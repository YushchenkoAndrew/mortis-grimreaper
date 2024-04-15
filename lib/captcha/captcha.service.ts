import Handlebars from 'handlebars';
import { Config } from '../../config';

type CaptchaResponse = { success: boolean };

export class CaptchaService {
  static async validate(captcha: string): Promise<boolean> {
    const ctl = new AbortController();
    setTimeout(() => ctl.abort(), Config.self.base.timeout);

    const url = Handlebars.compile(Config.self.captcha.url);
    const res: CaptchaResponse = await fetch(url({ captcha }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }, // prettier-ignore
      method: 'POST',
      signal: ctl.signal,
    })
      .then((res) => res.json())
      .catch(() => ({ success: false }));

    return res.success;
  }
}
