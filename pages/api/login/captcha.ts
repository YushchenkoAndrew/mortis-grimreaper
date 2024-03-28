import { NextApiRequest, NextApiResponse } from 'next';
import { CaptchaService } from '../../../lib/captcha';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const { captcha } = req.query;
  if (req.method !== 'POST') return res.status(404).send('');
  if (captcha && typeof captcha !== 'string') return res.status(400).send('');

  const success = await CaptchaService.validate(captcha as string);
  if (success) res.status(204).send('');
  else res.status(422).send({ message: 'Invalid reCAPTCHA' });
}
