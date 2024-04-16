import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import Container from '../../../../components/Container/Container';
import { AceEditor } from '../../../../components/dynamic';
import Header from '../../../../components/Header/Header';
import Navbar from '../../../../components/Navbar/Navbar';
import NavbarItem from '../../../../components/Navbar/NavbarItem';
import FileSystem from '../../../../components/Sidebar/FileSystem';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { Config } from '../../../../config';
import { NAVIGATION } from '../../../../constants';
import { AdminProjectEntity } from '../../../../lib/project/entities/admin-project.entity';
import { ErrorService } from '../../../../lib/common/error.service';
import {
  AdminAttachmentStore,
  AdminAttachmentStoreT,
} from '../../../../lib/attachment/stores/admin-attachment.store';
import { useAppDispatch, useAppSelector } from '../../../../lib/common/store';
import { AttachmentService } from '../../../../lib/attachment/attachment.service';
import { mode } from '../../../../components/dynamic/AceEditor';
import { AdminAttachmentEntity } from '../../../../lib/attachment/entities/admin-attachment.entity';
import { RequestTypeEnum } from '../../../../lib/common/types/request-type.enum';
import InputFormElement from '../../../../components/Form/Elements/InputFormElement';
import { AttachmentAttachableTypeEnum } from '../../../../lib/attachment/types/attachment-attachable-type.enum';

export default function () {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.admin.projects.index);
  const attachment = useAppSelector((state) => state.admin.attachment);

  const attachmentRef = useRef<AdminAttachmentStoreT>(null);
  attachmentRef.current = attachment as any;

  useEffect(() => {
    ErrorService.envelop(async () => {
      const project = (await dispatch(
        AdminProjectEntity.self.load.thunk(router.query.id),
      ).unwrap()) as AdminProjectEntity;

      const path = Array.isArray(router.query.path)
        ? router.query.path
        : [router.query.path].filter(Boolean);

      dispatch(AdminAttachmentStore.actions.setBuffer(''));
      dispatch(AdminAttachmentStore.actions.setName(path.concat('').join('/')));
      dispatch(AdminAttachmentStore.actions.setAttachableId(project.id));
    });
  }, []);

  const redirect = (path) =>
    router.push({
      pathname: `${router.route}/../tree/[...path]`,
      query: { ...router.query, path },
    });

  const save = () =>
    ErrorService.envelop(async () => {
      if (!attachmentRef.current.name) {
        throw new Error(`file name can't be blank`);
      }

      const blob = new Blob([attachmentRef.current.buffer]);
      const file = new File([blob], attachmentRef.current.name);

      const attachment = (await AdminAttachmentEntity.self.save.build(
        new AdminAttachmentEntity({
          path: attachmentRef.current.path + '/',
          file: file as any,
          attachable_id: attachmentRef.current.attachable_id,
          attachable_type: AttachmentAttachableTypeEnum.projects,
        }),
        { type: RequestTypeEnum.form },
      )) as AdminAttachmentEntity;

      redirect(AttachmentService.filepath(attachment));
    });

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
          <div className="flex px-2 items-center">
            <span className="text-1xl font-semibold">{project.name}</span>
            <span className="text-1xl ml-2 mr-3 font-semibold">
              {attachment.path}/
            </span>

            <InputFormElement
              placeholder="Name your file ..."
              value={attachment.name}
              onChange={(e) =>
                dispatch(AdminAttachmentStore.actions.setName(e))
              }
              onKeyDown={(e) =>
                !attachment.name && e.key == 'Backspace'
                  ? dispatch(AdminAttachmentStore.actions.popPath())
                  : null
              }
              setOptions={{ inputPadding: 'py-1' }}
              required
            />

            <div className="ml-auto relative inline-block text-left">
              <button
                className="inline-flex w-full px-3 py-2 justify-center items-center rounded bg-green-600 text-sm font-semibold text-gray-50 hover:bg-green-500 disabled:text-gray-300 disabled:hover:bg-green-600 focus:outline-none"
                type="button"
                disabled={!attachment.name}
                onClick={() => save()}
              >
                Create new file
              </button>
            </div>
          </div>
        }
      >
        <AceEditor
          mode={mode.getModeForPath(attachment.name).name}
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
          commands={[{ name: 'write', bindKey: null, exec: save }]}
          setOptions={{
            spellcheck: true,
            showLineNumbers: true,
            highlightGutterLine: true,
            enableSnippets: false,
          }}
        />
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return { props: ctx.params };
}
