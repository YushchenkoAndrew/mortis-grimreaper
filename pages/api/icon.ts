import { load } from 'cheerio';
import { NextApiRequest, NextApiResponse } from 'next';
import { Config } from '../../config';
import { StringService } from '../../lib/common';
import { ServerService } from '../../lib/common/server.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const { url } = req.query;
  if (req.method !== 'GET') return res.status(404).send({});
  if (!url || typeof url !== 'string' || !StringService.isUrlValid(url)) {
    return res.status(400).send({ message: `query.url is invalid` }); // prettier-ignore
  }

  if (ServerService.self.cache.has(`icon[${url}]`)) {
    const icon = ServerService.self.cache.get<string>(`icon[${url}]`);
    if (icon) return res.redirect(icon);
    return res.status(204).send(null);
  }

  const ctl = new AbortController();
  setTimeout(() => ctl.abort(), Config.self.base.timeout);

  const html = await fetch(url, { signal: ctl.signal, redirect: 'follow' })
    .then((res) => res.text())
    .catch(() => '<html></html>');

  const tree = load(html);
  const icon =
    tree('[rel="shortcut icon"]').attr('href') ||
    tree('[rel="apple-touch-icon"]').attr('href');

  ServerService.self.cache.set(`icon[${url}]`, icon, 3600 * 24 * 7);
  if (icon) return res.redirect(icon);
  return res.status(204).send(null);
}
