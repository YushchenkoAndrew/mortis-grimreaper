import type { NextApiRequest, NextApiResponse } from "next";
import { stringify, parse } from "yaml";
import { GetParam } from "../../lib/api/query";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method !== "POST") {
    return res.status(405).send("");
  }

  res
    .status(200)
    .send(
      GetParam(req.query.out) === "json"
        ? parse(req.body ?? "")
        : stringify(req.body ?? {})
    );
}
