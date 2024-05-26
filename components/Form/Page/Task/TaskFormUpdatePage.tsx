import { faAddressCard, faFile } from '@fortawesome/free-regular-svg-icons';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { KeyboardEvent, useCallback } from 'react';
import { ErrorService } from '../../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../../lib/common/store';
import { AdminDashboardCollection } from '../../../../lib/dashboard/collections/admin-dashboard.collection';
import { AdminTaskEntity } from '../../../../lib/dashboard/entities/admin-task.entity';
import { AdminTaskFormStore } from '../../../../lib/dashboard/stores/admin-task-form.store';
import { AdminLinkEntity } from '../../../../lib/link/entities/admin-link.entity';
import { AdminTagEntity } from '../../../../lib/tag/entities/admin-tag.entity';
import DisclosureFormElement from '../../Elements/DisclosureFormElement';
import InputFormElement from '../../Elements/InputFormElement';
import InputListFormElement from '../../Elements/InputListFormElement';
import KeyValueFormElement from '../../Elements/KeyValueFormElement';
import NextFormElement from '../../Elements/NextFormElement';
import TableFormElement from '../../Elements/TableFormElement';
import TextareaFormElement from '../../Elements/TextareaFormElement';

export interface TaskFormPageUpdateProps {
  className?: string;
}

export default function TaskFormUpdatePage(props: TaskFormPageUpdateProps) {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.dashboard.task.form);

  const onSubmit = useCallback(() => {
    ErrorService.envelop(async () => {
      const body = new AdminTaskEntity({ name: form.name, stage_id: form.stage_id }); // prettier-ignore
      const res = await dispatch(AdminTaskEntity.self.save.thunk(body)).unwrap(); // prettier-ignore

      if (form.description) {
        const body = new AdminTaskEntity({ description: form.description, id: res.id, stage_id: form.stage_id }); // prettier-ignore
        await dispatch(AdminTaskEntity.self.save.thunk(body)).unwrap(); // prettier-ignore
      }

      for (const tag of form.tags) {
        if (tag.id) continue;
        await AdminTagEntity.self.save.build(tag); // prettier-ignore
      }

      for (const link of form.new_links) {
        if (!link.name) continue;
        await AdminLinkEntity.self.save.build(link); // prettier-ignore
      }

      dispatch(AdminTaskFormStore.actions.reset());
      await dispatch(AdminDashboardCollection.self.select.thunk({})); // prettier-ignore
    });
  }, [form]);

  const onKeyDown = (e: KeyboardEvent<any>) => e.key == 'Enter' && onSubmit();

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
            onKeyDown={onKeyDown}
            setOptions={{
              inputPadding: 'py-1.5',
              inputFont: 'text-xl font-bold cursor-pointer focus:cursor-text',
              inputFontColor: 'text-gray-300 placeholder:text-gray-400 ',
              inputRing:
                'ring-0 focus:ring-2 ring-gray-800 focus:ring-gray-600',
              inputFocus: 'focus:ring-gray-800',
            }}
          />
        </div>
        {/* <div className="flex w-full items-center text-xl text-gray-300 font-bold ">
          <FontAwesomeIcon className="mr-2" icon={faAddressCard} />
          <span>Description</span>
        </div> */}
        <TextareaFormElement
          name={
            <div className="flex text-lg items-center mr-2 font-bold">
              <FontAwesomeIcon className="mr-2" icon={faBarsStaggered} />
              <span>Description</span>
            </div>
          }
          rows={4}
          placeholder="This input provides a brief and clear synopsis of this task"
          noSuggestion
          value={form.description}
          onChange={(e) =>
            dispatch(AdminTaskFormStore.actions.setDescription(e))
          }
          setOptions={{
            inputRing: 'ring-0 focus:ring-2 ring-gray-800 focus:ring-gray-600',
            inputFocus: 'focus:ring-gray-800',
          }}
        />

        <TableFormElement
          // TODO: Use draggable instead !!!!!!!!!
          noHeader
          className="mb-6 "
          columns={{ name: 'Name', updated_at: 'Last updated' }}
          data={new Array(5).fill({
            id: 'random',
            name: 'test',
            updated_at: new Date().toISOString(),
          })}
          dataComponent={{
            name: (attachment) => (
              <span className="flex h-full whitespace-nowrap text-gray-800">
                <FontAwesomeIcon
                  className="text-gray-500 text-lg mr-2"
                  icon={faFile}
                />
                {attachment.name}
                {/* {attachment._filepath()} */}
              </span>
            ),
            updated_at: (attachment) => moment(attachment.updated_at).toNow(),
          }}
          firstComponent={() => <span className="pl-7 py-6" />}
          setOptions={{ rowColor: 'bg-white', dataPadding: 'pr-6' }}
        />

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
          name="Links"
          description="Provide links to offer in-depth external resources"
        >
          <KeyValueFormElement
            // name="Links"
            placeholder={[
              'Displayed link name',
              'http://localhost:8000/projects',
            ]}
            values={form.new_links.map((e) => [e.name, e.link])}
            onChange={(key, value, index) =>
              dispatch(AdminTaskFormStore.actions.setLinks([key, value, index]))
            }
            onSubmit={(e, index) =>
              dispatch(
                e == 'add'
                  ? AdminTaskFormStore.actions.addLink()
                  : AdminTaskFormStore.actions.delLink(index),
              )
            }
            onKeyDown={(e) =>
              e.key == 'Enter' && dispatch(AdminTaskFormStore.actions.addLink())
            }
          />
        </DisclosureFormElement>

        <DisclosureFormElement
          name="Tags"
          description="This input will provide alternate names for the tag"
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
      </div>
    </div>
  );
}
