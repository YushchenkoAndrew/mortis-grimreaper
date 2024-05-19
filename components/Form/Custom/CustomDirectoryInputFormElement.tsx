import { Dispatch, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { AdminAttachmentStore } from '../../../lib/attachment/stores/admin-attachment.store';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import InputFormElement from '../Elements/InputFormElement';

export interface CustomDirectoryInputFormElementProps {
  prefix?: string;
  onSubmit?: Dispatch<void>;
}

export default function CustomDirectoryInputFormElement(
  props: CustomDirectoryInputFormElementProps,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const attachment = useAppSelector((state) => state.admin.attachment);

  const [updated, setCursor] = useState('');
  const position = useRef<number>(null);

  useEffect(() => {
    if (position.current === null) return;
    const delay = setTimeout(() => {
      inputRef.current.setSelectionRange(position.current, position.current);
      position.current = null;
    }, 0);

    return () => clearTimeout(delay);
  }, [updated]);

  return (
    <>
      <span
        className={`text-1xl font-semibold ${props.prefix ? '' : 'hidden'}`}
      >
        {props.prefix}
      </span>
      <span className="text-1xl ml-2 mr-3 font-semibold">
        {attachment.path}/
      </span>

      <InputFormElement
        ref={inputRef}
        placeholder="Name your file ..."
        value={attachment.name}
        onChange={(e) => {
          if (position.current !== null) return setCursor(uuid());
          return dispatch(AdminAttachmentStore.actions.setName(e));
        }}
        onKeyDown={(e) => {
          switch (e.key) {
            case 'Backspace':
              if (inputRef.current.selectionStart) return;
              position.current = attachment.path.split('/').at(-1).length;
              return dispatch(AdminAttachmentStore.actions.popPath());

            case 'Enter':
              return props.onSubmit?.();
          }
        }}
        setOptions={{ inputPadding: 'py-1' }}
      />
    </>
  );
}
