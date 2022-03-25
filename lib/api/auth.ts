import { apiUrl } from "../../config";
import getConfig from "next/config";
import redis from "../../config/redis";
import { ApiError, ApiTokens } from "../../types/api";
import md5 from "../md5";
import { GetServerIP } from "./ip";
import { freeMutex, waitMutex } from "./mutex";

const { serverRuntimeConfig } = getConfig();
export function PassValidate(pass: string, pass2: string) {
  let equal = true;
  let max = pass.length > pass2.length ? pass.length : pass2.length;
  for (let i = 0; i < max; i++) {
    equal =
      equal &&
      i < pass2.length &&
      i < pass.length &&
      pass2.charAt(i) == pass.charAt(i);
  }
  return equal;
}

export function UpdateTokens(data: ApiTokens) {
  redis.set("API:Access", data.access_token);
  redis.set("API:Refresh", data.refresh_token);

  redis.expire("API:Access", 15 * 60);
  redis.expire("API:Refresh", 7 * 24 * 60 * 60);
}

export function DeleteTokens() {
  redis.del("API:Access");
  redis.del("API:Refresh");
}

export function ApiAuth(retry: boolean = true): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      // await waitMutex();
      const access = await redis.get("API:Access");
      if (access) return resolve(access);

      // If Access token expired, then refresh token
      const refresh = await redis.get("API:Refresh");
      if (!refresh) {
        const res = await fetch(`${apiUrl}/refresh`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ refresh_token: refresh }),
        });

        const data = (await res.json()) as ApiTokens | ApiError;
        // If something wrong with keys or refresh token already
        // has been expired then just delete them and try again
        if (data.status == "ERR") {
          DeleteTokens();
          return resolve(await ApiAuth());
        }

        UpdateTokens(data);
        resolve(data.access_token);
      }

      // If Refresh token expired, then relogin
      const salt = md5((Math.random() * 10000 + 500).toString());
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user: serverRuntimeConfig.API_USER ?? "",
          pass:
            salt +
            "$" +
            md5(
              salt +
                serverRuntimeConfig.API_PEPPER +
                serverRuntimeConfig.API_PASS
            ),
        }),
      });

      const data = (await res.json()) as ApiTokens | ApiError;
      if (data.status === "ERR") return reject("Incorrect user or pass");

      UpdateTokens(data);
      resolve(data.access_token);
    } catch (err) {
      if (!retry) return reject(err);
      ApiAuth(false);
    }
  });
  // .finally(() => freeMutex());
}

export function VoidAuth() {
  return Buffer.from(serverRuntimeConfig.VOID_AUTH ?? "").toString("base64");
}

export async function DockerAuth() {
  const ip = await GetServerIP();
  return Buffer.from(
    JSON.stringify({
      username: serverRuntimeConfig.DOCKER_USER,
      password: serverRuntimeConfig.DOCKER_PASS,
      email: serverRuntimeConfig.DOCKER_EMAIL,
      serveraddress: ip,
    })
  ).toString("base64");
}
