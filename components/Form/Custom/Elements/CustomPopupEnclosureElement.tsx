import { Dispatch, memo, ReactNode } from 'react';
import { useAppSelector, StoreT } from '../../../../lib/common/store';
import { Unwrap } from '../../../../lib/common/types';
import PopupFormElement from '../../Elements/PopupFormElement';

export interface CustomPopupEnclosureElementProps<T> {
  title?: string;
  className?: string;
  state: Unwrap<T extends any ? T : never>;
  condition?: (value: any) => boolean;
  onClose: Dispatch<boolean>;
  children: ReactNode;
}

export default memo(function CustomPopupEnclosureElement(
  props: CustomPopupEnclosureElementProps<StoreT>,
) {
  const open = useAppSelector((state) =>
    props.state.split('.').reduce((acc, curr) => acc?.[curr], state),
  );

  return (
    <PopupFormElement
      className={props.className}
      open={props.condition?.(open) ?? !!open}
      onClose={props.onClose}
      setOptions={{ panelSize: 'sm:w-full sm:max-w-4xl' }}
    >
      <div
        className={`text-sm font-medium text-gray-800 bg-gray-100 px-4 py-3 border-b border-gray-300 ${
          props.title ? 'flex' : 'hidden'
        }`}
      >
        {props.title}
      </div>

      {props.children}
    </PopupFormElement>
  );
});
