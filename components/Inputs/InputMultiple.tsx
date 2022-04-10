import { number } from "prop-types";
import { Col, InputGroup, Row } from "react-bootstrap";
import InputValue from "./InputValue";

export interface InputMultipleProps {
  char: string[];
  className?: string;
  root?: string;
  readFrom: string;
  writeTo?: string;
  type?: string;
  size: number;
  required?: boolean;
  placeholder?: string;

  lg?: { span?: number };
  md?: { span?: number };
  sm?: { span?: number };
}

export default function InputMultiple(props: InputMultipleProps) {
  return (
    // <Row className="justify-content-center">
    <Row className="px-2">
      {props.char.map((item, key) => (
        <InputGroup
          as={Col}
          key={key + item}
          className={`p-2 ${props.className ?? ""}`}
          lg={props.lg}
          md={props.md}
          sm={{ ...(props.sm ?? {}), order: key }}
        >
          <InputValue
            className="rounded-left"
            readFrom={`${props.readFrom}_${item}`}
            writeTo={`${props.writeTo ?? props.readFrom}_${item}`}
            type={props.type}
            required={props.required}
            placeholder={props.placeholder}
          />
          <InputGroup.Append className="w-50">
            <InputGroup.Text className="w-100 justify-content-center">
              {item}
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      ))}
    </Row>
  );
}
