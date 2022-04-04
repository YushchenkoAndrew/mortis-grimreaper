import { withIronSessionApiRoute } from "iron-session/next";
import { GetParam } from "../../../lib/api/query";
import sessionConfig from "../../../config/session";
import { localVoidUrl } from "../../../config";

export default withIronSessionApiRoute(async function (req, res) {
  if (req.method !== "GET") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  if (!GetParam(req.query.path)) {
    return res
      .status(400)
      .send({ status: "ERR", message: "Bad request params" });
  }

  try {
    const ctl = new AbortController();
    setTimeout(() => ctl.abort(), Number(process.env.FETCH_TIMEOUT) + 15);

    const resp = await fetch(`${localVoidUrl}/${GetParam(req.query.path)}`, {
      signal: ctl.signal,
    });

    res.send(Buffer.from(await resp.arrayBuffer()));
  } catch (_) {
    res.status(408).send("");
  }
}, sessionConfig);
