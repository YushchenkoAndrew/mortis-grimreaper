import DefaultHeader from '../../components/admin/default/DefaultHeader';
import DefaultHead from '../../components/Header/Header';
import defaultServerSideHandler from '../../lib/auth';
import DefaultFooter from '../../components/default/DefaultFooter';
import { store } from '../../redux/admin/settings/storage';
import { Provider } from 'react-redux';
import DefaultSettingsForm from '../../components/admin/default/settings/DefaultSettingsForm';
import DefaultSettingsSideBar from '../../components/admin/default/settings/DefaultSettingsSideBar';
import DefaultNav from '../../components/admin/default/DefaultNav';

export default function AdminSettings() {
  return (
    <>
      <DefaultHead>
        <title>Settings</title>
      </DefaultHead>
      <DefaultHeader />

      <Provider store={store}>
        {/* <Container className="mt-3">
          <Row>
            <DefaultSettingsSideBar readFrom="main_window" />
            <DefaultSettingsForm></DefaultSettingsForm>
          </Row>
        </Container> */}
      </Provider>

      <DefaultFooter name="Menu">
        <ul className="list-unstyled">
          <DefaultNav style="text-muted" />
        </ul>
      </DefaultFooter>
    </>
  );
}

export const getServerSideProps = defaultServerSideHandler;
