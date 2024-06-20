import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  CSSProperties,
  Dispatch,
  LegacyRef,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { v4 } from 'uuid';
import { ObjectLiteral } from '../../../lib/common/types';
import InputFormElement from '../Elements/InputFormElement';
import MenuFormElement, {
  MenuFormElementProps,
} from '../Elements/MenuFormElement';

export interface StageFormPreviewProps<T extends ObjectLiteral> {
  name: string;
  onSubmit?: Dispatch<void>;
  onTaskCreate?: Dispatch<void>;
  onClick?: Dispatch<void>;
  onChange?: Dispatch<string>;

  actions: MenuFormElementProps<T>['actions'];
  onAction: MenuFormElementProps<T>['onChange'];

  blur?: boolean;
  className?: string;
  headerComponent?: ReactNode;
  children?: ReactNode;

  inputRef?: LegacyRef<HTMLDivElement>;
  style?: CSSProperties;
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;

  setOptions?: Partial<{
    inputClassName: string;
    menuClassName: string;
    taskCreateDisplay: string;
    divColor: string;
  }>;
}

export default function StageFormPreview<T extends ObjectLiteral>(
  props: StageFormPreviewProps<T>,
) {
  const [focused, onFocus] = useState('');
  const [styles, setStyles] = useState<ObjectLiteral>(null);

  const blurRef = useRef(false);
  blurRef.current = props.blur;

  useEffect(() => {
    let ignore = false;
    const delay = setTimeout(() => {
      if (ignore) return;
      if (blurRef.current) return setStyles(null);
      setStyles({
        inputFont:
          'text-sm font-bold bg-transparent focus:bg-gray-700 cursor-pointer focus:cursor-text',
        inputFocus: 'focus:ring-2 focus:ring-blue-600',
      });
    }, 200);

    return () => ((ignore = true), clearTimeout(delay));
  }, [focused]);

  return (
    <div
      className={`flex flex-col p-2 w-64 justify-center rounded-md ${
        props.setOptions?.divColor ?? 'bg-gray-900'
      } ${props.className ?? ''}`}
      onClick={() => props.onClick?.()}
    >
      <div className="flex w-full items-center space-x-2 ">
        {props.headerComponent}
        <InputFormElement
          blockRef={props.inputRef}
          style={props.style}
          listeners={props.listeners}
          attributes={props.attributes}
          className={`w-full ${props.setOptions?.inputClassName ?? ''}`}
          placeholder="Enter stage name"
          value={props.name.toUpperCase()}
          onFocus={() => onFocus(v4())}
          // onChange={setName}
          onChange={props.onChange}
          onBlur={() => styles && (setStyles(null), props.onSubmit?.())}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          setOptions={{
            inputPadding: 'py-1.5',
            inputFont: 'text-sm font-bold cursor-pointer',
            inputFontColor: 'text-gray-300 placeholder:text-gray-400 ',
            inputRing: 'ring-0 ring-gray-900',
            inputFocus: 'caret-transparent',
            ...styles,
          }}
        />

        <MenuFormElement
          disabled={!props.onSubmit}
          name={<FontAwesomeIcon icon={faEllipsisVertical} />}
          className={`mt-0.5 ${props.setOptions?.menuClassName ?? ''}`}
          actions={props.actions}
          setOptions={{
            buttonPadding: 'py-2 px-3.5',
            buttonColor: 'bg-transparent hover:bg-gray-700',
            buttonTextColor: 'text-gray-300 disabled:text-gray-400',
            noChevronDown: true,
          }}
          onChange={props.onAction}
        />
      </div>
      <div className="space-y-2">{props.children}</div>
      <div
        className={`p-1 mt-2 rounded-md items-center text-sm font-semibold text-gray-400 bg-gray-900 hover:bg-gray-600 cursor-pointer ${
          props.setOptions?.taskCreateDisplay || 'flex'
        }`}
        onClick={() => props.onTaskCreate?.()}
      >
        <FontAwesomeIcon className="ml-2 mr-4" icon={faPlus} />
        <span>Add new task</span>
      </div>
    </div>
  );
}
