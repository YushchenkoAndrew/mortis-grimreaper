import redis from "../../config/redis";

export async function FlushValue(key: string) {
  const keys = await redis.keys(`${key}*`);
  keys.forEach((item) => redis.del(item));
}

export async function FlushFilter(params: string[]) {
  const keys = await redis.keys("*");
  return params.forEach((key) =>
    keys.filter((item) => item.includes(key)).forEach((item) => redis.del(item))
  );
}
