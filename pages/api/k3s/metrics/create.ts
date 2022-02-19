import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import { apiUrl } from "../../../../config";
import sessionConfig from "../../../../config/session";
import { ApiAuth } from "../../../../lib/api/auth";
import { GetParam } from "../../../../lib/api/query";
import { DefaultRes, FullResponse } from "../../../../types/request";

export default withIronSession(async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse<DefaultRes>
) {
  if (req.method !== "POST") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const prefix = GetParam(req.query.prefix);
  const namespace = GetParam(req.query.namespace);
  const projectId = GetParam(req.query.id);
  if (!prefix || !namespace || !projectId) {
    return res.status(400).send({
      status: "ERR",
      message: "This request is too bad to be a true one",
    });
  }

  const { status, send } = await new Promise<FullResponse>((resolve) => {
    ApiAuth()
      .then((access) => {
        fetch(
          `${apiUrl}/subscription?prefix=${prefix}&namespace=${namespace}&id=${projectId}`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              Authorization: `Bear ${access}`,
            },
            body: JSON.stringify({
              // cron_time: "*/10 * * * * *",
              cron_time: "0 0 */4 * * *",
              operation: "metrics-all",
            }),
          }
        )
          .then((res) => res.json())
          .then((result: DefaultRes) => {
            resolve({
              status: result.status == "OK" ? 200 : 500,
              send: {
                status: result.status,
                message: result.message,
                result,
              },
            });
          })
          .catch((err) =>
            resolve({
              status: 500,
              send: { status: "ERR", message: "API error", result: err },
            })
          );
      })
      .catch((err) =>
        resolve({
          status: 500,
          send: { status: "ERR", message: "API Auth error" },
        })
      );
  });

  res.status(status).send(send);
},
sessionConfig);
