import { Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ProjectInfo } from "../../../config/placeholder";
import InputName from "../../Inputs/InputName";
import InputTemplate from "../../Inputs/InputTemplate";

export interface DefaultLinkFooterProps {
  root?: string;
  readFrom: string;
}

export default function DefaultLinkFooter(props: DefaultLinkFooterProps) {
  return (
    <div className="d-flex justify-content-center mb-3">
      <Form.Group as={Col} className="w-100 px-0">
        <h4 className="font-weight-bold mb-3">Additional Info</h4>
        <InputTemplate className="mb-3" label="Redirect Link">
          <InputName
            char="http://"
            root={props.root}
            readFrom={`${props.readFrom}_links_main`}
            required
            placeholder={ProjectInfo.link}
          />
        </InputTemplate>
      </Form.Group>
    </div>
  );
}
