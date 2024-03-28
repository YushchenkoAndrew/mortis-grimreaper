// import redis from "../../config/redis";

export async function FlushValue(key: string) {
  // const keys = await redis.keys(`${key}*`);
  // keys.forEach((item) => redis.del(item));
}

export async function FlushFilter(params: string[], match = "*") {
  //   for await (const key of await redis.scanIterator({ MATCH: match })) {
  //     for (const item of params) {
  //       if (!key.includes(item)) continue;
  //       redis.del(key);
  //       break;
  //     }
  //   }
}
