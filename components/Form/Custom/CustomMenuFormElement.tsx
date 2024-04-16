import { ChangeEvent, Dispatch, MutableRefObject } from 'react';
import { ObjectLiteral } from '../../../lib/common/types';
import MenuFormElement from '../Elements/MenuFormElement';
import NextFormElement from '../Elements/NextFormElement';

export interface CustomMenuFormElementProps<T extends ObjectLiteral> {
  className?: string;
  fileRef?: MutableRefObject<HTMLInputElement>;
  onFile?: Dispatch<ChangeEvent<HTMLInputElement>>;

  next?: string;
  onNext: Dispatch<void>;
  onBack?: Dispatch<void>;

  actions: T;
  onChange: Dispatch<keyof T>;

  isSubmitButton?: boolean;
}

export default function CustomMenuFormElement<T extends ObjectLiteral>(
  props: CustomMenuFormElementProps<T>,
) {
  return (
    <div className={props.className}>
      {props.fileRef ? (
        <input
          ref={props.fileRef}
          type="file"
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
          name="Action"
          actions={props.actions}
          onChange={props.onChange}
        />
      )}
    </div>
  );
}
