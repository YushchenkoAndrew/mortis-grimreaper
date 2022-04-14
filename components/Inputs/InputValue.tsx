import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

export interface InputValueProps {
  root?: string | (() => void);
  readFrom: string;
  writeTo?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  isInvalid?: () => Promise<string | undefined>;
}

export default function InputValue(props: InputValueProps) {
  const [invalid, onValidation] = useState<string | undefined>(undefined);

  const dispatch = useDispatch();
  const value = useSelector((state: any) =>
    props.readFrom.split("_").reduce((acc, curr) => acc[curr], state)
  );

  return (
    <>
      <Form.Control
        value={value || ""}
        type={props.type ?? "text"}
        name={props.readFrom}
        disabled={props.disabled}
        className={`text-dark ${props.className ?? ""}`}
        placeholder={props.placeholder ?? ""}
        required={props.required}
        onChange={({ target: { value } }) =>
          dispatch({
            type: `${(props.writeTo ?? props.readFrom).toUpperCase()}_CHANGED`,
            readFrom: props.readFrom,
            value: value,
          })
        }
        onBlur={async () => {
          onValidation(await props.isInvalid?.());
          if (!props.root) return;

          if (typeof props.root === "function") return props.root();
          dispatch({ type: `${props.root}_CACHED`.toUpperCase() });
        }}
        isInvalid={!!invalid}
      />

      <Form.Control.Feedback
        hidden={!props.required && !invalid}
        type="invalid"
        tooltip
      >
        {invalid ?? "This field is required"}
      </Form.Control.Feedback>
    </>
  );
}
