import {
  ChangeEvent,
  Dispatch,
  forwardRef,
  HTMLInputAutoCompleteAttribute,
  KeyboardEvent,
  LegacyRef,
  ReactNode,
  useState,
} from 'react';
import BlockFormElement, { BlockFormElementProps } from './BlockFormElement';

export interface InputFormElementProps
  extends Omit<BlockFormElementProps, 'children' | 'error'> {
  type?: 'password' | 'text';
  value: string;
  placeholder?: string;
  disabled?: boolean;

  errors?: string[];
  onFocus?: Dispatch<void>;
  onBlur?: Dispatch<void>;
  onChange: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: Dispatch<KeyboardEvent<HTMLInputElement>>;

  autoFocus?: boolean;
  autoComplete?: HTMLInputAutoCompleteAttribute;

  blockRef?: LegacyRef<HTMLDivElement>;

  setOptions?: Partial<{
    divClassName: string;
    headComponent: ReactNode;
    inputPadding: string;
    inputFont: string;
    inputFontColor: string;
    inputFocus: string;
    inputRing: string;
  }>;
}

export default forwardRef<HTMLInputElement, InputFormElementProps>(
  function InputFormElement(props: InputFormElementProps, ref) {
    return (
      <BlockFormElement
        {...props}
        ref={props.blockRef}
        error={props.errors?.[0]}
      >
        <input
          ref={ref}
          className={`block w-full rounded border-0 bg-transparent ${
            props.setOptions?.inputPadding ?? 'py-3.5'
          } ${
            props.setOptions?.inputFontColor ??
            'text-gray-800 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-600'
          } shadow-sm focus:ring-inset ${
            props.setOptions?.inputFocus ??
            (props.errors ? 'focus:ring-red-600' : 'focus:ring-blue-600')
          } ${props.setOptions?.inputFont ?? 'sm:text-sm sm:leading-6'} ${
            props.setOptions?.inputRing ??
            (props.errors
              ? 'ring-1 ring-red-600 hover:ring-red-600'
              : 'ring-1 ring-gray-700 dark:ring-gray-600 hover:ring-blue-600')
          }`}
          {...props.listeners}
          {...props.attributes}
          disabled={props.disabled}
          // autoFocus={props.autoFocus}
          // autoComplete={props.autoComplete}
          placeholder={props.placeholder}
          type={props.type ?? 'text'}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value, e)}
          onFocus={(e) => props.onFocus?.()}
          onBlur={(e) => props.onBlur?.()}
          onKeyDown={(e) => props.onKeyDown?.(e)}
        />
      </BlockFormElement>
    );
  },
);
