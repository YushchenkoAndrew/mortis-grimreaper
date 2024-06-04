import { arrayMove } from '@dnd-kit/sortable';
import {
  faAddressCard,
  faFile,
  faPenToSquare,
  faSquareCheck,
} from '@fortawesome/free-regular-svg-icons';
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { KeyboardEvent, ReactNode, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AttachmentService } from '../../../../lib/attachment/attachment.service';
import { AdminAttachmentEntity } from '../../../../lib/attachment/entities/admin-attachment.entity';
import { AdminAttachmentStore } from '../../../../lib/attachment/stores/admin-attachment.store';
import { AttachmentAttachableTypeEnum } from '../../../../lib/attachment/types/attachment-attachable-type.enum';
import { PositionEntity } from '../../../../lib/common/entities/position.entity';
import { ErrorService } from '../../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../../lib/common/store';
import { ObjectLiteral } from '../../../../lib/common/types';
import { OrderableTypeEnum } from '../../../../lib/common/types/orderable-type.enum';
import { AdminContextEntity } from '../../../../lib/context/entities/admin-context.entity';
import { ContextContextableTypeEnum } from '../../../../lib/context/types/context-contextable-type.enum';
import { AdminDashboardCollection } from '../../../../lib/dashboard/collections/admin-dashboard.collection';
import { AdminTaskEntity } from '../../../../lib/dashboard/entities/admin-task.entity';
import { TaskPositionEntity } from '../../../../lib/dashboard/entities/task-position.entity';
import { AdminTaskFormStore } from '../../../../lib/dashboard/stores/admin-task-form.store';
import { AdminLinkEntity } from '../../../../lib/link/entities/admin-link.entity';
import { AdminTagEntity } from '../../../../lib/tag/entities/admin-tag.entity';
import CustomYesNoPopupElement from '../../Custom/Elements/CustomYesNoPopupElement';
import LinkFormGraggable from '../../Draggable/LinkFormDraggable';
import TableFormGraggable from '../../Draggable/TableFormDraggable';
import DropdownFormElement from '../../Elements/DropdownFormElement';
import InputFormElement from '../../Elements/InputFormElement';
import InputListFormElement from '../../Elements/InputListFormElement';
import MenuFormElement from '../../Elements/MenuFormElement';
import TextareaFormElement from '../../Elements/TextareaFormElement';
import NoneFormPreview from '../../Previews/NoneFormPreview';
import TagFormPreview from '../../Previews/TagFormPreview';
import TooltipFormPreview from '../../Previews/TooltipFormPreview';

export interface TaskFormPageUpdateProps {
  className?: string;
}

export default function TaskFormUpdatePage(props: TaskFormPageUpdateProps) {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.dashboard.task.form);
  const stages = useAppSelector((state) => state.admin.dashboard.index._stages); // prettier-ignore

  const [deletePanel, openDeletePanel] = useState(false);

  const actions: ObjectLiteral = useMemo(() => {
    return stages.reduce((acc, curr) => ((acc[curr.id] = curr.name), acc), {});
  }, [stages]);

  const fileRef = useRef<HTMLInputElement>(null);
  const formIdRef = useRef<string>(null);
  formIdRef.current = form.id;

  const reload = async (stage_id?: string) => {
    const dashboard: AdminDashboardCollection = await dispatch(AdminDashboardCollection.self.select.thunk({})).unwrap(); // prettier-ignore
    const stage = dashboard.stages.find((e) => e.id == (stage_id ?? form.stage_id)); // prettier-ignore
    const task = stage.tasks.find((e) => e.id == form.id);

    if (!formIdRef.current) return;
    dispatch(AdminTaskFormStore.actions.init([stage.id, task])); // prettier-ignore
  };

  const onNameSubmit = () =>
    ErrorService.envelop(async () => {
      const body = new AdminTaskEntity({ name: form.name, id: form.id, stage_id: form.stage_id }); // prettier-ignore
      await dispatch(AdminTaskEntity.self.save.thunk(body)).unwrap(); // prettier-ignore

      await reload();
    });

  const onDescSubmit = () =>
    ErrorService.envelop(async () => {
      const body = new AdminTaskEntity({ description: form.description, id: form.id, stage_id: form.stage_id }); // prettier-ignore
      await dispatch(AdminTaskEntity.self.save.thunk(body)).unwrap(); // prettier-ignore

      await reload();
    });

  const onLinkSubmit = (action: 'add' | 'delete', index: number) =>
    ErrorService.envelop(async () => {
      const entity = form.links[index];
      if (!entity) return;

      const body = new AdminLinkEntity({ ...entity, name: entity.name || entity.link }); // prettier-ignore
      if (action == 'delete') await AdminLinkEntity.self.delete.exec(entity.id);
      else await AdminLinkEntity.self.save.build(body);

      await reload();
    });

  const onTagSubmit = (action: 'add' | 'delete', index: number) =>
    ErrorService.envelop(async () => {
      const entity = form.tags[index];

      if (action == 'add') await AdminTagEntity.self.save.build(form.tag);
      else if (entity) await AdminTagEntity.self.delete.exec(entity.id);

      await reload();
    });

  return (
    <div className="flex mt-2 mx-5 my-6">
      <div className="flex flex-col w-full space-y-4">
        <div className="flex w-full items-center">
          <input className="w-0 p-0 m-0 border-0 outline-0" type="color" />
          <FontAwesomeIcon
            className="text-xl mr-2 text-gray-300"
            icon={faAddressCard}
          />
          <InputFormElement
            className="w-full"
            placeholder="Task Name"
            value={form.name}
            autoFocus={false}
            onChange={(e) => dispatch(AdminTaskFormStore.actions.setName(e))}
            onBlur={() => onNameSubmit()}
            onKeyDown={(e: KeyboardEvent<any>) =>
              e.key == 'Enter' && onNameSubmit()
            }
            setOptions={{
              inputPadding: 'py-1.5',
              inputFont: 'text-xl font-bold cursor-pointer focus:cursor-text',
              inputFontColor: 'text-gray-300 placeholder:text-gray-400 ',
              inputRing: 'ring-0 focus:ring-2 ring-gray-800',
              inputFocus: 'focus:ring-blue-700',
            }}
          />
        </div>
        <TextareaFormElement
          name={
            <div className="flex text-sm items-center mr-2 font-semibold">
              Description
            </div>
          }
          rows={4}
          placeholder="This input provides a brief and clear synopsis of this task"
          noSuggestion
          value={form.description}
          onBlur={() => onDescSubmit()}
          onChange={(e) =>
            dispatch(AdminTaskFormStore.actions.setDescription(e))
          }
          setOptions={{
            inputRing: 'ring-0 focus:ring-2 ring-gray-800',
            inputFocus: 'focus:ring-blue-700',
          }}
        />

        {/* <div className="flex flex-col mb-8"> */}
        <LinkFormGraggable
          name={
            <div className="flex w-full mr-2 mb-2 text-sm justify-between items-center text-gray-300">
              <span className="font-semibold">Attached links</span>
              <FontAwesomeIcon
                className="text-sm p-1 hover:bg-gray-700 cursor-pointer"
                icon={faPlus}
                onClick={() => dispatch(AdminTaskFormStore.actions.newLink())}
              />
            </div>
          }
          noSuggestion
          placeholder={[
            'Displayed link name',
            'http://localhost:8000/projects',
          ]}
          values={form.links}
          onChange={(key, value, index) =>
            dispatch(AdminTaskFormStore.actions.setLinks([key, value, index]))
          }
          onDelete={(index) => onLinkSubmit('delete', index)}
          onSubmit={(e) => onLinkSubmit('add', form.links.length - 1)}
          onKeyDown={(e) =>
            e.key == 'Enter' && onLinkSubmit('add', form.links.length - 1)
          }
          onDragEnd={({ active, over }) =>
            ErrorService.envelop(async () => {
              const position = form.links.find((e) => e.id == over?.id)?.order ?? 1; // prettier-ignore
              if (!over?.id || position === null) return;

              dispatch(
                AdminTaskFormStore.actions.onLinkReorder(
                  arrayMove(
                    form.links.concat() as any,
                    form.links.findIndex((e) => e.id == active.id),
                    form.links.findIndex((e) => e.id == over.id),
                  ),
                ),
              );

              const body = new PositionEntity({ position, id: active.id, orderable: OrderableTypeEnum.links }); // prettier-ignore

              await PositionEntity.self.save.build(body);
              await reload();
            })
          }
        />
        {/* </div> */}

        <div className="flex flex-col mb-8">
          <div className="flex w-full mr-2 mb-2 text-sm justify-between items-center text-gray-300">
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              onChange={(event) => {
                ErrorService.envelop(async () => {
                  const files = Array.from(event.target.files);
                  const type = AttachmentAttachableTypeEnum.tasks;
                  await AttachmentService.saveAttachments(form, type, '/', files); // prettier-ignore

                  await reload();
                });
              }}
            />

            <span className="font-semibold">Attached files</span>
            <MenuFormElement
              className="mr-2"
              name={
                <FontAwesomeIcon
                  className="text-sm py-1 px-2.5 cursor-pointer"
                  icon={faEllipsisVertical}
                />
              }
              actions={{
                upload: 'Upload File',
                // delete: 'Delete File',
              }}
              onChange={(action) => {
                switch (action) {
                  case 'upload':
                    return fileRef.current.click();

                  // case 'delete':
                  //   return dispatch(AdminTaskFormStore.actions.initTrash());
                }
              }}
              setOptions={{
                buttonPadding: ' ',
                noChevronDown: true,
                buttonColor: 'hover:bg-gray-700',
              }}
              // itemComponent={props.itemComponent}
            />
          </div>

          <TableFormGraggable
            className={`rounded-md ${
              form.attachments?.length ? 'block' : 'hidden'
            }`}
            columns={{ name: 'Name', updated_at: 'Last updated' }}
            picked={form.picked}
            data={form.attachments}
            setOptions={{ overlayClassName: 'dark' }}
            onDragStart={(e) =>
              dispatch(
                AdminTaskFormStore.actions.onAttachmentPick(
                  e.active.id as string,
                ),
              )
            }
            onDragEnd={({ active, over }) =>
              ErrorService.envelop(async () => {
                const position = form.attachments.find((e) => e.id == over?.id)?.order ?? 1; // prettier-ignore

                if (!over?.id || position === null) {
                  return dispatch(
                    AdminTaskFormStore.actions.onAttachmentDrop(),
                  );
                }

                dispatch(
                  AdminTaskFormStore.actions.onAttachmentReorder(
                    arrayMove(
                      form.attachments.concat() as any,
                      form.attachments.findIndex((e) => e.id == active.id),
                      form.attachments.findIndex((e) => e.id == over.id),
                    ),
                  ),
                );

                const body = new PositionEntity({ position, id: active.id, orderable: OrderableTypeEnum.attachments }); // prettier-ignore

                await PositionEntity.self.save.build(body);
                await reload();
              })
            }
            onDragCancel={() =>
              dispatch(AdminTaskFormStore.actions.onAttachmentDrop())
            }
            onClick={(attachment: AdminAttachmentEntity) =>
              dispatch(AdminAttachmentStore.actions.init(attachment))
            }
            firstComponent={(props) =>
              props.row.type ? props.children : <span className="pl-7 py-6" />
            }
            dataComponent={{
              name: (attachment) => (
                <span
                  className={`group flex h-full whitespace-nowrap text-gray-300`}
                >
                  <FontAwesomeIcon
                    className="text-gray-400 text-lg mr-2"
                    icon={faFile}
                  />
                  {attachment.name}
                  <div id={attachment.id}></div>

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
        </div>

        <div
          className={`flex-col mb-8 ${
            form.contexts?.length ? 'flex' : 'hidden'
          }`}
        >
          <div className="flex w-full mr-2 mb-2 text-sm justify-between items-center text-gray-300">
            <span className="font-semibold">Checklist</span>
            <MenuFormElement
              className="mr-2"
              name={
                <FontAwesomeIcon
                  className="text-sm py-1 px-2.5 cursor-pointer"
                  icon={faEllipsisVertical}
                />
              }
              actions={{
                // upload: 'Upload File',
                delete: 'Delete checklist',
              }}
              onChange={(action) => {
                switch (action) {
                  case 'delete':
                  // TODO: ???????
                  // return dispatch(AdminTaskFormStore.actions.initTrash());
                }
              }}
              setOptions={{
                buttonPadding: ' ',
                noChevronDown: true,
                buttonColor: 'hover:bg-gray-700',
              }}
              // itemComponent={props.itemComponent}
            />
          </div>
          // TODO:
        </div>
      </div>

      <div className="flex flex-col w-full max-w-72 py-4 ml-4 space-y-4">
        <div className="flex mb-5 items-center justify-between">
          <MenuFormElement
            name={actions[form.stage_id]}
            actions={actions}
            onChange={(dst_stage_id: string) =>
              ErrorService.envelop(async () => {
                const body = new TaskPositionEntity({
                  position: 1,
                  id: form.id,
                  stage_id: dst_stage_id,
                  src_stage_id: form.stage_id,
                  orderable: OrderableTypeEnum.tasks,
                });

                await TaskPositionEntity.self.save.build(body);
                await reload(dst_stage_id);
              })
            }
            setOptions={{
              buttonPadding: 'py-1.5 px-3',
              buttonColor:
                'border border-gray-600 bg-transparent hover:bg-gray-700',
              buttonTextColor: 'text-gray-300',
            }}
          />

          <CustomYesNoPopupElement
            className="dark"
            title="Are you sure, you want to delete this task ?"
            open={deletePanel}
            onClose={() => openDeletePanel(false)}
            onNext={() => {
              ErrorService.envelop(async () => {
                await AdminTaskEntity.self.delete.exec(form);

                dispatch(AdminTaskFormStore.actions.reset());
                await reload();
              });
            }}
          />

          <MenuFormElement
            // className="mr-2"
            name={
              <FontAwesomeIcon
                className="text-sm py-2 px-3 cursor-pointer"
                icon={faEllipsisVertical}
              />
            }
            actions={{
              // status: `Make task ${}`,
              delete: 'Delete this task',
            }}
            onChange={(action) => {
              switch (action) {
                // case 'upload':
                //   return fileRef.current.click();

                case 'delete':
                  return openDeletePanel(true);
              }
            }}
            setOptions={{
              buttonPadding: ' ',
              noChevronDown: true,
              buttonColor: 'hover:bg-gray-700',
            }}
            // itemComponent={props.itemComponent}
          />
        </div>

        <DetailView
          name="Owner"
          value={
            <>
              <img
                src={form.owner?._avatar()}
                className={`mr-2 h-5 w-5 ${form.owner ? '' : 'hidden'}`}
                alt=""
              />
              <span className="text-sm">{form.owner?.name}</span>
              <NoneFormPreview hidden={!!form.owner} />
            </>
          }
        />

        <DetailView
          name="Tags"
          value={
            <div className="flex w-full  justify-between">
              <div className="flex flex-wrap space-x-1">
                <span className="hidden" />
                {form.tags.map((e) => (
                  <TagFormPreview key={e.id} name={e.name} />
                ))}
                <NoneFormPreview hidden={!!form.tags?.length} />
              </div>

              <DropdownFormElement
                name={<FontAwesomeIcon icon={faPenToSquare} />}
                contextComponent={
                  <InputListFormElement
                    name="Tags"
                    placeholder="Provide alternate names: test"
                    value={form.tag?.name || ''}
                    values={form.tags.map((e) => e.name)}
                    onChange={(e) =>
                      dispatch(AdminTaskFormStore.actions.setTag(e))
                    }
                    onSubmit={(e, index) => onTagSubmit(e, index)}
                    onKeyDown={(e) => e.key == 'Enter' && onTagSubmit('add', 0)}
                  />
                }
                setOptions={{
                  noChevronDown: true,
                  buttonPadding: 'p-1',
                  buttonColor: 'bg-gray-800 hover:bg-gray-700',
                  panelWidth: 'w-72',
                  panelPadding: 'py-2 px-3',
                }}
              />
            </div>
          }
        />

        <DetailView
          name="Checklist"
          value={
            form.contexts?.length ? (
              <div className="flex text-sm items-center w-full">
                <FontAwesomeIcon icon={faSquareCheck} />
                <span className="ml-2 font-semibold">
                  {form.contexts[0].outOf().join('/')}
                </span>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between">
                <NoneFormPreview />
                <FontAwesomeIcon
                  className="p-1 rounded bg-gray-800 hover:bg-gray-700 cursor-pointer"
                  icon={faPlus}
                  onClick={() =>
                    ErrorService.envelop(async () => {
                      const body = new AdminContextEntity({
                        name: 'Checklist',
                        contextable_id: form.id,
                        contextable_type: ContextContextableTypeEnum.tasks,
                      });

                      await AdminContextEntity.self.save.build(body);
                      await reload();
                    })
                  }
                />
              </div>
            )
          }
        />
      </div>
    </div>
  );
}

function DetailView(props: { name: ReactNode; value: ReactNode }) {
  return (
    <div className="flex w-full items-center text-gray-300">
      <span className="w-full max-w-36 text-xs font-bold">{props.name}</span>
      <div className="flex w-full items-center">{props.value}</div>
    </div>
  );
}
