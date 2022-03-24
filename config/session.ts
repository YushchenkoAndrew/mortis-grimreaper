import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

const sessionConfig = {
  cookieName: "SESSION_ID",
  password: serverRuntimeConfig.APPLICATION_SECRET ?? "",
};

export default sessionConfig;
