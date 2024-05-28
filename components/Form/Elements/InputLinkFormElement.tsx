import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useMemo } from 'react';
import { Config } from '../../../config';
import KeyValueFormElement, {
  KeyValueFormElementProps,
} from './KeyValueFormElement';

export interface InputLinkFormElementProps extends KeyValueFormElementProps {}

export default function InputLinkFormElement(props: InputLinkFormElementProps) {
  const index = useMemo(() => props.values.length - 1, [props.values]);
  const [last, ...init] = useMemo(() => props.values.reverse(), [props.values]);

  return (
    <KeyValueFormElement
      {...props}
      onChange={(key, value) => props.onChange(key, value, index)}
      values={last ? [last] : []}
      contextComponent={
        <div>
          {init.map(([key, value], index) => (
            <Link
              key={index}
              className="group flex px-2 py-2 -mt-0.5 items-center bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow dark:shadow-none border-gray-700 dark:border first:rounded-t last:rounded-b justify-between cursor-pointer"
              target="_blank"
              href={value}
              onClick={(e) => e.currentTarget != e.target && e.preventDefault()}
            >
              <div className="flex">
                <img
                  className="h-5 w-5 mr-2"
                  src={`${Config.self.base.api}/icon?url=${encodeURIComponent(
                    value,
                  )}`}
                />
                <span className="text-gray-800 dark:text-gray-300 text-sm group-hover:underline">
                  {key}
                </span>
              </div>

              <FontAwesomeIcon
                className="invisible group-hover:visible py-1 px-1.5 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                icon={faXmark}
                onClick={() => props.onSubmit('delete', index)}
              />
            </Link>
          ))}
        </div>
      }
    />
  );
}
