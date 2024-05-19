import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import { AdminProjectFormStore } from '../../../lib/project/stores/admin-project-form.store';
import InputFormElement from '../Elements/InputFormElement';
import TextareaFormElement from '../Elements/TextareaFormElement';

export interface ProjectFormPageProps {
  className?: string;
}

export default function ProjectFormPage(props: ProjectFormPageProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.project.form);

  return (
    <div className={`mt-6 space-y-7 ${props.className ?? ''}`}>
      <InputFormElement
        name="Project Name"
        placeholder="Project Name"
        value={form.name}
        onChange={(e) => dispatch(AdminProjectFormStore.actions.setName(e))}
      />

      <TextareaFormElement
        name="Description"
        description="This input provides a brief and clear synopsis of our project"
        placeholder="Provide project synopsis"
        value={form.description}
        onChange={(e) =>
          dispatch(AdminProjectFormStore.actions.setDescription(e))
        }
      />

      <TextareaFormElement
        name="Footer"
        description="This input with offer in-depth project description"
        placeholder="Provide in-depth project summary"
        value={form.footer}
        onChange={(e) => dispatch(AdminProjectFormStore.actions.setFooter(e))}
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
