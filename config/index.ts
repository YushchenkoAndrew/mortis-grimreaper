import getConfig from 'next/config';
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export const basePath = publicRuntimeConfig.BASE_PATH;
export const apiUrl = serverRuntimeConfig.API_URL;
export const botUrl = serverRuntimeConfig.BOT_URL;

export const voidUrl =
  process.env.NEXT_PUBLIC_VOID_URL || 'http://127.0.0.1:8003/files';
export const localVoidUrl = serverRuntimeConfig.VOID_URL;

export class Config {
  public readonly base = {
    web: publicRuntimeConfig.BASE_PATH,
    api: publicRuntimeConfig.BASE_PATH + '/api',
  };

  public readonly api = {
    url: serverRuntimeConfig.API_URL,
  };

  public readonly fetch = {
    timeout: 5000,
  };

  public readonly captcha = {
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${serverRuntimeConfig.RECAPTCHA_SECRET_KEY}&response={{captcha}}`,
    sitekey: publicRuntimeConfig.RECAPTCHA_SITE_KEY,
  };

  public readonly navigation = [
    { name: 'home', href: '/' },
    { name: 'board', href: '/board' },
    { name: 'projects', href: '/projects' },
    { name: 'portfolio', href: '/portfolio' },
    { name: 'contacts', href: '/contacts' },
  ];

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
