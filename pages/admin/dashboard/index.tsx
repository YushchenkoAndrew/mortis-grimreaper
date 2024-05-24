import {
  closestCenter,
  DndContext,
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
import StageFormCreatePage from '../../../components/Form/Page/Stage/StageFormCreatePage';
import StageFormPreview from '../../../components/Form/Previews/StageFormPreview';
import StageFormSortable from '../../../components/Form/Sortable/StageFormSortable';
import { Config } from '../../../config';
import { PositionEntity } from '../../../lib/common/entities/position.entity';
import { ErrorService } from '../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
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
  const dashboard = useAppSelector((state) => state.admin.dashboard.index);
  const [stage, onStage] = useState<AdminStageEntity>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
  );

  useEffect(() => {
    const dashboard = new AdminDashboardCollection(props.dashboard);
    dispatch(AdminDashboardStore.actions.init(dashboard));
  }, []);

  return (
    <AdminLayout
      title="Admin Dashboard"
      background="bg-[url('/projects/img/dashboard-background.png')]"
    >
      <CustomPopupEnclosureElement
        title="Create new stage"
        state="admin.dashboard.stage.form.id"
        onClose={() => dispatch(AdminStageFormStore.actions.reset())}
      >
        <StageFormCreatePage />
      </CustomPopupEnclosureElement>

      <CustomYesNoPopupElement
        title="Are you sure, you want to delete this stage ?"
        open={!!stage}
        onClose={() => onStage(null)}
        onNext={() => {
          ErrorService.envelop(async () => {
            onStage(null);
            await AdminStageEntity.self.delete.exec(stage.id);
            await dispatch(AdminDashboardCollection.self.select.thunk({})); // prettier-ignore
          });
        }}
      />

      <DndContext
        sensors={sensors}
        onDragEnd={({ active, over }) =>
          ErrorService.envelop(async () => {
            const position = dashboard.stages.find((e) => e.id == over?.id)?.order ?? null; // prettier-ignore
            if (!over?.id || position === null) return;

            dispatch(
              AdminDashboardStore.actions.onReorder(
                arrayMove(
                  dashboard.stages.map((e) => new AdminStageEntity(e as any)),
                  dashboard.stages.findIndex((e) => e.id == active.id),
                  dashboard.stages.findIndex((e) => e.id == over.id),
                ),
              ),
            );

            await AdminStageEntity.self.save.build(
              new PositionEntity({ position }),
              { method: 'PUT', route: `admin/stages/${active.id}/order` },
            );

            await dispatch(AdminDashboardCollection.self.select.thunk({})); // prettier-ignore
          })
        }
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={dashboard.stages.map((e) => e.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex w-full px-6 py-4 h-full space-x-4">
            {dashboard.stages.map((stage) => (
              <StageFormSortable
                key={stage.id}
                id={stage.id}
                name={stage.name}
                actions={{ delete: 'Delete Stage' }}
                onSubmit={() =>
                  ErrorService.envelop(async () => {
                    await dispatch(AdminStageEntity.self.save.thunk(stage));
                    await dispatch(AdminDashboardCollection.self.select.thunk({})); // prettier-ignore
                  })
                }
                onTaskCreate={() =>
                  dispatch(AdminTaskFormStore.actions.setId([stage.id, 'null']))
                }
                onChange={(action) => {
                  switch (action) {
                    case 'delete':
                      return onStage(stage as any);
                  }
                }}
              />
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
                onChange={() => null}
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
      .catch((err) => console.log(err));

  return { props: { ...ctx.params, dashboard } };
}
