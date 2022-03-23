import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import redis from "../../../config/redis";
import sessionConfig from "../../../config/session";
import { GetParam } from "../../../lib/api/query";
import { FullResponse } from "../../../types/request";
import { compressToBase64, decompressFromBase64 } from "lz-string";

function GetData(id: string) {
  return new Promise<FullResponse>((resolve) => {
    redis
      .get(`CACHE:${id}`)
      .then((data) => {
        if ((data = data && decompressFromBase64(data)))
          redis.expire(`CACHE:${id}`, 300);

        resolve({
          status: 200,
          send: {
            status: data ? "OK" : "ERR",
            message: data ? "Success" : "Cache is empty",
            result: data ? JSON.parse(data) : "",
          },
        });
      })
      .catch((err) => {
        resolve({
          status: 200,
          send: { status: "ERR", message: err.message },
        });
      });
  });
}

function SaveData(id: string, data: string) {
  return new Promise<FullResponse>((resolve) => {
    console.log(
      `Before - ${data.length}; After - ${compressToBase64(data).length}`
    );

    redis
      .set(`CACHE:${id}`, compressToBase64(data))
      .finally(() => redis.expire(`CACHE:${id}`, 300));

    resolve({
      status: 200,
      send: {
        status: "OK",
        message: "Success !!",
      },
    });
  });
}

export default withIronSession(async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).send({ stat: "ERR", message: "Unknown method" });
  }

  const id = GetParam(req.query.id);
  if (!id) {
    return res.status(400).send({
      stat: "ERR",
      message: "This request is too bad to be a true one",
    });
  }

  let { status, send } =
    req.method === "GET" ? await GetData(id) : await SaveData(id, req.body);

  res.status(status).send(send);
},
sessionConfig);
