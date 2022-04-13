import { memo } from "react";
import { Row } from "react-bootstrap";
import { flagColors, FlagType } from "../../types/flag";
import styles from "./Card.module.css";

export interface FlagProps {
  className?: string;
  name: FlagType;
}

export default memo(function Flag(props: FlagProps) {
  return (
    <Row className={props.className}>
      <span
        className={`${flagColors[props.name]} text-dark mr-1 mt-1 ${
          styles["flag"]
        }`}
      ></span>
      <p className="text-dark">{props.name}</p>
    </Row>
  );
});
