export interface TooltipFormPreviewProps {
  className?: string;
  value?: string;

  setOptions?: Partial<{ margin: string }>;
}

export default function TooltipFormPreview(props: TooltipFormPreviewProps) {
  if (!props.value) return <></>;

  return (
    <div
      className={`block invisible absolute z-10 ${
        props.setOptions?.margin ?? '-ml-6'
      } px-3 py-2 text-sm font-medium bg-blue-50 text-blue-600 cursor-default transition-opacity delay-500 duration-300 ease-in-out opacity-0 group-hover:visible group-hover:opacity-100 rounded border shadow-sm`}
    >
      {props.value}
    </div>
  );
}
