import {
  faEllipsisVertical,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import { PROJECTS_ACTIONS } from '../../../components/constants/projects';
import MenuFormElement from '../../../components/Form/Elements/MenuFormElement';
import NextFormElement from '../../../components/Form/Elements/NextFormElement';
import { ErrorService } from '../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../lib/common/store';
import { AdminProjectPageEntity } from '../../../lib/project/entities/admin-project-page.entity';
import { AdminProjectEntity } from '../../../lib/project/entities/admin-project.entity';
import { AdminProjectsStore } from '../../../lib/project/stores/admin-projects.store';
import { options } from '../../api/admin/auth/[...nextauth]';
import InputFormElement from '../../../components/Form/Elements/InputFormElement';
import NoData from '../../../components/Container/NoData';
import { useEffect, useMemo, useRef, useState } from 'react';
import AdminLayout from '../../../components/Container/Layout/AdminLayout';
import PopupFormElement from '../../../components/Form/Elements/PopupFormElement';
import ProjectFormCreatePage from '../../../components/Form/Page/ProjectFormCreatePage';
import { AdminProjectFormStore } from '../../../lib/project/stores/admin-project-form.store';
import ProjectCardSortable from '../../../components/Form/Sortable/ProjectCardSortable';
import CustomProjectDraggable from '../../../components/Form/Custom/Draggable/CustomProjectDraggable';

export default function () {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const trash = useAppSelector((state) => state.admin.projects.trash);
  const new_project = useAppSelector((state) => state.admin.project.form.id);
  const total = useAppSelector((state) => state.admin.projects.total);

  const className =
    'max-w-96 md:max-w-[calc(49.5rem)] lg:max-w-[calc(74rem)] 2xl:max-w-[calc(99rem)]';

  useEffect(() => {
    const autofocus = () => inputRef.current.focus();

    addEventListener('keydown', autofocus);
    return () => removeEventListener('keydown', autofocus);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      ErrorService.envelop(async () => {
        const page = await AdminProjectPageEntity.self.select.build({ page: 1, query }); // prettier-ignore
        dispatch(AdminProjectsStore.actions.search([query, page]));
      });
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <AdminLayout title="Admin Projects">
      <div className={`flex mx-auto w-full my-4 ${className}`}>
        <div className="flex -ml-1 w-full max-w-72">
          <InputFormElement
            ref={inputRef}
            className="w-full"
            value={query}
            placeholder="Search..."
            onChange={(v) => setQuery(v)}
            setOptions={{
              inputFocus:
                'bg-gray-100 focus:bg-white focus:ring-inset ring-gray-400',
              inputPadding: 'py-[calc(0.1875rem)] pl-8 pr-3',
              divClassName: 'relative',
              headComponent: (
                <FontAwesomeIcon
                  className="absolute py-0.5 inset-y-0 start-0 flex items-center ml-2 mt-1.5 pointer-events-none text-gray-500"
                  icon={faMagnifyingGlass}
                />
              ),
            }}
          />
        </div>
        <div className="flex ml-auto mr-2">
          <PopupFormElement
            open={!!new_project}
            onClose={() => dispatch(AdminProjectFormStore.actions.reset())}
            setOptions={{ panelSize: 'sm:w-full sm:max-w-4xl' }}
          >
            <div className="flex text-sm font-medium text-gray-800 bg-gray-100 px-4 py-3 border-b border-gray-300">
              Create project details
            </div>

            <ProjectFormCreatePage className="flex flex-col mx-5 mb-3" />
          </PopupFormElement>

          <NextFormElement
            className={`${trash ? 'hidden' : ''} mr-3`}
            setOptions={{ buttonPadding: 'py-1.5 px-3' }}
            next="New Project"
            onNext={() => dispatch(AdminProjectFormStore.actions.setId('null'))}
          />

          <NextFormElement
            className={`${trash ? '' : 'hidden'} mr-2`}
            setOptions={{ buttonPadding: 'py-1.5 px-3' }}
            next="Delete projects..."
            onNext={() =>
              ErrorService.envelop(async () => {
                if (!trash) return;
                for (const id in trash) {
                  await AdminProjectEntity.self.delete.exec(id);
                }

                router.reload();
              })
            }
            onBack={() => dispatch(AdminProjectsStore.actions.clearTrash())}
          />

          <MenuFormElement
            disabled={!!trash}
            name={<FontAwesomeIcon icon={faEllipsisVertical} />}
            className="mr-3"
            actions={PROJECTS_ACTIONS}
            setOptions={{
              buttonPadding: 'py-2 px-3.5',
              buttonColor:
                'bg-transparent border border-gray-400 hover:border-gray-500 hover:bg-gray-200 disabled:bg-gray-200 disabled:hover:border-gray-400',
              buttonTextColor: 'text-gray-700 disabled:text-gray-400',
              noChevronDown: true,
            }}
            onChange={(action) => {
              switch (action) {
                case 'delete':
                  return dispatch(AdminProjectsStore.actions.initTrash());
              }
            }}
          />
        </div>
      </div>

      <NoData
        className={`h-[calc(100vh-9rem)] ${className} ${
          total ? 'hidden' : 'block'
        }`}
        title="No projects found"
      />

      <CustomProjectDraggable CardComponent={ProjectCardSortable} />
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, options);
  if (!session) return { redirect: { destination: '/admin/login' } };

  return { props: ctx.params || {} };
}
