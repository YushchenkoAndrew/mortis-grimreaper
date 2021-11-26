import { withIronSession } from "next-iron-session";
import React from "react";
import DefaultHead from "../../components/default/DefaultHead";
import sessionConfig from "../../config/session";
import { NextSessionArgs } from "../../types/session";
import { checkIfUserExist } from "../../lib/api/session";
import redis from "../../config/redis";
import { basePath } from "../../config";

export default function Logout() {
  return (
    <>
      <DefaultHead>
        <title>Logout</title>
      </DefaultHead>
    </>
  );
}

export const getServerSideProps = withIronSession(async function ({
  req,
  res,
}: NextSessionArgs) {
  const sessionID = req.session.get("user");
  const isOk = await checkIfUserExist(sessionID);

  if (!sessionID || !isOk) {
    return {
      redirect: {
        basePath: false,
        destination: `${basePath}/admin/login`,
        permanent: false,
      },
    };
  }

  redis.del(`SESSION:${sessionID}`);
  await req.session.destroy();

  return {
    redirect: {
      basePath: false,
      destination: basePath,
      permanent: false,
    },
  };
},
sessionConfig);
