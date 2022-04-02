import DefaultHeader from "../../components/admin/default/DefaultHeader";
import DefaultHead from "../../components/default/DefaultHead";
import defaultServerSideHandler from "../../lib/api/session";

export default function AdminSettings() {
  return (
    <>
      <DefaultHead>
        <title>Settings</title>
      </DefaultHead>
      <DefaultHeader />
    </>
  );
}

export const getServerSideProps = defaultServerSideHandler;
