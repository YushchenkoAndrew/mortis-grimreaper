import { faCircleNotch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch } from 'react';

export interface NextFormElementProps {
  className?: string;
  next?: string;
  back?: string;

  processing?: boolean;
  onNext: Dispatch<void>;
  onBack?: Dispatch<void>;

  setOptions?: Partial<{ buttonPadding: string; nextButtonColor: string }>;
}

export default function NextFormElement(props: NextFormElementProps) {
  return (
    <div className={`${props.className || ''} flex space-x-2`}>
      <button
        className={`${props.onBack ? 'block' : 'hidden'} bg-transparent ${
          props.setOptions?.buttonPadding || 'px-4 py-3'
        } text-sm font-semibold border border-gray-400 rounded text-gray-700 hover:border-gray-500 hover:bg-gray-200`}
        type="button"
        onClick={() => props.onBack?.()}
      >
        {props.back || 'Back'}
      </button>
      <button
        className={`flex items-center rounded ${
          props.setOptions?.buttonPadding || 'px-4 py-3'
        } text-sm font-semibold shadow-sm ${
          props.setOptions?.nextButtonColor ||
          'text-white bg-blue-600  hover:bg-blue-500'
        }`}
        type="button"
        onClick={() => props.onNext()}
      >
        {props.next || 'Next'}
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
