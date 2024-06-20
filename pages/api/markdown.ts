import { existsSync, readFileSync } from 'fs';
import { marked } from 'marked';
import { NextApiRequest, NextApiResponse } from 'next';
import Handlebars from 'handlebars';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const { text } = req.body;
  if (req.method !== 'POST') return res.status(404).send({});
  if (text && typeof text !== 'string') {
    return res.status(400).send({ message: `body.text is expected to not empty` }); // prettier-ignore
  }

  const markdown = await marked.parse(text);
  const filename = `html/markdown-template.html.hbs`;
  const template = (existsSync(filename) && readFileSync(filename, 'utf-8')) || ''; // prettier-ignore
  const html = Handlebars.compile(template)({ title: 'Markdown', markdown });

  return res.setHeader('Content-Type', 'text/html').send(Buffer.from(html));
}
