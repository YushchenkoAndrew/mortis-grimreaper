import { faCircleNotch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch } from 'react';

export interface NextFormElementProps {
  name?: string;
  processing?: boolean;
  next: Dispatch<void>;
  back?: Dispatch<void>;
}

export default function NextFormElement(props: NextFormElementProps) {
  return (
    <div className="flex w-full bg-blue-100 p-3 rounded shadow-md space-x-2">
      <button
        className={`${
          props.back ? 'block' : 'hidden'
        } bg-transparent px-4 py-3 text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500 hover:underline`}
        type="button"
        onClick={() => props.back?.()}
      >
        Back
      </button>

      <button
        className="flex items-center rounded bg-blue-600 px-4 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500"
        type="button"
        onClick={() => props.next()}
      >
        {props.name || 'Next'}
        <FontAwesomeIcon
          className={`${
            props.processing ? 'block' : 'hidden'
          } ml-2 animate-spin`}
          icon={faCircleNotch}
        />
      </button>
    </div>
  );
}
