import type { NextApiRequest, NextApiResponse } from "next";
import { freeMutex, waitMutex } from "../../../lib/api/mutex";
import redis from "../../../config/redis";
import { apiUrl } from "../../../config";
import { ApiError, ApiRes, GeoIpLocationData } from "../../../types/api";
import md5 from "../../../lib/md5";
import { FullResponse } from "../../../types/request";
import { sendLogs } from "../../../lib/api/bot";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).send("");

  const date = new Date();
  const now = date.getTime() - date.getTimezoneOffset() * 60000;
  const prev = Number(req.headers["x-custom-header"]);
  const ip = req.headers["x-custom-ip"];
  if (isNaN(prev) || now < prev || now - prev >= 5000 || !ip) {
    return res.status(400).send("Nop");
  }

  const hash = md5(prev.toString());
  const { status, send } = await new Promise<FullResponse>(async (resolve) => {
    try {
      if (!(await redis.get(`RAND:${hash}`))) {
        return res.status(400).send("RAND");
      }

      console.log("[HANDLER] Rand is passed !!!");
      redis.del(`RAND:${hash}`);

      const resp = await fetch(`${apiUrl}/trace/${ip}`);
      const data = (await resp.json()) as
        | ApiRes<GeoIpLocationData[]>
        | ApiError;

      if (data.status === "ERR") {
        return resolve({
          status: 500,
          send: {
            status: "ERR",
            message: "Hold up it's not my fault ... kinda",
          },
        });
      }

      const user = {
        id: md5(
          (Math.random() * 100000 + 500).toString() +
            data.result[0].country_iso_code +
            now.toString()
        ),
        country: data.result[0].country_iso_code,
        expired: now + 86.4e6,
        salt: md5((Math.random() * 100000 + 500).toString()),
      };

      console.log("user: ");
      console.log(user);

      resolve({
        status: 201,
        send: {
          status: "OK",
          message: "Success",
          result: user,
        },
      });
    } catch (err) {
      resolve({
        status: 500,
        send: {
          status: "ERR",
          message:
            "F@$k, I fixed this yeasted, why it's still not working !!!!",
        },
      });
    }
  });

  res.status(status).send(send);
  if (status !== 201) return;

  // Run in background
  setTimeout(async () => {
    try {
      await redis.set(`USER:${send.result.id}`, send.result.country);

      redis.expire(`USER:${send.result.id}`, send.result.expired);
      redis.hIncrBy("Info:Now", "Visitors", 1);
      redis.hIncrBy("Info:Now", "Views", 1);

      // Need this for detect curr day countries
      redis.lPush("Info:Countries", send.result.country);

      // Use simple mutex handler for changing variables with kubernetes & docker
      await waitMutex();
      const data = JSON.parse((await redis.get("Info:World")) || "{}");
      data[send.result.country] = data[send.result.country]
        ? data[send.result.country] + 1
        : 1;

      redis.set("Info:World", JSON.stringify(data)).finally(() => freeMutex());
    } catch (err) {
      sendLogs({
        stat: "ERR",
        name: "WEB",
        file: "/pages/view/user.ts",
        message: "F@$k, I fixed this yeasted, why it's still not working !!!!",
        desc: err,
      });
    }
  }, 0);
}
