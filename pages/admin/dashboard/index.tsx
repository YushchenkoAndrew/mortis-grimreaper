import {
  closestCenter,
  closestCorners,
  DndContext,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/Container/Layout/AdminLayout';
import CustomPopupEnclosureElement from '../../../components/Form/Custom/Elements/CustomPopupEnclosureElement';
import CustomYesNoPopupElement from '../../../components/Form/Custom/Elements/CustomYesNoPopupElement';
import AttachmentFormPage from '../../../components/Form/Page/Attachment/AttachmentFormPage';
import StageFormCreatePage from '../../../components/Form/Page/Stage/StageFormCreatePage';
import TaskFormCreatePage from '../../../components/Form/Page/Task/TaskFormCreatePage';
import TaskFormUpdatePage from '../../../components/Form/Page/Task/TaskFormUpdatePage';
import StageFormPreview from '../../../components/Form/Previews/StageFormPreview';
import StageFormSortable from '../../../components/Form/Sortable/StageFormSortable';
import { Config } from '../../../config';
import { AdminAttachmentStore } from '../../../lib/attachment/stores/admin-attachment.store';
import { PositionEntity } from '../../../lib/common/entities/position.entity';
import { ErrorService } from '../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import { OrderableTypeEnum } from '../../../lib/common/types/orderable-type.enum';
import { AdminDashboardCollection } from '../../../lib/dashboard/collections/admin-dashboard.collection';
import { AdminStageEntity } from '../../../lib/dashboard/entities/admin-stage.entity';
import { AdminDashboardStore } from '../../../lib/dashboard/stores/admin-dashboard.store';
import { AdminStageFormStore } from '../../../lib/dashboard/stores/admin-stage-form.store';
import { AdminTaskFormStore } from '../../../lib/dashboard/stores/admin-task-form.store';
import { options } from '../../api/admin/auth/[...nextauth]';

interface PropsT {
  dashboard: AdminDashboardCollection;
}

export default function (props: PropsT) {
  const dispatch = useAppDispatch();
  const trash = useAppSelector((state) => state.admin.dashboard.index.trash);
  const stages = useAppSelector((state) => state.admin.dashboard.index.stages);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 2 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 2 } }),
  );

  useEffect(() => {
    const dashboard = AdminDashboardCollection.self.build(props.dashboard?.stages); // prettier-ignore
    dispatch(AdminDashboardStore.actions.init(dashboard as any));
  }, []);

  return (
    <AdminLayout
      title="Admin Dashboard"
      background="bg-[url('/projects/img/dashboard-background.png')]"
    >
      <CustomPopupEnclosureElement
        className="dark"
        title="Create new stage"
        state="admin.dashboard.stage.form.id"
        onClose={() => dispatch(AdminStageFormStore.actions.reset())}
      >
        <StageFormCreatePage />
      </CustomPopupEnclosureElement>

      <CustomPopupEnclosureElement
        className="dark"
        title="Create new task"
        state="admin.dashboard.task.form.id"
        condition={(id) => id === 'null'}
        onClose={() => dispatch(AdminTaskFormStore.actions.reset())}
      >
        <TaskFormCreatePage />
      </CustomPopupEnclosureElement>

      <CustomPopupEnclosureElement
        className="dark"
        state="admin.dashboard.task.form.id"
        condition={(id) => id && id !== 'null'}
        onClose={() => dispatch(AdminTaskFormStore.actions.reset())}
      >
        <TaskFormUpdatePage />
      </CustomPopupEnclosureElement>

      <CustomPopupEnclosureElement
        className="dark"
        state="admin.attachment.id"
        onClose={() => dispatch(AdminAttachmentStore.actions.reset())}
      >
        <AttachmentFormPage
          reload={() =>
            dispatch(AdminDashboardCollection.self.select.thunk({})).unwrap()
          }
        />
      </CustomPopupEnclosureElement>

      <CustomYesNoPopupElement
        title="Are you sure, you want to delete this stage ?"
        open={!!trash.length}
        onClose={() => dispatch(AdminDashboardStore.actions.clearTrash())}
        onNext={() => {
          ErrorService.envelop(
            async () => {
              await AdminStageEntity.self.delete.exec(trash[0].id);
              await dispatch(AdminDashboardCollection.self.select.thunk({})); // prettier-ignore
            },
            { in_progress: true },
          );
        }}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        measuring={{
          droppable: { strategy: MeasuringStrategy.Always },
        }}
        onDragEnd={({ active, over }) =>
          ErrorService.envelop(async () => {
            const position = stages.find((e) => e.id == over?.id)?.order ?? null; // prettier-ignore
            if (!over?.id || position === null) return;

            dispatch(
              AdminDashboardStore.actions.onReorder(
                arrayMove(
                  stages.map((e) => new AdminStageEntity(e as any)),
                  stages.findIndex((e) => e.id == active.id),
                  stages.findIndex((e) => e.id == over.id),
                ),
              ),
            );

            const body = new PositionEntity({ position, id: active.id, orderable: OrderableTypeEnum.stages }); // prettier-ignore

            await PositionEntity.self.save.build(body);
            await dispatch(AdminDashboardCollection.self.select.thunk({})); // prettier-ignore
          })
        }
        // collisionDetection={closestCenter}
      >
        <SortableContext
          items={stages.map((e) => e.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex w-full px-6 py-4 h-full space-x-4">
            {stages.map((stage) => (
              <StageFormSortable key={stage.id} id={stage.id} />
            ))}
            <div>
              <StageFormPreview
                name=""
                className="cursor-pointer mr-6"
                actions={{}}
                setOptions={{
                  inputClassName: 'hidden',
                  menuClassName: 'hidden',
                  taskCreateDisplay: 'hidden',
                  divColor:
                    'bg-gray-300 opacity-50 hover:bg-gray-200 hover:opacity-80 hover:shadow-lg',
                }}
                headerComponent={
                  <div className="flex my-1.5 w-full items-center text-gray-950 text-sm font-semibold">
                    <FontAwesomeIcon className="ml-1 mr-4" icon={faPlus} />
                    <span>Add new stage</span>
                  </div>
                }
                onAction={() => null}
                onClick={() =>
                  dispatch(AdminStageFormStore.actions.setId('null'))
                }
              />
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, options);
  if (!session) return { redirect: { destination: '/admin/login' } };

  const dashboard: AdminDashboardCollection =
    await AdminDashboardCollection.self.select
      .build({}, { hostname: Config.self.base.grape, ctx })
      .then((res) => JSON.parse(JSON.stringify(res)))
      .catch(() => null);

  return { props: { ...ctx.params, dashboard } };
}
