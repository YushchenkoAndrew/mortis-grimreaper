import { ChangeEvent, Dispatch, MutableRefObject, useState } from 'react';
import { ObjectLiteral } from '../../../lib/common/types';
import MenuFormElement, {
  MenuFormElementProps,
} from '../Elements/MenuFormElement';
import NextFormElement from '../Elements/NextFormElement';

export interface CustomMenuFormElementProps<T extends ObjectLiteral> {
  className?: string;
  fileRef?: MutableRefObject<HTMLInputElement>;
  onFile?: Dispatch<ChangeEvent<HTMLInputElement>>;

  next?: string;
  onNext: Dispatch<void>;
  onBack?: Dispatch<void>;

  name?: string;
  actions: T;
  onChange: Dispatch<keyof T>;
  setOptions?: MenuFormElementProps<T>['setOptions'];
  itemComponent?: MenuFormElementProps<T>['itemComponent'];

  isSubmitButton?: boolean;
}

export default function CustomMenuFormElement<T extends ObjectLiteral>(
  props: CustomMenuFormElementProps<T>,
) {
  const [open, setOpen] = useState(true);
  return (
    <div className={props.className}>
      {props.fileRef ? (
        <input
          ref={props.fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => props.onFile?.(event)}
        />
      ) : (
        <></>
      )}

      {props.isSubmitButton ? (
        <NextFormElement
          setOptions={{ buttonPadding: 'px-3 py-2' }}
          next={props.next || 'Apply changes...'}
          back="Cancel"
          onNext={props.onNext}
          onBack={props.onBack}
        />
      ) : (
        <MenuFormElement
          name={props.name || 'Action'}
          actions={props.actions}
          onChange={props.onChange}
          setOptions={props.setOptions}
          itemComponent={props.itemComponent}
        />
      )}
    </div>
  );
}
