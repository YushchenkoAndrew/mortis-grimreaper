import {
  faPen,
  faPlus,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

import HoverButton from "../../../HoverButton";

export interface DefaultMoreOptionsProps {
  root: string;
  readFrom: string;
  writeTo?: string;

  buttons?: ReactNode;
  children: ReactNode;

  onDelete: () => void;
  onValidate?: () => boolean;
}

export default function DefaultMoreOptions(props: DefaultMoreOptionsProps) {
  const dispatch = useDispatch();
  const value = useSelector((state: any) =>
    props.readFrom.split("_").reduce((acc, curr) => acc[curr], state)
  );

  function onHide() {
    dispatch({
      type: `${props.writeTo || props.readFrom}_INFO_CHANGED`.toUpperCase(),
      value: !value.info,
    });
  }

  function onInfo() {
    if (value.action === "info") return onHide();

    dispatch({
      type: `${props.writeTo || props.readFrom}_ACTION_CHANGED`.toUpperCase(),
      value: "info",
    });
  }

  function onCreate() {
    // NOTE: This func will change action to 'info' & hide window
    if (value.action === "create") return onInfo(), onHide();

    dispatch({
      type: `${props.writeTo || props.readFrom}_ACTION_CHANGED`.toUpperCase(),
      value: "create",
    });
  }

  function onEdit() {
    // NOTE: This func will change action to 'info' & hide window
    if (value.action === "update") return onInfo(), onHide();
    if (props.onValidate && !props.onValidate()) return;

    dispatch({
      type: `${props.writeTo || props.readFrom}_ACTION_CHANGED`.toUpperCase(),
      value: "update",
    });
  }

  function onDelete() {
    if (props.onValidate && !props.onValidate()) return;
    props.onDelete();
  }

  return (
    <></>
    // <Form.Group className="mb-2">
    //   <Row className="mr-auto pl-3">
    //     <InputGroup className="ml-4 d-flex justify-content-between">
    //       <Row className="py-3" style={{ width: "80%" }}>
    //         <HoverButton
    //           name="Info  "
    //           variant="outline-info"
    //           icon={faSearch}
    //           event={{ onClick: onInfo }}
    //         />

    //         {props.buttons}

    //         <HoverButton
    //           name="Create"
    //           variant="outline-success"
    //           icon={faPlus}
    //           event={{ onClick: onCreate }}
    //         />
    //         <HoverButton
    //           name="Edit  "
    //           variant="outline-warning"
    //           icon={faPen}
    //           event={{ onClick: onEdit }}
    //         />
    //         <HoverButton
    //           name="Delete"
    //           variant="danger"
    //           icon={faTrash}
    //           event={{ onClick: onDelete }}
    //         />
    //       </Row>

    //       <Button
    //         type="submit"
    //         hidden={!["create", "update"].includes(value.action)}
    //         variant="outline-primary"
    //         className="my-auto"
    //       >
    //         Submit
    //       </Button>
    //     </InputGroup>
    //   </Row>
    //   <Collapse className="justify-content-center" in={value.info}>
    //     <div>{props.children}</div>
    //   </Collapse>
    // </Form.Group>
  );
}
