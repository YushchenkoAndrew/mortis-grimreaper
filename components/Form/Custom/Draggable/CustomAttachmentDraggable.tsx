import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { AttachmentService } from '../../../../lib/attachment/attachment.service';
import { AdminAttachmentEntity } from '../../../../lib/attachment/entities/admin-attachment.entity';
import { PositionEntity } from '../../../../lib/common/entities/position.entity';
import { ErrorService } from '../../../../lib/common/error.service';
import { AdminProjectEntity } from '../../../../lib/project/entities/admin-project.entity';
import { AdminProjectStore } from '../../../../lib/project/stores/admin-project.store';
import TableFormGraggable from '../../Draggable/TableFormDraggable';
import TooltipFormPreview from '../../Previews/TooltipFormPreview';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../../lib/common/store';
import { arrayMove } from '@dnd-kit/sortable';
import { useMemo } from 'react';
import NoData from '../../../Container/NoData';
import { OrderableTypeEnum } from '../../../../lib/common/types/orderable-type.enum';

export interface CustomAttachmentDraggableProps {
  pathname: string;
  className?: string;
  hidden?: boolean;
}

export default function CustomAttachmentDraggable(
  props: CustomAttachmentDraggableProps,
) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const trash = useAppSelector((state) => state.admin.project.index.trash);
  const picked = useAppSelector((state) => state.admin.project.index.picked);
  const attachments = useAppSelector((state) => state.admin.project.index.attachments); // prettier-ignore

  const data = useMemo(() => {
    return AttachmentService.toList<AdminAttachmentEntity>(
      attachments,
      Array.isArray(router.query.path) ? router.query.path : [],
    );
  }, [attachments, router.query.path]);

  const redirect = (path: string[]) =>
    router.push({ pathname: props.pathname, query: { ...router.query, path } });

  return (
    <div
      className={`flex flex-col mb-8 ${props.hidden ? 'hidden' : 'block'}  ${
        props.className ?? ''
      }`}
    >
      <TableFormGraggable
        className="rounded-md "
        columns={{ name: 'Name', updated_at: 'Last updated' }}
        picked={picked}
        data={data}
        onDragStart={(e) =>
          dispatch(AdminProjectStore.actions.onPick(e.active.id as string))
        }
        onDragEnd={({ active, over }) =>
          ErrorService.envelop(async () => {
            const position = attachments.find((e) => e.id == over?.id)?.order ?? 1; // prettier-ignore

            if (!over?.id || position === null) {
              return dispatch(AdminProjectStore.actions.onDrop());
            }

            dispatch(
              AdminProjectStore.actions.onReorder(
                arrayMove(
                  attachments.concat() as any,
                  attachments.findIndex((e) => e.id == active.id),
                  attachments.findIndex((e) => e.id == over.id),
                ),
              ),
            );

            const body = new PositionEntity({ position, id: active.id, orderable: OrderableTypeEnum.attachments }); // prettier-ignore

            await PositionEntity.self.save.build(body);
            await dispatch(AdminProjectEntity.self.load.thunk(router.query.id)).unwrap(); // prettier-ignore
          })
        }
        onDragCancel={() => dispatch(AdminProjectStore.actions.onDrop())}
        onClick={(attachment: AdminAttachmentEntity) => {
          if (!trash) return redirect(AttachmentService.filepath(attachment)); // prettier-ignore
          if (attachment.type) return dispatch(AdminProjectStore.actions.pushTrash(attachment)); // prettier-ignore

          const files = attachments.filter((e) => e.path.startsWith(`/${attachment.name}/`)); // prettier-ignore
          dispatch(AdminProjectStore.actions.pushTrash(files.concat(attachment) as any)); // prettier-ignore
        }}
        firstComponent={(props) =>
          props.row.type ? props.children : <span className="pl-7 py-6" />
        }
        dataComponent={{
          name: (attachment) => (
            <span
              className={`group flex h-full whitespace-nowrap ${
                trash?.[attachment.id]
                  ? 'line-through text-gray-500'
                  : 'text-gray-800'
              }`}
            >
              <FontAwesomeIcon
                className="text-gray-500 text-lg mr-2"
                icon={attachment.type ? faFile : faFolder}
              />
              {attachment.name}

              {attachment.size ? (
                <TooltipFormPreview
                  value={`${attachment.size / 1000} KB`}
                  setOptions={{
                    margin: 'mt-4',
                    rounded: 'rounded-md',
                    color: 'bg-gray-600 text-white',
                  }}
                />
              ) : (
                <></>
              )}
            </span>
          ),
          updated_at: (attachment) => moment(attachment.updated_at).toNow(),
        }}
      />

      <NoData
        className={data.length ? 'hidden' : 'block w-full mt-16'}
        setOptions={{ border: '' }}
      />
    </div>
  );
}
