import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";

type QueryParams = { id: string };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(404);
  if (!req.query["id"]) return res.status(400);
  res.status(204);

  let { id } = req.query as QueryParams;
  redis.get(id, (err, reply) => {
    if (err || !reply) return;

    // TODO: Send to API
    console.log(`id=${id} country=${reply} click++`);
    redis.hincrby("Info:Sum", "Clicks", 1);
  });
}
