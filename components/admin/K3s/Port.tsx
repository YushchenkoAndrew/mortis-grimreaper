import React, { useImperativeHandle, useRef, useState } from "react";
import { InputGroup, Row } from "react-bootstrap";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";

export interface PortProps {
  show?: boolean;
  root?: string | (() => void);
  readFrom: string;
  writeTo: string;
}

export default function Port(props: PortProps) {
  // const [port, onPortChange] = useState<Port>({
  //   name: "",
  //   nodePort: "",
  //   port: "",
  //   protocol: "TCP",
  //   targetPort: "",
  // });

  // useImperativeHandle<unknown, PortRef>(ref, () => ({
  //   getValue: () =>
  //     Object.entries({
  //       ...port,
  //       port: Number(port.port ?? 0),
  //       nodePort: Number(port.nodePort ?? 0),
  //       targetPort: Number(port.targetPort ?? 0),
  //     } as Port).reduce(
  //       (acc, [key, item]) => (item ? { ...acc, [key]: item } : acc),
  //       {} as Port
  //     ),
  // }));

  return (
    <div className={`border rounded mx-1 p-2 ${props.show ? "" : "d-none"}`}>
      <InputTemplate label="Name" className="px-1">
        <InputName
          char="@"
          root={props.root}
          readFrom={`${props.readFrom}_name`}
          writeTo={`${props.writeTo}_name`}
          placeholder="void-port"
        />
      </InputTemplate>

      <InputTemplate label="Protocol" className="px-1">
        <InputRadio
          readFrom={`${props.readFrom}_protocol`}
          writeTo={`${props.writeTo}_protocol`}
          className="btn-group btn-group-sm btn-group-toggle"
          options={["TCP", "UDP", "HTTP", "PROXY"]}
          label="btn-outline-info"
        />
      </InputTemplate>

      <Row className="x-1">
        <InputTemplate className="col-6" label="Port">
          <InputGroup>
            <InputValue
              root={props.root}
              readFrom={`${props.readFrom}_port`}
              writeTo={`${props.writeTo}_port`}
              className="rounded"
              placeholder="8000"
            />
          </InputGroup>
        </InputTemplate>

        <InputTemplate className="col-6" label="Target Port">
          <InputGroup>
            <InputValue
              className="rounded"
              root={props.root}
              readFrom={`${props.readFrom}_targetPort`}
              writeTo={`${props.writeTo}_targetPort`}
              placeholder="3000"
            />
          </InputGroup>
        </InputTemplate>
      </Row>

      <InputTemplate label="Node Port" className="px-1">
        <InputGroup>
          <InputName
            char="?"
            root={props.root}
            readFrom={`${props.readFrom}_nodePort`}
            writeTo={`${props.writeTo}_nodePort`}
            placeholder="8000"
          />
        </InputGroup>
      </InputTemplate>
    </div>
  );
}
