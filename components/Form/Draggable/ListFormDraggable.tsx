import {
  closestCenter,
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ObjectLiteral, OnlyStringValueOf } from '../../../lib/common/types';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Dispatch, ReactNode, useMemo } from 'react';
import KeyValueFormElement, {
  KeyValueFormElementProps,
} from '../Elements/KeyValueFormElement';

type EntityT = { id: string; name: string };

export interface ListFormGraggableProps<T extends ObjectLiteral & EntityT>
  extends Omit<KeyValueFormElementProps, 'contextComponent' | 'values'> {
  onDragStart?: Dispatch<DragStartEvent>;
  onDragCancel?: Dispatch<DragCancelEvent>;
  onDragEnd?: Dispatch<DragEndEvent>;

  preview: [OnlyStringValueOf<T>, OnlyStringValueOf<T>];
  values: T[];
  onDelete: Dispatch<number>;
  onClick?: Dispatch<T>;

  iconComponent?: (obj: T) => ReactNode;
}

export default function ListFormGraggable<T extends ObjectLiteral & EntityT>(
  props: ListFormGraggableProps<T>,
) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 2 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 2 } }),
  );

  const index = useMemo(() => props.values.length - 1, [props.values]);
  const [last, init] = useMemo(() => {
    return [props.values.at(-1), props.values.slice(0, -1)];
  }, [props.values]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(event) => props.onDragStart?.(event)}
      onDragEnd={(event) => props.onDragEnd?.(event)}
      onDragCancel={(event) => props.onDragCancel?.(event)}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
    >
      <KeyValueFormElement
        {...props}
        onChange={(key, value) => props.onChange(key, value, index)}
        values={last ? [props.preview.map((k) => last[k]) as any] : []}
        contextComponent={
          <div>
            <SortableContext
              items={init}
              strategy={verticalListSortingStrategy}
            >
              {init.map((link, index) => (
                <Preview
                  key={link.id}
                  data={link}
                  onClick={props.onClick}
                  prefix={props.iconComponent?.(link)}
                  onDelete={() => props.onDelete(index)}
                />
              ))}
            </SortableContext>
          </div>
        }
      />
    </DndContext>
  );
}

function Preview(props: {
  data: EntityT;
  prefix?: ReactNode;
  onClick?: Dispatch<EntityT>;
  onDelete: Dispatch<void>;
}) {
  const { attributes, listeners, transform, transition, setNodeRef, isDragging } = useSortable({ id: props.data.id }); // prettier-ignore
  // TODO:
  // const [rename, setName] = useState(null);

  // const [focused, onFocus] = useState(props.data.name);
  // const [styles, setStyles] = useState<ObjectLiteral>(null);

  // const blurRef = useRef(false);
  // // blurRef.current = props.blur;
  // blurRef.current = true;

  // useEffect(() => {
  //   let ignore = false;
  //   const delay = setTimeout(() => {
  //     if (ignore) return;
  //     if (blurRef.current) return setStyles(null);
  //     setStyles({
  //       inputFont:
  //         'text-sm font-bold bg-transparent focus:bg-gray-700 cursor-pointer focus:cursor-text',
  //       inputFocus: 'focus:ring-2 focus:ring-blue-600',
  //     });
  //   }, 200);

  //   return () => ((ignore = true), clearTimeout(delay));
  // }, [focused]);

  return (
    <div
      ref={setNodeRef}
      className="group flex p-1 -mt-0.5 items-center bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow dark:shadow-none border-gray-700 dark:border first:rounded-t last:rounded-b justify-between cursor-pointer"
      style={{ transition, transform: CSS.Transform.toString(transform) }}
      onClick={(e) => {
        if (e.currentTarget != e.target) return;

        if (props.onClick) props.onClick(props.data);
        // else setName(props.data.name);
      }}
    >
      <div className="flex items-center">
        <FontAwesomeIcon
          {...attributes}
          {...listeners}
          icon={faGripVertical}
          className={`text-gray-400 dark:text-gray-600 text-sm p-2 -ml-0.5 mr-1 focus:outline-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        />
        {props.prefix}
        <span className="text-gray-800 dark:text-gray-300 text-sm group-hover:underline">
          {props.data.name}
        </span>

        {/* <InputFormElement
          // className={`w-full ${props.setOptions?.inputClassName ?? ''}`}

          placeholder="Enter name"
          value={rename}
          onFocus={() => onFocus(v4())}
          onChange={(value) => setName(value)}
          // onBlur={() => styles && (setStyles(null), props.onSubmit?.())}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          setOptions={{
            inputPadding: 'py-1.5',
            inputFont: 'text-sm cursor-pointer',
            inputFontColor: 'text-gray-300 placeholder:text-gray-400 ',
            inputRing: 'ring-0 ring-gray-900',
            inputFocus: 'caret-transparent',
            ...styles,
          }}
        /> */}
      </div>

      <FontAwesomeIcon
        className="invisible group-hover:visible py-1 px-1.5 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
        icon={faXmark}
        onClick={() => props.onDelete()}
      />
    </div>
  );
}
