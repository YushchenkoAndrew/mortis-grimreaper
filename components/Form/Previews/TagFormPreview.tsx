export interface TagFormPreviewProps {
  name: string;
}

export default function TagFormPreview(props: TagFormPreviewProps) {
  return (
    <span className="px-3 py-1 first:ml-1 rounded-full bg-indigo-100 text-xs text-indigo-600">
      {props.name}
    </span>
  );
}
