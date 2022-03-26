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

  const resp = await fetch(`${localVoidUrl}/${GetParam(req.query.path)}`);
  res.send(Buffer.from(await resp.arrayBuffer()));
}, sessionConfig);
