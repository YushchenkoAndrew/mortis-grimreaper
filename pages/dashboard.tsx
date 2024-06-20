import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../lib/common/store';
import DefaultLayout from '../components/Container/Layout/DefaultLayout';
import { GetServerSidePropsContext } from 'next';
import { Config } from '../config';
import { DashboardCollection } from '../lib/dashboard/collections/dashboard.collection';
import { DashboardStore } from '../lib/dashboard/stores/dashboard.store';
import { toast } from 'react-toastify';
import StageFormPreview from '../components/Form/Previews/StageFormPreview';
import TaskFormPreview from '../components/Form/Previews/TaskFormPreview';
import TaskStatsPreview from '../components/Form/Previews/TaskStatsPreview';
import CustomPopupEnclosureElement from '../components/Form/Custom/Elements/CustomPopupEnclosureElement';
import { TaskFormStore } from '../lib/dashboard/stores/task-form.store';
import TaskFormPreviewPage from '../components/Form/Page/Task/TaskFormPreviewPage';

interface PropsT {
  dashboard: DashboardCollection;
}

export default function (props: PropsT) {
  const dispatch = useAppDispatch();
  const stages = useAppSelector((state) => state.dashboard.index.stages);

  useEffect(() => {
    const dashboard = DashboardCollection.self.build(props.dashboard?.stages); // prettier-ignore
    dispatch(DashboardStore.actions.init(dashboard as any));

    toast('You only have preview access', {
      className: '-mt-14',
      type: 'info',
      autoClose: false,
      closeButton: false,
      position: 'bottom-right',
    });
  }, []);

  return (
    <DefaultLayout
      title="Admin Dashboard"
      background="bg-[url('/projects/img/dashboard-background.png')]"
    >
      <CustomPopupEnclosureElement
        className="dark"
        state="dashboard.task.id"
        condition={(id) => id && id !== 'null'}
        onClose={() => dispatch(TaskFormStore.actions.reset())}
      >
        <TaskFormPreviewPage />
      </CustomPopupEnclosureElement>

      <div className="flex w-full px-6 py-4 h-full space-x-4">
        {stages.map((stage) => (
          <div key={stage.id}>
            <StageFormPreview
              name={stage.name}
              onChange={(value) => null}
              actions={{}}
              onAction={(action) => null}
              setOptions={{
                menuClassName: 'hidden',
                taskCreateDisplay: 'hidden',
              }}
            >
              {stage.tasks.map((task) => (
                <TaskFormPreview
                  key={task.id}
                  name={task.name}
                  description={task.description}
                  // blur={isDragging}
                  onClick={() =>
                    dispatch(
                      TaskFormStore.actions.init([stage.id, task as any]),
                    )
                  }
                  contextComponent={<TaskStatsPreview task={task} />}
                />
              ))}
            </StageFormPreview>
          </div>
        ))}
      </div>
    </DefaultLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const dashboard: DashboardCollection = await DashboardCollection.self.select
    .build({}, { hostname: Config.self.base.grape, ctx })
    .then((res) => JSON.parse(JSON.stringify(res)))
    .catch(() => null);

  return { props: { ...ctx.params, dashboard } };
}
