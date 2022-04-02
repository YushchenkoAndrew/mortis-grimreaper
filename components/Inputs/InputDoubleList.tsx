import React, { useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import InputValue from "./InputValue";

export type DoubleType<Type> = {
  0: Type;
  1: Type;
};
export interface InputValueProps {
  char: DoubleType<string>;
  className?: string;
  root?: string;
  readFrom: string;
  writeTo?: string;
  type?: DoubleType<string>;
  required?: DoubleType<boolean>;
  placeholder?: DoubleType<string>;
}

export default function InputList(props: InputValueProps) {
  const values = useSelector((state: any) =>
    `temp_${props.readFrom}`.split("_").reduce((acc, curr) => acc[curr], state)
  );
  const dispatch = useDispatch();

  const writeTo = `temp_${props.writeTo ?? props.readFrom}`;
  const readFrom: DoubleType<string> = [
    `temp_${props.readFrom}_0`,
    `temp_${props.readFrom}_1`,
  ];

  return (
    <Form.Row className={props.className}>
      <InputGroup as={Col} md="6" sm={{ order: 1 }} className="p-2">
        <InputGroup.Prepend>
          <InputGroup.Text>{props.char[0]}</InputGroup.Text>
        </InputGroup.Prepend>
        <InputValue
          className="rounded-right"
          readFrom={readFrom[0]}
          writeTo={writeTo}
          type={props.type?.[0]}
          required={props.required?.[0]}
          placeholder={props.placeholder?.[0]}
        />
      </InputGroup>
      <InputGroup as={Col} md="6" sm={{ order: 2 }} className="p-2">
        <InputGroup.Prepend>
          <InputGroup.Text>{props.char[1]}</InputGroup.Text>
        </InputGroup.Prepend>
        <InputValue
          className="rounded-right"
          readFrom={readFrom[1]}
          writeTo={writeTo}
          type={props.type?.[1]}
          required={props.required?.[1]}
          placeholder={props.placeholder?.[1]}
        />
        <InputGroup.Append>
          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              if (!values[0] || !values[1]) return;

              dispatch({
                type: `${
                  props.writeTo ?? props.readFrom
                }_CHANGED`.toUpperCase(),
                readFrom: props.readFrom,
                name: values[1],
                value: values[0],
              });

              dispatch({
                type: `${writeTo}_CHANGED`.toUpperCase(),
                readFrom: readFrom[0],
                value: "",
              });

              dispatch({
                type: `${writeTo}_CHANGED`.toUpperCase(),
                readFrom: readFrom[1],
                value: "",
              });

              if (!props.root) return;
              dispatch({ type: `${props.root}_CACHED`.toUpperCase() });
            }}
          >
            Create
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form.Row>
  );
}
