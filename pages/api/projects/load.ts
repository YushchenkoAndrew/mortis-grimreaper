import { withIronSessionApiRoute } from "iron-session/next";
import { GetParam } from "../../../lib/api/query";
import { DefaultRes } from "../../../types/request";
import sessionConfig from "../../../config/session";
import { LoadRecords } from "../../../lib/api/api";

const REQUIRED_FIELDS = [
  "id",
  "name",
  "flag",
  "page",
  "limit",
  "created_to",
  "created_from",

  "link[id]",
  "link[name]",
  "link[page]",
  "link[limit]",

  "file[id]",
  "file[name]",
  "file[role]",
  "file[path]",
  "file[page]",
  "file[limit]",

  "subscription[id]",
  "subscription[name]",
  "subscription[cron_id]",
  "subscription[page]",
  "subscription[limit]",

  "metrics[id]",
  "metrics[name]",
  "metrics[namespace]",
  "metrics[container_name]",
  "metrics[created_from]",
  "metrics[created_to]",
];

export default withIronSessionApiRoute(async function (req, res) {
  if (req.method !== "GET") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const query = REQUIRED_FIELDS.filter(
    (key) => key in req.query && req.query[key]
  ).reduce((acc, curr) => ((acc[curr] = GetParam(req.query[curr])), acc), {
    id: null,
    name: null,
    flag: null,
    page: null,
    limit: null,
    created_to: null,
    created_from: null,

    "link[id]": null,
    "link[name]": null,
    "link[page]": null,
    "link[limit]": null,

    "file[id]": null,
    "file[name]": null,
    "file[role]": null,
    "file[path]": null,
    "file[page]": null,
    "file[limit]": null,

    "subscription[id]": null,
    "subscription[name]": null,
    "subscription[cron_id]": null,
    "subscription[page]": null,
    "subscription[limit]": null,

    "metrics[id]": null,
    "metrics[name]": null,
    "metrics[namespace]": null,
    "metrics[container_name]": null,
    "metrics[created_from]": null,
    "metrics[created_to]": null,
  });

  const projects = await LoadRecords("project", query);
  if (!projects) {
    return res
      .status(500)
      .send({ status: "ERR", message: "Something went wrong" } as DefaultRes);
  }

  res.send({ status: "OK", message: "Success!!", result: projects });
}, sessionConfig);
