import { Dispatch, ReactNode } from 'react';
import TooltipFormPreview from './TooltipFormPreview';

export interface TaskFormPreviewProps {
  name: string;
  description: string;

  blur?: boolean;
  onClick?: Dispatch<void>;

  className?: string;
  contextComponent?: ReactNode;
}

export default function TaskFormPreview(props: TaskFormPreviewProps) {
  return (
    <div
      className={`flex flex-col p-2 w-full rounded-md bg-gray-700 cursor-pointer ${
        props.className ?? ''
      }`}
      onClick={() => props.onClick?.()}
    >
      <div className="group max-h-10">
        <div className="w-full justify-between text-sm text-gray-300 font-medium line-clamp-2">
          {props.name}
        </div>

        <TooltipFormPreview
          value={
            <div className="flex flex-col">
              <span className="font-bold">{props.name}</span>
              <span className="text-xs text-gray-400">{props.description}</span>
            </div>
          }
          setOptions={{
            visible: !props.blur,
            color: 'bg-gray-800 text-gray-200',
            rounded: 'rounded-lg',
            margin: '',
          }}
        />
      </div>

      {props.contextComponent}
    </div>
  );
}
