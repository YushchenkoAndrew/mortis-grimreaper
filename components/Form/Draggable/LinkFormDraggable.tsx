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
import { ObjectLiteral } from '../../../lib/common/types';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Dispatch, useMemo } from 'react';
import KeyValueFormElement, {
  KeyValueFormElementProps,
} from '../Elements/KeyValueFormElement';
import { Config } from '../../../config';

type EntityT = { id: string; name: string; link: string };

export interface LinkFormGraggableProps<T extends ObjectLiteral & EntityT>
  extends Omit<KeyValueFormElementProps, 'contextComponent' | 'values'> {
  onDragStart?: Dispatch<DragStartEvent>;
  onDragCancel?: Dispatch<DragCancelEvent>;
  onDragEnd?: Dispatch<DragEndEvent>;

  values: T[];
  onDelete: Dispatch<number>;
}

export default function LinkFormGraggable<T extends ObjectLiteral & EntityT>(
  props: LinkFormGraggableProps<T>,
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
        values={last ? [[last.name, last.link]] : []}
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

function Preview(props: { data: EntityT; onDelete: Dispatch<void> }) {
  const { attributes, listeners, transform, transition, setNodeRef, isDragging } = useSortable({ id: props.data.id }); // prettier-ignore

  return (
    <div
      ref={setNodeRef}
      className="group flex p-1 -mt-0.5 items-center bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow dark:shadow-none border-gray-700 dark:border first:rounded-t last:rounded-b justify-between cursor-pointer"
      style={{ transition, transform: CSS.Transform.toString(transform) }}
      onClick={(e) => {
        if (e.currentTarget != e.target) return;
        window.open(props.data.link, '_blank');
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
        <img
          className="h-5 w-5 mr-2"
          src={`${Config.self.base.api}/icon?url=${encodeURIComponent(
            props.data.link,
          )}`}
        />
        <span className="text-gray-800 dark:text-gray-300 text-sm group-hover:underline">
          {props.data.name}
        </span>
      </div>

      <FontAwesomeIcon
        className="invisible group-hover:visible py-1 px-1.5 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
        icon={faXmark}
        onClick={() => props.onDelete()}
      />
    </div>
  );
}
