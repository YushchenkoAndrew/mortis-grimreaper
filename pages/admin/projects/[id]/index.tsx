import {
  faEye,
  faEyeSlash,
  faFile,
  faPenToSquare,
} from '@fortawesome/free-regular-svg-icons';
import {
  faArrowUpRightFromSquare,
  faEllipsisVertical,
  faFolder,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import {
  PROJECT_ACTIONS,
  PROJECT_FILE_ACTIONS,
} from '../../../../components/constants/projects';
import Container from '../../../../components/Container/Container';
import MenuFormElement from '../../../../components/Form/Elements/MenuFormElement';
import Header from '../../../../components/Header/Header';
import Navbar from '../../../../components/Navbar/Navbar';
import NavbarItem from '../../../../components/Navbar/NavbarItem';
import { Config } from '../../../../config';
import { NAVIGATION } from '../../../../constants';
import { AttachmentEntity } from '../../../../lib/attachment/entities/attachment.entity';
import { AdminProjectEntity } from '../../../../lib/project/entities/admin-project.entity';
import { ErrorService } from '../../../../lib/common/error.service';
import { AdminProjectStore } from '../../../../lib/project/stores/admin-project.store';
import { useAppDispatch, useAppSelector } from '../../../../lib/common/store';
import { AttachmentService } from '../../../../lib/attachment/attachment.service';
import { AdminAttachmentEntity } from '../../../../lib/attachment/entities/admin-attachment.entity';
import { AttachmentAttachableTypeEnum } from '../../../../lib/attachment/types/attachment-attachable-type.enum';
import moment from 'moment';
import { RequestTypeEnum } from '../../../../lib/common/types/request-type.enum';
import Link from 'next/link';
import CustomMenuFormElement from '../../../../components/Form/Custom/CustomMenuFormElement';
import { getServerSession } from 'next-auth';
import { options } from '../../../api/admin/auth/[...nextauth]';
import { StringService } from '../../../../lib/common';
import { ProjectStatusEnum } from '../../../../lib/project/types/project-status.enum';
import TableFormGraggable from '../../../../components/Form/Draggable/TableFormDraggable';
import { arrayMove } from '@dnd-kit/sortable';
import { PositionEntity } from '../../../../lib/common/entities/position.entity';
import CustomPopupSimpleFormElement from '../../../../components/Form/Custom/CustomPopupSimpleFormElement';
import { RenderHtml } from '../../../../components/dynamic';
import ImgFormElement from '../../../../components/Form/Elements/ImgFormElement';
import TooltipFormPreview from '../../../../components/Form/Previews/TooltipFormPreview';

export default function () {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.admin.project.index);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ErrorService.envelop(async () => {
      dispatch(() => dispatch(AdminProjectStore.actions.init()));

      const project = (await dispatch(
        AdminProjectEntity.self.load.thunk(router.query.id),
      ).unwrap()) as AdminProjectEntity;

      const readme = AttachmentService.readme(project.attachments);
      if (!readme) return;

      const preview = await AttachmentEntity.self.load.markdown(readme.id);
      dispatch(AdminProjectStore.actions.setHtml(preview));
    });
  }, []);

  const redirect = (path: string[]) =>
    router.push({
      pathname: `${router.route}/tree/[...path]`,
      query: { ...router.query, path },
    });

  const onFile = (files: File[], by_name?: boolean) =>
    ErrorService.envelop(async () => {
      for (const file of files) {
        const name = by_name ? file.name.split('.')[0] : file.name;
        const attachment = project.attachments.find(
          (e) => (by_name ? e._without_ext() : e.name) == name && e.path == '/',
        );

        await AdminAttachmentEntity.self.save.build(
          new AdminAttachmentEntity({
            id: attachment?.id,
            path: '/',
            file: file as any,
            attachable_id: project.id,
            attachable_type: AttachmentAttachableTypeEnum.projects,
          }),
          { type: RequestTypeEnum.form },
        );
      }

      await dispatch(AdminProjectEntity.self.load.thunk(router.query.id)).unwrap(); // prettier-ignore
    });

  return (
    <>
      <Header title={project.name || 'Project'}></Header>

      <Container
        Navbar={
          <Navbar
            Item={NavbarItem}
            navigation={NAVIGATION.admin}
            avatar={Config.self.github}
          />
        }
        // TODO:
        // Sidebar={
        //   <Sidebar
        //     Element={SidebarElement}
        //     data={PROJECT_ACTIONS}
        //     onClick={(data) => {
        //       // TODO:
        //       ErrorService.envelop(async () => {
        //         throw new Error('Impl this button !!');
        //       });
        //     }}
        //   />
        // }
      >
        <CustomPopupSimpleFormElement
          name="Directory name"
          value={project.directory || ''}
          open={project.directory !== null}
          onClose={() => dispatch(AdminProjectStore.actions.clearDir())}
          onChange={(v) => dispatch(AdminProjectStore.actions.setDir(v))}
          onNext={() => {
            const path = project.directory.split('/').filter(Boolean);
            if (!path.length) return dispatch(AdminProjectStore.actions.clearDir()); // prettier-ignore

            redirect(AttachmentService.filepath({ path: project.directory } as any)); // prettier-ignore
          }}
        />

        <div className="flex flex-col max-w-6xl">
          <div className="flex items-center my-4 pb-3 border-b border-gray-300">
            <ImgFormElement
              img={project.avatar}
              onFile={(file) =>
                ErrorService.envelop(async () => {
                  onFile([await AttachmentService.thumbnail(file)], true);
                })
              }
            />

            <Link
              className="group text-2xl font-semibold max-w-xl truncate hover:underline"
              target="_blank"
              href={{
                pathname: '/projects/[id]',
                query: { id: project.id },
              }}
            >
              {project.name}

              <TooltipFormPreview
                value={project.name}
                setOptions={{ margin: '-ml-2' }}
              />
            </Link>

            <span className="text-xs font-normal leading-4 mx-2 px-1 rounded-xl border border-gray-400 text-gray-500 ">
              {StringService.humanize(project.status)}
            </span>

            <MenuFormElement
              className="ml-auto"
              name={<FontAwesomeIcon icon={faEllipsisVertical} />}
              actions={PROJECT_ACTIONS}
              setOptions={{
                buttonPadding: 'py-2 px-3.5',
                buttonColor:
                  'bg-transparent border border-gray-400 hover:border-gray-500 hover:bg-gray-200',
                buttonTextColor: 'text-gray-700 ',
                noChevronDown: true,
              }}
              onChange={(action) =>
                ErrorService.envelop(async () => {
                  const status =
                    project.status == ProjectStatusEnum.active
                      ? ProjectStatusEnum.inactive
                      : ProjectStatusEnum.active;

                  switch (action) {
                    case 'status':
                      return await dispatch(
                        AdminProjectEntity.self.save.thunk(
                          new AdminProjectEntity({
                            id: project.id,
                            status,
                          }),
                        ),
                      ).unwrap();

                    case 'delete':
                      await AdminProjectEntity.self.delete.exec(project.id);
                      return router.push({
                        pathname: `${router.route}/..`,
                      });
                  }
                })
              }
            />
          </div>

          <div className="flex">
            <div className="flex flex-col justify-start max-w-4xl w-full">
              <div className="flex">
                <div className="flex ml-1 items-center text-sm">
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon
                      className="text-gray-400 mr-1 pb-0.5"
                      icon={faFile}
                    />
                    <span className="font-medium mr-1">
                      {project.attachments.length}
                    </span>
                    Files
                  </div>
                  <div className="flex items-center ml-4 text-gray-600">
                    <FontAwesomeIcon
                      className="text-gray-400 mr-1 pb-0.5"
                      icon={faArrowUpRightFromSquare}
                    />
                    <span className="font-medium mr-1">
                      {project.links.length}
                    </span>
                    Links
                  </div>
                </div>

                <CustomMenuFormElement
                  className="ml-auto mb-3"
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
                          pathname: `${router.route}/new`,
                          query: { ...router.query },
                        });

                      case 'delete':
                        return dispatch(AdminProjectStore.actions.initTrash());
                    }
                  }}
                  onFile={(event) => onFile(Array.from(event.target.files))}
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
                  onBack={() =>
                    dispatch(AdminProjectStore.actions.clearTrash())
                  }
                />
              </div>

              <TableFormGraggable
                className="mb-8 rounded-md"
                columns={{ name: 'Name', updated_at: 'Last updated' }}
                picked={project.picked}
                data={AttachmentService.toList<AdminAttachmentEntity>(
                  project.attachments,
                )}
                onDragStart={(e) =>
                  dispatch(
                    AdminProjectStore.actions.onPick(e.active.id as string),
                  )
                }
                onDragEnd={({ active, over }) =>
                  ErrorService.envelop(async () => {
                    const position =
                      project.attachments.find((e) => e.id == over?.id)
                        ?.order ?? null;

                    if (!over?.id || position === null) {
                      return dispatch(AdminProjectStore.actions.onDrop());
                    }

                    dispatch(
                      AdminProjectStore.actions.onReorder(
                        arrayMove(
                          project.attachments.concat() as any,
                          project.attachments.findIndex(
                            (e) => e.id == active.id,
                          ),
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
                onDragCancel={() =>
                  dispatch(AdminProjectStore.actions.onDrop())
                }
                onClick={(attachment: AdminAttachmentEntity) =>
                  project.trash
                    ? dispatch(AdminProjectStore.actions.pushTrash(attachment))
                    : redirect(AttachmentService.filepath(attachment))
                }
                firstComponent={(props) =>
                  props.row.type ? (
                    props.children
                  ) : (
                    <span className="pl-7 py-6" />
                  )
                }
                dataComponent={{
                  name: (attachment) => (
                    <span
                      className={`group flex h-full whitespace-nowrap ${
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
                  updated_at: (attachment) =>
                    moment(attachment.updated_at).toNow(),
                }}
              />

              <RenderHtml
                className="w-full h-full overflow-y-hidden p-5"
                html={project.html}
                headerComponent={
                  <div className="flex text-sm font-medium text-gray-800 bg-gray-100 px-4 py-2">
                    <FontAwesomeIcon
                      className="text-gray-500 text-lg mr-1.5"
                      icon={faFile}
                    />
                    README
                  </div>
                }
                setOptions={{
                  containerHeighOffset: 8,
                  containerClassName: `${
                    project.html ? 'block' : 'hidden'
                  } relative border rounded-md`,
                }}
              />
            </div>

            <div className="flex flex-col ml-5 max-w-60 w-full">
              <div className="flex text-lg justify-between">
                <span className="font-medium text-gray-800 mb-6">About</span>
                <FontAwesomeIcon
                  className="pt-1 text-gray-600 focus:outline-none hover:text-indigo-600 cursor-pointer"
                  icon={faGear}
                />
              </div>
              <span className="text-gray-800 text-pretty">
                {project.description}
              </span>

              <div></div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, options);
  if (!session) return { redirect: { destination: '/admin/login' } };

  return { props: ctx.params || {} };
  // const project = await AdminProjectEntity.self.load
  //   .build(ctx.params.id, { ctx, hostname: Config.self.base.grape })
  //   .catch((err) => null);

  // if (!project) return { redirect: { destination: '/admin/projects' } };
  // return {
  //   props: { ...ctx.params, project: JSON.parse(JSON.stringify(project)) },
  // };
}
