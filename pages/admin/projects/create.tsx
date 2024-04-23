import Container from '../../../components/Container/Container';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/Navbar';
import NavbarItem from '../../../components/Navbar/NavbarItem';
import RadioFormElement from '../../../components/Form/Elements/RadioFormElement';
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
import { GetServerSidePropsContext } from 'next';
import { options } from '../../api/admin/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { ProjectTypeEnum } from '../../../lib/project/types/project-type.enum';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function () {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const form = useAppSelector((state) => state.admin.project.form);

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
          <div className="mt-8 ">
            <Link
              className="text-sm underline hover:text-blue-600"
              href={{ pathname: `${router.route}/..` }}
            >
              Return back to the projects page
            </Link>
          </div>
          <span className="text-xl font-semibold mb-8 mt-2">
            Create Project From Source Code
          </span>
          <RadioFormElement
            name="Project Provider"
            value={form.type}
            onChange={(e) => dispatch(AdminProjectFormStore.actions.setType(e))}
            options={PROJECT_TYPES_OPTIONS}
          />

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

            {form.type == ProjectTypeEnum.link ? (
              <InputFormElement
                name="Redirect link"
                description="This redirection link will provide seamless access to the desired destination"
                placeholder="Provide in-depth project summary"
                value={form.link}
                required
                onChange={(e) =>
                  dispatch(AdminProjectFormStore.actions.setLink(e))
                }
              />
            ) : (
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
            )}

            <NextFormElement
              className="w-full bg-blue-100 p-3 rounded shadow-md"
              next="Create project"
              processing={form.processing}
              onNext={() =>
                ErrorService.envelop(async () => {
                  dispatch(AdminProjectEntity.self.save.thunk(form)).unwrap();
                })
              }
            />
          </div>
        </div>
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, options);
  if (!session) return { redirect: { destination: '/admin/login' } };

  return { props: ctx.params || {} };
}
