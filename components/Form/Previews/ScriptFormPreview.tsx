import DOMPurify from 'dompurify';
import { useState } from 'react';

const SCRIPT_PREVIEW_ID = 'script-preview';

export interface ScriptFormPreviewProps {
  scripts: [string, string][];
}

export default function ScriptFormPreview(props: ScriptFormPreviewProps) {
  const [selected, setSelected] = useState(0);

  return (
    <>
      <div className="flex w-full space-x-1 border-b border-gray-400 overflow-x-auto">
        {props.scripts.map(([name], index) => (
          <span
            key={index}
            className={`text-sm font-semibold px-3 py-1 hover:bg-gray-200 cursor-pointer ${
              index == selected ? 'bg-gray-200' : ''
            }`}
            onClick={() => {
              const code = document.getElementById(SCRIPT_PREVIEW_ID);
              if (!code || !props.scripts[index]) return;

              const [_, html] = props.scripts[index];
              setSelected(index), (code.innerHTML = DOMPurify.sanitize(html));
            }}
          >
            {name}
          </span>
        ))}
      </div>
      <pre
        className="h-[calc(100vh-6rem)] overflow-auto"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `<code id="${SCRIPT_PREVIEW_ID}">${
            props.scripts[selected]
              ? DOMPurify.sanitize(props.scripts[selected][1])
              : ''
          }</div>`,
        }}
      ></pre>
    </>
  );
}
