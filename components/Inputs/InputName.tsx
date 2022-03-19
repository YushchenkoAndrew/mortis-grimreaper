import React from "react";
import InputValue from "./InputValue";

export interface InputNameProps {
  char: string;
  root?: string;
  prefix: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export default function InputName(props: InputNameProps) {
  return (
    <div className="input-group">
      <div className="input-group-prepend">
        <span className="input-group-text">{props.char}</span>
      </div>
      <InputValue
        className="rounded-right"
        type={props.type}
        root={props.root}
        prefix={props.prefix}
        required={props.required}
        placeholder={props.placeholder}
      />
    </div>
  );
}
