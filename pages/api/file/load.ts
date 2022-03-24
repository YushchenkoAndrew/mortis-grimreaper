import { withIronSessionApiRoute } from "iron-session/next";
import { GetParam } from "../../../lib/api/query";
import sessionConfig from "../../../config/session";
import { LoadFile } from "../../../lib/api/file";

export default withIronSessionApiRoute(async function (req, res) {
  if (req.method !== "GET") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const project = GetParam(req.query.project);
  const role = GetParam(req.query.role);

  if (!project) {
    return res
      .status(400)
      .send({ status: "ERR", message: "Bad request params" });
  }

  const text = await LoadFile({ project, role });
  if (text) {
    res.status(500).send({ status: "ERR", message: "Something wen wrong" });
  }

  res.send({ status: "OK", message: "Success !!", result: text });
}, sessionConfig);
