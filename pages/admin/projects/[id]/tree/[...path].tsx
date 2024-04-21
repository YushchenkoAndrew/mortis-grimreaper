import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import Breadcrumbs from '../../../../../components/Breadcrumbs/Breadcrumbs';
import Container from '../../../../../components/Container/Container';
import { AceEditor } from '../../../../../components/dynamic';
import Header from '../../../../../components/Header/Header';
import Navbar from '../../../../../components/Navbar/Navbar';
import NavbarItem from '../../../../../components/Navbar/NavbarItem';
import FileSystem from '../../../../../components/Sidebar/FileSystem';
import Sidebar from '../../../../../components/Sidebar/Sidebar';
import { Config } from '../../../../../config';
import { NAVIGATION } from '../../../../../constants';
import { AdminProjectEntity } from '../../../../../lib/project/entities/admin-project.entity';
import { ErrorService } from '../../../../../lib/common/error.service';
import {
  AdminAttachmentStore,
  AdminAttachmentStoreT,
} from '../../../../../lib/attachment/stores/admin-attachment.store';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../lib/common/store';
import { AttachmentService } from '../../../../../lib/attachment/attachment.service';
import { AttachmentEntity } from '../../../../../lib/attachment/entities/attachment.entity';
import { mode } from '../../../../../components/dynamic/AceEditor';
import { AdminAttachmentEntity } from '../../../../../lib/attachment/entities/admin-attachment.entity';
import TableFormElement from '../../../../../components/Form/Elements/TableFormElement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { RequestTypeEnum } from '../../../../../lib/common/types/request-type.enum';
import InputFormElement from '../../../../../components/Form/Elements/InputFormElement';
import MenuFormElement from '../../../../../components/Form/Elements/MenuFormElement';
import { PROJECT_FILE_ACTIONS } from '../../../../../components/constants/projects';
import CustomMenuFormElement from '../../../../../components/Form/Custom/CustomMenuFormElement';
import { AdminProjectStore } from '../../../../../lib/project/stores/admin-project.store';
import { AttachmentAttachableTypeEnum } from '../../../../../lib/attachment/types/attachment-attachable-type.enum';
import { getServerSession } from 'next-auth';
import { options } from '../../../../api/admin/auth/[...nextauth]';

export default function () {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.admin.project.index);
  const attachment = useAppSelector((state) => state.admin.attachment);

  const fileRef = useRef<HTMLInputElement>(null);
  const attachmentRef = useRef<AdminAttachmentStoreT>(null);
  attachmentRef.current = attachment as any;

  useEffect(() => {
    ErrorService.envelop(async () => {
      if (!Array.isArray(router.query.path)) return;
      dispatch(AdminAttachmentStore.actions.setBuffer(''));

      const project = (await dispatch(
        AdminProjectEntity.self.load.thunk(router.query.id),
      ).unwrap()) as AdminProjectEntity;

      const root = '/' + router.query.path.join('/');
      const attachment = project.attachments.find((e) => e._filepath() == root);

      // prettier-ignore
      if (!attachment) return dispatch(AdminAttachmentStore.actions.setBuffer(null));

      dispatch(AdminAttachmentStore.actions.setAttachment(attachment as any));
      await AttachmentEntity.self.load
        .text(attachment.id)
        .then((buf) => dispatch(AdminAttachmentStore.actions.setBuffer(buf)));
    });
  }, [router.query.path]);

  const redirect = (path: string[]) =>
    router.push({
      pathname: router.route,
      query: { ...router.query, path },
    });

  return (
    <>
      <Header title="Admin project create"></Header>

      <Container
        className="w-full"
        Navbar={
          <Navbar
            Item={NavbarItem}
            navigation={NAVIGATION.admin}
            avatar={Config.self.github}
          />
        }
        Sidebar={
          <Sidebar
            Element={FileSystem}
            data={[AttachmentService.toTree(project.attachments)]}
            onClick={(data) =>
              redirect(
                Array.isArray(data) ? data : AttachmentService.filepath(data),
              )
            }
          />
        }
        Breadcrumbs={
          <div className="flex px-4 items-center">
            <Breadcrumbs path={[project.name].concat(router.query.path)} />

            <CustomMenuFormElement
              className="ml-auto"
              fileRef={fileRef}
              next="Delete files..."
              actions={PROJECT_FILE_ACTIONS}
              isSubmitButton={!!project.trash}
              onChange={(action) => {
                switch (action) {
                  case 'upload':
                    return fileRef.current.click();

                  case 'create':
                    return router.push({
                      pathname: `${router.route}/../../new`,
                      query: { ...router.query },
                    });

                  case 'delete':
                    return dispatch(AdminProjectStore.actions.initTrash());
                }
              }}
              onFile={(event) =>
                ErrorService.envelop(async () => {
                  await Promise.all(
                    Array.from(event.target.files).map((file) => {
                      const path = Array.isArray(router.query.path)
                        ? ['', ...router.query.path, ''].join('/')
                        : '/';

                      const attachment = project.attachments.find(
                        (e) => e.name == file.name && e.path == path,
                      );

                      return AdminAttachmentEntity.self.save.build(
                        new AdminAttachmentEntity({
                          id: attachment?.id,
                          path: path,
                          file: file as any,
                          attachable_id: project.id,
                          attachable_type:
                            AttachmentAttachableTypeEnum.projects,
                        }),
                        { type: RequestTypeEnum.form },
                      );
                    }),
                  );

                  await dispatch(AdminProjectEntity.self.load.thunk(router.query.id)).unwrap(); // prettier-ignore
                })
              }
              onNext={() =>
                ErrorService.envelop(async () => {
                  if (!project.trash) return;

                  await Promise.all(
                    Object.keys(project.trash).map((id) =>
                      AdminAttachmentEntity.self.delete.exec(id),
                    ),
                  );

                  await dispatch(AdminProjectEntity.self.load.thunk(router.query.id)).unwrap(); // prettier-ignore
                  dispatch(AdminProjectStore.actions.clearTrash());
                })
              }
              onBack={() => dispatch(AdminProjectStore.actions.clearTrash())}
            />
          </div>
        }
      >
        <AceEditor
          mode={mode.getModeForPath(attachment.name).name}
          className={attachment.buffer !== null ? 'block' : 'hidden'}
          theme="tomorrow"
          width="100%"
          height="calc(100vh - 8.5rem)"
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
                ErrorService.envelop(async () => {
                  const blob = new Blob([attachmentRef.current.buffer]);
                  const file = new File([blob], attachmentRef.current.name);

                  await AdminAttachmentEntity.self.save.build(
                    new AdminAttachmentEntity({
                      id: attachmentRef.current.id,
                      file: file as any,
                    }),
                    { type: RequestTypeEnum.form },
                  );

                  await AttachmentEntity.self.load
                    .text(attachmentRef.current.id)
                    .then((buf) =>
                      dispatch(AdminAttachmentStore.actions.setBuffer(buf)),
                    );
                }),
            },
          ]}
          setOptions={{
            spellcheck: true,
            showLineNumbers: true,
            highlightGutterLine: true,
            enableSnippets: false,
          }}
        />
        <TableFormElement
          className={`mb-8 mx-4 ${
            attachment.buffer !== null ? 'hidden' : 'block'
          }`}
          columns={{ name: 'Name', updated_at: 'Last updated' }}
          data={AttachmentService.toList<AdminAttachmentEntity>(
            project.attachments,
            Array.isArray(router.query.path) ? router.query.path : [],
          )}
          onClick={(attachment) =>
            project.trash
              ? dispatch(AdminProjectStore.actions.pushTrash(attachment))
              : redirect(AttachmentService.filepath(attachment))
          }
          dataComponent={{
            name: (attachment) => (
              <span
                className={`flex whitespace-nowrap ${
                  project.trash?.[attachment.id]
                    ? 'line-through text-gray-500'
                    : 'text-gray-800'
                }`}
              >
                <FontAwesomeIcon
                  className="text-gray-500 text-lg mr-2"
                  icon={attachment.type ? faFile : faFolder}
                />
                {attachment.name}
              </span>
            ),
            updated_at: (attachment) => moment(attachment.updated_at).toNow(),
          }}
        />
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, options);
  if (!session) return { redirect: { destination: '/admin/login' } };

  return { props: ctx.params || {} };
}
