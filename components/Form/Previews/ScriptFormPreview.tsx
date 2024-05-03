import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
// const { JSDOM } = require('jsdom');

const SCRIPT_PREVIEW_ID = 'script-preview';

export interface ScriptFormPreviewProps {
  scripts: [string, string][];
}

export default function ScriptFormPreview(props: ScriptFormPreviewProps) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const code = document.getElementById(SCRIPT_PREVIEW_ID);
    if (!code || !props.scripts[selected]) return;

    const [_, html] = props.scripts[selected];
    code.innerHTML = DOMPurify.sanitize(html);
  }, [selected]);

  return (
    <>
      <div className="flex w-full space-x-1 border-b border-gray-400 overflow-x-auto">
        {props.scripts.map(([name], index) => (
          <span
            key={index}
            className={`text-sm font-semibold px-3 py-1 hover:bg-gray-200 cursor-pointer ${
              index == selected ? 'bg-gray-200' : 'bg-white'
            }`}
            onClick={() => setSelected(index)}
          >
            {name}
          </span>
        ))}
      </div>
      <pre
        className="h-full lg:h-[calc(100vh-6rem)] overflow-auto bg-white"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `<code id="${SCRIPT_PREVIEW_ID}"></div>`,
        }}
      ></pre>
    </>
  );
}
