import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";

function CheckUser(id: string) {
  return new Promise<boolean>((resolve, reject) => {
    redis
      .get(`USER:${id}`)
      .then((ok) => {
        console.log("[HANDLER] Ping event USER:" + id);
        resolve(!!ok);
      })
      .catch(() => resolve(false));
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "HEAD") return res.status(405).send("");
  const id = req.headers["x-custom-header"] as string;
  if (!id) return res.status(400).send("");

  if (await CheckUser(id)) return res.status(204).send("");
  res.status(404).send("");
}
