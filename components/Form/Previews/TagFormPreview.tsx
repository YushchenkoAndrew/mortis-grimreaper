export interface TagFormPreviewProps {
  name: string;
}

export default function TagFormPreview(props: TagFormPreviewProps) {
  return (
    <span className="px-3 py-1 first:ml-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-xs text-indigo-600 dark:text-indigo-400  border-indigo-600 dark:border">
      {props.name}
    </span>
  );
}
