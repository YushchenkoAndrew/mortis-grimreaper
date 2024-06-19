import {
  faCircleExclamation,
  faPlus,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ChangeEvent,
  Dispatch,
  forwardRef,
  HTMLInputAutoCompleteAttribute,
  KeyboardEvent,
  ReactNode,
  useState,
} from 'react';
import BlockFormElement, { BlockFormElementProps } from './BlockFormElement';

export interface InputListFormElement
  extends Omit<BlockFormElementProps, 'children' | 'error'> {
  type?: 'password' | 'text';
  value: string;
  values: string[];
  placeholder?: string;

  errors?: string[];
  onChange: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: 'add' | 'delete', index: number) => void;
  onKeyDown?: Dispatch<KeyboardEvent<HTMLInputElement>>;

  autoFocus?: boolean;
  autoComplete?: HTMLInputAutoCompleteAttribute;

  setOptions?: Partial<{
    divClassName: string;
    headComponent: ReactNode;
    inputPadding: string;
    inputFocus: string;
  }>;
}

export default forwardRef<HTMLInputElement, InputListFormElement>(
  function InputListFormElement(props: InputListFormElement, ref) {
    return (
      <BlockFormElement {...props} error={props.errors?.[0]}>
        <div className="flex flex-col">
          <div className="flex space-x-2 items-center">
            <input
              ref={ref}
              className={`block w-full rounded border-0 bg-transparent ${
                props.setOptions?.inputPadding ?? 'py-3.5'
              } text-gray-800 dark:text-gray-300 shadow-sm ring-1 ring-inset placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-inset ${
                props.setOptions?.inputFocus ?? ''
              } sm:text-sm sm:leading-6 ${
                props.errors
                  ? 'ring-red-600 hover:ring-red-600 focus:ring-red-600'
                  : 'ring-gray-700 dark:ring-gray-600 hover:ring-blue-600 focus:ring-blue-600'
              }`}
              autoFocus={props.autoFocus}
              autoComplete={props.autoComplete}
              placeholder={props.placeholder}
              type={props.type ?? 'text'}
              value={props.value}
              onChange={(e) => props.onChange(e.target.value, e)}
              // onBlur={(e) => props.required && onError(!e.target.value)}
              onKeyDown={(e) => props.onKeyDown?.(e)}
            />

            <FontAwesomeIcon
              className="py-3.5 px-3.5 rounded cursor-pointer border border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900"
              icon={faPlus}
              onClick={() => props.onSubmit('add', null)}
            />
          </div>

          <div className="flex flex-wrap mt-2 space-x-1">
            {props.values.map((value, index) => (
              <span
                key={index}
                className="flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-sm font-semibold text-indigo-600 dark:text-indigo-300"
              >
                <span className="ml-3 mx-1">{value}</span>
                <FontAwesomeIcon
                  className="rounded-full px-1.5 py-1 hover:bg-indigo-200 dark:hover:bg-indigo-700 cursor-pointer"
                  icon={faXmark}
                  onClick={() => props.onSubmit('delete', index)}
                />
              </span>
            ))}
          </div>
        </div>
      </BlockFormElement>
    );
  },
);
