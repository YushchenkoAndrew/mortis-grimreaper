import { createClient } from "redis";
import getConfig from "next/config";
import { sendLogs } from "../lib/api/bot";

const { serverRuntimeConfig } = getConfig();
const PORT = Number(serverRuntimeConfig.REDIS_PORT ?? 6379);
const HOST = serverRuntimeConfig.REDIS_HOST ?? "127.0.0.1";

const client = createClient({ url: `redis://${HOST}:${PORT}` });

client.on("error", function (error) {
  sendLogs({
    stat: "ERR",
    name: "WEB",
    file: "/config/redis.ts",
    message: "Ohhh noooo, Cache is broken!!!",
    desc: error,
  });
});

export function FlushValue(key: string) {
  client
    .keys(`${key}:*`)
    .then((keys) => {
      keys.map((item) => client.del(item));
    })
    .catch((err) => {});
}

(async () => await client.connect())();

// Test connection
client.ping().catch((err) => console.log(err));
export default client;
