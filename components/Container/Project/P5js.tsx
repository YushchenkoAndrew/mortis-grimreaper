import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { memo, useMemo } from 'react';

import 'highlight.js/styles/github.css';
import ScriptFormPreview from '../../Form/Previews/ScriptFormPreview';
import { ProjectContainer } from './ProjectContainer';
import { Config } from '../../../config';

hljs.registerLanguage('js', javascript);

export default memo(function P5js(props: ProjectContainer) {
  const scripts = useMemo(() => {
    return props.preview.map(
      ([name, text]) =>
        [name, hljs.highlight(text, { language: 'js' }).value] as const,
    );
  }, [props.scripts]);

  return (
    <>
      {props.scripts.map((src) => (
        <script key={src.id} src={src._url()} />
      ))}

      <script src={`${Config.self.base.web}/js/lib/p5.min.js`} />
      <script src={`${Config.self.base.web}/js/lib/p5.sound.min.js`} />

      <div className="flex flex-col lg:flex-row h-full w-full overflow-x-hidden overflow-y-auto lg:overflow-y-hidden">
        <div
          className="flex-1 lg:w-1/2"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `<div id="p5js-container"></div>`,
          }}
        />
        <div className="flex-1 lg:w-1/2">
          <ScriptFormPreview scripts={scripts as any} />
        </div>
      </div>
    </>
  );
});
