import { sendLogs } from "./bot";

const DELAY = Number(process.env.MUTEX_WAIT ?? 10);

// Init simple Mutex for Docker with Redis
export function waitMutex(tries = 0) {
  // return new Promise<void>(async (resolve) => {
  //   try {
  //     const mutex = Number((await redis.get("MUTEX")) || 0);
  //     if (mutex === 0) {
  //       console.log("[MUTEX] IN USE");
  //       await redis.incr("MUTEX");
  //       return resolve();
  //     }

  //     // If process waiting for mutex too long then unfreeze it and just
  //     // keep going, despite it state
  //     if (tries++ > Number(process.env.MUTEX_INAFF ?? 10)) {
  //       resolve();
  //     }

  //     // If mutex is busy then wait when it will be free
  //     await new Promise<void>((resolve) => setTimeout(() => resolve(), DELAY));
  //     resolve(await waitMutex(tries + 1));
  //   } catch (err) {
  //     sendLogs({
  //       stat: "ERR",
  //       name: "WEB",
  //       file: "/api/mutext.ts",
  //       message: "There some problem with cache",
  //       desc: err,
  //     });
  //   }
  // });
  return Promise.resolve();
}

export function freeMutex() {
  return Promise.resolve();
  // return new Promise<void>(async (resolve) => {
  //   try {
  //     const mutex = Number((await redis.get("MUTEX")) || 0);
  //     if (mutex === 0) return resolve();

  //     console.log("[MUTEX] IS FREE");
  //     redis.decr("MUTEX");
  //   } catch (err) {
  //     sendLogs({
  //       stat: "ERR",
  //       name: "WEB",
  //       file: "/api/mutext.ts",
  //       message: "There some problem with cache",
  //       desc: err,
  //     });
  //   }
  // });
}
