import hljs from 'highlight.js/lib/core';
import cpp from 'highlight.js/lib/languages/cpp';

import 'highlight.js/styles/github.css';
import { Config } from '../../../config';
import ScriptFormPreview from '../../Form/Previews/ScriptFormPreview';
import { ProjectContainer } from './ProjectContainer';
import { memo, useMemo } from 'react';

hljs.registerLanguage('cpp', cpp);

export default memo(function Emscripten(props: ProjectContainer) {
  const scripts = useMemo(() => {
    return props.preview.map(
      ([name, text]) =>
        [name, hljs.highlight(text, { language: 'cpp' }).value] as const,
    );
  }, [props.scripts]);

  return (
    <>
      <div className="flex flex-col lg:flex-row h-full w-full overflow-x-hidden overflow-y-auto lg:overflow-y-hidden">
        <div className="flex-1 lg:w-1/2">
          <canvas
            id="canvas"
            onContextMenu={(e) => e.preventDefault()}
            tabIndex={-1}
          ></canvas>

          <script defer src={`${Config.self.base.web}/js/lib/emscripten.js`} />
          {props.scripts.map((src) => (
            <script defer key={src.id} src={src._url()} />
          ))}
        </div>

        <div className="flex-1 lg:w-1/2">
          <ScriptFormPreview scripts={scripts as any} />
        </div>
      </div>
    </>
  );
});
