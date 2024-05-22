import { forwardRef } from 'react';
import Thumbnail from '../../components/Thumbnail/Thumbnail';
import { useAppDispatch, useAppSelector } from '../../lib/common/store';
import { VirtuosoGrid } from 'react-virtuoso';
import { ErrorService } from '../../lib/common/error.service';
import { ProjectPageEntity } from '../../lib/project/entities/project-page.entity';
import { ProjectTypeEnum } from '../../lib/project/types/project-type.enum';
import DefaultLayout from '../../components/Container/Layout/DefaultLayout';

export default function () {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.project);

  return (
    <DefaultLayout title="Mortis Projects">
      <VirtuosoGrid
        className="overflow-x-hidden w-auto h-[calc(100vh-4rem)]"
        style={{ height: null }}
        data={projects.result}
        atBottomStateChange={() =>
          ErrorService.envelop(async () => {
            if (projects.result.length >= projects.total) return;
            dispatch(
              ProjectPageEntity.self.select.thunk({ page: projects.page + 1 }), // prettier-ignore
            ).unwrap();
          })
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
