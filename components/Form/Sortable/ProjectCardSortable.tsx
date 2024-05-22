import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import { useSortable } from '@dnd-kit/sortable';
import { memo, useMemo } from 'react';
import CardFormPreview from '../Previews/CardFormPreview';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/router';
import { AdminProjectsStore } from '../../../lib/project/stores/admin-projects.store';
import { ProjectCircle } from '../../constants/projects';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowUpRightFromSquare,
  faGripVertical,
  faHashtag,
} from '@fortawesome/free-solid-svg-icons';
import TooltipFormPreview from '../Previews/TooltipFormPreview';
import CustomProjectStatusPreview from '../Custom/Previews/CustomProjectStatusPreview';

export interface ProjectCardSortableProps {
  id: string;
}

export default memo(function ProjectCardSortable(
  props: ProjectCardSortableProps,
) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const trash = useAppSelector((state) => state.admin.projects.trash);
  const project = useAppSelector((state) => state.admin.projects.result.find(e => e.id == props.id)); // prettier-ignore
  const { transform, transition, setNodeRef, isDragging, attributes, listeners, } = useSortable({ id: props.id }); // prettier-ignore

  if (!project) return <></>;

  return (
    <CardFormPreview
      ref={setNodeRef}
      style={{ transition, transform: CSS.Transform.toString(transform) }}
      className={
        !trash
          ? ''
          : trash[project.id]
          ? 'cursor-pointer line-through'
          : 'cursor-pointer'
      }
      name={project.name}
      href={{
        pathname: `${router.route}/[id]`,
        query: { id: project.id },
      }}
      img={project._avatar()}
      description={project.description}
      setOptions={{ loading: isDragging }}
      headerComponent={
        <>
          <CustomProjectStatusPreview
            project={project as any}
            onChange={(e) => dispatch(AdminProjectsStore.actions.replace(e))}
          />
          <FontAwesomeIcon
            {...attributes}
            {...listeners}
            icon={faGripVertical}
            className={`text-gray-400 text-lg ml-auto focus:outline-none ${
              ''
              // props.graggable === false ? 'invisible' : ''
            } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          />
        </>
      }
      onClick={() =>
        trash && dispatch(AdminProjectsStore.actions.pushTrash(project))
      }
      contextComponent={
        <div className="flex text-sm items-center mt-1">
          <div className="flex items-center">
            <ProjectCircle type={project.type} />
            {project.type}
          </div>
          <div className="flex items-center ml-3 text-gray-600">
            <FontAwesomeIcon
              className="text-gray-400 mr-1 pb-0.5"
              icon={faFile}
            />
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
      }
    />
  );
});
