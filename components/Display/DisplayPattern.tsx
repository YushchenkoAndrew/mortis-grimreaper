import styles from "./DisplayPattern.module.scss";
import { Col } from "react-bootstrap";
import { svgBuild } from "../../lib/public/svg";
import { PatternData } from "../../types/api";
import DisplayDataRecord from "./DisplayDataRecord";

export interface DisplayPatternProps {
  data: PatternData;
  event?: { href?: string; onClick: () => void };
}

export function DisplayPattern(props: DisplayPatternProps) {
  return (
    <Col xs="10" sm="4" md="6" lg="4" className="my-3 text-center">
      <DisplayDataRecord
        delay={650}
        title="Pattern info"
        keys={["id", "created_at", "mode", "width", "height"]}
        data={props.data}
      >
        <a
          className={`card p-2 square ${styles["card"]}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,${svgBuild(
              props.data.width,
              props.data.height,
              props.data.path,
              props.data.mode.toLowerCase()
            )}")`,

            cursor: "pointer",
            backgroundRepeat: "repeat",
            backgroundSize: "100% 100% !important",
          }}
          {...(props.event ?? {})}
        ></a>
      </DisplayDataRecord>
    </Col>
  );
}
