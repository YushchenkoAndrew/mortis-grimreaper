import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import { apiUrl } from "../../../config";
import redis, { FlushValue } from "../../../config/redis";
import sessionConfig from "../../../config/session";
import { ApiAuth } from "../../../lib/api/auth";
import { sendLogs } from "../../../lib/api/bot";
import { GetParam } from "../../../lib/api/query";
import { ApiRes, ApiError, ProjectData } from "../../../types/api";
import { DefaultRes, FullResponse } from "../../../types/request";

function AddProject(body: string) {
  return new Promise<FullResponse>((resolve, reject) => {
    ApiAuth()
      .then((access) => {
        fetch(`${apiUrl}/project`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bear ${access}`,
          },
          body,
        })
          .then((res) => res.json())
          .then((data: ApiRes<ProjectData[]> | ApiError) => {
            resolve({
              status: 200,
              send: {
                status: data.status ?? "ERR",
                message: (data as ApiError).message ?? "Success",
                result: data.result ?? [],
              },
            });
          })
          .catch((err) => {
            resolve({
              status: 500,
              send: {
                status: "ERR",
                message: err,
              },
            });
          });
      })
      .catch((err) => {
        sendLogs({
          stat: "ERR",
          name: "WEB",
          file: "/api/admin/projects.ts",
          message: "Bruhh, something is broken and it's not me!!!",
          desc: err,
        });
      });
  });
}

const REQUIRED_FIELDS = ["name", "flag", "title", "desc", "note"];

export default withIronSession(async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse<DefaultRes>
) {
  if (req.method !== "POST") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const id = GetParam(req.query.id);
  const body = REQUIRED_FIELDS.filter(
    (key) => key in req.body && req.body[key]
  ).reduce((acc, curr) => (acc[curr] = req.body[curr]), {
    note: "Damn it, guess I forgot to put some context here",
  });

  if (Object.keys(body).length != REQUIRED_FIELDS.length) {
    return res
      .status(400)
      .send({ status: "ERR", message: "Not all required fields are setted" });
  }

  const { status, send } = await AddProject(JSON.stringify(body));

  if (send.status === "OK" && id) {
    redis.del(`CACHE:${id}`);
    FlushValue("Project");
  }

  res.status(status).send(send);
},
sessionConfig);
