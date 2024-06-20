import { ReactNode } from 'react';

export interface TooltipFormPreviewProps {
  className?: string;
  value?: ReactNode;

  setOptions?: Partial<{
    margin: string;
    color: string;
    rounded: string;
    visible: boolean;
  }>;
}

export default function TooltipFormPreview(props: TooltipFormPreviewProps) {
  if (!props.value) return <></>;

  return (
    <div
      className={`block invisible absolute z-20 ${
        props.setOptions?.margin ?? '-ml-6'
      } px-3 py-2 text-sm font-medium ${
        props.setOptions?.color ?? 'bg-blue-50 text-blue-600'
      } cursor-default transition-opacity delay-500 duration-300 ease-in-out opacity-0 group-hover:opacity-100 ${
        props.setOptions?.rounded ?? 'rounded'
      } ${
        props.setOptions?.visible === false ? '' : 'group-hover:visible'
      } border shadow-sm`}
    >
      {props.value}
    </div>
  );
}
