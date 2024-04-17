import { NextApiRequest, NextApiResponse } from 'next';
import { CaptchaService } from '../../../../lib/captcha/captcha.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const { captcha } = req.body;
  if (req.method !== 'POST') return res.status(404).send({});
  if (captcha && typeof captcha !== 'string') {
    return res.status(400).send({ message: `body.captcha is expected to not empty` }); // prettier-ignore
  }

  const success = await CaptchaService.validate(captcha);

  if (success) res.status(200).send({});
  else res.status(422).send({ message: 'Invalid reCAPTCHA' });
}
