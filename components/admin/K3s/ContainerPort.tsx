import React, { useImperativeHandle, useRef, useState } from "react";
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

  // function onChange({ target: { name, value } }: Event) {
  //   onPortChange({ ...port, [name]: value });
  // }

  return (
    <div
      className={`border rounded mx-1 px-2 py-2 ${props.show ? "" : "d-none"}`}
    >
      <InputTemplate label="Name">
        <InputName
          char="@"
          // name="name"
          // value={port.name ?? ""}

          root={props.root}
          readFrom={`${props.readFrom}_name`}
          writeTo={`${props.writeTo}_name`}
          placeholder="void-port"
          // onChange={onChange}
          // onBlur={onDataCache}
        />
      </InputTemplate>

      <InputTemplate label="Protocol">
        <InputRadio
          // name="protocol"
          // placeholder="TCP"
          readFrom={`${props.readFrom}_protocol`}
          writeTo={`${props.writeTo}_protocol`}
          className="btn-group btn-group-sm btn-group-toggle"
          options={["TCP", "UDP", "HTTP", "PROXY"]}
          label="btn-outline-info"
          // onChange={onChange}
        />
      </InputTemplate>

      <div className="row w-100">
        <InputTemplate className="col-6" label="Port">
          <div className="input-group">
            <InputValue
              // name="containerPort"
              className="rounded"
              required
              // value={`${port.containerPort ?? ""}`}

              root={props.root}
              readFrom={`${props.readFrom}_containerPort`}
              writeTo={`${props.writeTo}_containerPort`}
              placeholder="8000"
              // onChange={onChange}
              // onBlur={onDataCache}
            />
          </div>
        </InputTemplate>

        <InputTemplate className="col-6" label="Target Port">
          <div className="input-group">
            <InputValue
              // name="hostPort"
              className="rounded"
              root={props.root}
              readFrom={`${props.readFrom}_hostPort`}
              writeTo={`${props.writeTo}_hostPort`}
              // value={`${port.hostPort ?? ""}`}
              placeholder="8000"
              // onChange={onChange}
              // onBlur={onDataCache}
            />
          </div>
        </InputTemplate>
      </div>

      <InputTemplate label="Host IP">
        <div className="input-group">
          <InputName
            // name="hostIP"
            char="?"
            root={props.root}
            readFrom={`${props.readFrom}_hostIP`}
            writeTo={`${props.writeTo}_hostIP`}
            // value={port.hostIP ?? ""}
            placeholder="127.0.0.1"
            // onChange={onChange}
            // onBlur={onDataCache}
          />
        </div>
      </InputTemplate>
    </div>
  );
}
