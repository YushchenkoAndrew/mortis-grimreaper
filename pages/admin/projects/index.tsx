import React from 'react';
import Breadcrumbs from '../../../components/Breadcrumbs/Breadcrumbs';
import Container from '../../../components/Container/Container';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/Navbar';
import NavbarItem from '../../../components/Navbar/NavbarItem';
import { Config } from '../../../config';
import { NAVIGATION } from '../../../constants';
// import defaultServerSideHandler from '../../lib/api/session';

export default function () {
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
        Actions={<Breadcrumbs path={['Home', 'Projects']} />}
      >
        {/* <div className="grid grid-cols-1 items-center gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-y-8">
          <Virtuoso
            data={projects}
            endReached={() =>
              ErrorService.envelop(
                dispatch(ProjectPageEntity.self.select({ page: page + 1 }))
                  .unwrap,
              )
            }
            increaseViewportBy={200}
            itemContent={(_, project) => (
              <Thumbnail
                key={project.id}
                img={project.thumbnail?.path || ''}
                title={project.name}
                href={StringService.href('projects', project.id)}
                description={project.description}
                curtain
              />
            )}
            // components={{ Footer }}
          />

          {new Array(20).fill(0).map((_, i) => (
            <Thumbnail
              key={i}
              img={`${Config.self.base.web}/img/CodeRain.webp`}
              title="Code Rain"
              href={`${Config.self.base}/CodeRain`}
              description="Take the blue pill and the site will close, or take the red pill and I show how deep the rabbit hole goes"
              curtain
            />
          ))}
        </div> */}
      </Container>
    </>
  );
}

// export const getServerSideProps = defaultServerSideHandler;
