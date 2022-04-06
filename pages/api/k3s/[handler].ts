import { apiUrl } from "../../../config/index";
import { DefaultRes, FullResponse } from "../../../types/request";
import { withIronSessionApiRoute } from "iron-session/next";
import { ApiAuth } from "../../../lib/api/auth";
import { GetParam } from "../../../lib/api/query";
import sessionConfig from "../../../config/session";

export default withIronSessionApiRoute(async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const type = GetParam(req.query.type);
  const namespace = GetParam(req.query.namespace ?? "");
  if (
    !type ||
    (type !== "namespace" && !namespace) ||
    !process.env.K3S_ALLOWED_TYPES?.includes?.(type)
  ) {
    return res.status(400).send({
      status: "ERR",
      message: "This request is too bad to be a true one",
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
              return fetch(`${apiUrl}/k3s/${type}/${namespace}`, {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bear ${token}`,
                },

                body: JSON.stringify(req.body),
                signal: ctl.signal,
              });

            case "update":
            default:
              return new Promise<Response>((_, reject) =>
                reject("Unknown handler")
              );
          }
        })();

        const data = (await res.json()) as DefaultRes;
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
