import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ElementType, ReactNode } from "react";

export interface InputCollapseProps {
  as?: ElementType<any>;
  className?: string;
  labelClassName?: string;
  name: string;
  el?: ReactNode;
  children: ReactNode;

  show: boolean;
  onChange: () => void;
}

export default function InputCollapse(props: InputCollapseProps) {
  return (
    <></>
    // <Form.Group as={Col} className={`mb-2 ${props.className}`}>
    //   <Row
    //     className="mr-auto px-3"
    //     style={{ cursor: "pointer" }}
    //     onClick={props.onChange}
    //   >
    //     <Form.Label
    //       as={props.as}
    //       className={`mr-2 my-auto ${props.labelClassName ?? ""}`}
    //     >
    //       {props.name}
    //     </Form.Label>
    //     <FontAwesomeIcon
    //       className="my-auto"
    //       icon={faChevronDown}
    //       style={{
    //         transitionDuration: "0.25s",
    //         transitionProperty: "transform",
    //         transform: `rotate(${props.show ? "0deg" : "-90deg"}`,
    //       }}
    //     />
    //     {props.el}
    //   </Row>
    //   <Collapse className="justify-content-center" in={props.show}>
    //     <div>{props.children}</div>
    //   </Collapse>
    // </Form.Group>
  );
}
