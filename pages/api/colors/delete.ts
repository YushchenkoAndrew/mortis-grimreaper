import { withIronSessionApiRoute } from "iron-session/next";
import { apiUrl } from "../../../config";
import sessionConfig from "../../../config/session";
import { ApiAuth } from "../../../lib/api/auth";
import { FlushFilter } from "../../../lib/api/cache";
import { createQuery, GetParam } from "../../../lib/api/query";
import { ApiRes, ApiError } from "../../../types/api";
import { FullResponse } from "../../../types/request";

const REQUIRED_FIELDS = ["id", "mode", "colors"];
export default withIronSessionApiRoute(async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const body = REQUIRED_FIELDS.filter(
    (key) => key in req.body && req.body[key]
  ).reduce((acc, curr) => ((acc[curr] = req.body[curr]), acc), {
    mode: null,
    colors: null,
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

        const ctl = new AbortController();
        setTimeout(() => ctl.abort(), Number(process.env.FETCH_TIMEOUT));

        const res = await fetch(`${apiUrl}/pattern${createQuery(body)}`, {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            Authorization: `Bear ${token}`,
          },
          signal: ctl.signal,
        });

        const data = (await res.json()) as ApiRes<any> | ApiError;
        if (data.status == "ERR") {
          return resolve({ status: 200, send: data });
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

  // Flush all pattern precached values
  FlushFilter(["page"], "PATTERN:*");

  res.status(status).send(send);
}, sessionConfig);
