import { ReactNode, useMemo } from 'react';

export interface TopicFormPreviewProps {
  title: string;

  name: string;
  description: string;
  headerComponent?: ReactNode;
}

export default function TopicFormPreview(props: TopicFormPreviewProps) {
  const hidden = useMemo(() => !props.description, [props.description]);
  return (
    <div className="flex flex-col">
      <div className="flex text-lg justify-between">
        <span className="font-medium text-gray-800 mb-6">{props.title}</span>
        {props.headerComponent}
      </div>
      <span
        className={`text-gray-800 text-pretty mb-4 ${hidden ? 'hidden' : ''}`}
      >
        {props.description}
      </span>
      <span
        className={`text-gray-400 italic text-pretty mb-4 ${
          hidden ? '' : 'hidden'
        }`}
      >
        There is no {props.name} provided in this project
      </span>
    </div>
  );
}
