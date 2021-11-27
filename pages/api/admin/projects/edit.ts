import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import { apiUrl } from "../../../../config";
import redis, { FlushValue } from "../../../../config/redis";
import sessionConfig from "../../../../config/session";
import { ApiAuth } from "../../../../lib/api/auth";
import { sendLogs } from "../../../../lib/api/bot";
import { ApiRes, ApiError, ProjectData } from "../../../../types/api";
import { FullResponse } from "../../../../types/request";

function EditProject(body: string) {
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

export default withIronSession(async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send({ stat: "ERR", message: "Unknown method" });
  }

  let id = req.query["id"] as string;
  let { name, flag, title, desc, note } = req.body as ProjectData;
  if (!id || !name || !flag || !title || !desc || !note) {
    return res
      .status(400)
      .send({ stat: "ERR", message: "Not all required fields are setted" });
  }

  const { status, send } = await EditProject(
    JSON.stringify({ name, flag, title, desc, note })
  );

  if (send.status === "OK") {
    redis.del(`CACHE:${id}`);
    FlushValue("Project");
  }

  res.status(status).send(send);
},
sessionConfig);
