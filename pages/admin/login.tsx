import { withIronSessionSsr } from "iron-session/next";

import React from "react";
import SignIn from "../../components/admin/SignIn";
import DefaultHead from "../../components/default/DefaultHead";
import sessionConfig from "../../config/session";
import { checkIfUserExist } from "../../lib/api/session";
import { basePath } from "../../config";

export default function Login() {
  return (
    <>
      <DefaultHead>
        <title>Login</title>
      </DefaultHead>

      <div className="container text-center">
        <div className="h-100 justify-content-center">
          <SignIn title="Welcome back" desc="Sign in to go further" />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    if (!req.session.user || !(await checkIfUserExist(req.session.user))) {
      return { props: {} };
    }

    return {
      redirect: {
        basePath: false,
        destination: `${basePath}/admin`,
        permanent: false,
      },
    };
  },
  sessionConfig
);
