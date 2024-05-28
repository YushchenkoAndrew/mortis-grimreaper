import { faAddressCard, faFile } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { KeyboardEvent, useCallback, useRef } from 'react';
import { AttachmentService } from '../../../../lib/attachment/attachment.service';
import { AttachmentAttachableTypeEnum } from '../../../../lib/attachment/types/attachment-attachable-type.enum';
import { ErrorService } from '../../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../../lib/common/store';
import { AdminDashboardCollection } from '../../../../lib/dashboard/collections/admin-dashboard.collection';
import { AdminTaskEntity } from '../../../../lib/dashboard/entities/admin-task.entity';
import { AdminDashboardStore } from '../../../../lib/dashboard/stores/admin-dashboard.store';
import { AdminTaskFormStore } from '../../../../lib/dashboard/stores/admin-task-form.store';
import { AdminLinkEntity } from '../../../../lib/link/entities/admin-link.entity';
import { AdminTagEntity } from '../../../../lib/tag/entities/admin-tag.entity';
import NoData from '../../../Container/NoData';
import TableFormGraggable from '../../Draggable/TableFormDraggable';
import DisclosureFormElement from '../../Elements/DisclosureFormElement';
import InputFormElement from '../../Elements/InputFormElement';
import InputLinkFormElement from '../../Elements/InputLinkFormElement';
import InputListFormElement from '../../Elements/InputListFormElement';
import KeyValueFormElement from '../../Elements/KeyValueFormElement';
import MenuFormElement from '../../Elements/MenuFormElement';
import NextFormElement from '../../Elements/NextFormElement';
import TableFormElement from '../../Elements/TableFormElement';
import TextareaFormElement from '../../Elements/TextareaFormElement';
import TooltipFormPreview from '../../Previews/TooltipFormPreview';

export interface TaskFormPageUpdateProps {
  className?: string;
}

export default function TaskFormUpdatePage(props: TaskFormPageUpdateProps) {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.dashboard.task.form);

  const fileRef = useRef<HTMLInputElement>(null);
  const formIdRef = useRef<string>(null);
  formIdRef.current = form.id;

  const reload = async () => {
    const dashboard: AdminDashboardCollection = await dispatch(AdminDashboardCollection.self.select.thunk({})).unwrap(); // prettier-ignore
    const stage = dashboard.stages.find((e) => e.id == form.stage_id);
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
      const entity = form.new_links[index];
      if (!entity) return;

      const body = new AdminLinkEntity({ ...entity, name: entity.name || entity.link }); // prettier-ignore
      if (action == 'delete') await AdminLinkEntity.self.delete.exec(entity.id);
      else await AdminLinkEntity.self.save.build(body);

      await reload();
    });

  return (
    <div className="flex mt-2 mx-5 my-6">
      <div className="flex flex-col w-full space-y-4">
        <div className="flex w-full items-center">
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

        <div className="flex flex-col mb-8">
          <InputLinkFormElement
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
            values={form.new_links.map((e) => e && [e.name, e.link])}
            onChange={(key, value, index) =>
              dispatch(AdminTaskFormStore.actions.setLinks([key, value, index]))
            }
            onSubmit={(e, index) =>
              onLinkSubmit(e, e == 'add' ? form.new_links.length - 1 : index)
            }
            onKeyDown={(e) =>
              e.key == 'Enter' && onLinkSubmit('add', form.new_links.length - 1)
            }
          />
        </div>

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
                delete: 'Delete File',
              }}
              onChange={(action) => {
                switch (action) {
                  case 'upload':
                    return fileRef.current.click();

                  case 'delete':
                  // TODO:
                  // return dispatch(AdminProjectStore.actions.initTrash());
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
            // TODO: Use draggable instead !!!!!!!!!
            className={`rounded-md ${
              form.attachments?.length ? 'block' : 'hidden'
            }`}
            columns={{ name: 'Name', updated_at: 'Last updated' }}
            picked={null}
            data={form.attachments}
            onDragStart={
              (e) => null
              // dispatch(AdminProjectStore.actions.onPick(e.active.id as string))
            }
            onDragEnd={
              ({ active, over }) => null
              // ErrorService.envelop(async () => {
              //   const position = attachments.find((e) => e.id == over?.id)?.order ?? 1; // prettier-ignore

              //   if (!over?.id || position === null) {
              //     return dispatch(AdminProjectStore.actions.onDrop());
              //   }

              //   dispatch(
              //     AdminProjectStore.actions.onReorder(
              //       arrayMove(
              //         attachments.concat() as any,
              //         attachments.findIndex((e) => e.id == active.id),
              //         attachments.findIndex((e) => e.id == over.id),
              //       ),
              //     ),
              //   );

              //   await AdminAttachmentEntity.self.save.build(
              //     new PositionEntity({ position }),
              //     {
              //       method: 'PUT',
              //       route: `admin/attachments/${active.id}/order`,
              //     },
              //   );

              //   await dispatch(
              //     AdminProjectEntity.self.load.thunk(router.query.id),
              //   ).unwrap();
              // })
            }
            onDragCancel={
              () => null
              // dispatch(AdminProjectStore.actions.onDrop())
            }
            onClick={
              null
              //   (attachment: AdminAttachmentEntity) => {
              //   if (!trash) return redirect(AttachmentService.filepath(attachment)); // prettier-ignore
              //   if (attachment.type) return dispatch(AdminProjectStore.actions.pushTrash(attachment)); // prettier-ignore

              //   const files = attachments.filter((e) => e.path.startsWith(`/${attachment.name}/`)); // prettier-ignore
              //   dispatch(AdminProjectStore.actions.pushTrash(files.concat(attachment) as any)); // prettier-ignore
              // }
            }
            firstComponent={(props) =>
              props.row.type ? props.children : <span className="pl-7 py-6" />
            }
            dataComponent={{
              name: (attachment) => (
                <span
                  className={`group flex h-full whitespace-nowrap ${
                    // trash?.[attachment.id]
                    //   ? 'line-through text-gray-500' :
                    'text-gray-300'
                  }`}
                >
                  <FontAwesomeIcon
                    className="text-gray-400 text-lg mr-2"
                    icon={faFile}
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
        </div>

        {/* <InputFormElement
            className="w-full"
            placeholder="Task Name"
            value={form.name}
            autoFocus={false}
            onChange={(e) => dispatch(AdminTaskFormStore.actions.setName(e))}
            onKeyDown={onKeyDown}
            setOptions={{
              inputPadding: 'py-1.5',
              inputFont: 'text-xl font-bold cursor-pointer focus:cursor-text',
              inputFontColor: 'text-gray-300 placeholder:text-gray-400 ',
              inputRing:
                'ring-0 focus:ring-2 ring-gray-800 focus:ring-gray-600',
              inputFocus: 'focus:ring-gray-800',
            }}
          /> */}

        {/* <TextareaFormElement
          name="Description"
          description="This input provides a brief and clear synopsis of this task"
          placeholder="Provide task synopsis"
          value={form.description}
          onChange={(e) =>
            dispatch(AdminTaskFormStore.actions.setDescription(e))
          }
        /> */}
        {/* <DisclosureFormElement
          name="Attachments"
          description="Provide attachments to offer in-depth external resources"
        >
          <InputListFormElement
            placeholder="Provide alternate names: test"
            value={form.tag}
            values={form.tags.map((e) => e.name)}
            onChange={(e) => dispatch(AdminTaskFormStore.actions.setTag(e))}
            onSubmit={(e, index) =>
              dispatch(
                e == 'add'
                  ? AdminTaskFormStore.actions.addTag()
                  : AdminTaskFormStore.actions.delTag(index),
              )
            }
            onKeyDown={(e) =>
              e.key == 'Enter' && dispatch(AdminTaskFormStore.actions.addTag())
            }
          />
        </DisclosureFormElement> */}

        <DisclosureFormElement
          name="Tags"
          description="This input will provide alternate names for the tag"
          // TODO: Only display tags list, and on add add another popup/dropdown ???
        >
          <InputListFormElement
            placeholder="Provide alternate names: test"
            value={form.tag}
            values={form.tags.map((e) => e.name)}
            onChange={(e) => dispatch(AdminTaskFormStore.actions.setTag(e))}
            onSubmit={(e, index) =>
              dispatch(
                e == 'add'
                  ? AdminTaskFormStore.actions.addTag()
                  : AdminTaskFormStore.actions.delTag(index),
              )
            }
            onKeyDown={(e) =>
              e.key == 'Enter' && dispatch(AdminTaskFormStore.actions.addTag())
            }
          />
        </DisclosureFormElement>
      </div>

      {/* <div className="flex w-full my-4">
        <NextFormElement
          className="ml-auto mr-4"
          next="Create Task"
          back="Cancel"
          onNext={() => onSubmit()}
          onBack={() => dispatch(AdminTaskFormStore.actions.reset())}
          setOptions={{
            buttonPadding: 'py-1.5 px-4',
            nextButtonColor: 'text-white bg-green-600 hover:bg-green-700',
          }}
        />
      </div> */}

      <div className="w-72">
        <span className="text-gray-300">some stuff goes here</span>
        <InputListFormElement
          placeholder="Provide alternate names: test"
          value={form.tag}
          values={form.tags.map((e) => e.name)}
          onChange={(e) => dispatch(AdminTaskFormStore.actions.setTag(e))}
          onSubmit={(e, index) =>
            dispatch(
              e == 'add'
                ? AdminTaskFormStore.actions.addTag()
                : AdminTaskFormStore.actions.delTag(index),
            )
          }
          onKeyDown={(e) =>
            e.key == 'Enter' && dispatch(AdminTaskFormStore.actions.addTag())
          }
        />
      </div>
    </div>
  );
}
