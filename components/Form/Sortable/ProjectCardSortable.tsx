import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import { useSortable } from '@dnd-kit/sortable';
import { memo } from 'react';
import CardFormPreview from '../Previews/CardFormPreview';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/router';
import { AdminProjectsStore } from '../../../lib/project/stores/admin-projects.store';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import CustomProjectStatusPreview from '../Custom/Previews/CustomProjectStatusPreview';
import ProjectStatsPreview from '../Previews/ProjectStatsPreview';

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
      // img={thumbnail}
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
      contextComponent={<ProjectStatsPreview project={project} />}
    />
  );
});
