import type { NextApiRequest, NextApiResponse } from "next";
import { DefaultRes } from "../../types/request";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DefaultRes>
) {
  res.json({ status: "OK", message: "pong" });
}
