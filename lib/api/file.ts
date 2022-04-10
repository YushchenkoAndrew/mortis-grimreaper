import { apiUrl, localVoidUrl } from "../../config";
import { File } from "formidable";
import redis from "../../config/redis";
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

  const ctl = new AbortController();
  setTimeout(() => ctl.abort(), Number(process.env.FETCH_TIMEOUT));

  const res = await fetch(`${localVoidUrl}?path=/${path}`, {
    method: "POST",
    headers: { Authorization: `Basic ${VoidAuth()}` },
    body: formData as any,

    signal: ctl.signal,
  });

  return (await res.json()) as ApiOk | ApiError;
}

export function LoadFile(path: string) {
  return new Promise<string | null>(async (resolve) => {
    try {
      const reply = await redis.get(`FILE:${path}`);
      if (reply) {
        redis.expire(`FILE:${path}`, 2 * 60 * 60);
        return resolve(decompress(reply));
      }

      const ctl = new AbortController();
      setTimeout(() => ctl.abort(), Number(process.env.FETCH_TIMEOUT));

      const res = await fetch(`${localVoidUrl}/${path}`, {
        signal: ctl.signal,
      });

      const text = await res.text();

      resolve(text);
      redis
        .set(`FILE:${path}`, compress(text))
        .finally(() => redis.expire(`FILE:${path}`, 2 * 60 * 60));
    } catch (err: any) {
      resolve(null);
    }
  });
}

export function DeleteFile(args: { [key: string]: any }) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const ctl = new AbortController();
      setTimeout(() => ctl.abort(), Number(process.env.FETCH_TIMEOUT));

      const token = await ApiAuth();
      const res = await fetch(`${apiUrl}/file/${createQuery(args)}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: `Bear ${token}`,
        },

        signal: ctl.signal,
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
