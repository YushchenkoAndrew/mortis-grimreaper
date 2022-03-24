// import { withIronSession } from "next-iron-session";
import sessionConfig from "../../config/session";
// import { NextSessionArgs } from "../../types/session";
import redis from "../../config/redis";
import { basePath } from "../../config";
import { withIronSessionSsr } from "iron-session/next";

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

declare module "iron-session" {
  interface IronSessionData {
    user: string;
  }
}

export default withIronSessionSsr(async function getServerSideProps({ req }) {
  if (req.session.user && (await checkIfUserExist(req.session.user))) {
    return { props: {} };
  }

  return {
    redirect: {
      basePath: false,
      destination: `${basePath}/admin/login`,
      permanent: false,
    },
  };
}, sessionConfig);
