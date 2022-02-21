import React, { useImperativeHandle, useState } from "react";
import { Path } from "../../../types/K3s/Ingress";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";

export interface PathProps {
  show?: boolean;
}

export interface PathRef {
  getValue: () => Path;
}

export default React.forwardRef((props: PathProps, ref) => {
  const [path, onPathChange] = useState<Path>({
    path: "",
    backend: {
      serviceName: "",
      servicePort: "",
    },
  });

  useImperativeHandle<unknown, PathRef>(ref, () => ({
    getValue: () => ({
      ...path,
      path: "/" + path.path,
      backend: {
        ...path.backend,
        servicePort: Number(path.backend?.servicePort),
      },
    }),
  }));

  return (
    <div className={`border rounded p-2 ${props.show ? "" : "d-none"}`}>
      <InputTemplate label="Path">
        <InputName
          name="path"
          char="/"
          value={path.path ?? ""}
          placeholder={"void"}
          onChange={({ target: { name, value } }) => {
            onPathChange({ ...path, [name]: value });
          }}
          // onBlur={onDataCache}
        />
      </InputTemplate>

      <InputTemplate label="Path Type">
        <InputRadio
          name="pathType"
          placeholder="Prefix"
          className="btn-group btn-group-sm btn-group-toggle"
          options={["ImplementationSpecific", "Exact", "Prefix"]}
          label="btn-outline-info"
          onChange={({ target: { name, value } }) => {
            onPathChange({ ...path, [name]: value });
          }}
        />
      </InputTemplate>

      <InputTemplate label="Service Name">
        <div className="input-group">
          <InputValue
            name="serviceName"
            className="rounded"
            value={path.backend?.serviceName ?? ""}
            placeholder={"test"}
            onChange={({ target: { name, value } }) => {
              onPathChange({
                ...path,
                backend: {
                  ...path.backend,
                  [name]: value,
                },
              } as Path);
            }}
            // onBlur={onDataCache}
          />
        </div>
      </InputTemplate>

      <InputTemplate label="Service Port">
        <div className="input-group">
          <InputValue
            name="servicePort"
            className="rounded"
            value={`${path.backend?.servicePort ?? ""}`}
            placeholder="8000"
            onChange={({ target: { name, value } }) => {
              onPathChange({
                ...path,
                backend: {
                  ...path.backend,
                  [name]: value,
                },
              } as Path);
            }}
            // onBlur={onDataCache}
          />
        </div>
      </InputTemplate>
    </div>
  );
});
