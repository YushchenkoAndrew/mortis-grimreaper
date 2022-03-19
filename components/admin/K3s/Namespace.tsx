import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useImperativeHandle, useState } from "react";
import { Namespace as NamespaceType } from "../../../types/K3s/Namespace";
import InputName from "../../Inputs/InputName";
import InputTemplate from "../../Inputs/InputTemplate";

export interface NamespaceProps {
  show?: boolean;
  root?: string;
  prefix: string;
}

export interface NamespaceRef {
  getValue: () => NamespaceType;
}

export default function Namespace(props: NamespaceProps) {
  const [minimized, onMinimized] = useState(true);
  const [namespace, onNamespaceChange] = useState<NamespaceType>({
    apiVersion: "v1",
    kind: "Namespace",
    metadata: { name: "" },
    spec: {},
    status: {},
  });

  // useImperativeHandle<unknown, NamespaceRef>(ref, () => ({
  //   getValue: () => ({ ...namespace }),
  // }));

  return (
    <div className={`card px-1 py-3 ${props.show ? "" : "d-none"}`}>
      <InputTemplate
        labelClassName="font-weight-bold mx-2"
        label={[
          "Metadata ",
          <FontAwesomeIcon
            key={"icon-metadata"}
            icon={minimized ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() => onMinimized(!minimized)}
      >
        <div className={`border rounded mx-1 p-2 ${minimized ? "" : "d-none"}`}>
          <InputTemplate className="w-100" label="Name">
            <InputName
              char="@"
              root={props.root}
              prefix={`${props.prefix}_name`}
              // name="name"
              required
              // value={namespace.metadata?.name ?? ""}
              placeholder="demo"
              // onChange={({ target: { name, value } }) => {
              //   onNamespaceChange({
              //     ...namespace,
              //     metadata: {
              //       ...namespace.metadata,
              //       [name]: value,
              //     },
              //   });
              // }}
              // onBlur={onDataCache}
            />
          </InputTemplate>
        </div>
      </InputTemplate>
    </div>
  );
}
