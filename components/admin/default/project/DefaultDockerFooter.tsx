import { ProjectInfo } from "../../../../config/placeholder";
import InputDouble from "../../../Inputs/InputDouble";
import InputMultiple from "../../../Inputs/InputMultiple";
import InputName from "../../../Inputs/InputName";
import InputTemplate from "../../../Inputs/InputTemplate";

export interface DefaultDockerFooterProps {
  root?: string;
  readFrom: string;
}

export default function DefaultDockerFooter(props: DefaultDockerFooterProps) {
  return (
    <></>
    // <div className="d-flex justify-content-center mb-3">
    //   <Form.Group as={Col} className="w-100 px-0">
    //     <h4 className="font-weight-bold mb-3">Additional Info</h4>
    //     <InputTemplate className="mb-3" label="Redirect Link">
    //       <InputName
    //         char="http://"
    //         root={props.root}
    //         readFrom={`${props.readFrom}_links_main`}
    //         required
    //         placeholder={ProjectInfo.link}
    //       />
    //     </InputTemplate>

    //     <InputTemplate className="mb-3" label="Repo">
    //       <InputDouble
    //         char={["$", ":"]}
    //         root={props.root}
    //         readFrom={[
    //           `${props.readFrom}_repo_name`,
    //           `${props.readFrom}_repo_version`,
    //         ]}
    //         placeholder={["grimreapermortis/demo", "demo"]}
    //       />
    //     </InputTemplate>

    //     <InputTemplate className="mb-3" label="Metrics Cron Time">
    //       <InputMultiple
    //         char={["week", "month", "day"]}
    //         root={props.root}
    //         readFrom={`${props.readFrom}_cron`}
    //         size={2}
    //         required
    //         placeholder="*"
    //         lg={{ span: 4 }}
    //       />

    //       <InputMultiple
    //         char={["hour", "min", "sec"]}
    //         root={props.root}
    //         readFrom={`${props.readFrom}_cron`}
    //         size={2}
    //         required
    //         placeholder="*"
    //         lg={{ span: 4 }}
    //       />
    //     </InputTemplate>
    //   </Form.Group>
    // </div>
  );
}
