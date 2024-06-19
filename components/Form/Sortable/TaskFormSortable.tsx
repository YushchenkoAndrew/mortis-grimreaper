import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { faFile, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowUpRightFromSquare,
  faGripVertical,
  faHashtag,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import { AdminTaskFormStore } from '../../../lib/dashboard/stores/admin-task-form.store';
import TaskFormPreview from '../Previews/TaskFormPreview';

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
        contextComponent={
          <div className="flex mt-2 text-xs text-gray-500 space-x-2">
            <div className="flex items-center">
              <FontAwesomeIcon className="mr-1.5 pb-0.5" icon={faFile} />
              {task?.attachments?.length || 0}
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon
                className="mr-1 pb-0.5"
                icon={faArrowUpRightFromSquare}
              />
              {task?.links?.length || 0}
            </div>
            <div className="group flex items-center">
              <FontAwesomeIcon className="mr-1 pb-0.5" icon={faHashtag} />
              {task?.tags?.length || 0}
            </div>
            <div
              className={`group items-center ${
                task?.contexts?.[0] ? 'flex' : 'hidden'
              }`}
            >
              <FontAwesomeIcon className="mr-1 pb-0.5" icon={faSquareCheck} />
              {task?.contexts?.[0]?.outOf().join('/')}
            </div>
          </div>
        }
      />
    </div>
  );
}
