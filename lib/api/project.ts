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
      const result = decompress((await redis.get(`PROJECT:${query}`)) || "");
      if (result) return resolve(JSON.parse(result));

      const res = await fetch(`${apiUrl}/project${query}`);
      const data = (await res.json()) as ApiRes<Type[]> | ApiError;
      if (data.status === "ERR") return resolve(null);
      resolve(data.result);

      redis
        .set(`PROJECT:${query}`, compress(JSON.stringify(data.result)))
        .finally(() => redis.expire(`PROJECT:${query}`, 2 * 60 * 60));
    } catch (err: any) {
      resolve(null);
    }
  });
}
