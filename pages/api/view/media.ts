import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import { sendLogs } from "../../../lib/api/bot";
import { GetParam } from "../../../lib/api/query";

type QueryParams = { id: string };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).send("");
  if (!req.query.id) return res.status(400).send("");
  res.status(204).send("");

  // Run in background
  setTimeout(() => {
    const id = GetParam(req.query.id);
    redis
      .get(`USER:${id}`)
      .then((reply) => {
        console.log("[HANDLER] Media event USER:" + id);
        if (reply) return redis.hIncrBy("Info:Now", "Media", 1);
      })
      .catch((err) => {
        sendLogs({
          stat: "ERR",
          name: "WEB",
          file: "/api/view/media.ts",
          message: "Ohhh noooo, Cache is broken!!!",
          desc: err,
        });
      });
  }, 0);
}
