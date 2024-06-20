import { forwardRef, useEffect } from 'react';
import Thumbnail from '../../components/Thumbnail/Thumbnail';
import { useAppDispatch, useAppSelector } from '../../lib/common/store';
import { VirtuosoGrid } from 'react-virtuoso';
import { ErrorService } from '../../lib/common/error.service';
import { ProjectPageEntity } from '../../lib/project/entities/project-page.entity';
import { ProjectTypeEnum } from '../../lib/project/types/project-type.enum';
import DefaultLayout from '../../components/Container/Layout/DefaultLayout';
import { GetServerSidePropsContext } from 'next';
import { Config } from '../../config';
import { ProjectsStore } from '../../lib/project/stores/projects.store';

interface PropsT {
  projects: ProjectPageEntity;
}

export default function (props: PropsT) {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.project);

  const page = useAppSelector((state) => state.project.page);
  const request_id = useAppSelector((state) => state.project.request_id);

  useEffect(() => {
    const projects = ProjectPageEntity.self.build(props.projects);
    dispatch(ProjectsStore.actions.init(projects));
  }, []);

  useEffect(() => {
    if (request_id === null) return;

    let ignore = false;
    const delay = setTimeout(() => {
      ErrorService.envelop(async () => {
        const projects = await ProjectPageEntity.self.select.build({ page }); // prettier-ignore
        if (!ignore) dispatch(ProjectsStore.actions.push(projects));
      });
    }, 100);

    return () => ((ignore = true), clearTimeout(delay));
  }, [page]);

  return (
    <DefaultLayout title="Mortis Projects">
      <VirtuosoGrid
        className="overflow-x-hidden w-auto h-[calc(100vh-4rem)]"
        style={{ height: null }}
        data={projects.result}
        atBottomStateChange={() =>
          dispatch(ProjectsStore.actions.setPage(page + 1))
        }
        components={{
          List: forwardRef(({ children, className, style, ...props }, ref) => (
            <div
              ref={ref}
              {...props}
              className={`grid mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 max-w-full 2xl:max-w-[calc(120rem)] ${
                className || ''
              }`}
              style={style}
            >
              {children}
            </div>
          )),
          Item: ({ className, children, ...props }: any): any => (
            <div {...props} className={className}>
              {children}
            </div>
          ),
        }}
        itemContent={(_, project) => (
          <Thumbnail
            key={project.id}
            img={project._avatar()}
            name={project.name}
            href={`${window.location.href}/${project.id}`}
            barcode={projects.barcode[project.id]}
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
    </DefaultLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const projects: ProjectPageEntity = await ProjectPageEntity.self.select
    .build({ page: 1 }, { hostname: Config.self.base.grape, ctx })
    .then((res) => JSON.parse(JSON.stringify(res)))
    .catch(() => null);

  return { props: { ...ctx.params, projects } };
}
