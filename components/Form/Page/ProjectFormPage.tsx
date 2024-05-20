import { useRouter } from 'next/router';
import { Dispatch, KeyboardEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import { AdminProjectFormStore } from '../../../lib/project/stores/admin-project-form.store';
import InputFormElement from '../Elements/InputFormElement';
import InputListFormElement from '../Elements/InputListFormElement';
import KeyValueFormElement from '../Elements/KeyValueFormElement';
import TextareaFormElement from '../Elements/TextareaFormElement';

export interface ProjectFormPageProps {
  className?: string;
  onSubmit?: Dispatch<void>;
}

export default function ProjectFormPage(props: ProjectFormPageProps) {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.project.form);

  const onKeyDown = (e: KeyboardEvent<any>) =>
    e.key == 'Enter' && props.onSubmit?.();

  return (
    <div className={`mt-6 space-y-7 ${props.className ?? ''}`}>
      <InputFormElement
        name="Project Name"
        placeholder="Project Name"
        value={form.name}
        onChange={(e) => dispatch(AdminProjectFormStore.actions.setName(e))}
        onKeyDown={onKeyDown}
      />

      <TextareaFormElement
        name="Description"
        description="This input provides a brief and clear synopsis of our project"
        placeholder="Provide project synopsis"
        value={form.description}
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
        onChange={(e) => dispatch(AdminProjectFormStore.actions.setFooter(e))}
        onKeyDown={onKeyDown}
      />

      <KeyValueFormElement
        name="Links"
        description="Provide links to offer in-depth external resources"
        placeholder={['Displayed link name', 'http://localhost:8000/projects']}
        values={form.new_links.map((e) => [e.name, e.link])}
        onChange={(key, value, index) =>
          dispatch(AdminProjectFormStore.actions.setLinks([key, value, index]))
        }
        onSubmit={(e, index) =>
          dispatch(
            e == 'add'
              ? AdminProjectFormStore.actions.addLink()
              : AdminProjectFormStore.actions.delLink(index),
          )
        }
        onKeyDown={(e) =>
          e.key == 'Enter' && dispatch(AdminProjectFormStore.actions.addLink())
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
  );
}
