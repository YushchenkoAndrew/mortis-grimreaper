import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import InputName from "../../Inputs/InputName";
import InputTemplate from "../../Inputs/InputTemplate";

export interface NamespaceProps {
  show?: boolean;
  root?: string;
  readFrom: string;
  writeTo: string;
}

export default function Namespace(props: NamespaceProps) {
  const [minimized, onMinimized] = useState(true);

  return (
    <div className={`card px-1 py-3 ${props.show ? "" : "d-none"}`}>
      <InputTemplate
        className="px-0"
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
          <InputTemplate className="w-100 px-1" label="Name">
            <InputName
              char="@"
              root={props.root}
              readFrom={`${props.readFrom}_metadata_name`}
              writeTo={`${props.writeTo}_metadata_name`}
              placeholder="demo"
              required
            />
          </InputTemplate>
        </div>
      </InputTemplate>
    </div>
  );
}
