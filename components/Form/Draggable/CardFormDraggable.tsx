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
import {
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { DispatchComponent, ObjectLiteral } from '../../../lib/common/types';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { Dispatch, forwardRef, memo, useEffect, useMemo, useRef } from 'react';
import { VirtuosoGrid, VirtuosoGridHandle } from 'react-virtuoso';
import CardFormPreview, {
  CardFormPreviewProps,
} from '../Previews/CardFormPreview';

type IdEntity = { id: string };

export interface CardFormGraggableProps<T extends ObjectLiteral & IdEntity> {
  className?: string;

  onDragStart?: Dispatch<DragStartEvent>;
  onDragCancel?: Dispatch<DragCancelEvent>;
  onDragEnd?: Dispatch<DragEndEvent>;

  picked?: T;
  graggable?: boolean;

  data: T[];
  atBottomStateChange?: Dispatch<void>;

  setOptions?: Partial<{ listClassName: string; itemClassName: string }>;
  cardComponent: DispatchComponent<
    Omit<CardFormPreviewProps, 'style' | 'ref'>,
    T
  >;
}

export default memo(function CardFormGraggable<
  T extends ObjectLiteral & IdEntity,
>(props: CardFormGraggableProps<T>) {
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
  );

  const CardComponent = useMemo(
    () =>
      ({ data }: { data: T }) => {
        const { transform, transition, setNodeRef, isDragging } = useSortable({
          id: data.id,
        });

        return (
          <CardFormPreview
            ref={setNodeRef}
            style={{ transition, transform: CSS.Transform.toString(transform) }}
            className={props.cardComponent.className?.(data)}
            name={props.cardComponent.name(data)}
            href={props.cardComponent.href(data)}
            img={props.cardComponent.img(data)}
            description={props.cardComponent.description?.(data)}
            headerComponent={<HeaderComponent data={data} />}
            contextComponent={props.cardComponent.contextComponent?.(data)}
            onClick={props.cardComponent.onClick?.(data)}
            onFile={props.cardComponent.onFile?.(data)}
            setOptions={{ loading: isDragging }}
          />
        );
      },
    [props.cardComponent],
  );

  const HeaderComponent = useMemo(
    () =>
      ({ data }: { data: T }) => {
        const { attributes, listeners, isDragging } = useSortable({
          id: data.id,
        });

        return (
          <>
            {props.cardComponent.headerComponent?.(data)}

            <FontAwesomeIcon
              {...attributes}
              {...listeners}
              icon={faGripVertical}
              className={`text-gray-400 text-lg ml-auto focus:outline-none ${
                props.graggable === false ? 'invisible' : ''
              } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            />
          </>
        );
      },
    [props.graggable],
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
          List: forwardRef(({ children, className, style }, ref) => (
            <div
              ref={ref}
              className={`grid ${className || ''} ${
                props.setOptions?.listClassName || ''
              }`}
              style={style}
            >
              <SortableContext
                items={
                  (children as any)?.map?.(
                    (e) => e.props?.children?.props?.data,
                  ) || []
                }
                strategy={rectSortingStrategy}
              >
                {children}
              </SortableContext>
            </div>
          )),
          Item: ({ className, children }: any): any => (
            <div
              className={`${className || ''} ${
                props.setOptions?.itemClassName || ''
              }`}
            >
              {children}
            </div>
          ),
        }}
        itemContent={(_, data) => <CardComponent data={data} />}
        // components={{ Footer }}
      />

      <DragOverlay>
        {props.picked ? (
          <CardFormPreview
            href=""
            className={props.cardComponent.className?.(props.picked)}
            name={props.cardComponent.name(props.picked)}
            img={props.cardComponent.img(props.picked)}
            description={props.cardComponent.description?.(props.picked)}
            headerComponent={<HeaderComponent data={props.picked} />}
            contextComponent={props.cardComponent.contextComponent?.(
              props.picked,
            )}
          />
        ) : (
          <></>
        )}
      </DragOverlay>
    </DndContext>
  );
});
