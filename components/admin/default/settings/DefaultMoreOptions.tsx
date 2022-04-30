import {
  faPen,
  faPlus,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";
import { Col, Collapse, Form, InputGroup, Row, Button } from "react-bootstrap";
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
      <Row className="mr-auto pl-3">
        <InputGroup className="ml-4 d-flex justify-content-between">
          <Row className="py-3 w-75">
            <HoverButton
              name="Info  "
              variant="outline-info"
              icon={faSearch}
              event={{
                onClick: () =>
                  value.action === "info"
                    ? dispatch({
                        type: `${
                          props.writeTo || props.readFrom
                        }_INFO_CHANGED`.toUpperCase(),
                        value: !value.info,
                      })
                    : dispatch({
                        type: `${
                          props.writeTo || props.readFrom
                        }_ACTION_CHANGED`.toUpperCase(),
                        value: "info",
                      }),
              }}
            />
            {/* TODO: Add on click event */}
            <HoverButton
              name="Create"
              variant="outline-success"
              icon={faPlus}
              event={{
                onClick: () => {
                  dispatch({
                    type: `${
                      props.writeTo || props.readFrom
                    }_ACTION_CHANGED`.toUpperCase(),
                    value: "add",
                  });
                },
              }}
            />
            <HoverButton
              name="Edit  "
              variant="outline-warning"
              icon={faPen}
              event={{
                onClick: () => {
                  dispatch({
                    type: `${
                      props.writeTo || props.readFrom
                    }_ACTION_CHANGED`.toUpperCase(),
                    value: "edit",
                  });
                },
              }}
            />
            <HoverButton
              name="Delete"
              variant="danger"
              icon={faTrash}
              event={{
                onClick: () => {},
              }}
            />
          </Row>

          <Button
            hidden={!["add", "edit"].includes(value.action)}
            variant="outline-primary"
            className="my-auto"
          >
            Submit
          </Button>
        </InputGroup>
      </Row>
      <Collapse className="justify-content-center" in={value.info}>
        <div>{props.children}</div>
      </Collapse>
    </Form.Group>
  );
}
