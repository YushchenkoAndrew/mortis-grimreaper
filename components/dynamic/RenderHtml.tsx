import DOMPurify from 'dompurify';
import { LegacyRef } from 'react';

export type RenderHtmlProps = React.DetailedHTMLProps<
  React.IframeHTMLAttributes<HTMLIFrameElement>,
  HTMLIFrameElement
> & { html: string; iframe_ref?: LegacyRef<HTMLIFrameElement> };

export default function (props: RenderHtmlProps) {
  return (
    <iframe
      {...props}
      ref={props.iframe_ref}
      srcDoc={DOMPurify.sanitize(props.html)}
    />
  );
}
