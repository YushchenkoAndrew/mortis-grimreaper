import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  forwardRef,
  useState,
  Dispatch,
  KeyboardEvent,
  ReactNode,
} from 'react';
import BlockFormElement, { BlockFormElementProps } from './BlockFormElement';

export interface TextareaFormElementProps
  extends Omit<BlockFormElementProps, 'children' | 'error'> {
  value: string;
  placeholder?: string;
  onChange: Dispatch<string>;
  onKeyDown?: Dispatch<KeyboardEvent<HTMLTextAreaElement>>;

  rows?: number;
  autoComplete?: string;

  setOptions?: Partial<{
    divClassName: string;
    headComponent: ReactNode;
    inputPadding: string;
    inputFocus: string;
  }>;
}

export default forwardRef<HTMLTextAreaElement, TextareaFormElementProps>(
  function TextareaFormElement(props: TextareaFormElementProps, ref) {
    const [error, onError] = useState(false);
    return (
      <BlockFormElement {...props} error={error}>
        <textarea
          ref={ref}
          rows={props.rows ?? 2}
          className={`block w-full rounded border-0 ${
            props.setOptions?.inputPadding ?? 'py-3.5'
          } text-gray-800 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-inset ${
            props.setOptions?.inputFocus ?? ''
          } sm:text-sm sm:leading-6 ${
            error
              ? 'ring-red-600 hover:ring-red-600 focus:ring-red-600'
              : 'ring-gray-700 hover:ring-blue-600 focus:ring-blue-600'
          }`}
          autoComplete={props.autoComplete}
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) => (
            props.onChange(e.target.value),
            props.required && onError(!e.target.value)
          )}
          onBlur={(e) => props.required && onError(!e.target.value)}
          onKeyDown={(e) => props.onKeyDown?.(e)}
        />
      </BlockFormElement>
    );
  },
);
