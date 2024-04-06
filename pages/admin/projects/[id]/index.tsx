import { faFile } from '@fortawesome/free-regular-svg-icons';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { marked } from 'marked';
import { PROJECT_FILE_ACTIONS } from '../../../../components/constants/projects';
import Container from '../../../../components/Container/Container';
import { RenderHtml } from '../../../../components/dynamic';
import MenuFormElement from '../../../../components/Form/Elements/MenuFormElement';
import TableFormElement from '../../../../components/Form/Elements/TableFormElement';
import Header from '../../../../components/Header/Header';
import Navbar from '../../../../components/Navbar/Navbar';
import NavbarItem from '../../../../components/Navbar/NavbarItem';
import { Config } from '../../../../config';
import { NAVIGATION } from '../../../../constants';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';

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
          <div className="flex items-center">
            <img
              className="h-14 w-auto rounded my-8 mr-3"
              src={Config.self.github.src}
              alt="Admin"
            />

            <span className="text-2xl font-semibold">
              {form.name || 'test'}
            </span>
            <MenuFormElement
              className="ml-auto"
              name="Action"
              actions={PROJECT_FILE_ACTIONS}
              onChange={() => null}
            />
          </div>
          <TableFormElement
            className="mb-8"
            columns={{ name: 'Name', updated_at: 'Last updated' }}
            data={[
              {
                id: 'yes1',
                name: '/Test.js',
                updated_at: '2024-04-05T21:41:26.660Z',
              },

              {
                id: 'yes2',
                name: '/temp/Test2.js',
                updated_at: '2024-04-05T21:41:26.660Z',
              },
            ]}
            first={(value) => {
              const index = value.indexOf('/', 1);
              return (
                <span className="flex text-gray-800 whitespace-nowrap">
                  <FontAwesomeIcon
                    className="text-gray-500 text-lg mr-2"
                    icon={index != -1 ? faFolder : faFile}
                  />
                  {value.slice(1, index != -1 ? index : undefined)}
                </span>
              );
            }}
          />

          <div className="relative overflow-x-auto border rounded-md">
            <div className="flex text-sm font-medium text-gray-800 bg-gray-100 px-4 py-2">
              <FontAwesomeIcon
                className="text-gray-500 text-lg mr-1.5"
                icon={faFile}
              />
              README
            </div>

            <RenderHtml
              className="w-full p-5"
              html={marked.parse(
                '# Marked in the browser\n\nRendered by **marked**.',
              )}
            />
          </div>
        </div>
      </Container>
    </>
  );
}

// export const getServerSideProps = defaultServerSideHandler;
