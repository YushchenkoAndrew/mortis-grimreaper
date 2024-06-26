import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Breadcrumbs from '../../../../../components/Breadcrumbs/Breadcrumbs';
import { RenderHtml } from '../../../../../components/dynamic';
import FileSystem from '../../../../../components/Sidebar/FileSystem';
import Sidebar from '../../../../../components/Sidebar/Sidebar';
import { Config } from '../../../../../config';
import { AdminProjectEntity } from '../../../../../lib/project/entities/admin-project.entity';
import { ErrorService } from '../../../../../lib/common/error.service';
import { AdminAttachmentStore } from '../../../../../lib/attachment/stores/admin-attachment.store';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../lib/common/store';
import { AttachmentService } from '../../../../../lib/attachment/attachment.service';
import { AttachmentEntity } from '../../../../../lib/attachment/entities/attachment.entity';
import moment from 'moment';
import { AdminProjectStore } from '../../../../../lib/project/stores/admin-project.store';
import { getServerSession } from 'next-auth';
import { options } from '../../../../api/admin/auth/[...nextauth]';
import TabFormElement from '../../../../../components/Form/Elements/TabFormElement';
import CustomAttachmentDraggable from '../../../../../components/Form/Custom/Draggable/CustomAttachmentDraggable';
import AdminLayout from '../../../../../components/Container/Layout/AdminLayout';
import CustomProjectMenuElement from '../../../../../components/Form/Custom/Elements/CustomProjectMenuElement';
import EditorFormElement from '../../../../../components/Form/Elements/EditorFormElement';

interface PropsT {
  project: AdminProjectEntity;
}

export default function (props: PropsT) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.admin.project.index);
  const attachment = useAppSelector((state) => state.admin.attachment);

  useEffect(() => {
    ErrorService.envelop(async () => {
      if (!Array.isArray(router.query.path)) return;
      dispatch(AdminAttachmentStore.actions.setBuffer(''));

      const project = AdminProjectEntity.self.build(props.project);
      dispatch(AdminProjectStore.actions.init(project));

      const root = '/' + router.query.path.join('/');
      const attachment = project.attachments.find((e) => e._filepath() == root);

      // prettier-ignore
      if (!attachment) dispatch(AdminAttachmentStore.actions.setBuffer(null));
      else dispatch(AdminAttachmentStore.actions.init(attachment));

      // const text = await AttachmentEntity.self.load.raw(attachment.id);
      // dispatch(AdminAttachmentStore.actions.setBuffer(text));
    });
  }, [router.query.path]);

  const redirect = (path: string[]) =>
    router.push({ pathname: router.route, query: { ...router.query, path } });

  return (
    <AdminLayout
      className="w-full"
      title="Admin project tree"
      Sidebar={
        <Sidebar
          Element={FileSystem}
          data={[AttachmentService.toTree(project.attachments)]}
          onClick={(data) =>
            redirect(
              Array.isArray(data) ? data : AttachmentService.filepath(data),
            )
          }
          sortBy={([_a, a], [_b, b]) =>
            Number(!!a.type) - Number(!!b.type) ||
            ((a as any).order || 0) - ((b as any).order || 0)
          }
        />
      }
    >
      <div className="flex my-4 px-4 items-center">
        <Breadcrumbs
          href={[
            {
              name: project.name,
              path: {
                pathname: `${router.route}/../..`,
                query: { id: router.query.id },
              },
            },
          ]}
        />

        <CustomProjectMenuElement
          pathname={{
            create: `${router.route}/../../new`,
            attachment: router.route,
          }}
        />
      </div>

      {attachment.buffer == null ? (
        <CustomAttachmentDraggable className="mx-4" pathname={router.route} />
      ) : (
        <TabFormElement
          className="p-4"
          default="code"
          disabled={project.html ? [] : ['preview']}
          columns={{ preview: 'Preview', code: 'Code' }}
          headerComponent={
            <span className="flex ml-auto text-sm items-center text-gray-400">
              {attachment.updated_at && moment(attachment.updated_at).toNow()}
            </span>
          }
          dataComponent={{
            preview: () => (
              <RenderHtml
                className="w-full h-full overflow-y-hidden py-5 pl-5 "
                html={project.html}
                setOptions={{
                  height: 'calc(100vh - 14rem)',
                  containerHeighOffset: 8,
                  containerClassName: `${
                    project.html ? 'block' : 'hidden'
                  } relative border rounded-b`,
                }}
              />
            ),
            code: () => (
              <EditorFormElement
                vars={AttachmentService.vars(project.attachments)}
                onPreview={(src) =>
                  dispatch(AdminProjectStore.actions.setHtml(src))
                }
              />
            ),
          }}
        />
      )}
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, options);
  if (!session) return { redirect: { destination: '/admin/login' } };

  const project: AdminProjectEntity = await AdminProjectEntity.self.load
    .build(ctx.params.id, { hostname: Config.self.base.grape, ctx })
    .then((res) => JSON.parse(JSON.stringify(res)))
    .catch(() => null);

  return { props: { ...ctx.params, project } };
}
