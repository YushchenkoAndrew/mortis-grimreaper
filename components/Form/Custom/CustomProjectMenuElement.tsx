import { faFile } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useMemo, useRef, useState } from 'react';
import { AdminAttachmentEntity } from '../../../lib/attachment/entities/admin-attachment.entity';
import { ErrorService } from '../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import { AdminProjectEntity } from '../../../lib/project/entities/admin-project.entity';
import { ProjectService } from '../../../lib/project/project.service';
import { AdminProjectStore } from '../../../lib/project/stores/admin-project.store';
import MenuFormElement from '../Elements/MenuFormElement';
import NextFormElement from '../Elements/NextFormElement';
import PopupFormElement from '../Elements/PopupFormElement';
import TableFormElement from '../Elements/TableFormElement';
import CustomDirectoryInputFormElement from './CustomDirectoryInputFormElement';

export interface CustomProjectMenuElementProps {
  pathname: { create: string; attachment: string };
}

export default function CustomProjectMenuElement(
  props: CustomProjectMenuElementProps,
) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.admin.project.index);
  const attachment = useAppSelector((state) => state.admin.attachment);

  const [createPanel, openCreatePanel] = useState(false);
  const [deletePanel, openDeletePanel] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filepath = useMemo(() => {
    if (attachment.buffer !== null) return attachment.path;

    if (!Array.isArray(router.query.path)) return '/';
    return ['', ...router.query.path, ''].join('/');
  }, [attachment, router]);

  const onDirectory = () => {
    if (!attachment.name) return openCreatePanel(false);

    const path = (Array.isArray(router.query.path) ? router.query.path : [])
      .concat(attachment.path.split('/').filter(Boolean))
      .concat(attachment.name);

    router.push({
      pathname: props.pathname.attachment,
      query: { ...router.query, path },
    });
  };

  return (
    <>
      <PopupFormElement
        open={createPanel}
        onClose={() => openCreatePanel(false)}
        setOptions={{
          panelSize: 'sm:w-full sm:max-w-xl',
        }}
      >
        <div className="flex text-sm font-medium text-gray-800 bg-gray-100 px-4 py-3 border-b border-gray-300">
          Create project subdirectory
        </div>

        <div className="flex px-4 py-6 items-center border-b border-gray-300">
          <CustomDirectoryInputFormElement onSubmit={() => onDirectory()} />
        </div>
        <div className="flex w-full">
          <NextFormElement
            className="ml-auto mr-4 my-3"
            next="Create directory"
            back="Cancel"
            onNext={() => onDirectory()}
            onBack={() => openCreatePanel(false)}
            setOptions={{
              buttonPadding: 'py-1.5 px-4',
              nextButtonColor: 'text-white bg-green-600 hover:bg-green-700',
            }}
          />
        </div>
      </PopupFormElement>

      <PopupFormElement
        open={deletePanel}
        onClose={() => openDeletePanel(false)}
        setOptions={{
          panelSize: 'sm:w-full sm:max-w-3xl',
        }}
      >
        <div className="flex text-sm font-medium text-gray-800 bg-gray-100 px-4 py-3">
          Those selected attachments will be deleted
        </div>

        <TableFormElement
          noHeader
          className="mb-6 "
          columns={{ name: 'Name', updated_at: 'Last updated' }}
          data={Object.values(project.trash || {}).filter((e) => e.type)}
          dataComponent={{
            name: (attachment) => (
              <span className="flex h-full whitespace-nowrap text-gray-800">
                <FontAwesomeIcon
                  className="text-gray-500 text-lg mr-2"
                  icon={faFile}
                />
                {attachment._filepath()}
              </span>
            ),
            updated_at: (attachment) => moment(attachment.updated_at).toNow(),
          }}
          firstComponent={() => <span className="pl-7 py-6" />}
          setOptions={{ rowColor: 'bg-white', dataPadding: 'pr-6' }}
        />

        <div className="flex w-full">
          <NextFormElement
            className="ml-auto mr-4 my-3"
            next="Yes, delete those attachments..."
            back="Cancel"
            onNext={() =>
              ErrorService.envelop(async () => {
                if (!project.trash) return;

                for (const id in project.trash) {
                  if (!id) continue;
                  await AdminAttachmentEntity.self.delete.exec(id);
                }

                await dispatch(AdminProjectEntity.self.load.thunk(router.query.id)).unwrap(); // prettier-ignore
                dispatch(AdminProjectStore.actions.clearTrash());
              }).finally(() => openDeletePanel(false))
            }
            onBack={() => {
              openDeletePanel(false);
              dispatch(AdminProjectStore.actions.clearTrash());
            }}
            setOptions={{
              buttonPadding: 'py-1.5 px-4',
              nextButtonColor: 'text-white bg-red-600 hover:bg-red-700',
            }}
          />
        </div>
      </PopupFormElement>

      <div className="ml-auto">
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            ErrorService.envelop(async () => {
              const files = Array.from(event.target.files);
              await ProjectService.saveAttachments(project as any, filepath, files); // prettier-ignore
              await dispatch(AdminProjectEntity.self.load.thunk(router.query.id)).unwrap(); // prettier-ignore
            });
          }}
        />

        {!!project.trash ? (
          <NextFormElement
            next="Delete files..."
            back="Cancel"
            onNext={() => {
              if (Object.keys(project.trash).length) openDeletePanel(true);
              else dispatch(AdminProjectStore.actions.clearTrash());
            }}
            onBack={() => dispatch(AdminProjectStore.actions.clearTrash())}
            setOptions={{
              buttonPadding: 'px-3 py-1.5',
              nextButtonColor: 'text-white bg-red-600 hover:bg-red-700',
            }}
          />
        ) : (
          <MenuFormElement
            name="Action"
            actions={{
              dir: 'Create Directory',
              create: 'Create File',
              upload: 'Upload File',
              delete: 'Delete File',
            }}
            onChange={(action) => {
              switch (action) {
                case 'dir':
                  return openCreatePanel(true);

                case 'upload':
                  return fileRef.current.click();

                case 'create':
                  return router.push({
                    pathname: props.pathname.create,
                    query: { ...router.query },
                  });

                case 'delete':
                  return dispatch(AdminProjectStore.actions.initTrash());
              }
            }}
            // itemComponent={props.itemComponent}
          />
        )}
      </div>
    </>
  );
}
