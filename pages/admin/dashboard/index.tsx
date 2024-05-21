import {
  closestCenter,
  DndContext,
  DragOverlay,
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
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { useEffect, useMemo } from 'react';
import { v4 } from 'uuid';
import AdminLayout from '../../../components/Container/Layout/AdminLayout';
import StageFormPreview from '../../../components/Form/Previews/StageFormPreview';
import StageFormSortable from '../../../components/Form/Sortable/StageFormSortable';
import { Config } from '../../../config';
import { PositionEntity } from '../../../lib/common/entities/position.entity';
import { ErrorService } from '../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import { AdminDashboardCollection } from '../../../lib/dashboard/collections/admin-dashboard.collection';
import { AdminStageEntity } from '../../../lib/dashboard/entities/admin-stage.entity';
import { AdminDashboardStore } from '../../../lib/dashboard/stores/admin-dashboard.store';
import { options } from '../../api/admin/auth/[...nextauth]';

interface PropsT {
  dashboard: AdminDashboardCollection;
}

export default function (props: PropsT) {
  const dispatch = useAppDispatch();
  const dashboard = useAppSelector((state) => state.admin.dashboard.index);

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
                onSubmit={() =>
                  ErrorService.envelop(async () => {
                    await dispatch(AdminStageEntity.self.save.thunk(stage));
                    await dispatch(AdminDashboardCollection.self.select.thunk({})); // prettier-ignore
                  })
                }
              />
            ))}
            <div>{/* <StageFormPreview /> */}</div>
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
