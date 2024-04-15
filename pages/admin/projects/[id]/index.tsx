import { faFile } from '@fortawesome/free-regular-svg-icons';
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

export default function () {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.admin.projects.index);
  const fileRef = useRef<HTMLInputElement>(null);

  const redirect = (path: string[]) =>
    router.push({
      pathname: `${router.route}/tree/[...path]`,
      query: { ...router.query, path },
    });

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
      >
        <div className="flex flex-col mx-auto max-w-3xl w-full">
          <div className="flex items-center">
            <img
              className="h-14 w-auto rounded my-8 mr-3"
              src={Config.self.github.src}
              alt="thumbnailLL"
            />

            <span className="text-2xl font-semibold">{project.name}</span>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={(event) =>
                ErrorService.envelop(async () => {
                  await Promise.all(
                    Array.from(event.target.files).map((file) =>
                      AdminAttachmentEntity.self.save.build(
                        new AdminAttachmentEntity({
                          path: '/',
                          file: file as any,
                          attachable_id: project.id,
                          attachable_type:
                            AttachmentAttachableTypeEnum.projects,
                        }),
                        false,
                      ),
                    ),
                  );

                  await dispatch(
                    AdminProjectEntity.self.load.thunk(router.query.id),
                  ).unwrap();
                })
              }
            />
            <MenuFormElement
              className="ml-auto"
              name="Action"
              actions={PROJECT_FILE_ACTIONS}
              onChange={(action) => {
                switch (action) {
                  case 'upload':
                    return fileRef.current.click();
                }
              }}
            />
          </div>
          <TableFormElement
            className="mb-8"
            columns={{ name: 'Name', created_at: 'Last updated' }}
            data={AttachmentService.toList<AdminAttachmentEntity>(
              project.attachments,
            )}
            onClick={(attachment) =>
              redirect(AttachmentService.filepath(attachment))
            }
            stringify={{
              name: (attachment) => (
                <span className="flex text-gray-800 whitespace-nowrap">
                  <FontAwesomeIcon
                    className="text-gray-500 text-lg mr-2"
                    icon={attachment.type ? faFile : faFolder}
                  />
                  {attachment.name}
                </span>
              ),
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
