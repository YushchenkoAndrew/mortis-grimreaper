import { withIronSession } from "next-iron-session";
import sessionConfig from "../../config/session";
import { NextSessionArgs } from "../../types/session";
import redis from "../../config/redis";
import { basePath } from "../../config";

export function checkIfUserExist(sessionID: string) {
  return new Promise<boolean>((resolve) => {
    redis
      .get(`SESSION:${sessionID}`)
      .then((userID) => {
        redis
          .get(`USER:${userID}`)
          .then((data) => resolve(!!data))
          .catch(() => resolve(false));
      })
      .catch(() => resolve(false));
  });
}

export default withIronSession(async function ({ req, res }: NextSessionArgs) {
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

  return { props: {} };
}, sessionConfig);
