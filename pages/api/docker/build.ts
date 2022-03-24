import type { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import { localVoidUrl } from "../../../config";
import sessionConfig from "../../../config/session";
import { GetParam } from "../../../lib/api/query";
import { GetServerIP } from "../../../lib/api/ip";
import { DockerAuth, VoidAuth } from "../../../lib/api/auth";
import { withIronSessionApiRoute } from "iron-session/next/dist";

const { serverRuntimeConfig } = getConfig();

export default withIronSessionApiRoute(async function (req, res) {
  if (req.method !== "POST") return res.status(405).send("");

  const tag = GetParam(req.query.tag);
  const path = GetParam(req.query.path);
  if (!tag || !path) {
    return res.status(400).send("");
  }

  const data = await new Promise<string>((resolve) => {
    fetch(`${localVoidUrl}/docker?path=/${path}&t=${tag}&push`, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(serverRuntimeConfig.VOID_AUTH ?? "").toString("base64"),
      },
    })
      .then((res) => res.text())
      .then((data) => resolve(data))
      .catch(() => resolve(""));
  });

  if (!data) return res.send(data);
  await new Promise<void>(async (resolve) => {
    try {
      await fetch(`${localVoidUrl}/docker/push?t=${tag}&`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${VoidAuth()}`,
          "X-Registry-Auth": await DockerAuth(),
        },
      });
    } catch (err) {}
  });

  res.send(data);
}, sessionConfig);
