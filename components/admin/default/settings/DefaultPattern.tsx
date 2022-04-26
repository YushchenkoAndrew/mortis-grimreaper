import { Form, InputGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import InputTemplate from "../../../Inputs/InputTemplate";
import InputValue from "../../../Inputs/InputValue";

export interface DefaultPatternProps {
  show?: boolean;
  update?: boolean;
}

const PREFIX = "main";

export default function DefaultPatternForm(props: DefaultPatternProps) {
  const pattern = useSelector((state) => state[PREFIX]);
  const dispatch = useDispatch();

  return (
    <div className={props.show ? "" : "d-none"}>
      <hr />
      <Form.Row>
        <Form.Group className="w-100">
          <h4 className="font-weight-bold mb-3">Pattern</h4>
          <InputTemplate className="mb-3" label="Title">
            <InputGroup>
              <InputValue
                root={PREFIX}
                readFrom={`${PREFIX}_window`}
                className="rounded"
                placeholder={"ooooooooooooo"}
                required
              />
            </InputGroup>
          </InputTemplate>
        </Form.Group>
      </Form.Row>
      <hr />
    </div>
  );
}
