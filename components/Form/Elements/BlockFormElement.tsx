import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSProperties, forwardRef, ReactNode, useState } from 'react';

export interface BlockFormElementProps {
  name?: ReactNode;
  description?: string;
  error?: string;

  className?: string;
  required?: boolean;
  noSuggestion?: boolean;
  children: ReactNode;

  style?: CSSProperties;
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;

  setOptions?: Partial<{
    divClassName: string;
    headComponent: ReactNode;
    inputPadding: string;
    inputFocus: string;
  }>;
}

export default forwardRef<HTMLDivElement, BlockFormElementProps>(
  function BlockFormElement(props: BlockFormElementProps, ref) {
    return (
      <div
        ref={ref}
        className={props.className || ''}
        style={props.style}
        // {...props.listeners}
        // {...props.attributes}
      >
        <label
          className={`flex ${
            props.name ? 'block' : 'hidden'
          } text-sm font-medium leading-6 text-gray-800 dark:text-gray-300`}
        >
          {props.name}
          {props.noSuggestion ? (
            <></>
          ) : props.required ? (
            <span className="text-blue-400">*</span>
          ) : (
            ' (optional)'
          )}
        </label>
        <label
          className={`${
            props.description ? 'block' : 'hidden'
          } text-sm leading-6 text-gray-500 dark:text-gray-400`}
        >
          {props.description}
        </label>
        <div className={`mt-1 ${props.setOptions?.divClassName || ''}`}>
          {props.setOptions?.headComponent}
          {props.children}
          <div className={props.error ? 'block' : 'hidden'}>
            <span className="mt-1 text-sm text-red-600 dark:text-red-500 font-medium">
              <FontAwesomeIcon className="pr-2" icon={faCircleExclamation} />
              {props.error}
            </span>
          </div>
        </div>
      </div>
    );
  },
);
