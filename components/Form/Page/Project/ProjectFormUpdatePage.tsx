import { KeyboardEvent, useCallback } from 'react';
import { useValidate } from '../../../../hooks/useValidate';
import { ErrorService } from '../../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../../lib/common/store';
import { AdminLinkEntity } from '../../../../lib/link/entities/admin-link.entity';
import { AdminProjectEntity } from '../../../../lib/project/entities/admin-project.entity';
import { AdminProjectFormStore } from '../../../../lib/project/stores/admin-project-form.store';
import { AdminTagEntity } from '../../../../lib/tag/entities/admin-tag.entity';
import InputFormElement from '../../Elements/InputFormElement';
import InputListFormElement from '../../Elements/InputListFormElement';
import KeyValueFormElement from '../../Elements/KeyValueFormElement';
import NextFormElement from '../../Elements/NextFormElement';
import TextareaFormElement from '../../Elements/TextareaFormElement';

export interface ProjectFormPageUpdateProps {
  className?: string;
}

export default function ProjectFormUpdatePage(
  props: ProjectFormPageUpdateProps,
) {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.project.form);
  const errors = useValidate(AdminProjectEntity, form);

  const onSubmit = useCallback(() => {
    ErrorService.envelop(
      async () => {
        await dispatch(AdminProjectEntity.self.save.thunk(form)).unwrap(); // prettier-ignore

        for (const tag of form.del_tags) {
          await AdminTagEntity.self.delete.exec(tag.id); // prettier-ignore
        }

        for (const tag of form.tags) {
          if (tag.id) continue;
          await AdminTagEntity.self.save.build(tag); // prettier-ignore
        }

        for (const link of form.del_links) {
          await AdminLinkEntity.self.delete.exec(link.id); // prettier-ignore
        }

        for (const link of form.new_links) {
          if (!link.name) continue;
          await AdminLinkEntity.self.save.build(link); // prettier-ignore
        }

        await dispatch(AdminProjectEntity.self.load.thunk(form.id)); // prettier-ignore
        dispatch(AdminProjectFormStore.actions.reset());
      },
      { in_progress: true },
    );
  }, [form]);

  const onKeyDown = (e: KeyboardEvent<any>) => e.key == 'Enter' && onSubmit();

  return (
    <>
      <div className={`mt-6 space-y-7 ${props.className ?? ''}`}>
        <InputFormElement
          name="Project Name"
          placeholder="Project Name"
          value={form.name}
          errors={errors.name}
          onChange={(e) => dispatch(AdminProjectFormStore.actions.setName(e))}
          onKeyDown={onKeyDown}
        />

        <TextareaFormElement
          name="Description"
          description="This input provides a brief and clear synopsis of our project"
          placeholder="Provide project synopsis"
          value={form.description}
          errors={errors.description}
          onChange={(e) =>
            dispatch(AdminProjectFormStore.actions.setDescription(e))
          }
          onKeyDown={onKeyDown}
        />

        <TextareaFormElement
          name="Footer"
          description="This input with offer in-depth project description"
          placeholder="Provide in-depth project summary"
          value={form.footer}
          errors={errors.footer}
          onChange={(e) => dispatch(AdminProjectFormStore.actions.setFooter(e))}
          onKeyDown={onKeyDown}
        />

        <KeyValueFormElement
          name="Links"
          description="Provide links to offer in-depth external resources"
          placeholder={[
            'Displayed link name',
            'http://localhost:8000/projects',
          ]}
          values={form.new_links.map((e) => [e.name, e.link])}
          onChange={(key, value, index) =>
            dispatch(
              AdminProjectFormStore.actions.setLinks([key, value, index]),
            )
          }
          onSubmit={(e, index) =>
            dispatch(
              e == 'add'
                ? AdminProjectFormStore.actions.addLink()
                : AdminProjectFormStore.actions.delLink(index),
            )
          }
          onKeyDown={(e) =>
            e.key == 'Enter' &&
            dispatch(AdminProjectFormStore.actions.addLink())
          }
        />

        <InputListFormElement
          name="Tags"
          description="This input will provide alternate names for the project"
          placeholder="Provide alternate names: test"
          value={form.tag}
          values={form.tags.map((e) => e.name)}
          onChange={(e) => dispatch(AdminProjectFormStore.actions.setTag(e))}
          onSubmit={(e, index) =>
            dispatch(
              e == 'add'
                ? AdminProjectFormStore.actions.addTag()
                : AdminProjectFormStore.actions.delTag(index),
            )
          }
          onKeyDown={(e) =>
            e.key == 'Enter' && dispatch(AdminProjectFormStore.actions.addTag())
          }
        />

        {/* <InputFormElement
              name="Redirect link"
              description="This redirection link will provide seamless access to the desired destination"
              placeholder="Provide in-depth project summary"
              value={form.link}
              required
              onChange={(e) =>
                dispatch(AdminProjectFormStore.actions.setLink(e))
              }
            /> */}
      </div>

      <div className="flex w-full">
        <NextFormElement
          className="ml-auto mr-4 my-3"
          next="Save changes"
          back="Cancel"
          onNext={() => onSubmit()}
          onBack={() => dispatch(AdminProjectFormStore.actions.reset())}
          setOptions={{
            buttonPadding: 'py-1.5 px-4',
            nextButtonColor: 'text-white bg-green-600 hover:bg-green-700',
          }}
        />
      </div>
    </>
  );
}
