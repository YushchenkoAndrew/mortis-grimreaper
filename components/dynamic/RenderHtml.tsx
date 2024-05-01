import DOMPurify from 'dompurify';
import { ReactNode, useRef, useState } from 'react';

export type RenderHtmlProps = React.DetailedHTMLProps<
  React.IframeHTMLAttributes<HTMLIFrameElement>,
  HTMLIFrameElement
> & {
  html: string;
  headerComponent?: ReactNode;
  setOptions?: Partial<{
    height: string;
    containerClassName: string;
    containerHeighOffset: number;
  }>;
};

export default function (props: RenderHtmlProps) {
  const iframeRef = useRef<HTMLIFrameElement>();
  const [height, setHeight] = useState(0);

  return (
    <div
      className={props.setOptions?.containerClassName}
      style={{
        height:
          props.setOptions?.height ??
          `calc(${height}px + ${
            props.setOptions?.containerHeighOffset ?? 6
          }rem)`,
      }}
    >
      {props.headerComponent}

      <iframe
        {...props}
        ref={iframeRef}
        srcDoc={DOMPurify.sanitize(props.html)}
        onLoad={() =>
          setHeight(iframeRef.current.contentWindow.document.body.scrollHeight)
        }
      />
    </div>
  );
}
