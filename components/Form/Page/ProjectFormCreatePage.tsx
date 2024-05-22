import { useRouter } from 'next/router';
import { Dispatch, useCallback } from 'react';
import { ErrorService } from '../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import { AdminProjectEntity } from '../../../lib/project/entities/admin-project.entity';
import { AdminProjectFormStore } from '../../../lib/project/stores/admin-project-form.store';
import { ProjectTypeEnum } from '../../../lib/project/types/project-type.enum';
import { PROJECT_TYPES_OPTIONS } from '../../constants/projects';
import CheckFormElement from '../Elements/CheckFormElement';
import InputFormElement from '../Elements/InputFormElement';
import NextFormElement from '../Elements/NextFormElement';
import RadioFormElement from '../Elements/RadioFormElement';
import TextareaFormElement from '../Elements/TextareaFormElement';

export interface ProjectFormPageCreateProps {
  className?: string;
}

export default function ProjectFormCreatePage(
  props: ProjectFormPageCreateProps,
) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.project.form);

  const onSubmit = useCallback(() => {
    ErrorService.envelop(async () => {
      const copy = { ...form, id: null };
      const project = await dispatch(AdminProjectEntity.self.save.thunk(copy)).unwrap(); // prettier-ignore
      dispatch(AdminProjectFormStore.actions.reset());

      router.push({
        pathname: `${router.route}/[id]`,
        query: { id: project.id },
      });
    });
  }, [form]);

  return (
    // <div className="flex flex-col mx-auto max-w-3xl w-full">
    // {/* <div className="mt-8 ">
    //   <Link
    //     className="text-sm underline hover:text-indigo-600"
    //     href={{ pathname: `${router.route}/..` }}
    //   >
    //     Return back to the projects page
    //   </Link>
    // </div> */}
    // <div className="flex flex-col mx-5">
    <>
      <div className="flex mx-6 mt-3">
        {/* <span className="text-xl font-semibold mb-8">
          Create Project From Source Code
        </span> */}
        <RadioFormElement
          name="Project Provider"
          value={form.type}
          onChange={(e) => dispatch(AdminProjectFormStore.actions.setType(e))}
          options={PROJECT_TYPES_OPTIONS}
        />
        <div className="flex flex-col ml-6">
          <label className="block text-sm font-medium leading-6 text-gray-800">
            Initialize project with:
          </label>
          <CheckFormElement
            className={`mt-1 ${
              form.type == ProjectTypeEnum.link ? 'hidden' : ''
            }`}
            name="Add a README file"
            description="Delivers a comprehensive project overview from development point perspective"
            value={form.readme}
            onChange={() =>
              dispatch(AdminProjectFormStore.actions.invertREADME())
            }
          />
        </div>
      </div>

      <div className="mt-8 mx-5 space-y-7">
        <InputFormElement
          name="Project Name"
          placeholder="Project Name"
          value={form.name}
          onChange={(e) => dispatch(AdminProjectFormStore.actions.setName(e))}
          required
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

        <InputFormElement
          className={form.type != ProjectTypeEnum.link ? 'hidden' : ''}
          name="Redirect link"
          description="This redirection link will provide seamless access to the desired destination"
          placeholder="Provide in-depth project summary"
          value={form.link}
          required
          onChange={(e) => dispatch(AdminProjectFormStore.actions.setLink(e))}
        />
        {/* 
        <NextFormElement
          className="w-full bg-blue-100 p-3 rounded shadow-md"
          next="Create project"
          processing={form.processing}
          onNext={() => props.onSubmit?.()}
        /> */}
      </div>

      <div className="flex w-full my-6">
        <NextFormElement
          className="ml-auto mr-4"
          next="Create project"
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
