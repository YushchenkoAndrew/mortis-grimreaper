import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProjectEntity } from '../../../lib/project/entities/project.entity';
import { ProjectCircle } from '../../constants/projects';
import TooltipFormPreview from './TooltipFormPreview';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowUpRightFromSquare,
  faHashtag,
} from '@fortawesome/free-solid-svg-icons';
import { DeepEntity } from '../../../lib/common/types';

export interface ProjectStatsPreviewProps<T extends ProjectEntity> {
  project: DeepEntity<T>;
}

export default function ProjectStatsPreview<T extends ProjectEntity>({
  project,
}: ProjectStatsPreviewProps<T>) {
  return (
    <div className="flex text-sm items-center mt-1">
      <div className="flex items-center">
        <ProjectCircle type={project.type} />
        {project.type}
      </div>
      <div className="flex items-center ml-3 text-gray-600">
        <FontAwesomeIcon className="text-gray-400 mr-1 pb-0.5" icon={faFile} />
        {project.attachments.length}
      </div>
      <div className="flex items-center ml-3 text-gray-600">
        <FontAwesomeIcon
          className="text-gray-400 mr-1 pb-0.5"
          icon={faArrowUpRightFromSquare}
        />
        {project.links.length}
      </div>
      <div className="group flex items-center ml-3 text-gray-600 cursor-pointer">
        <FontAwesomeIcon
          className="text-gray-400 mr-1 pb-0.5"
          icon={faHashtag}
        />
        {project.tags.length}
        <TooltipFormPreview
          value={project.tags.map((e) => e.name).join()}
          setOptions={{
            color: 'bg-gray-600 text-white',
            rounded: 'rounded-lg',
            margin: 'mt-14',
          }}
        />
      </div>
    </div>
  );
}
