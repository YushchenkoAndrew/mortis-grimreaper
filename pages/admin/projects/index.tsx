import { faFile } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowUpRightFromSquare,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import {
  ProjectCircle,
  PROJECTS_ACTIONS,
} from '../../../components/constants/projects';
import Container from '../../../components/Container/Container';
import MenuFormElement from '../../../components/Form/Elements/MenuFormElement';
import NextFormElement from '../../../components/Form/Elements/NextFormElement';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/Navbar';
import NavbarItem from '../../../components/Navbar/NavbarItem';
import { Config } from '../../../config';
import { NAVIGATION } from '../../../constants';
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

export default function () {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.admin.projects);

  return (
    <>
      <Header title="Admin Projects"></Header>

      <Container
        className="overflow-y-hidden w-full h-[calc(100vh-4rem)]"
        Navbar={
          <Navbar
            Item={NavbarItem}
            navigation={NAVIGATION.admin}
            avatar={Config.self.github}
          />
        }
        Breadcrumbs={
          <div className="flex mx-auto w-full max-w-96 md:max-w-[calc(49.5rem)] lg:max-w-[calc(74rem)] 2xl:max-w-[calc(99rem)]">
            <div className="flex ml-auto">
              <NextFormElement
                className={`${projects.trash ? 'hidden' : ''} mr-3`}
                setOptions={{ buttonPadding: 'py-1.5 px-3' }}
                next="New Project"
                onNext={() =>
                  router.push({ pathname: `${router.route}/create` })
                }
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
        }
      >
        <CardFormGraggable
          className="overflow-x-hidden w-auto h-[calc(100vh-8rem)]"
          atBottomStateChange={() =>
            ErrorService.envelop(async () => {
              if (projects.result.length >= projects.total) return;
              dispatch(
                AdminProjectPageEntity.self.select.thunk({
                  page: projects.page + 1,
                }),
              ).unwrap();
            })
          }
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
                  .map((_, index) => AdminProjectPageEntity.self.select.build({ page: index + 1 })), // prettier-ignore
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
              <span className="text-xs font-normal leading-4 mx-2 px-1 rounded-xl border border-gray-400 text-gray-500 ">
                {StringService.humanize(project.status)}
              </span>
            ),
            onClick: (project) => () => {
              if (!projects.trash) return;
              dispatch(AdminProjectsStore.actions.pushTrash(project as any));
            },
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
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, options);
  if (!session) return { redirect: { destination: '/admin/login' } };

  return { props: ctx.params || {} };
}
