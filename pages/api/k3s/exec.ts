import { exec } from "child_process";
import sessionConfig from "../../../config/session";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(async function (req, res) {
  if (req.method !== "POST" || req.headers["content-type"] !== "text/plain") {
    return res.status(404).send("");
  }

  const text = await new Promise((resolve) => {
    // FIXME: Instead of that send request to 'void' Container
    // with api /exec route ...
    exec(req.body, (error, stdout, stderr) => {
      resolve(stdout || error || stderr);
    });
  });

  res.status(200).send(text);
}, sessionConfig);
