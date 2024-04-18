import { faFile } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import React, { forwardRef, useEffect } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import Breadcrumbs from '../../../components/Breadcrumbs/Breadcrumbs';
import Card from '../../../components/Card/Card';
import Container from '../../../components/Container/Container';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/Navbar';
import NavbarItem from '../../../components/Navbar/NavbarItem';
import { Config } from '../../../config';
import { NAVIGATION } from '../../../constants';
import { StringService } from '../../../lib/common';
import { ErrorService } from '../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import { AdminProjectPageEntity } from '../../../lib/project/entities/admin-project-page.entity';
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
          <Breadcrumbs className="px-6" path={['Home', 'Projects']} />
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
            >
              <div className="flex text-sm items-center mt-1">
                <div className="flex items-center">
                  <span
                    className={`h-3 w-3 rounded-full mr-1 ${
                      project.type == ProjectTypeEnum.html
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
