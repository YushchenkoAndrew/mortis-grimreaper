import { Dispatch } from 'react';

export interface CheckFormElementProps {
  name: string;
  value: boolean;
  onChange: Dispatch<void>;

  description?: string;

  className?: string;
}

export default function CheckFormElement(props: CheckFormElementProps) {
  return (
    <div className={props.className || ''}>
      <div className="relative flex gap-x-2">
        <input
          className="h-4 w-4 mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          type="checkbox"
          checked={props.value}
          onChange={() => props.onChange()}
        />
        <div className="text-sm ">
          <label className="font-medium text-gray-900">{props.name}</label>
          <p className="text-gray-500">{props.description}</p>
        </div>
      </div>
    </div>
  );
}
