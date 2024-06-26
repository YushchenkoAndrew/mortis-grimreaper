import getConfig from 'next/config';
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export class Config {
  public readonly base = {
    web: publicRuntimeConfig.BASE_PATH,
    api: publicRuntimeConfig.BASE_PATH + '/api',
    grape: serverRuntimeConfig.API_URL,

    timeout: 5000,
    secret: serverRuntimeConfig.SESSION_SECRET,
    // TODO:
    // ALLOWED_INVALID_LOGINS
  };

  public readonly captcha = {
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${serverRuntimeConfig.RECAPTCHA_SECRET_KEY}&response={{captcha}}`,
    sitekey: publicRuntimeConfig.RECAPTCHA_SITE_KEY,
  };

  public readonly github = {
    href: publicRuntimeConfig.GITHUB,
    src: publicRuntimeConfig.GITHUB + '.png?size=80',
    name: new URL(publicRuntimeConfig.GITHUB).pathname,
  };

  private static instance: Config;
  private constructor() {}

  static get self(): Config {
    return (this.instance ||= new Config());
  }
}
