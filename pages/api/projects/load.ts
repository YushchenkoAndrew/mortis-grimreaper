import { withIronSessionApiRoute } from "iron-session/next";
import { GetParam } from "../../../lib/api/query";
import { DefaultRes } from "../../../types/request";
import sessionConfig from "../../../config/session";
import { LoadProjects } from "../../../lib/api/project";

const REQUIRED_FIELDS = ["id", "file[role]", "page"];
export default withIronSessionApiRoute(async function (req, res) {
  if (req.method !== "GET") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const query = REQUIRED_FIELDS.filter(
    (key) => key in req.query && req.query[key]
  ).reduce((acc, curr) => ((acc[curr] = GetParam(req.query[curr])), acc), {
    id: null,
  });

  console.log(req.query);

  const projects = await LoadProjects(query);
  if (!projects) {
    return res
      .status(500)
      .send({ status: "ERR", message: "Something went wrong" } as DefaultRes);
  }

  res.send({ status: "OK", message: "Success!!", result: projects });
}, sessionConfig);
