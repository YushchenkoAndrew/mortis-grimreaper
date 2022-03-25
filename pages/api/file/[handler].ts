import fs from "fs";
import { File, IncomingForm } from "formidable";
import sessionConfig from "../../../config/session";
import FormData from "form-data";
import { FullResponse } from "../../../types/request";
import { apiUrl, localVoidUrl } from "../../../config";
import { ApiAuth, VoidAuth } from "../../../lib/api/auth";
import { ApiError, ApiOk, ApiRes, FileData } from "../../../types/api";
import { GetParam } from "../../../lib/api/query";
import { withIronSessionApiRoute } from "iron-session/next";
import { DeleteFile } from "../../../lib/api/file";
import { FlushFilter } from "../../../lib/api/cache";

export const config = { api: { bodyParser: false } };

const REQUIRED_FIELDS = ["id", "project", "role", "path", "project_id"];
export default withIronSessionApiRoute(async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const body = REQUIRED_FIELDS.filter(
    (key) => key in req.query && req.query[key]
  ).reduce((acc, curr) => ((acc[curr] = GetParam(req.query[curr])), acc), {
    id: -1,
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

        const token = await ApiAuth();
        let res = await (function () {
          switch (GetParam(req.query.handler)) {
            case "create":
              return fetch(`${apiUrl}/file/${body.project_id}`, {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bear ${token}`,
                },
                body: JSON.stringify({
                  ...body,
                  name: file.name,
                  type: file.type ?? "text/plain",
                }),
              });

            case "update":
              return fetch(`${apiUrl}/file/${body.id}`, {
                method: "PUT",
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bear ${token}`,
                },
                body: JSON.stringify({
                  ...body,
                  name: file.name,
                  type: file.type ?? "text/plain",
                }),
              });

            default:
              return new Promise<Response>((_, reject) =>
                reject("Unknown handler")
              );
          }
        })();

        const data = (await res.json()) as ApiRes<FileData[]> | ApiError;
        if (data.status === "ERR") {
          return resolve({ status: 500, send: data });
        }

        console.log(data);

        const formData = new FormData();
        formData.append(
          "file",
          fs.createReadStream(file.path),
          file.name || ""
        );

        res = await fetch(
          `${localVoidUrl}?path=/${body.project}/${body.role + body.path}`,
          {
            method: "POST",
            headers: { Authorization: `Basic ${VoidAuth()}` },
            body: formData as any,
          }
        );

        const result = (await res.json()) as ApiOk | ApiError;
        if (result.status !== "OK") {
          await DeleteFile({ id: data.result[0].id, name: file.name });
          return resolve({ status: 500, send: result });
        }

        resolve({ status: 200, send: result });
      } catch (err: any) {
        resolve({
          status: 500,
          send: { status: "ERR", message: err },
        });
      }
    });
  })();

  FlushFilter(["File", "page"]);
  res.status(status).send(send);
}, sessionConfig);
