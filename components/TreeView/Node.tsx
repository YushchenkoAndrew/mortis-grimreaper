import {
  faExternalLinkAlt,
  faFolder,
  faFolderOpen,
  faPencilAlt,
  faTrashAlt,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "./Node.module.scss";
export interface NodeProps {
  name: string;
  index?: string;
  href?: string;
  open?: boolean;
  className?: string;
  icon?: IconDefinition;
  iconClass?: string;
  children?: React.ReactNode;
  onSelect?: () => void;
  onChange?: (key: string) => void;
}

function Node(props: NodeProps) {
  return (
    <li>
      <span
        className={`${
          props.className ?? ""
        } row text-dark text-decoration-none`}
        onClick={() => {
          if (props.icon !== faFolder) return props.onSelect?.();
          props.onChange?.(props.index || "");
        }}
      >
        {props.icon ? (
          <FontAwesomeIcon
            className={`ml-1 mr-2 ${props.iconClass ?? ""}`}
            icon={
              props.icon === faFolder && props.open ? faFolderOpen : props.icon
            }
            size="lg"
            fontSize="1rem"
          />
        ) : (
          <span />
        )}
        {props.name}

        {/* TODO: Maybe to do some node editing */}
        <a>
          <FontAwesomeIcon
            className={`ml-4 mr-1 ${styles["el-prop"]} text-primary `}
            icon={faPencilAlt}
            size="lg"
            fontSize="1rem"
          />
        </a>
        {props.href ? (
          <a href={props.href} target="_blank" rel="noreferrer">
            <FontAwesomeIcon
              className={`ml-1 mr-1 ${styles["el-prop"]} text-primary`}
              icon={faExternalLinkAlt}
              size="lg"
              fontSize="1rem"
            />
          </a>
        ) : null}
        <a>
          <FontAwesomeIcon
            className={`ml-1 mr-2 ${styles["el-prop"]} text-danger `}
            icon={faTrashAlt}
            size="lg"
            fontSize="1rem"
          />
        </a>
      </span>
      {props.children && props.open ? <ul>{props.children}</ul> : null}
    </li>
  );
}

export default React.memo(Node);
