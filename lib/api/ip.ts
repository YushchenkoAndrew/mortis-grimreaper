import redis from "../../config/redis";

export function GetServerIP() {
  return new Promise(async (resolve, reject) => {
    try {
      const reply = await redis.get("PUBLIC:IP");
      if (reply) return resolve(reply);

      const res = await fetch("https://ipecho.net/plain");
      const ip = await res.text();

      await redis.set("PUBLIC:IP", ip);
      resolve(ip);
    } catch (err) {
      reject(err);
    }
  });
}
