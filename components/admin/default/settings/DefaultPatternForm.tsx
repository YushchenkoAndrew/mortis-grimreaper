import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import HoverButton from "../../../HoverButton";
import InputRadio from "../../../Inputs/InputRadio";
import InputTemplate from "../../../Inputs/InputTemplate";
import InputValue from "../../../Inputs/InputValue";
// import styles from "./DefaultPatternForm.module.scss";

export interface DefaultPatternFormProps {
  root: string;
  readFrom: string;
  writeTo?: string;
}

export default function DefaultPatternForm(props: DefaultPatternFormProps) {
  return (
    <>
      <Row>
        <InputGroup as={Col} xs="3">
          <InputTemplate className="mb-3" label="Mode">
            <InputRadio
              root={props.root}
              readFrom={`${props.readFrom}_window`}
              options={["Stroke", "Fill", "Join"]}
              label="btn-sm btn-outline-info"
              writeTo={(value) => {}}
            />
          </InputTemplate>
        </InputGroup>

        <InputGroup as={Col} xs="3" className="pl-0 ">
          <InputTemplate className="mb-3" label="Colors">
            <InputValue
              root={props.root}
              readFrom={`${props.readFrom}_window`}
              className="rounded"
              placeholder={"5"}
              disabled
              required
            />
          </InputTemplate>
        </InputGroup>

        <InputGroup as={Col} xs="3" className="pl-0 ">
          <InputTemplate className="mb-3" label="Max Scale">
            <InputValue
              root={props.root}
              readFrom={`${props.readFrom}_window`}
              className="rounded"
              placeholder={"5"}
              disabled
              required
            />
          </InputTemplate>
        </InputGroup>

        <InputGroup as={Col} xs="3" className="pl-0 ">
          <InputTemplate className="mb-3" label="Max Scale">
            <InputValue
              root={props.root}
              readFrom={`${props.readFrom}_window`}
              className="rounded"
              placeholder={"5"}
              disabled
              required
            />
          </InputTemplate>
        </InputGroup>
      </Row>

      <InputGroup as={Col} xs="4" className="pl-0">
        <InputTemplate className="mb-3" label="Title">
          <InputValue
            root={props.root}
            readFrom={`${props.readFrom}_window`}
            className="rounded"
            placeholder={"ooooooooooooo"}
            disabled
            required
          />
        </InputTemplate>
      </InputGroup>

      <InputTemplate className="mb-3" label="Title">
        <InputGroup>
          <InputValue
            root={props.root}
            readFrom={`${props.readFrom}_window`}
            className="rounded"
            placeholder={"ooooooooooooo"}
            required
          />
        </InputGroup>
      </InputTemplate>
    </>
  );
}
