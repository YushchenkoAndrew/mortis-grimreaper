import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ObjectLiteral } from '../../../lib/common/types';
import StageFormPreview, {
  StageFormPreviewProps,
} from '../Previews/StageFormPreview';

export interface StageFormSortableProps<T extends ObjectLiteral>
  extends Omit<StageFormPreviewProps<T>, 'headerComponent'> {
  id: string;
}

export default function StageFormSortable<T extends ObjectLiteral>(
  props: StageFormSortableProps<T>,
) {
  const { attributes, listeners, transform, transition, setNodeRef, isDragging } = useSortable({ id: props.id }); // prettier-ignore

  return (
    <div
      ref={setNodeRef}
      style={{ transition, transform: CSS.Transform.toString(transform) }}
    >
      <StageFormPreview
        {...props}
        headerComponent={
          <FontAwesomeIcon
            {...attributes}
            {...listeners}
            icon={faGripVertical}
            className={`text-gray-400 px-2 text-lg ml-auto focus:outline-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          />
        }
      />
    </div>
  );
}
