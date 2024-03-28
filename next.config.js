module.exports = {
  reactStrictMode: false,
  swcMinify: true,
  basePath: process.env.BASE_PATH || '/projects',

  async rewrites() {
    return [
      {
        source: '/api/:projects*',
        destination: 'http://192.168.0.106:31337/grape/:projects*',
      },
    ];
  },

  env: {
    NEXT_PUBLIC_VOID_URL: process.env.NEXT_PUBLIC_VOID_URL,
    // NEXT_PUBLIC_RECAPTCHA_INVISIBLE_SITE_KEY:
    //   process.env.RECAPTCHA_INVISIBLE_SITE_KEY,

    ALLOWED_INVALID_LOGIN_REQ: process.env.ENV === 'test' ? 20 : 6,
    K3S_ALLOWED_TYPES: [
      'deployment',
      'service',
      'ingress',
      'pods',
      'namespace',
    ],
  },

  publicRuntimeConfig: {
    BASE_PATH: process.env.BASE_PATH || '/projects',
    GITHUB: process.env.GITHUB,

    RECAPTCHA_SITE_KEY:
      process.env.ENV === 'test'
        ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
        : process.env.RECAPTCHA_SITE_KEY,
    RECAPTCHA_INVISIBLE_SITE_KEY: process.env.RECAPTCHA_INVISIBLE_SITE_KEY,
  },

  serverRuntimeConfig: {
    BASE_PATH: process.env.BASE_PATH,

    API_URL: process.env.API_URL,
    API_USER: process.env.API_USER,
    API_PASS: process.env.API_PASS,
    API_PEPPER: process.env.API_PEPPER,

    BOT_URL: process.env.BOT_URL,
    BOT_KEY: process.env.BOT_KEY,

    WEB_KEY: process.env.WEB_KEY,
    WEB_PEPPER: process.env.WEB_PEPPER,

    VOID_URL: process.env.VOID_URL,
    VOID_AUTH: process.env.VOID_AUTH,

    RECAPTCHA_SECRET_KEY:
      process.env.ENV === 'test'
        ? '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
        : process.env.RECAPTCHA_SECRET_KEY,
    RECAPTCHA_INVISIBLE_SECRET_KEY: process.env.RECAPTCHA_INVISIBLE_SECRET_KEY,

    SESSION_TTL: process.env.SESSION_TTL,

    DOCKER_USER: process.env.DOCKER_USER,
    DOCKER_PASS: process.env.DOCKER_PASS,
    DOCKER_EMAIL: process.env.DOCKER_EMAIL,
  },
};
