import { Dispatch } from 'react';
import { ObjectLiteral } from '../../../lib/common/types';
import InputFormElement from '../Elements/InputFormElement';
import NextFormElement from '../Elements/NextFormElement';
import PopupFormElement, {
  PopupFormElementProps,
} from '../Elements/PopupFormElement';

export interface CustomPopupSimpleFormElementProps {
  name?: string;
  value: string;

  open: boolean;
  onClose: Dispatch<boolean>;

  onChange: Dispatch<string>;
  onNext: Dispatch<void>;
}

export default function CustomPopupSimpleFormElement(
  props: CustomPopupSimpleFormElementProps,
) {
  return (
    <PopupFormElement open={props.open} onClose={props.onClose}>
      <div className="flex flex-col p-6 rounded bg-white shadow">
        <div className="flex w-full items-end">
          <InputFormElement
            className="w-full"
            name={props.name}
            value={props.value}
            onChange={props.onChange}
          />
          <NextFormElement
            next="Create"
            onNext={props.onNext}
            setOptions={{ buttonPadding: 'p-4' }}
          />
        </div>
      </div>
    </PopupFormElement>
  );
}
