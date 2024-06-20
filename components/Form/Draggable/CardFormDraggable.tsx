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
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { ObjectLiteral } from '../../../lib/common/types';
import { ComponentType, Dispatch, forwardRef, memo } from 'react';
import { VirtuosoGrid, VirtuosoGridHandle } from 'react-virtuoso';

type IdEntity = { id: string };

export interface CardFormGraggableProps<T extends ObjectLiteral & IdEntity> {
  className?: string;

  onDragStart?: Dispatch<DragStartEvent>;
  onDragCancel?: Dispatch<DragCancelEvent>;
  onDragEnd?: Dispatch<DragEndEvent>;

  picked?: string;
  // graggable?: boolean;

  data: T[];
  atBottomStateChange?: Dispatch<void>;

  setOptions?: Partial<{ listClassName: string; itemClassName: string }>;
  CardComponent: ComponentType<{ id: string }>;
}

export default memo(function CardFormGraggable<
  T extends ObjectLiteral & IdEntity,
>({ CardComponent, ...props }: CardFormGraggableProps<T>) {
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(event) => props.onDragStart?.(event)}
      onDragEnd={(event) => props.onDragEnd?.(event)}
      onDragCancel={(event) => props.onDragCancel?.(event)}
      collisionDetection={closestCenter}
    >
      <VirtuosoGrid
        data={props.data}
        className={props.className}
        style={{ height: null }}
        // endReached={() => props.endReached?.()}
        atBottomStateChange={(flag) =>
          flag ? props.atBottomStateChange?.() : null
        }
        components={{
          List: forwardRef(({ children, className, style, ...rest }, ref) => (
            <div
              ref={ref}
              {...rest}
              className={`grid ${className || ''} ${
                props.setOptions?.listClassName || ''
              }`}
              style={style}
            >
              <SortableContext
                items={
                  (children as any)?.map?.((e) => e.props?.children?.props) ||
                  []
                }
                strategy={rectSortingStrategy}
              >
                {children}
              </SortableContext>
            </div>
          )),
          Item: ({ className, children, ...rest }: any): any => (
            <div
              {...rest}
              key={children?.props?.id}
              className={`${className || ''} ${
                props.setOptions?.itemClassName || ''
              }`}
            >
              {children}
            </div>
          ),
        }}
        itemContent={(_, data) => <CardComponent id={data.id} />}
        // components={{ Footer }}
      />

      <DragOverlay>
        {props.picked ? <CardComponent id={props.picked} /> : <></>}
      </DragOverlay>
    </DndContext>
  );
});
