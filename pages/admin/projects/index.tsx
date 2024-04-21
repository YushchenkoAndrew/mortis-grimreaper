import { faFile } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import React, { forwardRef, useEffect } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import Breadcrumbs from '../../../components/Breadcrumbs/Breadcrumbs';
import Card from '../../../components/Card/Card';
import {
  PROJECTS_ACTIONS,
  PROJECT_FILE_ACTIONS,
} from '../../../components/constants/projects';
import Container from '../../../components/Container/Container';
import CustomMenuFormElement from '../../../components/Form/Custom/CustomMenuFormElement';
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
import { AdminProjectsStore } from '../../../lib/project/stores/admin-projects.store';
import { ProjectTypeEnum } from '../../../lib/project/types/project-type.enum';
import { options } from '../../api/admin/auth/[...nextauth]';

export default function () {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.admin.projects);

  useEffect(() => {
    nextPage();
  }, []);

  const nextPage = () =>
    ErrorService.envelop(async () => {
      if (projects.result.length >= projects.total) return;
      dispatch(
        AdminProjectPageEntity.self.select.thunk({ page: projects.page + 1 }),
      ).unwrap();
    });

  console.log(projects);

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
              <MenuFormElement
                noChevronDown
                name={<FontAwesomeIcon icon={faEllipsisVertical} />}
                actions={PROJECTS_ACTIONS}
                setOptions={{
                  buttonPadding: 'py-2 px-3.5',
                  buttonColor:
                    'bg-transparent border border-gray-400 hover:border-gray-500 hover:bg-gray-200',
                  buttonTextColor: 'text-gray-700 ',
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

              <NextFormElement
                className="ml-auto pr-3"
                setOptions={{ buttonPadding: 'py-1.5 px-3' }}
                next="New Project"
                onNext={() =>
                  router.push({ pathname: `${router.route}/create` })
                }
              />
            </div>

            {/* <CustomMenuFormElement
              next="Delete projects..."
              actions={PROJECTS_ACTIONS}
              isSubmitButton={!!projects.trash}
              onChange={(action) => {
                switch (action) {
                }
              }}
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
            /> */}
          </div>
        }
      >
        <VirtuosoGrid
          data={projects.result}
          className="overflow-x-hidden w-auto h-[calc(100vh-8rem)]"
          style={{ height: null }}
          endReached={() => nextPage()}
          components={{
            List: forwardRef(({ children, className, style }, ref) => (
              <div
                ref={ref}
                className={`grid mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 max-w-96 md:max-w-[calc(49.5rem)] lg:max-w-[calc(74rem)] 2xl:max-w-[calc(99rem)] ${
                  className || ''
                }`}
                style={style}
              >
                {children}
              </div>
            )),
            Item: (props: any) => (
              <div className={`pr-3 pb-3 ${props.className || ''}`}>
                {props.children}
              </div>
            ),
          }}
          itemContent={(_, project) => (
            <Card
              className={
                projects.trash
                  ? projects.trash[project.id]
                    ? 'cursor-pointer line-through'
                    : 'cursor-pointer'
                  : ''
              }
              name={project.name}
              href={{
                pathname: `${router.route}/[id]`,
                query: { id: project.id },
              }}
              img={project._avatar()}
              description={
                project.description ||
                `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.`
              }
              header={
                <span className="text-xs font-normal leading-4 mx-2 px-1 rounded-xl border border-gray-400 text-gray-500 ">
                  {StringService.humanize(project.status)}
                </span>
              }
              onClick={() => {
                if (!projects.trash) return;
                dispatch(AdminProjectsStore.actions.pushTrash(project as any));
              }}
            >
              <div className="flex text-sm items-center mt-1">
                <div className="flex items-center">
                  <span
                    className={`h-3 w-3 rounded-full mr-1 ${
                      project.type == ProjectTypeEnum.p5js
                        ? 'bg-red-500'
                        : project.type == ProjectTypeEnum.emscripten
                        ? 'bg-lime-400'
                        : project.type == ProjectTypeEnum.html
                        ? 'bg-orange-400'
                        : project.type == ProjectTypeEnum.markdown
                        ? 'bg-red-400'
                        : project.type == ProjectTypeEnum.link
                        ? 'bg-cyan-500'
                        : project.type == ProjectTypeEnum.k3s
                        ? 'bg-blue-400'
                        : 'border border-gray-500'
                    }`}
                  />
                  {project.type}
                </div>
                <div className="flex items-center ml-3 text-gray-600">
                  <FontAwesomeIcon
                    className="text-gray-400 mr-1 pb-0.5"
                    icon={faFile}
                  />
                  {project.attachments.length}
                </div>
              </div>
            </Card>
          )}
          // components={{ Footer }}
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
