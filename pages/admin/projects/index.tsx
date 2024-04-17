import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import React, { useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import Breadcrumbs from '../../../components/Breadcrumbs/Breadcrumbs';
import Container from '../../../components/Container/Container';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/Navbar';
import NavbarItem from '../../../components/Navbar/NavbarItem';
import { Config } from '../../../config';
import { NAVIGATION } from '../../../constants';
import { ErrorService } from '../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import { AdminProjectPageEntity } from '../../../lib/project/entities/admin-project-page.entity';
import { options } from '../../api/admin/auth/[...nextauth]';

export default function () {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.admin.projects);

  useEffect(() => {
    ErrorService.envelop(async () => {
      dispatch(AdminProjectPageEntity.self.select.thunk({ page: 1 })).unwrap();
    });
  }, []);

  console.log(projects);

  return (
    <>
      <Header title="Admin Projects"></Header>

      <Container
        Navbar={
          <Navbar
            Item={NavbarItem}
            navigation={NAVIGATION.admin}
            avatar={Config.self.github}
          />
        }
        Breadcrumbs={<Breadcrumbs path={['Home', 'Projects']} />}
      >
        <div className="grid grid-cols-1 items-center gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-y-8">
          <Virtuoso
            data={projects.result}
            endReached={
              () => []
              // ErrorService.envelop(
              //   dispatch(ProjectPageEntity.self.select({ page: page + 1 }))
              //     .unwrap,
              // )
            }
            increaseViewportBy={200}
            itemContent={
              (_, project) => <p>{project.id}</p>
              // <Thumbnail
              //   key={project.id}
              //   img={project.thumbnail?.path || ''}
              //   title={project.name}
              //   href={StringService.href('projects', project.id)}
              //   description={project.description}
              //   curtain
              // />
            }
            // components={{ Footer }}
          />
        </div>
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, options);
  if (!session) return { redirect: { destination: '/admin/login' } };

  return { props: ctx.params || {} };
}
