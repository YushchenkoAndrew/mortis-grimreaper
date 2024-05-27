import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import {
  ChangeEvent,
  Dispatch,
  HTMLInputAutoCompleteAttribute,
  KeyboardEvent,
  useMemo,
} from 'react';
import { Config } from '../../../config';
import BlockFormElement, { BlockFormElementProps } from './BlockFormElement';
import KeyValueFormElement, {
  KeyValueFormElementProps,
} from './KeyValueFormElement';

export interface InputLinkFormElementProps extends KeyValueFormElementProps {}

export default function InputLinkFormElement(props: InputLinkFormElementProps) {
  // const [error, onError] = useState(false);
  const index = useMemo(() => props.values.length - 1, [props.values]);
  const [last, ...init] = useMemo(() => props.values.reverse(), [props.values]);

  // name?: ReactNode;
  // description?: string;
  // error?: boolean;

  // className?: string;
  // required?: boolean;
  // noSuggestion?: boolean;
  // children: ReactNode;

  // style?: CSSProperties;
  // listeners?: SyntheticListenerMap;
  // attributes?: DraggableAttributes;

  return (
    <KeyValueFormElement
      {...props}
      onChange={(key, value) => props.onChange(key, value, index)}
      values={[last]}
      contextComponent={props.values.map(([key, value], index) => (
        <div
          key={index}
          className="group flex px-2 py-2 items-center bg-white shadow border border-gray-200 rounded justify-between"
          // target="_blank"
          // href={
          //   'https://stackoverflow.com/questions/31543451/cheerio-extract-text-from-html-with-separators'
          // }
          // TODO: Dont trigger parrent onClick event when children is clicked
          onClick={() => console.log('YES')}
        >
          <div className="flex">
            <img
              className="h-5 w-5 mr-2"
              src={`${Config.self.base.api}/icon?url=${encodeURIComponent(
                'https://stackoverflow.com/questions/31543451/cheerio-extract-text-from-html-with-separators',
              )}`}
            />
            <span className="text-gray-800 text-sm group-hover:underline">
              test
            </span>
          </div>

          <FontAwesomeIcon
            className="invisible group-hover:visible py-0.5 px-1 text-gray-700 text-sm hover:bg-gray-200"
            icon={faXmark}
            onClick={() => console.log('HERE')}
          />
        </div>
      ))}
    />
    // <BlockFormElement
    //   {...props}
    //   setOptions={{
    //     ...props.setOptions,
    //     headComponent: null,
    //     divClassName: 'flex flex-col space-y-2',
    //   }}
    // >

    //   {props.values.map(([key, value], index) => {
    //     const isFinal = props.values.length - 1 != index;
    //     return (
    //       <div key={index} className="flex space-x-2 items-center">
    //         <div className="flex flex-col w-full">
    //           <span
    //             className={`text-sm font-semibold text-gray-500 dark:text-gray-400 ${
    //               index ? 'hidden' : ''
    //             }`}
    //           >
    //             Key
    //           </span>
    //           <input
    //             className={`block w-full rounded border-0 bg-transparent ${
    //               props.setOptions?.inputPadding ?? 'py-3.5'
    //             } text-gray-800 dark:text-gray-300 shadow-sm ring-1 ring-inset placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-inset ${
    //               props.setOptions?.inputFocus ?? ''
    //             } sm:text-sm sm:leading-6 ring-gray-700 dark:ring-gray-600 hover:ring-blue-600 focus:ring-blue-600`}
    //             autoFocus={props.autoFocus}
    //             autoComplete={props.autoComplete}
    //             placeholder={props.placeholder?.[0]}
    //             type={props.type ?? 'text'}
    //             value={key}
    //             onChange={(e) => props.onChange(e.target.value, value, index)}
    //             // onBlur={(e) => props.required && onError(!e.target.value)}
    //             onKeyDown={(e) => props.onKeyDown?.(e)}
    //           />
    //         </div>
    //         <div className="flex flex-col w-full">
    //           <span
    //             className={`text-sm font-semibold text-gray-500 dark:text-gray-400 ${
    //               index ? 'hidden' : ''
    //             }`}
    //           >
    //             Value
    //           </span>
    //           <input
    //             className={`block w-full rounded border-0 mr-2 bg-transparent ${
    //               props.setOptions?.inputPadding ?? 'py-3.5'
    //             } text-gray-800 dark:text-gray-300 shadow-sm ring-1 ring-inset placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-inset ${
    //               props.setOptions?.inputFocus ?? ''
    //             } sm:text-sm sm:leading-6 ring-gray-700 dark:ring-gray-600 hover:ring-blue-600 focus:ring-blue-600`}
    //             autoFocus={props.autoFocus}
    //             autoComplete={props.autoComplete}
    //             placeholder={props.placeholder?.[1]}
    //             type={props.type ?? 'text'}
    //             value={value}
    //             onChange={(e) => props.onChange(key, e.target.value, index)}
    //             // onBlur={(e) => props.required && onError(!e.target.value)}
    //             onKeyDown={(e) => props.onKeyDown?.(e)}
    //           />
    //         </div>

    //         <div className={index ? '' : 'mt-5'}>
    //           <FontAwesomeIcon
    //             className={`py-3.5 px-3.5 rounded cursor-pointer ${
    //               isFinal
    //                 ? 'text-gray-400 border border-white hover:border-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900'
    //                 : 'border border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900'
    //             }`}
    //             icon={isFinal ? faTrashCan : faPlus}
    //             onClick={() =>
    //               props.onSubmit(isFinal ? 'delete' : 'add', index)
    //             }
    //           />
    //         </div>
    //       </div>
    //     );
    //   })}
    // </BlockFormElement>
  );
}
