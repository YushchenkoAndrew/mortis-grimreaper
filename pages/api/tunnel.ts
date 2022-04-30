import type { NextApiRequest, NextApiResponse } from "next";
import { DefaultRes } from "../../types/request";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return res.status(404).send("");

  // NOTE: TEST tunnel
  const ctl = new AbortController();
  setTimeout(() => ctl.abort(), Number(process.env.FETCH_TIMEOUT) + 15);

  const resp = await fetch(`http://127.0.0.1:8000/projects/admin/login`, {
    signal: ctl.signal,
  });

  res.send(await resp.text());
}
