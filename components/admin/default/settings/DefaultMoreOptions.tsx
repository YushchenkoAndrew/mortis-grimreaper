import {
  faPen,
  faPlus,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";
import { Col, Collapse, Form, InputGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import HoverButton from "../../../HoverButton";

export interface DefaultMoreOptionsProps {
  root: string;
  readFrom: string;
  writeTo?: string;
  children: ReactNode;
}

export default function DefaultMoreOptions(props: DefaultMoreOptionsProps) {
  const dispatch = useDispatch();
  const value = useSelector((state: any) =>
    props.readFrom.split("_").reduce((acc, curr) => acc[curr], state)
  );

  return (
    <Form.Group as={Col} className="mb-2">
      <Row className="mr-auto px-3" style={{ cursor: "pointer" }}>
        <InputGroup className="ml-4">
          <Row className="py-3 w-100">
            <HoverButton
              name="Info  "
              variant="outline-info"
              icon={faSearch}
              event={{
                onClick: () => {
                  dispatch({
                    type: `${
                      props.writeTo || props.readFrom
                    }_CHANGED`.toUpperCase(),
                    value: !value,
                  });
                },
              }}
            />
            {/* TODO: Add on click event */}
            <HoverButton
              name="Create"
              variant="outline-success"
              icon={faPlus}
            />
            <HoverButton name="Edit  " variant="outline-warning" icon={faPen} />
            <HoverButton name="Delete" variant="danger" icon={faTrash} />
          </Row>
        </InputGroup>
      </Row>
      <Collapse className="justify-content-center" in={value}>
        <div>{props.children}</div>
      </Collapse>
    </Form.Group>
  );
}
