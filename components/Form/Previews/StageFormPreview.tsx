import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, ReactNode, useState } from 'react';
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

  className?: string;
  headerComponent?: ReactNode;
  children?: ReactNode;

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
  // const [name, setName] = useState(props.name);
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
          className={`w-full ${props.setOptions?.inputClassName ?? ''}`}
          placeholder="Enter stage name"
          value={props.name.toUpperCase()}
          // onChange={setName}
          onChange={props.onChange}
          onBlur={props.onSubmit}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          setOptions={{
            inputPadding: 'py-1.5',
            inputFont:
              'text-sm font-semibold bg-transparent focus:bg-gray-700 cursor-pointer focus:cursor-text',
            inputFontColor: 'text-gray-300 placeholder:text-gray-400 ',
            inputRing: 'ring-0 ring-gray-900',
            inputFocus: 'focus:ring-2 focus:ring-blue-600',
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
      {props.children}
      <div
        className={`p-1 rounded-md items-center text-sm font-semibold text-gray-400 bg-gray-900 hover:bg-gray-600 cursor-pointer ${
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
