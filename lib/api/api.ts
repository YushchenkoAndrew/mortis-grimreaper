import { apiUrl } from "../../config";
import redis from "../../config/redis";
import { createQuery } from "./query";
import { ApiError, ApiRes } from "../../types/api";
import {
  compressToBase64 as compress,
  decompressFromBase64 as decompress,
} from "lz-string";

export function LoadRecords<Type = any>(
  path: string,
  args: { [key: string]: any }
) {
  return new Promise<Type[] | null>(async (resolve) => {
    try {
      const prefix = path.toUpperCase();
      const query = createQuery(args);
      const result = decompress((await redis.get(`${prefix}:${query}`)) || "");
      if (result) return resolve(JSON.parse(result));

      const ctl = new AbortController();
      setTimeout(() => ctl.abort(), Number(process.env.FETCH_TIMEOUT));

      const res = await fetch(`${apiUrl}/${path}${query}`, {
        signal: ctl.signal,
      });

      const data = (await res.json()) as ApiRes<Type[]> | ApiError;
      if (data.status === "ERR") return resolve(null);
      resolve(data.result);

      redis
        .set(`${prefix}:${query}`, compress(JSON.stringify(data.result)))
        .finally(() => redis.expire(`${prefix}:${query}`, 2 * 60 * 60));
    } catch (err: any) {
      resolve(null);
    }
  });
}
