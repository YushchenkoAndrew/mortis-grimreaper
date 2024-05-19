import { faFile } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowUpRightFromSquare,
  faEllipsisVertical,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import {
  ProjectCircle,
  PROJECTS_ACTIONS,
} from '../../../components/constants/projects';
import MenuFormElement from '../../../components/Form/Elements/MenuFormElement';
import NextFormElement from '../../../components/Form/Elements/NextFormElement';
import { StringService } from '../../../lib/common';
import { ErrorService } from '../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import { AdminProjectPageEntity } from '../../../lib/project/entities/admin-project-page.entity';
import { AdminProjectEntity } from '../../../lib/project/entities/admin-project.entity';
import { AdminProjectsStore } from '../../../lib/project/stores/admin-projects.store';
import { options } from '../../api/admin/auth/[...nextauth]';
import CardFormGraggable from '../../../components/Form/Draggable/CardFormDraggable';
import { arrayMove } from '@dnd-kit/sortable';
import { PositionEntity } from '../../../lib/common/entities/position.entity';
import { ProjectStatusEnum } from '../../../lib/project/types/project-status.enum';
import InputFormElement from '../../../components/Form/Elements/InputFormElement';
import NoData from '../../../components/Container/NoData';
import { useEffect, useRef } from 'react';
import AdminLayout from '../../../components/Container/Layout/AdminLayout';
import CustomProjectStatusPreview from '../../../components/Form/Custom/CustomProjectStatusPreview';

export default function () {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.admin.projects);
  const className =
    'max-w-96 md:max-w-[calc(49.5rem)] lg:max-w-[calc(74rem)] 2xl:max-w-[calc(99rem)]';

  const lock = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const autofocus = () => inputRef.current.focus();

    addEventListener('keydown', autofocus);
    return () => removeEventListener('keydown', autofocus);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      ErrorService.envelop(async () => {
        const page = await AdminProjectPageEntity.self.select.build({ page: 1, query: projects.query }); // prettier-ignore
        dispatch(AdminProjectsStore.actions.search(page as any));
      }).finally(() => (lock.current = false));
    }, 500);

    return () => clearTimeout(delay);
  }, [projects.query]);

  return (
    <AdminLayout title="Admin Projects">
      <div className={`flex mx-auto w-full my-4 ${className}`}>
        <div className="flex -ml-1 w-full max-w-72">
          <InputFormElement
            ref={inputRef}
            className="w-full"
            value={projects.query}
            placeholder="Search..."
            onChange={(v) => dispatch(AdminProjectsStore.actions.setQuery(v))}
            setOptions={{
              inputFocus:
                'bg-gray-100 focus:bg-white focus:ring-inset ring-gray-400',
              inputPadding: 'py-[calc(0.1875rem)] pl-8 pr-3',
              divClassName: 'relative',
              headComponent: (
                <FontAwesomeIcon
                  className="absolute py-0.5 inset-y-0 start-0 flex items-center ml-2 mt-1.5 pointer-events-none text-gray-500"
                  icon={faMagnifyingGlass}
                />
              ),
            }}
          />
        </div>
        <div className="flex ml-auto mr-2">
          <NextFormElement
            className={`${projects.trash ? 'hidden' : ''} mr-3`}
            setOptions={{ buttonPadding: 'py-1.5 px-3' }}
            next="New Project"
            onNext={() => router.push({ pathname: `${router.route}/create` })}
          />

          <NextFormElement
            className={`${projects.trash ? '' : 'hidden'} mr-2`}
            setOptions={{ buttonPadding: 'py-1.5 px-3' }}
            next="Delete projects..."
            onNext={() =>
              ErrorService.envelop(async () => {
                if (!projects.trash) return;
                for (const id in projects.trash) {
                  await AdminProjectEntity.self.delete.exec(id);
                }

                router.reload();
              })
            }
            onBack={() => dispatch(AdminProjectsStore.actions.clearTrash())}
          />

          <MenuFormElement
            disabled={!!projects.trash}
            name={<FontAwesomeIcon icon={faEllipsisVertical} />}
            className="mr-3"
            actions={PROJECTS_ACTIONS}
            setOptions={{
              buttonPadding: 'py-2 px-3.5',
              buttonColor:
                'bg-transparent border border-gray-400 hover:border-gray-500 hover:bg-gray-200 disabled:bg-gray-200 disabled:hover:border-gray-400',
              buttonTextColor: 'text-gray-700 disabled:text-gray-400',
              noChevronDown: true,
            }}
            onChange={(action) => {
              switch (action) {
                case 'create':
                  // prettier-ignore
                  return router.push({ pathname: `${router.route}/create` });

                case 'delete':
                  return dispatch(AdminProjectsStore.actions.initTrash());
              }
            }}
          />
        </div>
      </div>

      <NoData
        className={`h-[calc(100vh-9rem)] ${className} ${
          projects.result?.length ? 'hidden' : 'block'
        }`}
        title="No projects found"
      />
      <CardFormGraggable
        className={`overflow-x-hidden w-auto h-[calc(100vh-8rem)] ${
          projects.result?.length ? 'block' : 'hidden'
        }`}
        atBottomStateChange={() =>
          ErrorService.envelop(async () => {
            if (projects.result.length >= projects.total) return;
            dispatch(
              AdminProjectPageEntity.self.select.thunk({
                query: projects.query || null,
                page: projects.page + 1,
              }),
            ).unwrap();
          })
        }
        graggable={!projects.query}
        data={projects.result}
        picked={projects.picked}
        onDragStart={(e) =>
          dispatch(AdminProjectsStore.actions.onPick(e.active.id as string))
        }
        onDragEnd={({ active, over }) =>
          ErrorService.envelop(async () => {
            const position =
              projects.result.find((e) => e.id == over?.id)?.order ?? null;

            if (!over?.id || position === null) {
              return dispatch(AdminProjectsStore.actions.onDrop());
            }

            dispatch(
              AdminProjectsStore.actions.onReorder(
                arrayMove(
                  projects.result.concat() as any,
                  projects.result.findIndex((e) => e.id == active.id),
                  projects.result.findIndex((e) => e.id == over.id),
                ),
              ),
            );

            await AdminProjectEntity.self.save.build(
              new PositionEntity({ position }),
              {
                method: 'PUT',
                route: `admin/projects/${active.id}/order`,
              },
            );

            const saved = await Promise.all<any>(
              Array(projects.page)
                .fill(0)
                .map((_, index) =>
                  AdminProjectPageEntity.self.select.build({
                    query: projects.query || null,
                    page: index + 1,
                  }),
                ),
            );

            dispatch(AdminProjectsStore.actions.onReorderSaved(saved));
          })
        }
        onDragCancel={() => dispatch(AdminProjectsStore.actions.onDrop())}
        setOptions={{
          listClassName:
            'mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 max-w-96 md:max-w-[calc(49.5rem)] lg:max-w-[calc(74rem)] 2xl:max-w-[calc(99rem)]',
          itemClassName: 'pr-3 pb-3',
        }}
        cardComponent={{
          className: (project) => {
            if (!projects.trash) return '';
            return projects.trash[project.id]
              ? 'cursor-pointer line-through'
              : 'cursor-pointer';
          },
          name: (project) => project.name,
          description: (project) => project.description,
          img: (project) => project._avatar(),
          href: (project) => ({
            pathname: `${router.route}/[id]`,
            query: { id: project.id },
          }),
          headerComponent: (project) => (
            <CustomProjectStatusPreview
              project={project as any}
              onChange={(e) => dispatch(AdminProjectsStore.actions.replace(e))}
            />
          ),
          onClick: (project) => () => {
            if (!projects.trash) return;
            dispatch(AdminProjectsStore.actions.pushTrash(project as any));
          },
          // onFile: (project) => (file) => {
          //   ErrorService.envelop(async () => {
          //     await AttachmentService.thumbnail(file);
          //   });
          // },
          contextComponent: (project) => (
            <div className="flex text-sm items-center mt-1">
              <div className="flex items-center">
                <ProjectCircle type={project.type} />
                {project.type}
              </div>
              <div className="flex items-center ml-3 text-gray-600">
                <FontAwesomeIcon
                  className="text-gray-400 mr-1 pb-0.5"
                  icon={faFile}
                />
                {project.attachments.length}
              </div>
              <div className="flex items-center ml-3 text-gray-600">
                <FontAwesomeIcon
                  className="text-gray-400 mr-1 pb-0.5"
                  icon={faArrowUpRightFromSquare}
                />
                {project.links.length}
              </div>
            </div>
          ),
        }}
      />
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, options);
  if (!session) return { redirect: { destination: '/admin/login' } };

  return { props: ctx.params || {} };
}
