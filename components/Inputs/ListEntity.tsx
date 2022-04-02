import React, { useState } from "react";
import { Button, Col, Form, InputGroup } from "react-bootstrap";
import { DoubleType } from "./InputDoubleList";

export interface ListEntityProps {
  char: DoubleType<string>;
  // name: DoubleType<string>;
  value: DoubleType<string>;
  onChange: () => void;
}

export default function ListEntity(props: ListEntityProps) {
  return (
    <>
      <InputGroup as={Col} md="6" sm={{ order: 1 }} className="p-2">
        <InputGroup.Prepend>
          <InputGroup.Text>{props.char[0]}</InputGroup.Text>
        </InputGroup.Prepend>
        <li className="form-control">{props.value[0]}</li>
      </InputGroup>

      <InputGroup as={Col} md="6" sm={{ order: 2 }} className="p-2">
        <InputGroup.Prepend>
          <InputGroup.Text>{props.char[1]}</InputGroup.Text>
        </InputGroup.Prepend>
        <li className="form-control">{props.value[1]}</li>

        <InputGroup.Append>
          <Button variant="outline-danger" onClick={() => props.onChange()}>
            Delete
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </>
  );
}
