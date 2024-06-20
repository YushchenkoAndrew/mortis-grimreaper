export interface NoneFormPreviewProps {
  hidden?: boolean;
}

export default function NoneFormPreview(props: NoneFormPreviewProps) {
  return (
    <span
      className={`text-sm dark:text-gray-400 ${
        props.hidden ? 'hidden' : 'block'
      }`}
    >
      None
    </span>
  );
}
