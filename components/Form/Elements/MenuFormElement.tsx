import {
  faChevronDown,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, Transition } from '@headlessui/react';
import { Dispatch, Fragment, ReactNode } from 'react';
import { ObjectLiteral } from '../../../lib/common/types';

export interface MenuFormElementProps<T extends ObjectLiteral> {
  className?: string;
  name: ReactNode;
  actions: T;
  disabled?: boolean;
  onChange: Dispatch<keyof T>;
  setOptions?: Partial<{
    buttonPadding: string;
    buttonColor: string;
    buttonTextColor: string;
    noChevronDown?: boolean;
  }>;
  itemComponent?: Partial<{
    [action in keyof T]: (props: {
      key: string;
      value: any;
      className: string;
      onChange: Dispatch<keyof T>;
    }) => ReactNode;
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
        <Menu.Items className="absolute z-10 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-gray-50 shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="p-1">
            {Object.entries(props.actions).map(([key, value], index) => {
              const className =
                'w-full p-2 text-left items-center rounded-md text-sm hover:bg-blue-100';
              return (
                <Menu.Item key={index}>
                  {props.itemComponent?.[key] ? (
                    props.itemComponent[key]({
                      className,
                      key,
                      value,
                      onChange: props.onChange,
                    })
                  ) : (
                    <button
                      className={className}
                      type="button"
                      onClick={() => props.onChange(key)}
                    >
                      {value}
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
