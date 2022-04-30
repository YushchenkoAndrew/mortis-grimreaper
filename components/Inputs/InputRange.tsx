import { ElementType } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

export interface InputRangeProps {
  root?: string | (() => void);
  readFrom: string;
  writeTo?: string | ((item: string) => void);
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  property?: { max?: number; min?: number; step?: number };
}

export default function InputRange(props: InputRangeProps) {
  const dispatch = useDispatch();
  const value = useSelector((state: any) =>
    props.readFrom.split("_").reduce((acc, curr) => acc[curr], state)
  );

  return (
    <Form.Group as={Row} className={`m-2 ${props.className ?? ""}`}>
      <Col xs="3" sm="2" md="3" lg="2" className="text-center">
        <Form.Label as="small" className="mb-0">
          {props.label}
        </Form.Label>
        <span
          className="py-1 border justify-content-center rounded primary mx-auto"
          style={{
            backgroundColor: "#eee",
            display: "flex",
            width: "3rem",
            height: "2.2rem",
          }}
        >
          {value || "-"}
        </span>
        {/* </Row> */}
      </Col>
      <Col xs="9" sm="10" md="9" lg="10" className="pr-0 pt-3">
        <input
          value={value || ""}
          type="range"
          name={props.readFrom}
          className="range-slider my-2 px-2"
          placeholder={props.placeholder ?? ""}
          required={props.required}
          disabled={props.disabled}
          onChange={({ target: { value } }) => {
            if (typeof props.writeTo === "function") {
              return props.writeTo(value);
            }

            dispatch({
              type: `${props.writeTo ?? props.readFrom}_CHANGED`.toUpperCase(),
              readFrom: props.readFrom,
              value: value,
            });
          }}
          onBlur={async () => {
            if (!props.root) return;

            if (typeof props.root === "function") return props.root();
            dispatch({ type: `${props.root}_CACHED`.toUpperCase() });
          }}
          {...(props.property ?? {})}
        />
      </Col>
    </Form.Group>
  );
}
