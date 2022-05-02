import { withIronSessionApiRoute } from "iron-session/next";
import { GetParam } from "../../../lib/api/query";
import { DefaultRes } from "../../../types/request";
import sessionConfig from "../../../config/session";
import { LoadRecords } from "../../../lib/api/api";

const REQUIRED_FIELDS = ["id", "mode", "colors", "page", "limit"];

export default withIronSessionApiRoute(async function (req, res) {
  if (req.method !== "GET") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const query = REQUIRED_FIELDS.filter(
    (key) => key in req.query && req.query[key]
  ).reduce((acc, curr) => ((acc[curr] = GetParam(req.query[curr])), acc), {
    id: null,
    mode: null,
    colors: null,
    page: null,
    limit: null,
  });

  const patterns = await LoadRecords("pattern", query);
  if (!patterns) {
    return res
      .status(500)
      .send({ status: "ERR", message: "Something went wrong" } as DefaultRes);
  }

  res.send({ status: "OK", message: "Success!!", result: patterns });
}, sessionConfig);
