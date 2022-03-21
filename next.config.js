module.exports = {
  reactStrictMode: true,
  webpack5: true,
  swcMinify: false,
  basePath: process.env.BASE_PATH || "/projects",

  async headers() {
    return [
      {
        source: "/api/info/analytics",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=1000, must-revalidate",
          },
        ],
      },
      {
        source: "/api/info/statistic",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=1000, must-revalidate",
          },
        ],
      },
      // {
      //   source: "/api/view/rand",
      //   headers: [
      //     {
      //       key: "Cache-Control",
      //       value: "public, max-age=3600, must-revalidate",
      //     },
      //   ],
      // },
    ];
  },

  env: {
    NEXT_PUBLIC_VOID_URL: process.env.NEXT_PUBLIC_VOID_URL,
    // NEXT_PUBLIC_RECAPTCHA_INVISIBLE_SITE_KEY:
    //   process.env.RECAPTCHA_INVISIBLE_SITE_KEY,
    ALLOWED_INVALID_LOGIN_REQ: process.env.ENV === "test" ? 20 : 6,
    K3S_ALLOWED_TYPES: [
      "deployment",
      "service",
      "ingress",
      "pods",
      "namespace",
    ],
  },

  publicRuntimeConfig: {
    BASE_PATH: process.env.BASE_PATH || "/projects",

    RECAPTCHA_SITE_KEY:
      process.env.ENV === "test"
        ? "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
        : process.env.RECAPTCHA_SITE_KEY,
    RECAPTCHA_INVISIBLE_SITE_KEY: process.env.RECAPTCHA_INVISIBLE_SITE_KEY,
  },

  serverRuntimeConfig: {
    BASE_PATH: process.env.BASE_PATH,

    ADMIN_USER: process.env.ADMIN_USER,
    ADMIN_PASS: process.env.ADMIN_PASS,
    APPLICATION_SECRET: process.env.APPLICATION_SECRET,

    API_URL: process.env.API_URL,
    API_USER: process.env.API_USER,
    API_PASS: process.env.API_PASS,
    API_PEPPER: process.env.API_PEPPER,

    BOT_URL: process.env.BOT_URL,
    BOT_KEY: process.env.BOT_KEY,

    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,

    WEB_KEY: process.env.WEB_KEY,
    WEB_PEPPER: process.env.WEB_PEPPER,

    VOID_URL: process.env.VOID_URL,
    VOID_AUTH: process.env.VOID_AUTH,

    RECAPTCHA_SECRET_KEY:
      process.env.ENV === "test"
        ? "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
        : process.env.RECAPTCHA_SECRET_KEY,
    RECAPTCHA_INVISIBLE_SECRET_KEY: process.env.RECAPTCHA_INVISIBLE_SECRET_KEY,

    EMAIL_TO: process.env.EMAIL_TO,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_PASS: process.env.EMAIL_PASS,

    SESSION_TTL: process.env.SESSION_TTL,

    DOCKER_USER: process.env.DOCKER_USER,
    DOCKER_PASS: process.env.DOCKER_PASS,
    DOCKER_EMAIL: process.env.DOCKER_EMAIL,
  },
};
