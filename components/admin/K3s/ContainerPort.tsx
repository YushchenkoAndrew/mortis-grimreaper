import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";

export interface ContainerPortProps {
  hidden?: boolean;

  root?: string | (() => void);
  readFrom: string;
  writeTo: string;
}

export default function ContainerPort(props: ContainerPortProps) {
  return (
    // <div hidden={props.hidden} className="border rounded mx-1 px-2 py-2">
    //   <InputTemplate label="Name" className="px-1">
    //     <InputName
    //       char="@"
    //       root={props.root}
    //       readFrom={`${props.readFrom}_name`}
    //       writeTo={`${props.writeTo}_name`}
    //       placeholder="void-port"
    //     />
    //   </InputTemplate>

    //   <InputTemplate label="Protocol" className="px-1">
    //     <InputRadio
    //       readFrom={`${props.readFrom}_protocol`}
    //       writeTo={`${props.writeTo}_protocol`}
    //       className="btn-group btn-group-sm btn-group-toggle"
    //       options={["TCP", "UDP", "HTTP", "PROXY"]}
    //       label="btn-outline-info"
    //     />
    //   </InputTemplate>

    //   <Row className="px-1">
    //     <InputTemplate className="col-6" label="Port">
    //       <InputGroup>
    //         <InputValue
    //           className="rounded"
    //           required
    //           root={props.root}
    //           readFrom={`${props.readFrom}_containerPort`}
    //           writeTo={`${props.writeTo}_containerPort`}
    //           placeholder="8000"
    //         />
    //       </InputGroup>
    //     </InputTemplate>

    //     <InputTemplate className="col-6" label="Target Port">
    //       <InputGroup>
    //         <InputValue
    //           className="rounded"
    //           root={props.root}
    //           readFrom={`${props.readFrom}_hostPort`}
    //           writeTo={`${props.writeTo}_hostPort`}
    //           placeholder="8000"
    //         />
    //       </InputGroup>
    //     </InputTemplate>
    //   </Row>

    //   <InputTemplate label="Host IP" className="px-1">
    //     <div className="input-group">
    //       <InputName
    //         char="?"
    //         root={props.root}
    //         readFrom={`${props.readFrom}_hostIP`}
    //         writeTo={`${props.writeTo}_hostIP`}
    //         placeholder="127.0.0.1"
    //       />
    //     </div>
    //   </InputTemplate>
    // </div>
    <></>
  );
}
