import { apiUrl, localVoidUrl } from "../../config";
import { File } from "formidable";
import redis from "../../config/redis";
import { formPath } from "../public/files";
import { createQuery } from "../../lib/api/query";
import { ApiError, ApiOk, ApiRes, FileData } from "../../types/api";
import {
  compressToBase64 as compress,
  decompressFromBase64 as decompress,
} from "lz-string";
import FormData from "form-data";
import { sendLogs } from "./bot";
import { ApiAuth, VoidAuth } from "./auth";
import { createReadStream } from "fs";

export async function SendFile(file: File, path: string) {
  const formData = new FormData();
  formData.append("file", createReadStream(file.path), file.name || "");

  const res = await fetch(`${localVoidUrl}?path=/${path}`, {
    method: "POST",
    headers: { Authorization: `Basic ${VoidAuth()}` },
    body: formData as any,
  });

  return (await res.json()) as ApiOk | ApiError;
}

export function LoadFile(args: { [key: string]: any }) {
  return new Promise<string | null>(async (resolve) => {
    try {
      const query = createQuery(args);
      let result = decompress((await redis.get(`File:${query}`)) || "");
      if (result) return resolve(result);

      let res = await fetch(`${apiUrl}/file${query}`);
      const data = (await res.json()) as ApiRes<FileData[]> | ApiError;
      if (data.status === "ERR") return null;

      res = await fetch(
        `${localVoidUrl}/${args.project}/${formPath(data.result[0])}`
      );

      const text = await res.text();
      resolve(text);

      const compressed = compress(text);
      if (!compressed) return;

      redis
        .set(`File:${query}`, compressed)
        .finally(() => redis.expire(`File:${query}`, 2 * 60 * 60));
    } catch (err: any) {
      resolve(null);
    }
  });
}

export function DeleteFile(args: { [key: string]: any }) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const token = await ApiAuth();
      const res = await fetch(`${apiUrl}/file/${createQuery(args)}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: `Bear ${token}`,
        },
      });

      const data = (await res.json()) as ApiRes<FileData[]> | ApiError;
      if (data.status === "ERR") return reject(data.message);

      resolve();
    } catch (err) {
      reject(err);
      sendLogs({
        stat: "ERR",
        name: "WEB",
        file: "/api/admin/file.ts",
        message: "Bruhh, something is broken and it's not me!!!",
        desc: err,
      });
    }
  });
}