import { withIronSessionApiRoute } from "iron-session/next";
import redis from "../../../config/redis";
import sessionConfig from "../../../config/session";
import { GetParam } from "../../../lib/api/query";
import { FullResponse } from "../../../types/request";
import {
  compressToBase64 as compress,
  decompressFromBase64 as decompress,
} from "lz-string";

const ALLOWED_METHODS = ["GET", "POST", "DELETE"];
export default withIronSessionApiRoute(async function (req, res) {
  if (!req.method || !ALLOWED_METHODS.includes(req.method)) {
    return res.status(405).send({ stat: "ERR", message: "Unknown method" });
  }

  const id = GetParam(req.query.id);
  if (!id) {
    return res.status(400).send({
      stat: "ERR",
      message: "This request is too bad to be a true one",
    });
  }

  const { status, send } = await (function () {
    switch (req.method) {
      case "GET":
        return new Promise<FullResponse>((resolve) => {
          redis.get(`CACHE:${id}`).then((data) => {
            if ((data = data && decompress(data))) {
              redis.expire(`CACHE:${id}`, 300);
            }

            resolve({
              status: 200,
              send: {
                status: data ? "OK" : "ERR",
                message: data ? "Success" : "Cache is empty",
                result: data ? JSON.parse(data) : "",
              },
            });
          });
        });

      case "POST":
        return new Promise<FullResponse>((resolve) => {
          console.log(
            `CACHE:${id} Before - ${req.body.length}; After - ${
              compress(req.body).length
            }`
          );

          redis
            .set(`CACHE:${id}`, compress(req.body))
            .finally(() => redis.expire(`CACHE:${id}`, 300));

          resolve({
            status: 200,
            send: { status: "OK", message: "Success !!" },
          });
        });

      case "DELETE":
        return new Promise<FullResponse>((resolve) => {
          redis.del(`CACHE:${id}`);
          resolve({
            status: 200,
            send: { status: "OK", message: "Success !!" },
          });
        });
    }

    return new Promise<FullResponse>((resolve) => {
      resolve({
        status: 200,
        send: { status: "ERR", message: "Unknown handler" },
      });
    });
  })();

  res.status(status).send(send);
}, sessionConfig);
