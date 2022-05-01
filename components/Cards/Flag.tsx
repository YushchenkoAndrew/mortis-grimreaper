import { memo } from "react";
import { Row } from "react-bootstrap";
import { flagColors, FlagType } from "../../types/flag";

export interface FlagProps {
  className?: string;
  name: FlagType;
}

export default memo(function Flag(props: FlagProps) {
  return (
    <Row className={props.className}>
      <span
        className={`${flagColors[props.name]} text-dark mr-1 mt-1`}
        style={{
          width: 15,
          height: 15,
          borderRadius: 13,
          display: "flex",
        }}
      ></span>
      <p className="text-dark">{props.name}</p>
    </Row>
  );
});
