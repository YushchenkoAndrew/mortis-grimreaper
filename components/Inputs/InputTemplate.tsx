import React from "react";

export interface InputTemplateProps {
  className?: string;
  labelClassName?: string;
  label: any;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function InputTemplate(props: InputTemplateProps) {
  return (
    // <Form.Group as={Col} className={`mb-2 ${props.className}`}>
    //   <Form.Label
    //     className={`mr-3 mb-0 ${props.labelClassName ?? ""}`}
    //     style={props.onClick && { cursor: "pointer" }}
    //     onClick={props.onClick}
    //   >
    //     {props.label}
    //   </Form.Label>
    //   {props.children}
    // </Form.Group>
    <></>
  );
}
