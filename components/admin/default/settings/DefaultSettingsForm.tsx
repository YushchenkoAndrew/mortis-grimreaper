import { Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultPattern from "./DefaultPatterns";
export interface DefaultSettingsFormProps {
  // operation: string;
  // preview?: { [name: string]: any };
  // code?: { tree: TreeObj };
}

export default function DefaultSettingsForm(props: DefaultSettingsFormProps) {
  const root = useSelector((state: any) => state);

  return (
    <Col className="py-3 px-0 w-100">
      <ToastContainer
        // position="top-right"
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        transition={Bounce}
        closeOnClick
        rtl={false}
        draggable
      />

      <DefaultPattern show={root.main.window === "Patterns"} />
      {/* <DefaultCodeView show={root.main.window === "Code"} /> */}
      {/* <DefaultK3sConfig show={root.main.window === "Config"} /> */}
    </Col>
  );
}
