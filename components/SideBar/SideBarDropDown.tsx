import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useState } from "react";
import SideBarItem from "./SideBarItem";

export interface SideBarItemProps {
  title: string | ReactNode;
  active?: boolean;

  event?: { href?: string; onClick?: () => void };
  children: ReactNode;
}

export default function SideBarDropDown(props: SideBarItemProps) {
  const [show, onShow] = useState(false);
  return (
    <>
      {/* <SideBarItem
        className="d-flex justify-content-between"
        event={{ onClick: () => onShow(!show) }}
      >
        <div>{props.title}</div>
        <FontAwesomeIcon
          className="mx-2 my-auto text-dark"
          icon={faChevronDown}
          style={{
            transitionDuration: "0.25s",
            transitionProperty: "transform",
            transform: `rotate(${show ? "0deg" : "-90deg"}`,
          }}
        />
      </SideBarItem>

      <Collapse in={show}>
        <Row className="ml-auto px-3">{props.children}</Row>
      </Collapse> */}
    </>
  );
}
