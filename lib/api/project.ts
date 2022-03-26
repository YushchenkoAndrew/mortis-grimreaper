import { apiUrl } from "../../config";
import redis from "../../config/redis";
import { createQuery } from "./query";
import { ApiError, ApiRes } from "../../types/api";
import {
  compressToBase64 as compress,
  decompressFromBase64 as decompress,
} from "lz-string";

export function LoadProjects<Type = any>(args: { [key: string]: any }) {
  return new Promise<Type[] | null>(async (resolve) => {
    try {
      const query = createQuery(args);
      const result = decompress((await redis.get(`Project:${query}`)) || "");
      if (result) return resolve(JSON.parse(result));

      const res = await fetch(`${apiUrl}/project${query}`);
      const data = (await res.json()) as ApiRes<Type[]> | ApiError;
      if (data.status === "ERR") return resolve(null);
      resolve(data.result);

      const compressed = compress(JSON.stringify(data.result));
      if (!compressed) return;

      redis
        .set(`Project:${query}`, compressed)
        .finally(() => redis.expire(`Project:${query}`, 2 * 60 * 60));
    } catch (err: any) {
      resolve(null);
    }
  });
}