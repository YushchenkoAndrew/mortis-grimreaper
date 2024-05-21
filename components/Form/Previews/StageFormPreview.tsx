import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, ReactNode, useState } from 'react';
import InputFormElement from '../Elements/InputFormElement';
import MenuFormElement from '../Elements/MenuFormElement';

export interface StageFormPreviewProps {
  name: string;
  onSubmit?: Dispatch<void>;
  headerComponent?: ReactNode;
}

export default function StageFormPreview(props: StageFormPreviewProps) {
  const [name, setName] = useState(props.name);
  return (
    <div>
      <div className="flex flex-col p-2 max-w-64 justify-center bg-gray-900 rounded-md ">
        <div className="flex w-full items-center space-x-2 ">
          {props.headerComponent}
          <InputFormElement
            className="w-full"
            placeholder="Enter stage name"
            value={name.toUpperCase()}
            onChange={setName}
            onBlur={props.onSubmit}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            setOptions={{
              inputPadding: 'py-1.5',
              inputFont:
                'text-sm font-semibold bg-transparent focus:bg-gray-700 cursor-pointer focus:cursor-text',
              inputFontColor: 'text-gray-200 placeholder:text-gray-400 ',
              inputRing: 'ring-0 ring-gray-900',
              inputFocus: 'focus:ring-2 focus:ring-blue-600',
            }}
          />

          <MenuFormElement
            disabled={!props.onSubmit}
            name={<FontAwesomeIcon icon={faEllipsisVertical} />}
            className="mt-0.5"
            actions={{}}
            setOptions={{
              buttonPadding: 'py-2 px-3.5',
              buttonColor: 'bg-transparent hover:bg-gray-700',
              buttonTextColor: 'text-gray-200 disabled:text-gray-400',
              noChevronDown: true,
            }}
            onChange={(action) => {
              // switch (action) {
              //   case 'delete':
              //     return dispatch(AdminProjectsStore.actions.initTrash());
              // }
            }}
          />
        </div>
      </div>
    </div>
  );
}
