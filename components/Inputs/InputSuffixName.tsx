import React from "react";
import InputValue from "./InputValue";

export interface InputSuffixNameProps {
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

export default function InputSuffixName(props: InputSuffixNameProps) {
  return (
    // <InputGroup hasValidation>
    //   <InputValue {...props} className="rounded-left" />
    //   <InputGroup.Append>
    //     <InputGroup.Text>{props.char}</InputGroup.Text>
    //   </InputGroup.Append>
    // </InputGroup>
    <></>
  );
}
