import React from "react";
import { InputGroup } from "react-bootstrap";
import InputValue from "./InputValue";

export interface InputNameProps {
  char: string;
  root?: string | (() => void);
  readFrom: string;
  writeTo?: string | ((item: string) => void);
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  isInvalid?: () => Promise<string | undefined>;
}

export default function InputName(props: InputNameProps) {
  return (
    <InputGroup hasValidation>
      <InputGroup.Prepend>
        <InputGroup.Text>{props.char}</InputGroup.Text>
      </InputGroup.Prepend>
      <InputValue {...props} className="rounded-right" />
    </InputGroup>
  );
}
