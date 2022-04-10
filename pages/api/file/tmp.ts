import { File, IncomingForm } from "formidable";
import sessionConfig from "../../../config/session";
import { FullResponse } from "../../../types/request";
import { GetParam } from "../../../lib/api/query";
import { withIronSessionApiRoute } from "iron-session/next";
import { SendFile } from "../../../lib/api/file";
import { formPath } from "../../../lib/public/files";

export const config = { api: { bodyParser: false } };

const REQUIRED_FIELDS = ["role", "dir"];
export default withIronSessionApiRoute(async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const body = REQUIRED_FIELDS.filter(
    (key) => key in req.query && req.query[key]
  ).reduce((acc, curr) => ((acc[curr] = GetParam(req.query[curr])), acc), {
    dir: "/",
  } as { [name: string]: any });

  if (Object.keys(body).length != REQUIRED_FIELDS.length) {
    return res.status(400).send({
      status: "ERR",
      massage: "Not all required fields are assign",
    });
  }

  const { status, send } = await (function () {
    return new Promise<FullResponse>(async (resolve) => {
      try {
        const file = await new Promise<File>((resolve, reject) => {
          new IncomingForm({ multiples: false }).parse(req, (err, _, files) => {
            if (!err && files.file) return resolve(files.file as File);
            reject("Something went wrong with file paring");
          });
        });

        const result = await SendFile(
          file,
          formPath(["tmp", body.role, body.dir])
        );

        resolve({ status: result.status === "OK" ? 200 : 500, send: result });
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
