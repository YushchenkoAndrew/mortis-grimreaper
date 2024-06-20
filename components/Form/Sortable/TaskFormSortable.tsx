import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import { AdminTaskFormStore } from '../../../lib/dashboard/stores/admin-task-form.store';
import TaskFormPreview from '../Previews/TaskFormPreview';
import TaskStatsPreview from '../Previews/TaskStatsPreview';

export interface TaskFormSortableProps {
  id: string;
  stage_id: string;
}

export default function TaskFormSortable(props: TaskFormSortableProps) {
  const dispatch = useAppDispatch();
  const task = useAppSelector((state) => state.admin.dashboard.index.stages.find(e => e.id == props.stage_id)?.tasks.find(e => e.id == props.id)); // prettier-ignore
  const { attributes, listeners, transform, transition, setNodeRef, isDragging } = useSortable({ id: props.id }); // prettier-ignore

  return (
    <div
      ref={setNodeRef}
      style={{ transition, transform: CSS.Transform.toString(transform) }}
      {...listeners}
      {...attributes}
    >
      <TaskFormPreview
        name={task.name}
        description={task.description}
        blur={isDragging}
        onClick={() =>
          dispatch(
            AdminTaskFormStore.actions.init([props.stage_id, task as any]),
          )
        }
        contextComponent={<TaskStatsPreview task={task} />}
      />
    </div>
  );
}
