import Container from '../../../components/Container/Container';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/Navbar';
import NavbarItem from '../../../components/Navbar/NavbarItem';
import Radio from '../../../components/Radio/Radio';
import { Config } from '../../../config';
import { NAVIGATION } from '../../../constants';
import { PROJECT_TYPES_OPTIONS } from '../../../components/constants/projects';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import { AdminProjectFormStore } from '../../../lib/project/stores/admin-project-form.store';
import InputFormElement from '../../../components/Form/Elements/InputFormElement';
import CheckFormElement from '../../../components/Form/Elements/CheckFormElement';
import NextFormElement from '../../../components/Form/Elements/NextFormElement';
import { ErrorService } from '../../../lib/common/error.service';
import { AdminProjectEntity } from '../../../lib/project/entities/admin-project.entity';

export default function () {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.projects.form);

  return (
    <>
      <Header title="Admin project create"></Header>

      <Container
        Navbar={
          <Navbar
            Item={NavbarItem}
            navigation={NAVIGATION.admin}
            avatar={Config.self.github}
          />
        }
      >
        <div className="flex flex-col mx-auto max-w-3xl w-full">
          <span className="text-xl font-semibold my-8">
            Create Project From Source Code
          </span>
          <Radio
            name="Project Provider"
            value={form.type}
            onChange={(e) => dispatch(AdminProjectFormStore.actions.setType(e))}
            options={PROJECT_TYPES_OPTIONS}
          ></Radio>

          <div className="mt-8 space-y-7">
            <InputFormElement
              name="Project Name"
              placeholder="Project Name"
              value={form.name}
              onChange={(e) =>
                dispatch(AdminProjectFormStore.actions.setName(e))
              }
              required
            />

            <InputFormElement
              name="Description"
              description="This input provides a brief and clear synopsis of our project"
              placeholder="Provide project synopsis"
              value={form.description}
              onChange={(e) =>
                dispatch(AdminProjectFormStore.actions.setDescription(e))
              }
            />

            <InputFormElement
              name="Footer"
              description="This input with offer in-depth project description"
              placeholder="Provide in-depth project summary"
              value={form.footer}
              onChange={(e) =>
                dispatch(AdminProjectFormStore.actions.setFooter(e))
              }
            />

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-800">
                Initialize project with:
              </label>
              <CheckFormElement
                className="mt-1"
                name="Add a README file"
                description="Delivers a comprehensive project overview from development point perspective"
                value={form.readme}
                onChange={() =>
                  dispatch(AdminProjectFormStore.actions.invertREADME())
                }
              />
            </div>

            <NextFormElement
              name="Create project"
              processing={form.processing}
              onNext={() =>
                ErrorService.envelop(
                  dispatch(AdminProjectEntity.self.save.thunk(form)).unwrap,
                )
              }
            />
          </div>
        </div>
      </Container>
    </>
  );
}

// export const getServerSideProps = defaultServerSideHandler;
