import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ErrorService } from '../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import { AdminDashboardCollection } from '../../../lib/dashboard/collections/admin-dashboard.collection';
import { AdminStageEntity } from '../../../lib/dashboard/entities/admin-stage.entity';
import { AdminTaskEntity } from '../../../lib/dashboard/entities/admin-task.entity';
import { AdminDashboardStore } from '../../../lib/dashboard/stores/admin-dashboard.store';
import { AdminTaskFormStore } from '../../../lib/dashboard/stores/admin-task-form.store';
import StageFormPreview from '../Previews/StageFormPreview';
import TaskFormSortable from './TaskFormSortable';
export interface StageFormSortableProps {
  id: string;
}

export default function StageFormSortable(props: StageFormSortableProps) {
  const dispatch = useAppDispatch();
  const stage = useAppSelector((state) => state.admin.dashboard.index.stages.find(e => e.id == props.id)); // prettier-ignore
  const { attributes, listeners, transform, transition, setNodeRef, isDragging } = useSortable({ id: props.id }); // prettier-ignore

  return (
    <div
      ref={setNodeRef}
      style={{ transition, transform: CSS.Transform.toString(transform) }}
    >
      <StageFormPreview
        listeners={listeners}
        attributes={attributes}
        blur={isDragging}
        name={stage.name}
        onChange={(value) =>
          dispatch(AdminDashboardStore.actions.setStageName([stage.id, value]))
        }
        actions={{ delete: 'Delete Stage' }}
        onSubmit={() =>
          ErrorService.envelop(async () => {
            await dispatch(AdminStageEntity.self.save.thunk(stage));
            await dispatch(AdminDashboardCollection.self.select.thunk({})); // prettier-ignore
          })
        }
        onTaskCreate={() =>
          dispatch(
            AdminTaskFormStore.actions.init([
              stage.id,
              new AdminTaskEntity({ id: 'null' }),
            ]),
          )
        }
        onAction={(action) => {
          switch (action) {
            case 'delete':
              return dispatch(AdminDashboardStore.actions.pushTrash(stage));
          }
        }}
      >
        <SortableContext
          items={stage.tasks}
          strategy={verticalListSortingStrategy}
        >
          {stage.tasks.map((task) => (
            <TaskFormSortable key={task.id} id={task.id} stage_id={stage.id} />
          ))}
        </SortableContext>
      </StageFormPreview>
    </div>
  );
}
