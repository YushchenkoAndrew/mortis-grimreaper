import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Collapse } from "react-bootstrap";
import InputName from "../../Inputs/InputName";
import InputTemplate from "../../Inputs/InputTemplate";

export interface NamespaceProps {
  hidden?: boolean;
  root?: string | (() => void);
  readFrom: string;
  writeTo: string;
}

export default function Namespace(props: NamespaceProps) {
  const [minimized, onMinimized] = useState(true);

  return (
    <div hidden={props.hidden} className="card px-1 py-3">
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
        <Collapse in={minimized}>
          <div>
            <div className="border rounded mx-1 p-2">
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
          </div>
        </Collapse>
      </InputTemplate>
    </div>
  );
}
