import React, { useState } from "react";
import { Button, Col, Form, FormControl, InputGroup } from "react-bootstrap";
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
        <FormControl as="li" className="text-truncate">
          {props.value[0]}
        </FormControl>
      </InputGroup>

      <InputGroup as={Col} md="6" sm={{ order: 2 }} className="p-2">
        <InputGroup.Prepend>
          <InputGroup.Text>{props.char[1]}</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl as="li" className="text-truncate">
          {props.value[1]}
        </FormControl>

        <InputGroup.Append>
          <Button variant="outline-danger" onClick={() => props.onChange()}>
            Delete
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </>
  );
}
