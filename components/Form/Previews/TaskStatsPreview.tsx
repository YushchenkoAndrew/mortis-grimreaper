import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowUpRightFromSquare,
  faHashtag,
} from '@fortawesome/free-solid-svg-icons';
import { DeepEntity } from '../../../lib/common/types';
import { TaskEntity } from '../../../lib/dashboard/entities/task.entity';

export interface TaskStatsPreviewProps<T extends TaskEntity> {
  task: DeepEntity<T>;
}

export default function TaskStatsPreview<T extends TaskEntity>({
  task,
}: TaskStatsPreviewProps<T>) {
  return (
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
  );
}
