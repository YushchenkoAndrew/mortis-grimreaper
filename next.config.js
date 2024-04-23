module.exports = {
  reactStrictMode: false,
  swcMinify: true,
  basePath: process.env.BASE_PATH || '/projects',

  async rewrites() {
    const proxy = (src, dst) => ({
      source: `/api/${src}`,
      destination: `${process.env.API_URL}/${dst || src}`,
    });

    return [
      proxy('projects'),
      proxy('projects/:id'),
      proxy('attachments/:id'),
      proxy('admin/projects'),
      proxy('admin/projects/:id'),
      proxy('admin/attachments'),
      proxy('admin/attachments/:id'),
      proxy('admin/attachments/:id/order'),
      // proxy('admin/login', 'login'),
    ];
  },

  env: {},

  publicRuntimeConfig: {
    BASE_PATH: process.env.BASE_PATH,
    GITHUB: process.env.GITHUB,

    ALLOWED_INVALID_LOGIN_REQ: process.env.ALLOWED_INVALID_LOGIN_REQ,

    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    RECAPTCHA_INVISIBLE_SITE_KEY: process.env.RECAPTCHA_INVISIBLE_SITE_KEY,
  },

  serverRuntimeConfig: {
    BASE_PATH: process.env.BASE_PATH,
    API_URL: process.env.API_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,

    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    RECAPTCHA_INVISIBLE_SECRET_KEY: process.env.RECAPTCHA_INVISIBLE_SECRET_KEY,
  },
};
