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
import BlockFormElement, { BlockFormElementProps } from './BlockFormElement';

export interface InputFormElementProps
  extends Omit<BlockFormElementProps, 'children' | 'error'> {
  type?: 'password' | 'text';
  value: string;
  placeholder?: string;

  onChange: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
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

export default forwardRef<HTMLInputElement, InputFormElementProps>(
  function InputFormElement(props: InputFormElementProps, ref) {
    const [error, onError] = useState(false);
    return (
      <BlockFormElement {...props} error={error}>
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
      </BlockFormElement>
    );
  },
);
