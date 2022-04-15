import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

export interface InputTextProps {
  root?: string;
  readFrom: string;
  writeTo?: string | ((item: string) => void);
  rows?: number;
  required?: boolean;
  placeholder?: string;
}

export default function InputText(props: InputTextProps) {
  const value = useSelector((state: any) =>
    props.readFrom.split("_").reduce((acc, curr) => acc[curr], state)
  );
  const dispatch = useDispatch();

  return (
    <InputGroup>
      <Form.Control
        as="textarea"
        value={value || ""}
        name={props.readFrom}
        className="form-control rounded text-dark"
        placeholder={props.placeholder ?? ""}
        rows={props.rows ?? 3}
        required={props.required}
        onChange={({ target: { value } }) => {
          if (typeof props.writeTo === "function") {
            return props.writeTo(value);
          }

          dispatch({
            type: `${props.writeTo ?? props.readFrom}_CHANGED`.toUpperCase(),
            value,
          });
        }}
        onBlur={() => {
          if (!props.root) return;
          dispatch({ type: `${props.root}_CACHED`.toUpperCase() });
        }}
      />
      <Form.Control.Feedback hidden={!props.required} type="invalid" tooltip>
        This field is required
      </Form.Control.Feedback>
    </InputGroup>
  );
}
