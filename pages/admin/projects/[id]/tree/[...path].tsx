import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef } from 'react';
import Breadcrumbs from '../../../../../components/Breadcrumbs/Breadcrumbs';
import Container from '../../../../../components/Container/Container';
import { AceEditor, RenderHtml } from '../../../../../components/dynamic';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { RequestTypeEnum } from '../../../../../lib/common/types/request-type.enum';
import {
  PROJECT_FILE_ACTIONS,
  PROJECT_HANDLEBAR_SHORTCUTS,
} from '../../../../../components/constants/projects';
import CustomMenuFormElement from '../../../../../components/Form/Custom/CustomMenuFormElement';
import { AdminProjectStore } from '../../../../../lib/project/stores/admin-project.store';
import { AttachmentAttachableTypeEnum } from '../../../../../lib/attachment/types/attachment-attachable-type.enum';
import { getServerSession } from 'next-auth';
import { options } from '../../../../api/admin/auth/[...nextauth]';
import Handlebars from 'handlebars';
import CustomPopupSimpleFormElement from '../../../../../components/Form/Custom/CustomPopupSimpleFormElement';
import TableFormGraggable from '../../../../../components/Form/Draggable/TableFormDraggable';
import { arrayMove } from '@dnd-kit/sortable';
import { PositionEntity } from '../../../../../lib/common/entities/position.entity';
import TabFormElement from '../../../../../components/Form/Elements/TabFormElement';
import { StringService } from '../../../../../lib/common';
import TooltipFormPreview from '../../../../../components/Form/Previews/TooltipFormPreview';

export default function () {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.admin.project.index);
  const attachment = useAppSelector((state) => state.admin.attachment);

  const fileRef = useRef<HTMLInputElement>(null);
  const projectRef = useRef<AdminProjectEntity>(null);
  const attachmentRef = useRef<AdminAttachmentStoreT>(null);
  projectRef.current = project as any;
  attachmentRef.current = attachment as any;

  const filepath = useMemo(() => {
    if (attachment.buffer !== null) return attachment.path;

    if (!Array.isArray(router.query.path)) return '/';
    return ['', ...router.query.path, ''].join('/');
  }, [attachment, router]);

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

      const text = await AttachmentEntity.self.load.raw(attachment.id);
      dispatch(AdminAttachmentStore.actions.setBuffer(text));

      await parse(attachment.type, text);
    });
  }, [router.query.path]);

  const redirect = (path: string[]) =>
    router.push({
      pathname: router.route,
      query: { ...router.query, path },
    });

  const parse = async (type: string, text: string) => {
    switch (type) {
      case '.md': {
        const html = await StringService.markdown(text);
        return dispatch(AdminProjectStore.actions.setHtml(html));
      }

      case '.html':
        return dispatch(AdminProjectStore.actions.setHtml(text));
    }
  };

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
            sortBy={([_a, a], [_b, b]) =>
              Number(!!a.type) - Number(!!b.type) ||
              ((a as any).order || 0) - ((b as any).order || 0)
            }
          />
        }
        Breadcrumbs={
          <div className="flex px-4 items-center">
            <Breadcrumbs
              href={[
                {
                  name: project.name,
                  path: {
                    pathname: `${router.route}/../..`,
                    query: { id: router.query.id },
                  },
                },
              ]}
            />

            <CustomPopupSimpleFormElement
              name="Directory name"
              value={project.directory || ''}
              open={project.directory !== null}
              onClose={() => dispatch(AdminProjectStore.actions.clearDir())}
              onChange={(v) => dispatch(AdminProjectStore.actions.setDir(v))}
              onNext={() => {
                const path = project.directory.split('/').filter(Boolean);
                if (!path.length) return dispatch(AdminProjectStore.actions.clearDir()); // prettier-ignore

                const final = Array.isArray(router.query.path)
                  ? router.query.path.concat(path)
                  : path;

                redirect(AttachmentService.filepath({ path: final.join("/")  } as any)); // prettier-ignore
              }}
            />
            <CustomMenuFormElement
              className="ml-auto"
              fileRef={fileRef}
              next="Delete files..."
              actions={PROJECT_FILE_ACTIONS}
              isSubmitButton={!!project.trash}
              onChange={(action) => {
                switch (action) {
                  case 'dir':
                    return dispatch(AdminProjectStore.actions.initDir());

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
                  for (const file of Array.from(event.target.files)) {
                    const entity = project.attachments.find(
                      (e) => e.name == file.name && e.path == filepath,
                    );

                    await AdminAttachmentEntity.self.save.build(
                      new AdminAttachmentEntity({
                        id: entity?.id,
                        path: filepath,
                        file: file as any,
                        attachable_id: project.id,
                        attachable_type: AttachmentAttachableTypeEnum.projects,
                      }),
                      { type: RequestTypeEnum.form },
                    );

                    await dispatch(AdminProjectEntity.self.load.thunk(router.query.id)).unwrap(); // prettier-ignore
                  }
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
        <TabFormElement
          className={`p-4 ${attachment.buffer !== null ? 'block' : 'hidden'}`}
          default="code"
          disabled={project.html ? [] : ['preview']}
          columns={{ preview: 'Preview', code: 'Code' }}
          headerComponent={
            <span className="flex ml-auto text-sm items-center text-gray-400">
              {attachment.updated_at && moment(attachment.updated_at).toNow()}
            </span>
          }
          dataComponent={{
            preview: () => (
              <RenderHtml
                className="w-full h-full overflow-y-hidden py-5 pl-5 "
                html={project.html}
                setOptions={{
                  height: 'calc(100vh - 14rem)',
                  containerHeighOffset: 8,
                  containerClassName: `${
                    project.html ? 'block' : 'hidden'
                  } relative border rounded-b`,
                }}
              />
            ),
            code: () => (
              <AceEditor
                mode={mode.getModeForPath(attachment.name).name}
                className="border rounded-b"
                theme="tomorrow"
                width="100%"
                height="calc(100vh - 14rem)"
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
                        const vars = AttachmentService.vars(projectRef.current.attachments); // prettier-ignore
                        const template = Handlebars.compile(attachmentRef.current.buffer); // prettier-ignore
                        const buffer = template(Object.assign(vars, PROJECT_HANDLEBAR_SHORTCUTS)); // prettier-ignore

                        const blob = new Blob([buffer]);
                        const file = new File(
                          [blob],
                          attachmentRef.current.name,
                        );

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
                            dispatch(
                              AdminAttachmentStore.actions.setBuffer(buf),
                            ),
                          );

                        await parse(attachmentRef.current.type, buffer);
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
            ),
          }}
        />
        <TableFormGraggable
          className={`mb-8 mx-4 ${
            attachment.buffer !== null ? 'hidden' : 'block'
          }`}
          columns={{ name: 'Name', updated_at: 'Last updated' }}
          picked={project.picked}
          data={AttachmentService.toList<AdminAttachmentEntity>(
            project.attachments,
            Array.isArray(router.query.path) ? router.query.path : [],
          )}
          onDragStart={(e) =>
            dispatch(AdminProjectStore.actions.onPick(e.active.id as string))
          }
          onDragEnd={({ active, over }) =>
            ErrorService.envelop(async () => {
              const position =
                project.attachments.find((e) => e.id == over?.id)?.order ??
                null;

              if (!over?.id || position === null) {
                return dispatch(AdminProjectStore.actions.onDrop());
              }

              dispatch(
                AdminProjectStore.actions.onReorder(
                  arrayMove(
                    project.attachments.concat() as any,
                    project.attachments.findIndex((e) => e.id == active.id),
                    project.attachments.findIndex((e) => e.id == over.id),
                  ),
                ),
              );

              await AdminAttachmentEntity.self.save.build(
                new PositionEntity({ position }),
                {
                  method: 'PUT',
                  route: `admin/attachments/${active.id}/order`,
                },
              );

              await dispatch(
                AdminProjectEntity.self.load.thunk(router.query.id),
              ).unwrap();
            })
          }
          onDragCancel={() => dispatch(AdminProjectStore.actions.onDrop())}
          onClick={(attachment: AdminAttachmentEntity) =>
            project.trash
              ? dispatch(AdminProjectStore.actions.pushTrash(attachment))
              : redirect(AttachmentService.filepath(attachment))
          }
          dataComponent={{
            name: (attachment) => (
              <span
                className={`group flex whitespace-nowrap ${
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

                {attachment.size && (
                  <TooltipFormPreview
                    value={`${attachment.size / 1000} KB`}
                    setOptions={{
                      margin: 'mt-4',
                      rounded: 'rounded-md',
                      color: 'bg-gray-600 text-white',
                    }}
                  />
                )}
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
