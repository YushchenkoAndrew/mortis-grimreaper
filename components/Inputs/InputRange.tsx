import { useState } from "react";
import { Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

export interface InputRangeProps {
  root?: string | (() => void);
  readFrom: string;
  writeTo?: string | ((item: string) => void);
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
    <Form.Group as={Row} className="mx-2">
      <input
        value={value || ""}
        type="range"
        name={props.readFrom}
        className={`range-slider my-2 px-2 ${props.className ?? ""}`}
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

      <span
        className="justify-content-center py-1 border rounded primary m-1"
        style={{
          backgroundColor: "#eee",
          display: "flex",
          width: "3rem",
          height: "2.2rem",
        }}
      >
        {value}
      </span>
    </Form.Group>
  );
}
