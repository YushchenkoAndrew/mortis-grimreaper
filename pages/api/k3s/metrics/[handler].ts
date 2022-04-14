import { withIronSessionApiRoute } from "iron-session/next";
import { apiUrl } from "../../../../config";
import sessionConfig from "../../../../config/session";
import { ApiAuth } from "../../../../lib/api/auth";
import { createQuery, GetParam } from "../../../../lib/api/query";
import { DefaultRes, FullResponse } from "../../../../types/request";

const REQUIRED_FIELDS = ["project_id", "label", "namespace"];
export default withIronSessionApiRoute(async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const body = REQUIRED_FIELDS.filter(
    (key) => key in req.query && req.query[key]
  ).reduce(
    (acc, curr) => ((acc[curr] = GetParam(req.query[curr])), acc),
    {} as { [name: string]: any }
  );

  if (Object.keys(body).length != REQUIRED_FIELDS.length) {
    return res.status(400).send({
      status: "ERR",
      message: "This request is too bad to be a true one",
    });
  }

  const { status, send } = await (async function () {
    return new Promise<FullResponse>(async (resolve) => {
      try {
        const token = await ApiAuth();
        const res = await (function () {
          const ctl = new AbortController();
          setTimeout(() => ctl.abort(), Number(process.env.FETCH_TIMEOUT));

          switch (req.query.handler) {
            case "create":
              return fetch(`${apiUrl}/subscription${createQuery(body)}`, {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bear ${token}`,
                },

                body: JSON.stringify({
                  name: "metrics-all",
                  cron_time: req.body,
                }),

                signal: ctl.signal,
              });

            case "update":
              return fetch(`${apiUrl}/subscription${createQuery(body)}`, {
                method: "PUT",
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bear ${token}`,
                },

                body: JSON.stringify({
                  name: "metrics-all",
                  cron_time: req.body,
                }),

                signal: ctl.signal,
              });

            default:
              return new Promise<Response>((_, reject) =>
                reject("Unknown handler")
              );
          }
        })();

        const data = (await res.json()) as DefaultRes;
        console.log(data);

        resolve({ status: data.status === "OK" ? 200 : 500, send: data });
      } catch (err: any) {
        resolve({
          status: 500,
          send: { status: "ERR", message: err },
        });
      }
    });
  })();

  res.status(status).send(send);
}, sessionConfig);
