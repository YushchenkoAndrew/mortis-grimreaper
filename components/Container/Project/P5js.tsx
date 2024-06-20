import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { memo, useMemo } from 'react';

import 'highlight.js/styles/github.css';
import ScriptFormPreview from '../../Form/Previews/ScriptFormPreview';
import { ProjectContainer } from './ProjectContainer';
import { RenderHtml } from '../../dynamic';

hljs.registerLanguage('js', javascript);

export default memo(function P5js(props: ProjectContainer) {
  const scripts = useMemo(() => {
    return props.preview.map(
      ([name, text]) =>
        [name, hljs.highlight(text, { language: 'js' }).value] as const,
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
            containerClassName: 'flex-1',
          }}
        />
        <div className="flex-1 lg:w-1/2">
          <ScriptFormPreview scripts={scripts as any} />
        </div>
      </div>
    </>
  );
});
