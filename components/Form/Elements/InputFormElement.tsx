import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
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

export interface InputFormElementProps {
  name?: string;
  value: string;
  onChange: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: Dispatch<KeyboardEvent<HTMLInputElement>>;

  placeholder?: string;
  description?: string;

  className?: string;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  type?: 'password' | 'text';

  setOptions?: Partial<{
    divClassName: string;
    headComponent: ReactNode;
    inputPadding: string;
    inputFocus: string;
  }>;
}

export default forwardRef<HTMLInputElement, InputFormElementProps>(
  function InputFormElement(props: InputFormElementProps, ref) {
    const [error, onError] = useState(false);
    return (
      <div className={props.className || ''}>
        <label
          className={`${
            props.name ? 'block' : 'hidden'
          } text-sm font-medium leading-6 text-gray-800`}
        >
          {props.name}
          {props.required ? (
            <span className="text-blue-400">*</span>
          ) : (
            ' (optional)'
          )}
        </label>
        <label
          className={`${
            props.description ? 'block' : 'hidden'
          } text-sm leading-6 text-gray-500`}
        >
          {props.description}
        </label>
        <div className={`mt-1 ${props.setOptions?.divClassName || ''}`}>
          {props.setOptions?.headComponent}
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
          <div className={error ? 'block' : 'hidden'}>
            <span className="mt-1 text-sm text-red-600 font-medium">
              <FontAwesomeIcon className="pr-2" icon={faCircleExclamation} />
              Cannot be blank
            </span>
          </div>
        </div>
      </div>
    );
  },
);
