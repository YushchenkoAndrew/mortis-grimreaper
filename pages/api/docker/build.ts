import { localVoidUrl } from "../../../config";
import sessionConfig from "../../../config/session";
import { GetParam } from "../../../lib/api/query";
import { VoidAuth } from "../../../lib/api/auth";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("");

  const tag = GetParam(req.query.tag);
  const path = GetParam(req.query.path);
  if (!tag || !path) {
    return res.status(400).send("");
  }

  try {
    const resp = await fetch(`${localVoidUrl}/docker?path=/${path}&t=${tag}`, {
      method: "POST",
      headers: { Authorization: `Basic ${VoidAuth()}` },
    });

    res.setHeader("Content-Type", "text/event-stream;charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("X-Accel-Buffering", "no");

    for await (const chunk of resp.body as any) {
      res.write(chunk);
    }
    res.end();
  } catch (err) {
    res.status(500).send({ status: "ERR", message: err });
  }
}, sessionConfig);
