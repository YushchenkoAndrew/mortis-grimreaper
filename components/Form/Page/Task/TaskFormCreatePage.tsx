import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { KeyboardEvent, useCallback } from 'react';
import { ErrorService } from '../../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../../lib/common/store';
import { AdminDashboardCollection } from '../../../../lib/dashboard/collections/admin-dashboard.collection';
import { AdminTaskEntity } from '../../../../lib/dashboard/entities/admin-task.entity';
import { AdminTaskFormStore } from '../../../../lib/dashboard/stores/admin-task-form.store';
import { AdminLinkEntity } from '../../../../lib/link/entities/admin-link.entity';
import { AdminTagEntity } from '../../../../lib/tag/entities/admin-tag.entity';
import LinkFormGraggable from '../../Draggable/LinkFormDraggable';
import DisclosureFormElement from '../../Elements/DisclosureFormElement';
import InputFormElement from '../../Elements/InputFormElement';
import InputListFormElement from '../../Elements/InputListFormElement';
import KeyValueFormElement from '../../Elements/KeyValueFormElement';
import NextFormElement from '../../Elements/NextFormElement';
import TextareaFormElement from '../../Elements/TextareaFormElement';

export interface TaskFormPageCreateProps {
  className?: string;
}

export default function TaskFormCreatePage(props: TaskFormPageCreateProps) {
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
        const body = new AdminTagEntity({ ...tag, taggable_id: res.id });
        await AdminTagEntity.self.save.build(body); // prettier-ignore
      }

      for (const link of form.links) {
        if (!link.name) continue;
        const body = new AdminLinkEntity({ ...link, linkable_id: res.id });
        await AdminLinkEntity.self.save.build(body); // prettier-ignore
      }

      dispatch(AdminTaskFormStore.actions.reset());
      await dispatch(AdminDashboardCollection.self.select.thunk({})); // prettier-ignore
    });
  }, [form]);

  const onKeyDown = (e: KeyboardEvent<any>) => e.key == 'Enter' && onSubmit();

  return (
    <>
      <div className="flex flex-col mt-8 mx-5 space-y-7">
        <InputFormElement
          name="Task Name"
          placeholder="Task Name"
          value={form.name}
          onChange={(e) => dispatch(AdminTaskFormStore.actions.setName(e))}
          onKeyDown={onKeyDown}
          required
        />

        <TextareaFormElement
          name="Description"
          description="This input provides a brief and clear synopsis of this task"
          placeholder="Provide task synopsis"
          value={form.description}
          onChange={(e) =>
            dispatch(AdminTaskFormStore.actions.setDescription(e))
          }
        />
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
          {/* <KeyValueFormElement
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
          /> */}

          <LinkFormGraggable
            noSuggestion
            placeholder={[
              'Displayed link name',
              'http://localhost:8000/projects',
            ]}
            values={form.links}
            onChange={(key, value, index) =>
              dispatch(AdminTaskFormStore.actions.setLinks([key, value, index]))
            }
            onDelete={(index) =>
              dispatch(AdminTaskFormStore.actions.delLink(index))
            }
            onSubmit={(e) => dispatch(AdminTaskFormStore.actions.addLink())}
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

      <div className="flex w-full my-4">
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
      </div>
    </>
  );
}
