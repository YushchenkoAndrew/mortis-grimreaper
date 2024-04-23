import { Config } from '../../config';
import { AttachmentEntity } from '../../lib/attachment/entities/attachment.entity';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { useEffect, useState } from 'react';
import { ErrorService } from '../../lib/common/error.service';

import 'highlight.js/styles/github.css';

hljs.registerLanguage('js', javascript);

export interface P5jsProps {
  className?: string;
  scripts: AttachmentEntity[];
}

export default function P5js(props: P5jsProps) {
  const [selected, setSelected] = useState(0);
  const [scripts, setScripts] = useState<[string, string][]>([]);

  useEffect(() => {
    ErrorService.envelop(async () => {
      const list = await Promise.all(
        props.scripts.map(
          (e) =>
          AttachmentEntity.self.load
            .text(e.id)
            .then((text) => [e.name, hljs.highlight(text, {  language: 'js' }).value ]), // prettier-ignore
        ),
      );

      // hljs.initLineNumbersOnLoad();
      setScripts(list as any);

      const [_, html] = list?.[0] || [];
      const code = document.getElementById('p5js-code');
      if (code) code.innerHTML = html;
    });
  }, []);

  return (
    <>
      <script src={`${Config.self.base.web}/js/lib/p5.min.js`} />
      <script src={`${Config.self.base.web}/js/lib/p5.sound.min.js`} />
      {props.scripts.map((src) => (
        <script key={src.id} src={src._url()} />
      ))}

      <div className="flex h-full w-full overflow-hidden">
        <div
          className="flex-1"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `<div id="p5js-container"></div>`,
          }}
        />
        <div className="flex-1 w-1/2">
          <div className="flex w-full space-x-1 border-b border-gray-400">
            {scripts.map(([name], index) => (
              <span
                key={index}
                className={`text-sm font-semibold px-3 py-1 hover:bg-gray-200 cursor-pointer ${
                  index == selected ? 'bg-gray-200' : ''
                }`}
                onClick={() => {
                  const code = document.getElementById('p5js-code');
                  if (!code || !scripts[index]) return;

                  const [_, html] = scripts[index];
                  setSelected(index), (code.innerHTML = html);
                }}
              >
                {name}
              </span>
            ))}
          </div>
          <pre
            className="h-[calc(100vh-6rem)] overflow-auto"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: `<code id="p5js-code"></div>` }}
          />
        </div>
      </div>
    </>
  );
}
