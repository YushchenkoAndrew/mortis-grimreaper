import { faFile, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { PROJECT_FILE_ACTIONS } from '../../../../components/constants/projects';
import Container from '../../../../components/Container/Container';
import { RenderHtml } from '../../../../components/dynamic';
import MenuFormElement from '../../../../components/Form/Elements/MenuFormElement';
import TableFormElement from '../../../../components/Form/Elements/TableFormElement';
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
import { CommonRequest } from '../../../../lib/common/common.request';

export default function () {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.admin.projects.index);

  const imgRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ErrorService.envelop(async () => {
      const project = (await dispatch(
        AdminProjectEntity.self.load.thunk(router.query.id),
      ).unwrap()) as AdminProjectEntity;

      const readme = AttachmentService.readme(project.attachments);
      if (!readme) return;

      const preview = await AttachmentEntity.self.load.markdown(readme.id);
      dispatch(AdminProjectStore.actions.setREADME(preview));
    });
  }, []);

  const redirect = (path: string[]) =>
    router.push({
      pathname: `${router.route}/tree/[...path]`,
      query: { ...router.query, path },
    });

  const onFile = (files: File[]) =>
    ErrorService.envelop(async () => {
      await Promise.all(
        files.map((file) => {
          const attachment = project.attachments.find(
            (e) => e.name == file.name && e.path == '/',
          );

          return AdminAttachmentEntity.self.save.build(
            new AdminAttachmentEntity({
              id: attachment?.id,
              path: '/',
              file: file as any,
              attachable_id: project.id,
              attachable_type: AttachmentAttachableTypeEnum.projects,
            }),
            { type: RequestTypeEnum.form },
          );
        }),
      );

      await dispatch(AdminProjectEntity.self.load.thunk(router.query.id)).unwrap(); // prettier-ignore
    });

  return (
    <>
      <Header title="Admin project create"></Header>

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
        <div className="flex flex-col mx-auto max-w-3xl w-full">
          <div className="flex items-center">
            <div
              className="block relative group h-14 w-14 my-8 mr-3 cursor-pointer"
              onClick={() => imgRef.current.click()}
            >
              <input
                ref={imgRef}
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files[0];
                  if (!file) return;

                  const ext = file.name.split('.').at(-1);
                  return onFile([new File([file], `thumbnail.${ext}`)]);
                }}
              />
              <span className="absolute block top-0 left-0 h-full w-full rounded group-hover:bg-gray-400">
                <div className="hidden group-hover:flex w-full h-full justify-center items-center">
                  <FontAwesomeIcon
                    className="text-2xl text-gray-800"
                    icon={faPenToSquare}
                  />
                </div>
              </span>
              <img
                className="relative block top-0 left-0 h-full w-full rounded mix-blend-multiply"
                src={
                  project.thumbnail?.file
                    ? project.thumbnail.url()
                    : project.avatar
                }
                alt="thumbnailLL"
              />
            </div>

            <Link
              className="text-2xl font-semibold hover:underline"
              href={{
                pathname: '/projects/[id]',
                query: { id: project.id },
              }}
            >
              {project.name}
            </Link>

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
              onBack={() => dispatch(AdminProjectStore.actions.clearTrash())}
            />
          </div>
          <TableFormElement
            className="mb-8"
            columns={{ name: 'Name', updated_at: 'Last updated' }}
            data={AttachmentService.toList<AdminAttachmentEntity>(
              project.attachments,
            )}
            onClick={(attachment) =>
              project.trash
                ? dispatch(AdminProjectStore.actions.pushTrash(attachment))
                : redirect(AttachmentService.filepath(attachment))
            }
            stringify={{
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

          <div
            className={`${
              project.readme ? 'block' : 'hidden'
            } relative border rounded-md`}
          >
            <div className="flex text-sm font-medium text-gray-800 bg-gray-100 px-4 py-2">
              <FontAwesomeIcon
                className="text-gray-500 text-lg mr-1.5"
                icon={faFile}
              />
              README
            </div>

            <RenderHtml
              className="w-full h-full overflow-y-hidden p-5"
              html={project.readme}
            />
          </div>
        </div>
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return { props: ctx.params };
}
