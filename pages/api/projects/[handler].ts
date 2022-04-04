import { withIronSessionApiRoute } from "iron-session/next";
import { apiUrl } from "../../../config";
import sessionConfig from "../../../config/session";
import { ApiAuth } from "../../../lib/api/auth";
import { FlushFilter } from "../../../lib/api/cache";
import { ApiRes, ApiError, ProjectData, ApiResult } from "../../../types/api";
import { FullResponse } from "../../../types/request";

const REQUIRED_FIELDS = ["id", "name", "flag", "title", "desc", "note"];
export default withIronSessionApiRoute(async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const body = REQUIRED_FIELDS.filter(
    (key) => key in req.body && req.body[key]
  ).reduce((acc, curr) => ((acc[curr] = req.body[curr]), acc), {
    id: -1,
    note: "Damn it, guess I forgot to put some context here",
  } as { [key: string]: any });

  if (Object.keys(body).length != REQUIRED_FIELDS.length) {
    return res.status(400).send({
      status: "ERR",
      massage: "Not all required fields are assign",
    });
  }

  const { status, send } = await (function () {
    return new Promise<FullResponse>(async (resolve) => {
      try {
        const token = await ApiAuth();
        const res = await (function () {
          const ctl = new AbortController();
          setTimeout(() => ctl.abort(), Number(process.env.FETCH_TIMEOUT));

          switch (req.query.handler) {
            case "create":
              return fetch(`${apiUrl}/project`, {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bear ${token}`,
                },
                body: JSON.stringify(body),

                signal: ctl.signal,
              });

            case "update":
              return fetch(`${apiUrl}/project/${body.name}`, {
                method: "PUT",
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bear ${token}`,
                },
                body: JSON.stringify(body),

                signal: ctl.signal,
              });

            default:
              return new Promise<Response>((_, reject) =>
                reject("Unknown handler")
              );
          }
        })();

        const data = (await res.json()) as ApiRes<ProjectData[]> | ApiError;
        if (data.status == "ERR") {
          resolve({ status: 200, send: data });
        }

        resolve({
          status: 200,
          send: { status: "OK", message: "Success", result: data.result },
        });
      } catch (err: any) {
        resolve({
          status: 500,
          send: { status: "ERR", message: err },
        });
      }
    });
  })();

  // Flush all projects precached values
  FlushFilter(["page", `name=${body.name}`], "PROJECT:*");

  res.status(status).send(send);
}, sessionConfig);
