import { treePlaceholder } from "../../config/placeholder";
import redis from "../../config/redis";
import { sendLogs } from "./bot";

// Init simple Mutex for Docker with Redis
export function waitMutex() {
  let nTries = 0;
  return new Promise<boolean>((resolve, reject) => {
    redis
      .get("Mutex:Free")
      .then((reply) => {
        let stat: number;
        if (isNaN((stat = Number(reply))) || stat === 1) {
          return redis.set("Mutex:Free", "0").then(() => {
            nTries = 0;
            resolve(true);
          });
        }

        // If process waiting for mutex too long then unfreeze it and just
        // keep going, despite it state
        if (nTries++ > Number(process.env.MUTEX_INAFF ?? 10)) {
          nTries = 0;
          resolve(true);
        }

        // If mutex is busy then wait when it will be free
        console.log("[MUTEX] Wait");
        setTimeout(
          () => waitMutex().then((res) => resolve(res)),
          Number(process.env.MUTEX_WAIT ?? 10)
        );
      })
      .catch((err) => {
        sendLogs({
          stat: "ERR",
          name: "WEB",
          file: "/api/mutext.ts",
          message: "There some problem with cache",
          desc: err,
        });
      });
  });
}

export function freeMutex() {
  console.log("[MUTEX] Free");
  redis.set("Mutex:Free", "1");
}
