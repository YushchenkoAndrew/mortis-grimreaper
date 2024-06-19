module.exports = {
  reactStrictMode: false,
  swcMinify: true,
  basePath: process.env.BASE_PATH || '/projects',
  images: { minimumCacheTTL: 60 },

  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'Cross-Origin-Embedder-Policy',
  //           value: 'require-corp',
  //         },
  //         {
  //           key: 'Cross-Origin-Opener-Policy',
  //           value: 'same-origin',
  //         },
  //       ],
  //     },
  //   ];
  // },

  async rewrites() {
    const proxy = (src, dst, options) => ({
      ...options,
      source: `/api/${src}`,
      destination: `${process.env.API_URL}/${dst || src}`,
      // Headers
    });

    return [
      proxy('projects'),
      proxy('projects/:id'),
      proxy('attachments/:id'),
      proxy('admin/projects'),
      proxy('admin/projects/:id'),
      proxy('admin/projects/:id/order'),
      proxy('admin/tags'),
      proxy('admin/tags/:id'),
      proxy('admin/links'),
      proxy('admin/links/:id'),
      proxy('admin/links/:id/order'),
      proxy('admin/attachments'),
      proxy('admin/attachments/:id'),
      proxy('admin/attachments/:id/order'),

      proxy('admin/contexts'),
      proxy('admin/contexts/:context_id'),
      proxy('admin/contexts/:context_id/order'),
      proxy('admin/contexts/:context_id/fields'),
      proxy('admin/contexts/:context_id/fields/:id'),
      proxy('admin/contexts/:context_id/fields/:id/order'),

      proxy('admin/stages'),
      proxy('admin/stages/:stage_id'),
      proxy('admin/stages/:stage_id/order'),
      proxy('admin/stages/:stage_id/tasks'),
      proxy('admin/stages/:stage_id/tasks/:id'),
      proxy('admin/stages/:stage_id/tasks/:id/order'),
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
