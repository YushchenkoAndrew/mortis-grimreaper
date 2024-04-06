import DOMPurify from 'dompurify';

export default function (
  props: React.DetailedHTMLProps<
    React.IframeHTMLAttributes<HTMLIFrameElement>,
    HTMLIFrameElement
  > & { html: string },
) {
  return <iframe {...props} srcDoc={DOMPurify.sanitize(props.html)} />;
}
