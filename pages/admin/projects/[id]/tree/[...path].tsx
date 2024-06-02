import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef } from 'react';
import Breadcrumbs from '../../../../../components/Breadcrumbs/Breadcrumbs';
import { AceEditor, RenderHtml } from '../../../../../components/dynamic';
import FileSystem from '../../../../../components/Sidebar/FileSystem';
import Sidebar from '../../../../../components/Sidebar/Sidebar';
import { Config } from '../../../../../config';
import { AdminProjectEntity } from '../../../../../lib/project/entities/admin-project.entity';
import { ErrorService } from '../../../../../lib/common/error.service';
import {
  AdminAttachmentStore,
  AdminAttachmentStoreT,
} from '../../../../../lib/attachment/stores/admin-attachment.store';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../lib/common/store';
import { AttachmentService } from '../../../../../lib/attachment/attachment.service';
import { AttachmentEntity } from '../../../../../lib/attachment/entities/attachment.entity';
import { mode } from '../../../../../components/dynamic/AceEditor';
import { AdminAttachmentEntity } from '../../../../../lib/attachment/entities/admin-attachment.entity';
import moment from 'moment';
import { RequestTypeEnum } from '../../../../../lib/common/types/request-type.enum';
import { PROJECT_HANDLEBAR_SHORTCUTS } from '../../../../../components/constants/projects';
import { AdminProjectStore } from '../../../../../lib/project/stores/admin-project.store';
import { getServerSession } from 'next-auth';
import { options } from '../../../../api/admin/auth/[...nextauth]';
import Handlebars from 'handlebars';
import TabFormElement from '../../../../../components/Form/Elements/TabFormElement';
import { StringService } from '../../../../../lib/common';
import CustomAttachmentDraggable from '../../../../../components/Form/Custom/Draggable/CustomAttachmentDraggable';
import AdminLayout from '../../../../../components/Container/Layout/AdminLayout';
import CustomProjectMenuElement from '../../../../../components/Form/Custom/Elements/CustomProjectMenuElement';
import { MarkdownEntity } from '../../../../../lib/common/entities/markdown.entity';

interface PropsT {
  project: AdminProjectEntity;
}

export default function (props: PropsT) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.admin.project.index);
  const attachment = useAppSelector((state) => state.admin.attachment);

  // const fileRef = useRef<HTMLInputElement>(null);
  const projectRef = useRef<AdminProjectEntity>(null);
  const attachmentRef = useRef<AdminAttachmentStoreT>(null);
  projectRef.current = project as any;
  attachmentRef.current = attachment as any;

  useEffect(() => {
    ErrorService.envelop(async () => {
      if (!Array.isArray(router.query.path)) return;
      dispatch(AdminAttachmentStore.actions.setBuffer(''));

      const project = AdminProjectEntity.self.build(props.project);
      dispatch(AdminProjectStore.actions.init(project));

      const root = '/' + router.query.path.join('/');
      const attachment = project.attachments.find((e) => e._filepath() == root);

      // prettier-ignore
      if (!attachment) return dispatch(AdminAttachmentStore.actions.setBuffer(null));
      dispatch(AdminAttachmentStore.actions.setAttachment(attachment as any));

      const text = await AttachmentEntity.self.load.raw(attachment.id);
      dispatch(AdminAttachmentStore.actions.setBuffer(text));

      await parse(attachment.type, text);
    });
  }, [router.query.path]);

  const redirect = (path: string[]) =>
    router.push({ pathname: router.route, query: { ...router.query, path } });

  const parse = async (type: string, text: string) => {
    switch (type) {
      case '.md': {
        const html = await MarkdownEntity.self.save.text({ text });
        return dispatch(AdminProjectStore.actions.setHtml(html));
      }

      case '.html':
        return dispatch(AdminProjectStore.actions.setHtml(text));
    }
  };

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

      <TabFormElement
        className={`p-4 ${attachment.buffer !== null ? 'block' : 'hidden'}`}
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
            <AceEditor
              mode={mode.getModeForPath(attachment.name).name}
              className="border rounded-b"
              theme="tomorrow"
              width="100%"
              height="calc(100vh - 14rem)"
              tabSize={2}
              fontSize={16}
              lineHeight={19}
              keyboardHandler="vim"
              enableLiveAutocompletion
              enableBasicAutocompletion
              showGutter
              showPrintMargin
              highlightActiveLine
              value={attachment.buffer || ''}
              onChange={(value) =>
                dispatch(AdminAttachmentStore.actions.setBuffer(value))
              }
              commands={[
                {
                  name: 'write',
                  bindKey: null,
                  exec: () =>
                    ErrorService.envelop(async () => {
                      const vars = AttachmentService.vars(projectRef.current.attachments); // prettier-ignore
                      const template = Handlebars.compile(attachmentRef.current.buffer); // prettier-ignore
                      const buffer = template(Object.assign(vars, PROJECT_HANDLEBAR_SHORTCUTS)); // prettier-ignore

                      const blob = new Blob([buffer]);
                      const file = new File([blob], attachmentRef.current.name);

                      await AdminAttachmentEntity.self.save.build(
                        new AdminAttachmentEntity({
                          id: attachmentRef.current.id,
                          file: file as any,
                        }),
                        { type: RequestTypeEnum.form },
                      );

                      await AttachmentEntity.self.load
                        .raw(attachmentRef.current.id)
                        .then((buf) =>
                          dispatch(AdminAttachmentStore.actions.setBuffer(buf)),
                        );

                      await parse(attachmentRef.current.type, buffer);
                    }),
                },
              ]}
              setOptions={{
                spellcheck: true,
                showLineNumbers: true,
                highlightGutterLine: true,
                enableSnippets: false,
              }}
            />
          ),
        }}
      />

      <CustomAttachmentDraggable
        hidden={attachment.buffer !== null}
        className="mx-4"
        pathname={router.route}
      />
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
