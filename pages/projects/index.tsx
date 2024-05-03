import { forwardRef } from 'react';
import Thumbnail from '../../components/Thumbnail/Thumbnail';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import { Config } from '../../config';
import { useAppDispatch, useAppSelector } from '../../lib/common/store';
import GlitchItem from '../../components/Navbar/GlitchItem';
import Container from '../../components/Container/Container';
import {
  NAVIGATION,
  PUBLIC_FONT_4BITFONT,
  PUBLIC_FONT_ABSTRACT,
  PUBLIC_FONT_ROBOTO,
} from '../../constants';
import { VirtuosoGrid } from 'react-virtuoso';
import { ErrorService } from '../../lib/common/error.service';
import { ProjectPageEntity } from '../../lib/project/entities/project-page.entity';
import { ProjectTypeEnum } from '../../lib/project/types/project-type.enum';

export default function () {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.project);

  return (
    <>
      <Header
        title="Mortis Projects"
        fonts={[PUBLIC_FONT_4BITFONT, PUBLIC_FONT_ABSTRACT, PUBLIC_FONT_ROBOTO]}
      ></Header>

      <Container
        className="overflow-y-hidden w-full h-[calc(100vh-4rem)]"
        Navbar={
          <Navbar
            Item={GlitchItem}
            navigation={NAVIGATION.default}
            avatar={Config.self.github}
          />
        }
        // Breadcrumbs={<Breadcrumbs path={['Home', 'Projects']} />}
      >
        {/* <div className="grid grid-cols-1 items-center gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-y-8"> */}
        <VirtuosoGrid
          className="overflow-x-hidden w-auto h-[calc(100vh-4rem)]"
          style={{ height: null }}
          data={projects.result}
          atBottomStateChange={() =>
            ErrorService.envelop(async () => {
              if (projects.result.length >= projects.total) return;
              dispatch(
                ProjectPageEntity.self.select.thunk({
                  page: projects.page + 1,
                }),
              ).unwrap();
            })
          }
          components={{
            List: forwardRef(({ children, className, style }, ref) => (
              <div
                ref={ref}
                className={`grid mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 max-w-full 2xl:max-w-[calc(120rem)] ${
                  className || ''
                }`}
                style={style}
              >
                {children}
              </div>
            )),
            Item: ({ className, children }: any): any => (
              <div className={className}>{children}</div>
            ),
          }}
          itemContent={(index, project) => (
            <Thumbnail
              key={project.id}
              img={project._avatar()}
              name={project.name}
              href={`${window.location.href}/${project.id}`}
              barcode={projects.random == index}
              target={project.type == ProjectTypeEnum.link && '_blank'}
              description={project.description}
              setOptions={{
                imgSize:
                  'h-[calc(100vw-1rem)] sm:h-[calc(100vw/2-0.5rem)] md:h-[calc(100vw/3-0.35rem)] lg:h-[calc(100vw/4-0.25rem)] 2xl:h-[calc(100vw/5-0.25rem)] aspect-1',
              }}
              curtain
            />
          )}
          // components={{ Footer }}
        />
      </Container>
    </>
  );
}
