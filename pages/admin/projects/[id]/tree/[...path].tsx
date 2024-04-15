import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Breadcrumbs from '../../../../../components/Breadcrumbs/Breadcrumbs';
import Container from '../../../../../components/Container/Container';
import { AceEditor } from '../../../../../components/dynamic';
import Header from '../../../../../components/Header/Header';
import Navbar from '../../../../../components/Navbar/Navbar';
import NavbarItem from '../../../../../components/Navbar/NavbarItem';
import FileSystem from '../../../../../components/Sidebar/FileSystem';
import Sidebar from '../../../../../components/Sidebar/Sidebar';
import { Config } from '../../../../../config';
import { NAVIGATION } from '../../../../../constants';
import { AdminProjectEntity } from '../../../../../lib/project/entities/admin-project.entity';
import { ErrorService } from '../../../../../lib/common/error.service';
import { AdminAttachmentStore } from '../../../../../lib/attachment/stores/admin-attachment.store';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../lib/common/store';
import { AttachmentService } from '../../../../../lib/attachment/attachment.service';
import { AttachmentEntity } from '../../../../../lib/attachment/entities/attachment.entity';
import { mode } from '../../../../../components/dynamic/AceEditor';
import { AdminAttachmentEntity } from '../../../../../lib/attachment/entities/admin-attachment.entity';
import TableFormElement from '../../../../../components/Form/Elements/TableFormElement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function () {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.admin.projects.index);
  const attachment = useAppSelector((state) => state.admin.attachment);

  const redirect = (path: string[]) =>
    router.push({
      pathname: router.route,
      query: { ...router.query, path },
    });

  useEffect(() => {
    ErrorService.envelop(async () => {
      if (!Array.isArray(router.query.path)) return;
      const entity = project.id
        ? project
        : ((await dispatch(
            AdminProjectEntity.self.load.thunk(router.query.id),
          ).unwrap()) as AdminProjectEntity);

      const root = '/' + router.query.path.join('/');
      const attachment = entity.attachments.find((e) => e.filepath() == root);

      if (!attachment) {
        return dispatch(AdminAttachmentStore.actions.setBuffer(null));
      }

      dispatch(AdminAttachmentStore.actions.setAttachment(attachment as any));
      AttachmentEntity.self.load
        .text(attachment.id)
        .then((buf) => dispatch(AdminAttachmentStore.actions.setBuffer(buf)));
    });
  }, [router.query.path]);

  console.log(attachment);

  return (
    <>
      <Header title="Admin project create"></Header>

      <Container
        className="w-full"
        Navbar={
          <Navbar
            Item={NavbarItem}
            navigation={NAVIGATION.admin}
            avatar={Config.self.github}
          />
        }
        Sidebar={
          <Sidebar
            Element={FileSystem}
            data={[AttachmentService.toTree(project.attachments)]}
            onClick={(data) =>
              redirect(
                Array.isArray(data) ? data : AttachmentService.filepath(data),
              )
            }
          />
        }
        Breadcrumbs={
          <Breadcrumbs
            className="px-4"
            path={[project.name].concat(router.query.path)}
          />
        }
      >
        <AceEditor
          mode={mode.getModeForPath(attachment.name).name}
          className={attachment.buffer !== null ? 'block' : 'hidden'}
          theme="tomorrow"
          width="100%"
          height="calc(100vh - 8.5rem)"
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
          onLoad={(editor) => {
            editor.commands.addCommand({
              name: 'write',
              exec: (editor, args) => {
                console.log(args);
              },
            });
          }}
          setOptions={{
            spellcheck: true,
            showLineNumbers: true,
            highlightGutterLine: true,
            enableSnippets: false,
          }}
        />
        <TableFormElement
          className={`mb-8 ${attachment.buffer !== null ? 'hidden' : 'block'}`}
          columns={{ name: 'Name', created_at: 'Last updated' }}
          data={AttachmentService.toList<AdminAttachmentEntity>(
            project.attachments,
            Array.isArray(router.query.path) ? router.query.path : [],
          )}
          onClick={(attachment) =>
            redirect(AttachmentService.filepath(attachment))
          }
          stringify={{
            name: (attachment) => (
              <span className="flex text-gray-800 whitespace-nowrap">
                <FontAwesomeIcon
                  className="text-gray-500 text-lg mr-2"
                  icon={attachment.type ? faFile : faFolder}
                />
                {attachment.name}
              </span>
            ),
          }}
        />
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return { props: ctx.params };
}
