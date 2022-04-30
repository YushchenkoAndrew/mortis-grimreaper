import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import styles from "./HoverButton.module.scss";

export interface HoverButtonProps {
  name: string;
  variant?: string;
  icon: IconProp;
  event?: { href?: string; onClick?: () => void };
}

export default function HoverButton(props: HoverButtonProps) {
  return (
    <Button
      variant={props.variant}
      className={`my-auto mx-1 py-1 row ${styles["hover-button"]}`}
      // NOTE: NOT THE BEST SOLUTION !!!
      style={{
        fontSize: "16px",
        maxWidth: props.name.length * 16 + "px",
      }}
      href={props.event?.href}
      onClick={props.event?.onClick}
    >
      <p className="m-0">{props.name}</p>
      <FontAwesomeIcon
        className="my-auto"
        icon={props.icon}
        size="1x"
        fontSize="1rem"
      />
    </Button>
  );
}
