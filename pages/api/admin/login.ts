import redis from "../../../config/redis";
import { PassValidate } from "../../../lib/api/auth";
import { sendLogs } from "../../../lib/api/bot";
import md5 from "../../../lib/md5";
import { LoginRequest } from "../../../types/admin";
import { FullResponse } from "../../../types/request";
import getConfig from "next/config";
import { checkCaptcha } from "../../../lib/api/captcha";
import { GetParam } from "../../../lib/api/query";
import { withIronSessionApiRoute } from "iron-session/next";

const { serverRuntimeConfig } = getConfig();
function checkUserInfo(id: string, salt: string, user: string, pass: string) {
  return new Promise<FullResponse>((resolve, reject) => {
    redis
      .get(`LOGIN:${id}`)
      .then((tries) => {
        if (!tries) {
          redis.set(`LOGIN:${id}`, (tries = "1"));
          redis.expire(id, 8.64e4);
        } else redis.incr(`LOGIN:${id}`);

        if (Number(tries) >= Number(process.env.ALLOWED_INVALID_LOGIN_REQ)) {
          sendLogs({
            stat: "ERR",
            name: "WEB",
            file: "/pages/api/admin/logs",
            message: "You can't go EVEN FURTHER BEYOND",
            desc: `User ${id} surpass limit of password tries`,
          });

          return resolve({
            status: 429,
            send: {
              status: "ERR",
              message: "You can't go EVEN FURTHER BEYOND",
            },
          });
        }

        // Constant time check for userName && passValidation
        let equal = {
          user: PassValidate(
            md5(salt.toString() + (serverRuntimeConfig.ADMIN_USER ?? "")),
            user
          ),
          pass: PassValidate(
            md5(salt.toString() + (serverRuntimeConfig.ADMIN_PASS ?? "")),
            pass
          ),
        };

        if (!equal.user || !equal.pass) {
          return resolve({
            status: 401,
            send: {
              status: "ERR",
              message: "So your name is Mr.[LOGIN], huh...",
            },
          });
        }

        redis.set(`LOGIN:${id}`, "1");
        return resolve({
          status: 200,
          send: {
            status: "OK",
            message: "I guess you can pass",
          },
        });
      })
      .catch(() => {
        redis.set(`LOGIN:${id}`, "1");
        redis.expire(id, 8.64e4);
      });
  });
}

export default withIronSessionApiRoute(
  async function (req, res) {
    if (req.method !== "POST") {
      return res.status(405).send({ status: "ERR", message: "Unknown method" });
    }

    let id = GetParam(req.query["id"]);
    let { salt, user, pass, captcha } = req.body as LoginRequest;
    if (!salt || !user || !pass || !captcha || !id) {
      return res.status(400).send({
        status: "ERR",
        message: "This request is too bad to be a true one",
      });
    }

    const { status, send } = await new Promise<FullResponse>(
      (resolve, reject) => {
        checkCaptcha(
          id,
          captcha,
          serverRuntimeConfig.RECAPTCHA_SECRET_KEY
        ).then((res) => {
          if (res.send.status !== "OK") resolve(res);
          checkUserInfo(id, salt, user, pass).then((res) => resolve(res));
        });
      }
    );

    if (send.status === "OK") {
      const sessionID = md5(Math.random().toString() + id);
      console.log("[LOGIN] Generate session SESSION:" + sessionID);

      redis.set(`SESSION:${sessionID}`, id);
      redis.expire(
        `SESSION:${sessionID}`,
        Number(serverRuntimeConfig.SESSION_TTL ?? 3600)
      );

      req.session.user = sessionID;
      await req.session.save();
    }

    res.status(status).send(send);
  },
  {
    cookieName: "SESSION_ID",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      maxAge: Number(serverRuntimeConfig.SESSION_TTL ?? 3600),
    },
    password: serverRuntimeConfig.APPLICATION_SECRET ?? "",
  }
);
