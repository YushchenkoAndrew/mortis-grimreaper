import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import { PassValidate } from "../../../lib/api/auth";
import { sendLogs } from "../../../lib/api/bot";
import getConfig from "next/config";
import md5 from "../../../lib/md5";

const { serverRuntimeConfig } = getConfig();
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("");

  const key = (req.query.key as string) || "";
  const salt = req.headers["x-custom-header"] || "";
  if (
    !PassValidate(
      key,
      md5(salt + serverRuntimeConfig.WEB_PEPPER + serverRuntimeConfig.WEB_KEY)
    )
  ) {
    sendLogs({
      stat: "OK",
      name: "WEB",
      file: "/api/cache/reset.ts",
      message: "Someone tried to reach this handler. You'll will no pass!!",
    });
    return res.status(401).send("");
  }
  redis.hmset("Info:Now", "Views", 0, "Visitors", 0, "Clicks", 0, "Media", 0);

  // The best way just delete those vars
  redis.del("Info:Prev");
  redis.del("Info:Stat");
  redis.del("Info:Days");
  redis.del("Info:Countries");

  redis.del("API:Access");
  redis.del("API:Refresh");

  res.status(204).send("");
}
