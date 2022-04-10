import { localVoidUrl } from "../../../config";
import sessionConfig from "../../../config/session";
import { GetParam } from "../../../lib/api/query";
import { DockerAuth, VoidAuth } from "../../../lib/api/auth";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("");

  const tag = GetParam(req.query.tag);
  if (!tag) {
    return res.status(400).send("");
  }

  try {
    // NOTE: Not sure about should I use abort signal or not
    const resp = await fetch(`${localVoidUrl}/docker/push?t=${tag}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${VoidAuth()}`,
        "X-Registry-Auth": await DockerAuth(),
      },
    });

    res.status(200).send(await resp.json());
  } catch (err) {
    res.status(500).send({ status: "ERR", message: err });
  }
}, sessionConfig);
