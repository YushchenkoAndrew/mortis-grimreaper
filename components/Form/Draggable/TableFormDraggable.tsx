import {
  closestCenter,
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragOverlay,
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
import TableFormElement, {
  TableFormElementProps,
} from '../Elements/TableFormElement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { Dispatch, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type IdEntity = { id: string };

export interface TableFormGraggableProps<T extends ObjectLiteral & IdEntity>
  extends Omit<TableFormElementProps<T>, 'firstComponent' | 'lastComponent'> {
  onDragStart?: Dispatch<DragStartEvent>;
  onDragCancel?: Dispatch<DragCancelEvent>;
  onDragEnd?: Dispatch<DragEndEvent>;
  firstComponent?: (props: { row: T; children: ReactNode }) => ReactNode;
  lastComponent?: (props: { row: T; children: ReactNode }) => ReactNode;

  picked?: T;
  setOptions?: Partial<{
    rowColor: string;
    dataPadding: string;
    overlayClassName: string;
  }>;
}

type RowComponentT<T> = {
  className: string;
  children: ReactNode;
  row: T;
};

export default function TableFormGraggable<T extends ObjectLiteral & IdEntity>(
  props: TableFormGraggableProps<T>,
) {
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
  );

  const elementRef = useRef<Element>(null);
  useEffect(() => {
    elementRef.current = document.body;
  }, []);

  const RowComponent = ({ className, children, row }: RowComponentT<T>) => {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
      id: row.id,
    });

    return (
      <tr
        ref={setNodeRef}
        className={className}
        style={{ transition, transform: CSS.Transform.toString(transform) }}
        onClick={() => props.onClick?.(row)}
      >
        {isDragging && props.onDragStart ? (
          <td
            className="py-4 bg-blue-50 dark:bg-gray-700"
            colSpan={Object.keys(props.columns).length}
          >
            &nbsp;
          </td>
        ) : (
          children
        )}
      </tr>
    );
  };

  const FirstComponent = (props: { row: T; isDragging?: boolean }) => {
    const { attributes, listeners } = useSortable({ id: props.row.id });

    return (
      <FontAwesomeIcon
        {...attributes}
        {...listeners}
        icon={faGripVertical}
        className={`text-gray-400 dark:text-gray-600 text-lg pl-3 pr-2 py-4 ${
          props.isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      />
    );
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(event) => props.onDragStart?.(event)}
      onDragEnd={(event) => props.onDragEnd?.(event)}
      onDragCancel={(event) => props.onDragCancel?.(event)}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
    >
      <TableFormElement
        className={props.className}
        columns={props.columns}
        data={props.data}
        setOptions={{ dataPadding: 'pr-6' }}
        bodyComponent={(children, data) => (
          <SortableContext items={data} strategy={verticalListSortingStrategy}>
            {children}
          </SortableContext>
        )}
        rowComponent={(props, row) => (
          <RowComponent key={row.id} {...props} row={row} />
        )}
        firstComponent={(row) =>
          props.firstComponent?.({
            row,
            children: <FirstComponent row={row} />,
          }) ?? <FirstComponent row={row} />
        }
        lastComponent={(row) => props.lastComponent?.({ row, children: <></> })}
        dataComponent={props.dataComponent}
      />

      {elementRef.current &&
        createPortal(
          <DragOverlay className={props.setOptions?.overlayClassName}>
            <TableFormElement
              noHeader
              columns={props.columns}
              data={[].concat(props.picked || [])}
              dataComponent={props.dataComponent}
              firstComponent={(row) =>
                props.firstComponent?.({
                  row,
                  children: <FirstComponent row={row} isDragging />,
                }) ?? <FirstComponent row={row} isDragging />
              }
              setOptions={{
                rowColor: 'bg-white dark:bg-gray-800',
                dataPadding: 'pr-6',
              }}
            />
          </DragOverlay>,
          elementRef.current,
        )}
    </DndContext>
  );
}
