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
    const [error, onError] = useState(false);
    return (
      <BlockFormElement {...props} error={error}>
        <div className="flex flex-col">
          <div className="flex space-x-2 items-center">
            <input
              ref={ref}
              className={`block w-full rounded border-0 ${
                props.setOptions?.inputPadding ?? 'py-3.5'
              } text-gray-800 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-inset ${
                props.setOptions?.inputFocus ?? ''
              } sm:text-sm sm:leading-6 ${
                error
                  ? 'ring-red-600 hover:ring-red-600 focus:ring-red-600'
                  : 'ring-gray-700 hover:ring-blue-600 focus:ring-blue-600'
              }`}
              autoFocus={props.autoFocus}
              autoComplete={props.autoComplete}
              placeholder={props.placeholder}
              type={props.type ?? 'text'}
              value={props.value}
              onChange={(e) => (
                props.onChange(e.target.value, e),
                props.required && onError(!e.target.value)
              )}
              onBlur={(e) => props.required && onError(!e.target.value)}
              onKeyDown={(e) => props.onKeyDown?.(e)}
            />

            <FontAwesomeIcon
              className="py-3.5 px-3.5 rounded cursor-pointer border border-indigo-600 text-indigo-600 hover:bg-indigo-100"
              icon={faPlus}
              onClick={() => props.onSubmit('add', null)}
            />
          </div>

          <div className="flex flex-wrap mt-2 space-x-1">
            {props.values.map((value, index) => (
              <span
                key={index}
                className="flex items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600"
              >
                <span className="ml-3 mx-1">{value}</span>
                <FontAwesomeIcon
                  className="rounded-full px-1.5 py-1 hover:bg-indigo-200 cursor-pointer"
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
