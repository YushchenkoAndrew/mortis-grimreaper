import React, { useImperativeHandle, useRef, useState } from "react";
import { InputGroup, Row } from "react-bootstrap";
// import { Event } from "../../../pages/admin/projects/operation";
import { Port } from "../../../types/K3s/Deployment";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";

export interface ContainerPortProps {
  show?: boolean;

  root?: string;
  readFrom: string;
  writeTo: string;
}

// export interface ContainerPortRef {
//   getValue: () => Port;
// }

export default function ContainerPort(props: ContainerPortProps) {
  // const [port, onPortChange] = useState<Port>({
  //   containerPort: "",
  //   hostIP: "",
  //   hostPort: "",
  //   name: "",
  //   protocol: "TCP",
  // });

  // useImperativeHandle<unknown, ContainerPortRef>(ref, () => ({
  //   getValue: () =>
  //     Object.entries({
  //       ...port,
  //       containerPort: Number(port.containerPort),
  //       hostPort: Number(port.hostPort),
  //     } as Port).reduce(
  //       (acc, [key, item]) => (item ? { ...acc, [key]: item } : acc),
  //       {} as Port
  //     ),
  // }));

  return (
    <div
      className={`border rounded mx-1 px-2 py-2 ${props.show ? "" : "d-none"}`}
    >
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

      <Row className="px-1">
        <InputTemplate className="col-6" label="Port">
          <InputGroup>
            <InputValue
              className="rounded"
              required
              root={props.root}
              readFrom={`${props.readFrom}_containerPort`}
              writeTo={`${props.writeTo}_containerPort`}
              placeholder="8000"
            />
          </InputGroup>
        </InputTemplate>

        <InputTemplate className="col-6" label="Target Port">
          <InputGroup>
            <InputValue
              className="rounded"
              root={props.root}
              readFrom={`${props.readFrom}_hostPort`}
              writeTo={`${props.writeTo}_hostPort`}
              placeholder="8000"
            />
          </InputGroup>
        </InputTemplate>
      </Row>

      <InputTemplate label="Host IP" className="px-1">
        <div className="input-group">
          <InputName
            char="?"
            root={props.root}
            readFrom={`${props.readFrom}_hostIP`}
            writeTo={`${props.writeTo}_hostIP`}
            placeholder="127.0.0.1"
          />
        </div>
      </InputTemplate>
    </div>
  );
}
