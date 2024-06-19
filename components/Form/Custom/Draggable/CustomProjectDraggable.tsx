import { PositionEntity } from '../../../../lib/common/entities/position.entity';
import { ErrorService } from '../../../../lib/common/error.service';
import { AdminProjectEntity } from '../../../../lib/project/entities/admin-project.entity';
import { useAppDispatch, useAppSelector } from '../../../../lib/common/store';
import { arrayMove } from '@dnd-kit/sortable';
import { memo } from 'react';
import CardFormDraggable, {
  CardFormGraggableProps,
} from '../../Draggable/CardFormDraggable';
import { AdminProjectPageEntity } from '../../../../lib/project/entities/admin-project-page.entity';
import { AdminProjectsStore } from '../../../../lib/project/stores/admin-projects.store';
import { ProjectEntity } from '../../../../lib/project/entities/project.entity';
import { OrderableTypeEnum } from '../../../../lib/common/types/orderable-type.enum';

export interface CustomProjectDraggableProps
  extends Pick<CardFormGraggableProps<ProjectEntity>, 'CardComponent'> {}

export default memo(function CustomProjectDraggable(
  props: CustomProjectDraggableProps,
) {
  const dispatch = useAppDispatch();

  const page = useAppSelector((state) => state.admin.projects.page);
  const picked = useAppSelector((state) => state.admin.projects.picked);
  const projects = useAppSelector((state) => state.admin.projects.result);

  return (
    <CardFormDraggable
      className={`overflow-x-hidden w-auto h-[calc(100vh-8rem)] ${
        projects?.length ? 'block' : 'hidden'
      }`}
      atBottomStateChange={() =>
        dispatch(AdminProjectsStore.actions.setPage(page + 1))
      }
      // graggable={!query}
      data={projects}
      picked={picked}
      onDragStart={(e) =>
        dispatch(AdminProjectsStore.actions.onPick(e.active.id as string))
      }
      onDragEnd={({ active, over }) =>
        ErrorService.envelop(async () => {
          const position =
            projects.find((e) => e.id == over?.id)?.order ?? null;

          if (!over?.id || position === null) {
            return dispatch(AdminProjectsStore.actions.onDrop());
          }

          dispatch(
            AdminProjectsStore.actions.onReorder(
              arrayMove(
                projects.map((e) => new AdminProjectEntity(e as any)),
                projects.findIndex((e) => e.id == active.id),
                projects.findIndex((e) => e.id == over.id),
              ),
            ),
          );

          const body = new PositionEntity({ position, id: active.id, orderable: OrderableTypeEnum.attachments }); // prettier-ignore

          await PositionEntity.self.save.build(body);
          const saved = await Promise.all<any>(
            Array(page)
              .fill(0)
              .map((_, index) =>
                AdminProjectPageEntity.self.select.build({ page: index + 1 }),
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
      CardComponent={props.CardComponent}
    />
  );
});
