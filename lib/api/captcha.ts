import redis from "../../config/redis";
import { FullResponse } from "../../types/request";
import { sendLogs } from "./bot";

export function checkCaptcha(id: string, captcha: string, secrete: string) {
  return new Promise<FullResponse>(async (resolve) => {
    try {
      const reply = await redis.get(`USER:${id}`);
      if (!reply) {
        return resolve({
          status: 403,
          send: { status: "ERR", message: "Man, who the heck are you ?" },
        });
      }

      const ctl = new AbortController();
      setTimeout(() => ctl.abort(), Number(process.env.FETCH_TIMEOUT));

      const res = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secrete}&response=${captcha}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          },
          method: "POST",

          signal: ctl.signal,
        }
      );

      const data = await res.json();
      console.log(data);

      resolve({
        status: 200,
        send: {
          status: data.success ? "OK" : "ERR",
          message: data.success ? "Success!!" : "You are a ROBOT !!!",
        },
      });

      if (!data.success) {
        sendLogs({
          stat: "ERR",
          name: "WEB",
          file: "/api/admin/captcha.ts",
          message: "Robot is parsing my site !!!",
          desc: data,
        });
      }
    } catch (err) {
      resolve({
        status: 500,
        send: { status: "ERR", message: "Stooopp breaking stuff MAAANN !!" },
      });
    }
  });
}
