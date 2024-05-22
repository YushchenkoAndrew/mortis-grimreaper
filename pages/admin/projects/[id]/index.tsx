import { faFile } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowUpRightFromSquare,
  faChevronDown,
  faEllipsisVertical,
  faGear,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import MenuFormElement from '../../../../components/Form/Elements/MenuFormElement';
import { Config } from '../../../../config';
import { AttachmentEntity } from '../../../../lib/attachment/entities/attachment.entity';
import { AdminProjectEntity } from '../../../../lib/project/entities/admin-project.entity';
import { ErrorService } from '../../../../lib/common/error.service';
import { AdminProjectStore } from '../../../../lib/project/stores/admin-project.store';
import { useAppDispatch, useAppSelector } from '../../../../lib/common/store';
import { AttachmentService } from '../../../../lib/attachment/attachment.service';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { options } from '../../../api/admin/auth/[...nextauth]';
import { RenderHtml } from '../../../../components/dynamic';
import ImgFormElement from '../../../../components/Form/Elements/ImgFormElement';
import TooltipFormPreview from '../../../../components/Form/Previews/TooltipFormPreview';
import PopupFormElement from '../../../../components/Form/Elements/PopupFormElement';
import CustomAttachmentDraggable from '../../../../components/Form/Custom/Draggable/CustomAttachmentDraggable';
import TopicFormPreview from '../../../../components/Form/Previews/TopicFormPreview';
import AdminLayout from '../../../../components/Container/Layout/AdminLayout';
import CustomProjectMenuElement from '../../../../components/Form/Custom/Elements/CustomProjectMenuElement';
import { ProjectService } from '../../../../lib/project/project.service';
import ProjectFormUpdatePage from '../../../../components/Form/Page/ProjectFormUpdatePage';
import { AdminProjectFormStore } from '../../../../lib/project/stores/admin-project-form.store';
import CustomYesNoPopupElement from '../../../../components/Form/Custom/Elements/CustomYesNoPopupElement';
import CustomProjectStatusPreview from '../../../../components/Form/Custom/Previews/CustomProjectStatusPreview';

interface PropsT {
  project: AdminProjectEntity;
}

export default function (props: PropsT) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.admin.project.index);
  const project_update = useAppSelector((state) => state.admin.project.form.id);

  const [deletePanel, openDeletePanel] = useState(false);

  useEffect(() => {
    ErrorService.envelop(async () => {
      const project = AdminProjectEntity.self.build(props.project);
      dispatch(AdminProjectStore.actions.init(project));

      const readme = AttachmentService.readme(props.project.attachments);
      if (!readme) return;

      const preview = await AttachmentEntity.self.load.markdown(readme.id);
      dispatch(AdminProjectStore.actions.setHtml(preview));
    });
  }, []);

  return (
    <AdminLayout title={project.name} className="">
      <div className="flex flex-col max-w-6xl">
        <div className="flex items-center my-4 pb-3 border-b border-gray-300">
          <ImgFormElement
            img={project.avatar}
            onFile={(file) =>
              ErrorService.envelop(async () => {
                const thumbnail = await AttachmentService.thumbnail(file);
                await ProjectService.saveAttachments(project as any, '/', [thumbnail], true); // prettier-ignore
                await dispatch(AdminProjectEntity.self.load.thunk(router.query.id)).unwrap(); // prettier-ignore
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

          <CustomProjectStatusPreview
            project={new AdminProjectEntity(project as any)}
            onChange={(e) =>
              dispatch(AdminProjectStore.actions.setStatus(e.status))
            }
          />

          <CustomYesNoPopupElement
            title="Are you sure, you want to delete this project ?"
            open={deletePanel}
            onClose={() => openDeletePanel(false)}
            onNext={() => {
              ErrorService.envelop(async () => {
                await AdminProjectEntity.self.delete.exec(project.id);
                router.push({ pathname: `${router.route}/..` });
              });
            }}
          />

          <MenuFormElement
            className="ml-auto"
            name={
              <>
                <span className="mr-2">Options</span>
                <FontAwesomeIcon icon={faChevronDown} />
              </>
            }
            actions={{
              delete: 'Delete this project',
            }}
            setOptions={{
              buttonPadding: 'py-1.5 px-3',
              buttonColor:
                'bg-transparent border border-gray-400 hover:border-gray-500 hover:bg-gray-200',
              buttonTextColor: 'text-gray-700 ',
              noChevronDown: true,
            }}
            onChange={(action) =>
              ErrorService.envelop(async () => {
                switch (action) {
                  case 'delete':
                    return openDeletePanel(true);
                }
              })
            }
          />
        </div>

        <div className="flex">
          <div className="flex flex-col justify-start max-w-4xl w-full">
            <div className="flex mb-3">
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

              <CustomProjectMenuElement
                pathname={{
                  create: `${router.route}/new`,
                  attachment: `${router.route}/tree/[...path]`,
                }}
              />
            </div>

            <CustomAttachmentDraggable
              pathname={`${router.route}/tree/[...path]`}
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

          <PopupFormElement
            open={!!project_update}
            onClose={() => dispatch(AdminProjectFormStore.actions.reset())}
            setOptions={{
              panelSize: 'sm:w-full sm:max-w-3xl',
            }}
          >
            <div className="flex text-sm font-medium text-gray-800 bg-gray-100 px-4 py-3 border-b border-gray-300">
              Update project details
            </div>

            <ProjectFormUpdatePage className="flex flex-col mx-5 mb-3" />
          </PopupFormElement>

          <div className="flex flex-col ml-5 max-w-60 w-full">
            <TopicFormPreview
              title="About"
              name="description"
              description={project.description}
              headerComponent={
                <FontAwesomeIcon
                  className="pt-1 text-gray-600 focus:outline-none hover:text-indigo-600 cursor-pointer"
                  icon={faGear}
                  onClick={() =>
                    dispatch(AdminProjectFormStore.actions.init(project as any))
                  }
                />
              }
            />
            <TopicFormPreview
              title="Summary"
              name="footer"
              description={project.footer}
            />

            <div
              className={
                project.tags?.length
                  ? 'flex flex-wrap mb-4 space-x-1 space-y-2'
                  : 'hidden'
              }
            >
              {project.tags.map((e) => (
                <span
                  key={e.id}
                  className="px-3 py-1 first:ml-1 rounded-full bg-indigo-100 text-xs text-indigo-600"
                >
                  {e.name}
                </span>
              ))}
            </div>

            <div
              className={
                project.links?.length ? 'flex flex-wrap space-x-2' : 'hidden'
              }
            >
              <FontAwesomeIcon
                className="text-sm pt-1.5 text-gray-600"
                icon={faLink}
              />
              {project.links.map((e) => (
                <Link
                  key={e.id}
                  className="text-indigo-600 hover:underline cursor-pointer"
                  href={e.link}
                >
                  {e.name}
                </Link>
              ))}
            </div>

            <span className="w-full mt-2 border-b border-gray-300" />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, options);
  if (!session) return { redirect: { destination: '/admin/login' } };

  const project: AdminProjectEntity = await AdminProjectEntity.self.load
    .build(ctx.params.id, { hostname: Config.self.base.grape, ctx })
    .then((res) => JSON.parse(JSON.stringify(res)))
    .catch(() => null);

  return { props: { ...ctx.params, project } };
}
