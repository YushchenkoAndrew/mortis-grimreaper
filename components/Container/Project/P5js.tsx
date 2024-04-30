import { Config } from '../../../config';
import { AttachmentEntity } from '../../../lib/attachment/entities/attachment.entity';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { memo, useEffect, useState } from 'react';
import { ErrorService } from '../../../lib/common/error.service';

import 'highlight.js/styles/github.css';
import ScriptFormPreview from '../../Form/Previews/ScriptFormPreview';
import { ProjectContainer } from './ProjectContainer';

hljs.registerLanguage('js', javascript);

export default memo(function P5js(props: ProjectContainer) {
  const [scripts, setScripts] = useState<(readonly [string, string])[]>([]);

  useEffect(() => {
    ErrorService.envelop(async () => {
      setScripts(
        await Promise.all(
          props.preview.map((e) =>
            AttachmentEntity.self.load
              .text(e.id)
              .then(
                (text) =>
                  [
                    e.name,
                    hljs.highlight(text, { language: 'js' }).value,
                  ] as const,
              ),
          ),
        ),
      );
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
          <ScriptFormPreview scripts={scripts as any} />
        </div>
      </div>
    </>
  );
});
