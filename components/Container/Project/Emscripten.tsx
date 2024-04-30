import { AttachmentEntity } from '../../../lib/attachment/entities/attachment.entity';
import hljs from 'highlight.js/lib/core';
import cpp from 'highlight.js/lib/languages/cpp';

import 'highlight.js/styles/github.css';
import { Config } from '../../../config';
import ScriptFormPreview from '../../Form/Previews/ScriptFormPreview';
import { ProjectContainer } from './ProjectContainer';
import { memo, useEffect, useState } from 'react';
import { ErrorService } from '../../../lib/common/error.service';

hljs.registerLanguage('cpp', cpp);

export default memo(function Emscripten(props: ProjectContainer) {
  const [scripts, setScripts] = useState<(readonly [string, string])[]>([]);

  useEffect(() => {
    ErrorService.envelop(async () => {
      const list = await Promise.all(
        props.preview.map(
          (e) =>
          AttachmentEntity.self.load
            .text(e.id)
            .then((text) => [e.name, hljs.highlight(text, {  language: 'cpp' }).value] as const), // prettier-ignore
        ),
      );

      // hljs.initLineNumbersOnLoad();
      setScripts(list);
    });
  }, []);

  return (
    <>
      <div className="flex h-full w-full overflow-hidden">
        <div className="flex-1 w-1/2">
          <canvas
            id="canvas"
            onContextMenu={(e) => e.preventDefault()}
            tabIndex={-1}
          ></canvas>

          <script src={`${Config.self.base.web}/js/lib/emscripten.js`} />
          {props.scripts.map((src) => (
            <script async key={src.id} src={src._url()} />
          ))}
        </div>

        <div className="flex-1 w-1/2">
          <ScriptFormPreview scripts={scripts as any} />
        </div>
      </div>
    </>
  );
});
