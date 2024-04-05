import { Dispatch } from 'react';
import { ProjectStepEnum } from '../../../entities/project/types/project-step.enum';
import { projectFormStore } from '../../../redux/reducer/admin/projects/project-form.reducer';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { PROJECT_TYPES_OPTIONS } from '../../constants/projects';
import Radio from '../../Radio/Radio';
import InputFormElement from '../Elements/InputFormElement';
import NextFormElement from '../Elements/NextFormElement';

export interface ProjectResourceFormProps {
  value: ProjectStepEnum;
  next: Dispatch<void>;
}

export default function ProjectResourceForm(props: ProjectResourceFormProps) {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.projects.form);

  return (
    <div className={props.value == form.step ? 'block' : 'hidden'}>
      <span className="text-xl font-semibold my-8">
        Create Project From Source Code
      </span>
      <Radio
        name="Project Provider"
        value={form.type}
        onChange={(e) => dispatch(projectFormStore.actions.setType(e))}
        options={PROJECT_TYPES_OPTIONS}
      ></Radio>

      <div className="mt-8 space-y-7">
        <InputFormElement
          name="Project Name"
          placeholder="Project Name"
          value={form.name}
          onChange={(e) => dispatch(projectFormStore.actions.setName(e))}
          required
        />

        <InputFormElement
          name="Description"
          description="This input provides a brief and clear synopsis of our project"
          placeholder="Provide project synopsis"
          value={form.description}
          onChange={(e) => dispatch(projectFormStore.actions.setDescription(e))}
        />

        <InputFormElement
          name="Footer"
          description="This input with offer in-depth project description"
          placeholder="Provide in-depth project summary"
          value={form.footer}
          onChange={(e) => dispatch(projectFormStore.actions.setFooter(e))}
        />

        <NextFormElement processing={form.processing} next={props.next} />
      </div>
    </div>
  );
}
