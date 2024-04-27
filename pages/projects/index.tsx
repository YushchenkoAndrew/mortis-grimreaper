import { useEffect } from 'react';
import { toast } from 'react-toastify';

import Thumbnail from '../../components/Thumbnail/Thumbnail';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import { Config } from '../../config';
import { StringService } from '../../lib/common';
import { useAppDispatch, useAppSelector } from '../../lib/common/store';
import GlitchItem from '../../components/Navbar/GlitchItem';
import Container from '../../components/Container/Container';
import {
  NAVIGATION,
  PUBLIC_FONT_4BITFONT,
  PUBLIC_FONT_ABSTRACT,
  PUBLIC_FONT_ROBOTO,
} from '../../constants';
import { Virtuoso } from 'react-virtuoso';
import { ErrorService } from '../../lib/common/error.service';
import { ProjectPageEntity } from '../../lib/project/entities/project-page.entity';

export default function () {
  const dispatch = useAppDispatch();
  const { page, projects } = useAppSelector((state) => state.project);

  useEffect(() => {
    dispatch(ProjectPageEntity.self.select.thunk({ page: 1 }))
      .unwrap()
      .catch((err) => toast(err.message, { type: 'error' }));
  }, []);

  return (
    <>
      <Header
        title="Mortis Projects"
        fonts={[PUBLIC_FONT_4BITFONT, PUBLIC_FONT_ABSTRACT, PUBLIC_FONT_ROBOTO]}
      ></Header>

      <Container
        Navbar={
          <Navbar
            Item={GlitchItem}
            navigation={NAVIGATION.default}
            avatar={Config.self.github}
          />
        }
        // Breadcrumbs={<Breadcrumbs path={['Home', 'Projects']} />}
      >
        <div className="grid grid-cols-1 items-center gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-y-8">
          <Virtuoso
            data={projects}
            endReached={() =>
              ErrorService.envelop(
                dispatch(
                  ProjectPageEntity.self.select.thunk({ page: page + 1 }),
                ).unwrap,
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
        </div>
      </Container>

      <main role="main">
        {/*   <div className="container mt-5">
          <div className="card-columns">
            <ProjectCard
              img={`${Config.self.base}/img/ApproximatingPiValue.webp`}
              title="Find Pi with RNG"
              href={`${Config.self.base}/ApproximatingPiValue`}
              description="Plz RNG Gods, I need to gacha the Pi value"
            />
            <ProjectCard
              img={`${Config.self.base}/img/CodeRain.webp`}
              title="Code Rain"
              size="lg"
              href={`${Config.self.base}/CodeRain`}
              description="Take the blue pill and the site will close, or take the red pill and I show how deep the rabbit hole goes"
            />
            <ProjectCard
              img={`${Config.self.base}/img/HammingCode.webp`}
              title="Hamming Code"
              href={`${Config.self.base}/HammingCode`}
              description="The first algorithm for Error correction"
            />
            <ProjectCard
              img={`${Config.self.base}/img/Minecraft.webp`}
              title="3D Engine"
              size="lg"
              href={`${Config.self.base}/Minecraft`}
              description="Yet another Minecraft clone"
            />
            <ProjectCard
              img={`${Config.self.base}/img/ReactionDiffusion.webp`}
              title="Reaction Diffusion"
              href={`${Config.self.base}/ReactionDiffusion`}
              description="Haha, chemical elements go brrrrr "
            />
            <ProjectCard
              img={`${Config.self.base}/img/ShadowCasting.webp`}
              title="Shadow Casting"
              href={`${Config.self.base}/ShadowCasting`}
              description="Caveman discover shadow. Ugh, Uugh pretty shade"
            />

            <ProjectCard
              img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
              title="Some text"
              href="#"
              size="lg"
              description="Some small text which is no so important, but still it's good to have"
            />
          </div>
        </div> */}

        <div className="container mt-5">
          {/* <InfiniteScroll
            className="row text-center"
            dataLength={projects[0].length}
            next={() => loadProjects()}
            hasMore={hasMore}
            loader={
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            }
          >
            {projects.map((chunk, i) => {
              if (!chunk.length) return null;
              return (
                <div key={i} className="col-12 col-lg-4 col-md-6 px-2">
                  {chunk.map((item, j) => {
                    const img = item.files.map(
                      (file) => `${voidUrl}/${item.name}/${formPath(file)}`
                    );
                    return (
                      <ProjectCard
                        key={j}
                        title={item.title}
                        img={img.length > 1 ? img : img[0]}
                        target={
                          item.flag === "Link" || item.flag === "Docker"
                            ? "_blank"
                            : "_self"
                        }
                        href={`${basePath}/${item.name}`}
                        description={item.desc}
                      />
                    );
                  })}
                </div>
              );
            })}
          </InfiniteScroll> */}
        </div>
      </main>

      {/* <DefaultFooter name="Menu" background>
        <ul className="list-unstyled">
          <DefaultNav style="text-muted" />
        </ul>
      </DefaultFooter> */}
    </>
  );
}
