import { withIronSessionApiRoute } from "iron-session/next";
import { GetParam } from "../../../lib/api/query";
import { DefaultRes } from "../../../types/request";
import sessionConfig from "../../../config/session";
import { LoadProjects } from "../../../lib/api/project";

export default withIronSessionApiRoute(async function (req, res) {
  if (req.method !== "GET") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const role = GetParam(req.query.role);
  const id = Number(GetParam(req.query.id));
  const page = Number(GetParam(req.query.page));

  if (isNaN(page) && isNaN(id)) {
    return res.status(400).send({ status: "ERR", message: "Bad 'page' param" });
  }

  const projects = await LoadProjects({ id, role, page });
  if (!projects) {
    return res
      .status(500)
      .send({ status: "ERR", message: "Something went wrong" } as DefaultRes);
  }

  res.send({ status: "OK", message: "Success!!", result: projects });
}, sessionConfig);
