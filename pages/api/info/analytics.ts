import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import { formatDate } from "../../info";
import { ApiError, ApiRes, InfoData, InfoSum } from "../../../types/api";
import { AnalyticsData, DefaultRes } from "../../../types/request";
import { apiUrl } from "../../../config";
import { Analytics } from "../../../types/info";
import { sendLogs } from "../../../lib/api/bot";
import { freeMutex, waitMutex } from "../../../lib/api/mutex";
import { GetParam } from "../../../lib/api/query";

type QueryParams = { date: string };

type TimeLine = { time: string; value: number };

function FormData(doughnut: Analytics, lineData: TimeLine[]): AnalyticsData {
  return {
    status: "OK",
    doughnut,
    line: lineData.map((item) => item.value),
    days: lineData.map((item) => item.time),
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalyticsData | DefaultRes>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ status: "ERR", message: "Request handler not found" });
  }

  const date = GetParam(req.query.date);
  if (!date) {
    return res
      .status(400)
      .json({ status: "ERR", message: "Not all Query params are declared!" });
  }

  try {
    const now = formatDate(new Date());
    const results = await Promise.all([
      new Promise((resolve, reject) => {
        waitMutex().then(() => {
          redis
            .get("Info:Stat")
            .then((reply) => {
              freeMutex();
              if (reply) return resolve(JSON.parse(reply));

              fetch(`${apiUrl}/info/sum`)
                .then((res) => res.json())
                .then((res: ApiRes<InfoData[]> | ApiError) => {
                  if (res.status == "ERR")
                    return reject(
                      "Idk something wrong happened at the backend"
                    );

                  const result = res.result.pop();
                  if (!res.items || !result)
                    return reject(
                      "Idk something wrong happened at the backend"
                    );

                  const stat = {
                    ctr: result.views ? result.clicks / result.views : 1,
                    cr_media: result.visitors
                      ? result.media / result.visitors
                      : 1,
                    cr_projects: result.visitors
                      ? result.clicks / result.visitors
                      : 1,
                  };

                  waitMutex().then(() => {
                    redis
                      .set("Info:Stat", JSON.stringify(stat))
                      .then(() => redis.expire("Info:Stat", 2 * 60 * 60))
                      .finally(() => freeMutex());
                  });
                  return resolve(stat);
                })
                .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
        });
      }),

      new Promise((resolve, reject) => {
        waitMutex().then(() => {
          redis.get("Info:Days").then((reply) => {
            freeMutex();
            if (reply && now == date) return resolve(JSON.parse(reply));

            let prev = new Date(date);
            prev.setDate(prev.getDate() - 7);

            fetch(
              `${apiUrl}/info/range?end=${date}&start=${formatDate(
                prev
              )}&orderBy=CreatedAt`
            )
              .then((res) => res.json())
              .then((res: ApiRes<InfoData[]> | ApiError) => {
                if (res.status == "ERR" || !res.items)
                  return reject("Idk something wrong happened at the backend");

                // Need this just to decrease space usage in RAM
                let result = {} as { [time: string]: number };
                res.result.forEach(
                  (item) =>
                    (result[item.created_at.split("T")[0]] = item.visitors)
                );

                waitMutex().then(() => {
                  redis
                    .set("Info:Days", JSON.stringify(result))
                    .finally(() => freeMutex());
                });

                if (
                  new Date(prev) > new Date(now) ||
                  new Date(date) < new Date(now)
                ) {
                  return resolve(result);
                }

                // Add now values from another place in Cache
                waitMutex().then(() => {
                  redis
                    .hGet("Info:Now", "Visitors")
                    .then(() => {
                      if (reply) result[now] = +reply;
                      resolve(result);
                    })
                    .finally(() => freeMutex());
                });
              })
              .catch((err) => reject(err));
          });
        });
      }),
    ]);
    // .then((results) => {
    let timeline = Object.entries(
      results[1] as { [time: string]: number }
    ).reduce((acc, [key, value]) => {
      acc.push({ time: key, value } as TimeLine);
      return acc;
    }, [] as TimeLine[]);

    res.status(200).json(FormData(results[0] as Analytics, timeline));
  } catch (err) {
    res.status(200).json({
      status: "ERR",
      message: err as string,
    });

    sendLogs({
      stat: "ERR",
      name: "WEB",
      file: "/api/info/analytics.ts",
      message: "Couldn't reach analytics data",
      desc: err,
    });
  }
}
