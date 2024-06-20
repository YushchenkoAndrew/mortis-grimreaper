import { Dispatch, useEffect, useRef } from 'react';
import { AdminAttachmentEntity } from '../../../lib/attachment/entities/admin-attachment.entity';
import { AttachmentEntity } from '../../../lib/attachment/entities/attachment.entity';
import {
  AdminAttachmentStore,
  AdminAttachmentStoreT,
} from '../../../lib/attachment/stores/admin-attachment.store';
import { MarkdownEntity } from '../../../lib/common/entities/markdown.entity';
import { ErrorService } from '../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import { RequestTypeEnum } from '../../../lib/common/types/request-type.enum';
import { AceEditor } from '../../dynamic';
import { mode } from '../../dynamic/AceEditor';
import { useCallback } from 'react';
import { ObjectLiteral } from '../../../lib/common/types';
import Handlebars from 'handlebars';

export interface EditorFormElementProps {
  className?: string;
  vars: ObjectLiteral<string>;
  onPreview: Dispatch<string>;

  setOptions?: Partial<{
    height: string;
    theme: string;
  }>;
}

export default function EditorFormElement(props: EditorFormElementProps) {
  const dispatch = useAppDispatch();
  const attachment = useAppSelector((state) => state.admin.attachment);

  const attachmentRef = useRef<AdminAttachmentStoreT>(null);
  attachmentRef.current = attachment as any;

  const varRef = useRef<ObjectLiteral<string>>();
  varRef.current = props.vars;

  const previewRef = useRef<Dispatch<string>>();
  previewRef.current = props.onPreview;

  useEffect(() => {
    ErrorService.envelop(async () => {
      if (!attachment.id) return;

      const text = await AttachmentEntity.self.load.raw(attachment.id);
      dispatch(AdminAttachmentStore.actions.setBuffer(text));

      const preview = await parse(attachment.type, text);
      if (preview) props.onPreview(preview);
    });
  }, [attachment.id]);

  const parse = useCallback(
    async (type: string, text: string) => {
      switch (type) {
        case '.md':
          return MarkdownEntity.self.save.text({ text });

        case '.html':
          return text;
      }

      return null;
    },
    [props.onPreview],
  );

  return (
    <AceEditor
      mode={mode.getModeForPath(attachment.name).name}
      className={props.className ?? 'border rounded-b'}
      theme={props.setOptions?.theme || 'tomorrow'}
      width="100%"
      height={props.setOptions?.height || 'calc(100vh - 14rem)'}
      tabSize={2}
      fontSize={16}
      lineHeight={19}
      keyboardHandler="vim"
      enableLiveAutocompletion
      enableBasicAutocompletion
      showGutter
      showPrintMargin
      highlightActiveLine
      value={attachment.buffer || ''}
      onChange={(value) =>
        dispatch(AdminAttachmentStore.actions.setBuffer(value))
      }
      commands={[
        {
          name: 'write',
          bindKey: null,
          exec: () =>
            ErrorService.envelop(
              async () => {
                const template = Handlebars.compile(attachmentRef.current.buffer)(varRef.current); // prettier-ignore

                const blob = new Blob([template]);
                const file = new File([blob], attachmentRef.current.name);

                await AdminAttachmentEntity.self.save.build(
                  new AdminAttachmentEntity({
                    id: attachmentRef.current.id,
                    file: file as any,
                  }),
                  { type: RequestTypeEnum.form },
                );

                await AttachmentEntity.self.load
                  .raw(attachmentRef.current.id)
                  .then((buf) =>
                    dispatch(AdminAttachmentStore.actions.setBuffer(buf)),
                  );

                const preview = await parse(
                  attachmentRef.current.type,
                  template,
                );
                if (preview) previewRef.current?.(preview);
              },
              { in_progress: true },
            ),
        },
      ]}
      setOptions={{
        spellcheck: true,
        showLineNumbers: true,
        highlightGutterLine: true,
        enableSnippets: false,
      }}
    />
  );
}
