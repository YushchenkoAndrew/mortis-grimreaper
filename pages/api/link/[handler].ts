import sessionConfig from "../../../config/session";
import { FullResponse } from "../../../types/request";
import { apiUrl } from "../../../config";
import { ApiAuth } from "../../../lib/api/auth";
import { ApiError, ApiRes, LinkData } from "../../../types/api";
import { GetParam } from "../../../lib/api/query";
import { withIronSessionApiRoute } from "iron-session/next/dist";
import { FlushFilter } from "../../../lib/api/cache";

// const REQUIRED_FIELDS = ["id", "project", "role", "path", "project_id"];
export default withIronSessionApiRoute(async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  if (!GetParam(req.query.id) || !req.body) {
    return res.status(400).send({
      status: "ERR",
      massage: "Not all required fields are assign",
    });
  }

  // FIXME: body will contain only new and required data
  // there for I'll need to override all LinkData with projectId
  const { status, send } = await (function () {
    return new Promise<FullResponse>(async (resolve) => {
      try {
        const token = await ApiAuth();
        let res = await (function () {
          switch (GetParam(req.query.handler)) {
            case "create":
            case "update":
              return fetch(`${apiUrl}/link/${GetParam(req.query.id)}`, {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bear ${token}`,
                },
                body: JSON.stringify(
                  Object.keys(req.body).reduce(
                    (acc, curr) => [
                      ...acc,
                      { name: curr, link: req.body[curr] },
                    ],
                    [] as LinkData[]
                  )
                ),
              });

            default:
              return new Promise<Response>((_, reject) =>
                reject("Unknown handler")
              );
          }
        })();

        const data = (await res.json()) as ApiRes<LinkData[]> | ApiError;
        if (data.status === "ERR") {
          return resolve({ status: 500, send: data });
        }

        resolve({
          status: 200,
          send: { status: "OK", message: "Success", result: data.result },
        });
      } catch (err: any) {
        resolve({ status: 500, send: { status: "ERR", message: err } });
      }
    });
  })();

  FlushFilter(["Link", "page"]);
  res.status(status).send(send);
}, sessionConfig);
