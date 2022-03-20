import React, { useImperativeHandle, useRef, useState } from "react";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";

export interface PortProps {
  show?: boolean;
  root?: string;
  readFrom: string;
  writeTo: string;
}

// export interface PortRef {
//   getValue: () => Port;
// }

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

  // function onChange({ target: { name, value } }: Event) {
  //   onPortChange({ ...port, [name]: value });
  // }

  return (
    <div className={`border rounded mx-1 p-2 ${props.show ? "" : "d-none"}`}>
      <InputTemplate label="Name">
        <InputName
          char="@"
          root={props.root}
          readFrom={`${props.readFrom}_name`}
          writeTo={`${props.writeTo}_name`}
          placeholder="void-port"
          // name="name"
          // value={port.name ?? ""}
          // onChange={onChange}
          // onBlur={onDataCache}
        />
      </InputTemplate>

      <InputTemplate label="Protocol">
        <InputRadio
          readFrom={`${props.readFrom}_protocol`}
          writeTo={`${props.writeTo}_protocol`}
          className="btn-group btn-group-sm btn-group-toggle"
          options={["TCP", "UDP", "HTTP", "PROXY"]}
          label="btn-outline-info"
          // name="protocol"
          // placeholder="TCP"
          // onChange={onChange}
        />
      </InputTemplate>

      <div className="row w-100">
        <InputTemplate className="col-6" label="Port">
          <div className="input-group">
            <InputValue
              root={props.root}
              readFrom={`${props.readFrom}_port`}
              writeTo={`${props.writeTo}_port`}
              className="rounded"
              placeholder="8000"
              // name="port"
              // onChange={onChange}
              // onBlur={onDataCache}
            />
          </div>
        </InputTemplate>

        <InputTemplate className="col-6" label="Target Port">
          <div className="input-group">
            <InputValue
              className="rounded"
              // name="targetPort"
              // value={`${port.targetPort ?? ""}`}
              root={props.root}
              readFrom={`${props.readFrom}_targetPort`}
              writeTo={`${props.writeTo}_targetPort`}
              placeholder="3000"
              // onChange={onChange}
              // onBlur={onDataCache}
            />
          </div>
        </InputTemplate>
      </div>

      <InputTemplate label="Node Port">
        <div className="input-group">
          <InputName
            char="?"
            root={props.root}
            readFrom={`${props.readFrom}_nodePort`}
            writeTo={`${props.writeTo}_nodePort`}
            placeholder="8000"
            // name="nodePort"
            // value={`${port.nodePort ?? ""}`}
            // onChange={onChange}
            // onBlur={onDataCache}
          />
        </div>
      </InputTemplate>
    </div>
  );
}
