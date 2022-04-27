import { useState } from "react";
import { Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Bounce, ToastContainer } from "react-toastify";
import DefaultPattern from "./DefaultPatterns";

export interface DefaultSettingsFormProps {
  // operation: string;
  // preview?: { [name: string]: any };
  // code?: { tree: TreeObj };
}

export default function DefaultSettingsForm(props: DefaultSettingsFormProps) {
  const dispatch = useDispatch();
  const root = useSelector((state: any) => state);
  const [validated, setValidated] = useState(false);

  return (
    <Form
      as={Col}
      noValidate
      className="p-3"
      validated={validated}
      onSubmit={async (event) => {
        event?.preventDefault();
        if (!event.currentTarget.checkValidity()) {
          event.stopPropagation();
          return setValidated(true);
        }
      }}
    >
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
    </Form>
  );
}
