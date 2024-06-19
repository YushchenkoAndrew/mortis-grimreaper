import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useState } from 'react';
import { AdminAttachmentEntity } from '../../../../lib/attachment/entities/admin-attachment.entity';
import { AdminAttachmentStore } from '../../../../lib/attachment/stores/admin-attachment.store';
import { ErrorService } from '../../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../../lib/common/store';
import { RenderHtml } from '../../../dynamic';
import CustomYesNoPopupElement from '../../Custom/Elements/CustomYesNoPopupElement';
import EditorFormElement from '../../Elements/EditorFormElement';
import MenuFormElement from '../../Elements/MenuFormElement';
import TabFormElement from '../../Elements/TabFormElement';

export interface AttachmentFormPageProps {
  className?: string;
  reload?: () => Promise<void>;
}

export default function AttachmentFormPage(props: AttachmentFormPageProps) {
  const dispatch = useAppDispatch();
  const attachment = useAppSelector((state) => state.admin.attachment); // prettier-ignore

  const [deletePanel, openDeletePanel] = useState(false);

  return (
    <div className="flex flex-col">
      {/* <div className="flex w-full">
        <NextFormElement
          className="ml-auto mr-4 my-3"
          next="Submit"
          back="Cancel"
          onNext={() => null}
          onBack={() => dispatch(AdminAttachmentStore.actions.reset())}
          setOptions={{
            buttonPadding: 'py-1.5 px-4',
            nextButtonColor:
              'text-green-500 hover:text-white border border-gray-600 hover:border-green-600 bg-gray-700 hover:bg-green-600',
          }}
        />
      </div> */}

      <CustomYesNoPopupElement
        className="dark"
        title="Are you sure, you want to delete this task ?"
        open={deletePanel}
        onClose={() => openDeletePanel(false)}
        onNext={() => {
          ErrorService.envelop(
            async () => {
              await AdminAttachmentEntity.self.delete.exec(attachment.id);
              dispatch(AdminAttachmentStore.actions.reset());

              await props.reload?.();
            },
            { in_progress: true },
          );
        }}
      />

      <TabFormElement
        className="block"
        default="code"
        // disabled={project.html ? [] : ['preview']}
        disabled={['preview']}
        columns={{ preview: 'Preview', code: 'Code' }}
        headerComponent={
          <div className="flex ml-auto text-sm items-center text-gray-400">
            <span className="pb-1">
              {attachment.updated_at && moment(attachment.updated_at).toNow()}
            </span>
            <MenuFormElement
              className="ml-4"
              name={
                <FontAwesomeIcon
                  className="rounded py-1.5 px-3 border border-gray-600 bg-gray-700 hover:bg-gray-600 cursor-pointer"
                  icon={faEllipsisVertical}
                />
              }
              actions={{
                delete: 'Delete File',
              }}
              onChange={(action) => {
                switch (action) {
                  case 'delete':
                    return openDeletePanel(true);
                }
              }}
              setOptions={{
                buttonPadding: ' ',
                noChevronDown: true,
                buttonColor: 'hover:bg-gray-700',
              }}
              // itemComponent={props.itemComponent}
            />
          </div>
        }
        dataComponent={{
          preview: () => (
            <RenderHtml
              className="w-full h-full overflow-y-hidden py-5 pl-5 "
              html={''}
              setOptions={{
                height: 'calc(100vh - 14rem)',
                containerHeighOffset: 8,
                containerClassName: `${
                  // project.html ? 'block' :
                  'hidden'
                } relative border rounded-b`,
              }}
            />
          ),
          code: () => (
            <EditorFormElement
              className=""
              onPreview={() => null}
              vars={{}}
              setOptions={{ theme: 'tomorrow_night' }}
            />
          ),
        }}
      />
    </div>
  );
}
