import DefaultHeader from "../../components/admin/default/DefaultHeader";
import DefaultHead from "../../components/default/DefaultHead";
import defaultServerSideHandler from "../../lib/api/session";
import { Container } from "react-bootstrap";
import DefaultFooter from "../../components/default/DefaultFooter";
import DefaultNav from "../../components/admin/default/DefaultNav";
import { store } from "../../redux/admin/settings/storage";
import { Provider } from "react-redux";
import DefaultSettingsSideBar from "../../components/admin/default/DefaultSettingsSideBar";

export default function AdminSettings() {
  return (
    <>
      <DefaultHead>
        <title>Settings</title>
      </DefaultHead>
      <DefaultHeader />

      <Provider store={store}>
        <Container className="mt-3">
          <DefaultSettingsSideBar readFrom="main_window" />
        </Container>
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
