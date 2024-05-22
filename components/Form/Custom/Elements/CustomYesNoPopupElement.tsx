import { Dispatch } from 'react';
import NextFormElement from '../../Elements/NextFormElement';
import PopupFormElement from '../../Elements/PopupFormElement';

export interface CustomYesNoPopupElementProps {
  title: string;
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
      onClose={() => props.onClose()}
      setOptions={{
        panelSize: 'sm:w-full sm:max-w-md',
      }}
    >
      <div className="flex text-sm font-medium text-gray-800 bg-gray-100 px-4 py-3 border-b border-gray-300">
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
            nextButtonColor: 'text-white bg-green-600 hover:bg-green-700',
          }}
        />
      </div>
    </PopupFormElement>
  );
}
