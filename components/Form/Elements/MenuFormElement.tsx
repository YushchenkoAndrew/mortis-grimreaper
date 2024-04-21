import {
  faChevronDown,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu } from '@headlessui/react';
import {
  Dispatch,
  HTMLInputAutoCompleteAttribute,
  ReactNode,
  useState,
} from 'react';
import { ObjectLiteral } from '../../../lib/common/types';

export interface MenuFormElementProps<T extends ObjectLiteral> {
  className?: string;
  name: ReactNode;
  noChevronDown?: boolean;
  actions: T;
  onChange: Dispatch<keyof T>;
  setOptions?: Partial<{
    buttonPadding: string;
    buttonColor: string;
    buttonTextColor: string;
  }>;
}

export default function MenuFormElement<T extends ObjectLiteral>(
  props: MenuFormElementProps<T>,
) {
  return (
    <Menu
      as="div"
      className={`${props.className || ''} relative inline-block text-left`}
    >
      <div>
        <Menu.Button
          className={`inline-flex w-full ${
            props.setOptions?.buttonPadding || 'px-3 py-2'
          } justify-center items-center rounded text-sm font-semibold focus:outline-none ${
            props.setOptions?.buttonColor || 'bg-blue-600 hover:bg-blue-500'
          } ${props.setOptions?.buttonTextColor || 'text-gray-50'}`}
        >
          {props.name}
          <FontAwesomeIcon
            className={`-mr-1 ml-2 pb-0.5 ${
              props.noChevronDown ? 'hidden' : ''
            }`}
            icon={faChevronDown}
          />
        </Menu.Button>
      </div>
      <Menu.Items className="absolute z-10 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-gray-50 shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div className="p-1">
          {Object.entries(props.actions).map(([key, value], index) => (
            <Menu.Item key={index}>
              <button
                className="w-full p-2 text-left items-center rounded-md text-sm hover:bg-blue-100 "
                type="button"
                onClick={() => props.onChange(key)}
              >
                {value}
              </button>
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
}
