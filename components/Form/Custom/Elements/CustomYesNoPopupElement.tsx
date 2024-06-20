import { Dispatch } from 'react';
import NextFormElement from '../../Elements/NextFormElement';
import PopupFormElement from '../../Elements/PopupFormElement';

export interface CustomYesNoPopupElementProps {
  title: string;
  className?: string;
  open: boolean;
  onNext: Dispatch<void>;
  onClose: Dispatch<void>;
}

export default function CustomYesNoPopupElement(
  props: CustomYesNoPopupElementProps,
) {
  return (
    <PopupFormElement
      open={props.open}
      className={props.className}
      onClose={() => props.onClose()}
      setOptions={{
        panelSize: 'sm:w-full sm:max-w-md',
      }}
    >
      <div className="flex text-sm font-medium text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b border-gray-300 dark:border-gray-600">
        {props.title || 'Are you sure for the action to be applied ?'}
      </div>
      <div className="flex w-full">
        <NextFormElement
          className="ml-auto mr-4 my-3"
          next="Yes, apply changes..."
          back="Cancel"
          onNext={props.onNext}
          onBack={props.onClose}
          setOptions={{
            buttonPadding: 'py-1.5 px-4',
            nextButtonColor:
              'text-white dark:text-red-500 dark:hover:text-white bg-red-600 border-gray-600 dark:border dark:hover:border-red-600 dark:bg-gray-700 hover:bg-red-700 dark:hover:bg-red-600',
          }}
        />
      </div>
    </PopupFormElement>
  );
}
