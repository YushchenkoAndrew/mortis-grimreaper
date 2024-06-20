import DOMPurify from 'dompurify';
import { ReactNode, useMemo, useRef, useState } from 'react';

export type RenderHtmlProps = React.DetailedHTMLProps<
  React.IframeHTMLAttributes<HTMLIFrameElement>,
  HTMLIFrameElement
> & {
  html: string;
  dompurify?: DOMPurify.Config & {
    RETURN_DOM_FRAGMENT?: false | undefined;
    RETURN_DOM?: false | undefined;
  };
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

  const copy = useMemo(() => {
    const copy = { ...props };

    delete copy.html;
    delete copy.dompurify;
    delete copy.setOptions;
    delete copy.headerComponent;

    return copy;
  }, [props]);

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
        {...copy}
        ref={iframeRef}
        srcDoc={DOMPurify.sanitize(props.html, props.dompurify)}
        onLoad={() =>
          setHeight(iframeRef.current.contentWindow.document.body.scrollHeight)
        }
      />
    </div>
  );
}
