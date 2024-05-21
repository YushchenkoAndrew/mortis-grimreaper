import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StageFormPreview, {
  StageFormPreviewProps,
} from '../Previews/StageFormPreview';

export interface StageFormSortableProps
  extends Omit<StageFormPreviewProps, 'headerComponent'> {
  id: string;
}

export default function StageFormSortable(props: StageFormSortableProps) {
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

        // ref={setNodeRef}
        // className={props.cardComponent.className?.(data)}
        // name={props.cardComponent.name(data)}
        // href={props.cardComponent.href(data)}
        // img={props.cardComponent.img(data)}
        // description={props.cardComponent.description?.(data)}
        // headerComponent={<HeaderComponent data={data} />}
        // contextComponent={props.cardComponent.contextComponent?.(data)}
        // onClick={props.cardComponent.onClick?.(data)}
        // onFile={props.cardComponent.onFile?.(data)}
        // setOptions={{ loading: isDragging }}
      />
    </div>
  );
}
