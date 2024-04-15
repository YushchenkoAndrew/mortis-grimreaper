import {
  faCheckCircle,
  faCircle,
  faCircleDot,
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RadioGroup } from '@headlessui/react';
import { Dispatch, useEffect, useState } from 'react';
import { ObjectLiteral } from '../../lib/common/types';

export interface StepsProps<T extends ObjectLiteral> {
  value: keyof T & string;
  states: T;
}

export default function Steps<T extends ObjectLiteral>(props: StepsProps<T>) {
  const [active, onActive] = useState(-1);

  useEffect(
    () => onActive(Object.keys(props.states).indexOf(props.value)),
    [props.value],
  );

  return (
    <div className="w-full max-w-xs">
      <RadioGroup value={props.value}>
        {Object.entries(props.states).map(([key, value], index) => (
          <RadioGroup.Option
            key={index}
            value={key}
            className="relative flex bg-transparent px-5 py-4 focus:outline-none"
          >
            {({ checked }) => {
              const style = (...options: any[]) => {
                if (checked) return options[0];
                return active > index ? options[1] : options[2];
              };

              return (
                <>
                  <div className="flex w-full items-center">
                    <FontAwesomeIcon
                      className={`${style(
                        'text-blue-600',
                        'text-green-600',
                        'text-gray-300',
                      )} text-3xl`}
                      icon={style(faCircleDot, faCheckCircle, faCircle)}
                    />
                    <span
                      className={`${style(
                        'text-gray-800',
                        'text-gray-600 line-through',
                        'text-gray-400',
                      )} ml-3 font-medium text-base `}
                    >
                      {value}
                    </span>
                  </div>
                </>
              );
            }}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </div>
  );
}
