import {
  faChevronDown,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, Transition } from '@headlessui/react';
import { Dispatch, Fragment, ReactNode } from 'react';
import { ObjectLiteral } from '../../../lib/common/types';

export interface DropdownFormElementProps<T extends ObjectLiteral> {
  className?: string;
  name: ReactNode;
  disabled?: boolean;
  // onChange: Dispatch<keyof T>;
  setOptions?: Partial<{
    buttonPadding: string;
    buttonColor: string;
    buttonTextColor: string;
    noChevronDown?: boolean;
    panelWidth?: string;
    panelPadding?: string;
  }>;
  contextComponent: ReactNode;
}

export default function DropdownFormElement<T extends ObjectLiteral>(
  props: DropdownFormElementProps<T>,
) {
  return (
    <Menu
      as="div"
      className={`${props.className || ''} relative inline-block text-left`}
    >
      <Menu.Button
        disabled={props.disabled}
        className={`inline-flex w-full ${
          props.setOptions?.buttonPadding || 'px-3 py-2'
        } justify-center items-center rounded text-sm font-semibold focus:outline-none ${
          props.setOptions?.buttonColor ||
          'bg-blue-600 hover:bg-blue-500 disabled:bg-gray-50'
        } ${props.setOptions?.buttonTextColor || 'text-gray-50'}`}
      >
        {props.name}
        <FontAwesomeIcon
          className={`-mr-1 ml-2 pb-0.5 ${
            props.setOptions?.noChevronDown ? 'hidden' : ''
          }`}
          icon={faChevronDown}
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute z-10 right-0 mt-2 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 dark:border border-gray-700 shadow-lg ring-1 ring-black/5 focus:outline-none ${
            props.setOptions?.panelWidth ?? 'w-56'
          } ${props.setOptions?.panelPadding ?? ''}`}
        >
          <Menu.Item>{props.contextComponent}</Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
