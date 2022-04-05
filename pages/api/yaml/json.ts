import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "yaml";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST" || req.headers["content-type"] !== "text/plain") {
    return res.status(405).send({});
  }

  res.status(200).send(parse(req.body ?? ""));
}
