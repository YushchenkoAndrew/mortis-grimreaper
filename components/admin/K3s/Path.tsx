import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";

export interface PathProps {
  hidden?: boolean;
  root?: string | (() => void);
  readFrom: string;
  writeTo: string;
}

export default function Path(props: PathProps) {
  return (
    <div hidden={props.hidden} className="border rounded p-2">
      <InputTemplate label="Path" className="px-1">
        <InputName
          char="/"
          root={props.root}
          readFrom={`${props.readFrom}_path`}
          writeTo={`${props.writeTo}_path`}
          placeholder={"void"}
        />
      </InputTemplate>

      <InputTemplate label="Path Type" className="px-1">
        <InputRadio
          readFrom={`${props.readFrom}_pathType`}
          writeTo={`${props.writeTo}_pathType`}
          className="btn-group btn-group-sm btn-group-toggle"
          options={["ImplementationSpecific", "Exact", "Prefix"]}
          label="btn-outline-info"
        />
      </InputTemplate>

      <InputTemplate label="Service Name" className="px-1">
        <div className="input-group">
          <InputValue
            className="rounded"
            root={props.root}
            readFrom={`${props.readFrom}_backend_serviceName`}
            writeTo={`${props.writeTo}_backend_serviceName`}
            placeholder={"test"}
          />
        </div>
      </InputTemplate>

      <InputTemplate label="Service Port" className="px-1">
        <div className="input-group">
          <InputValue
            className="rounded"
            root={props.root}
            readFrom={`${props.readFrom}_backend_servicePort`}
            writeTo={`${props.writeTo}_backend_servicePort`}
            placeholder="8000"
          />
        </div>
      </InputTemplate>
    </div>
  );
}
