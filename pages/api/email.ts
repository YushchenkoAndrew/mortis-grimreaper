import type { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import { checkCaptcha } from "../../lib/api/captcha";
import { createTransport } from "nodemailer";
import { DefaultRes, FullResponse } from "../../types/request";
import { sendLogs } from "../../lib/api/bot";
import { GetParam } from "../../lib/api/query";
const { serverRuntimeConfig } = getConfig();

export type EmailRequest = {
  email: string;
  text: string;
  captcha: string;
};

function sendEmail(email: string, text: string) {
  let transporter = createTransport({
    service: "Gmail",
    port: 465,
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: serverRuntimeConfig.EMAIL_FROM,
      pass: serverRuntimeConfig.EMAIL_PASS,
    },
  });

  return transporter.sendMail({
    from: email,
    to: serverRuntimeConfig.EMAIL_TO,
    subject: `You received message from web-server`,
    text: text,
    html: `<div>${text}</div><p>Sent from: <a href="mailto:${email}">${email}</a></p>`,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DefaultRes>
) {
  if (req.method !== "POST") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  let id = GetParam(req.query["id"]);
  let { email, text, captcha } = req.body as EmailRequest;

  if (!email || !text || !captcha || !id) {
    return res.status(400).send({
      status: "ERR",
      message: "This request is too bad to be a true one",
    });
  }

  const { status, send } = await new Promise<FullResponse>(
    (resolve, reject) => {
      checkCaptcha(
        id,
        captcha,
        serverRuntimeConfig.RECAPTCHA_INVISIBLE_SECRET_KEY
      ).then((res) => {
        if (res.send.status !== "OK") resolve(res);
        sendEmail(email, text)
          .then((res) => {
            console.log(res);

            resolve({
              status: 200,
              send: {
                status: "OK",
                message: "Success",
              },
            });
          })
          .catch((err) => {
            sendLogs({
              stat: "ERR",
              name: "WEB",
              file: "/api/email.ts",
              message: "Noooo Botodachi !!!",
              desc: err,
            });

            resolve({
              status: 500,
              send: {
                status: "ERR",
                message: "Stooopp breaking stuff MAAANN !!",
              },
            });
          });
      });
    }
  );

  res.status(status).send(send);
}
