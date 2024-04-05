import { RadioGroup } from '@headlessui/react';
import { Dispatch } from 'react';
import { ObjectLiteral } from '../../types';

export interface RadioProps<T extends ObjectLiteral<React.ReactNode>> {
  className?: string;
  name: string;
  value: keyof T & string;
  onChange: Dispatch<keyof T & string>;
  options: T;
}

export default function Radio<T extends ObjectLiteral<React.ReactNode>>(
  props: RadioProps<T>,
) {
  return (
    <div className={`${props.className || ''} max-w-sm w-full`}>
      <span className="text-sm font-medium">{props.name}</span>
      <RadioGroup
        className="mt-1 space-y-1.5"
        value={props.value}
        onChange={props.onChange}
      >
        {Object.entries(props.options).map(([key, value], i) => (
          <RadioGroup.Option key={i} value={key}>
            {({ checked }) => (
              <div
                className={`flex relative p-5 rounded ${
                  checked
                    ? 'bg-blue-50 ring-1 ring-blue-600 text-blue-600'
                    : 'bg-transparent ring-1 ring-gray-700 text-gray-800'
                }`}
              >
                <span className="flex items-center">
                  <input
                    className="mr-2 text-blue-600"
                    type="radio"
                    checked={checked}
                    onChange={() => null}
                  />
                  <span className="ml-1 flex font-medium items-center">
                    {value}
                  </span>
                </span>
              </div>
            )}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </div>
  );
}
