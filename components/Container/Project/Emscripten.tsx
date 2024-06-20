import hljs from 'highlight.js/lib/core';
import cpp from 'highlight.js/lib/languages/cpp';

import 'highlight.js/styles/github.css';
import ScriptFormPreview from '../../Form/Previews/ScriptFormPreview';
import { ProjectContainer } from './ProjectContainer';
import { memo, useMemo } from 'react';
import { RenderHtml } from '../../dynamic';

hljs.registerLanguage('cpp', cpp);

export default memo(function Emscripten(props: ProjectContainer) {
  const scripts = useMemo(() => {
    return props.preview.map(
      ([name, text]) =>
        [name, hljs.highlight(text, { language: 'cpp' }).value] as const,
    );
  }, [props.preview]);

  return (
    <>
      <div className="flex flex-col lg:flex-row h-full w-full overflow-x-hidden overflow-y-auto lg:overflow-y-hidden">
        <RenderHtml
          className="w-full h-full overflow-y-hidden"
          html={props.html}
          dompurify={{ FORCE_BODY: true, ADD_TAGS: ['script'] }}
          setOptions={{
            height: 'calc(100vh - 4rem)',
            containerClassName: 'flex-1 lg:w-1/2',
          }}
        />

        <div className="flex-1 lg:w-1/2">
          <ScriptFormPreview scripts={scripts as any} />
        </div>
      </div>
    </>
  );
});
