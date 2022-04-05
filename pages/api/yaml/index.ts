import type { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "yaml";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === "POST") {
    return res.status(200).send(stringify(req.body ?? {}));
  }

  res.status(405).send("");
}
