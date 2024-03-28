import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { svgBuild } from "../../lib/public/svg";
import { PatternData } from "../../types/api";
import DisplayDataRecord from "./DisplayDataRecord";
import styles from "./DisplayPattern.module.scss";

export interface DisplayPatternProps extends ColProps {
  data: PatternData;
  event?: { href?: string; onClick: () => void };
  selected?: boolean;
}

export function DisplayPattern(props: DisplayPatternProps) {
  return (
    <></>
    // <Col
    //   xs={props.xs ?? "10"}
    //   sm={props.sm ?? "4"}
    //   md={props.md ?? "6"}
    //   lg={props.lg ?? "4"}
    //   xl={props.xl ?? "3"}
    //   className="my-3 text-center"
    // >
    //   <DisplayDataRecord
    //     delay={650}
    //     title="Pattern info"
    //     keys={["id", "created_at", "mode", "width", "height"]}
    //     data={props.data}
    //   >
    //     <a
    //       className={styles["card"]}
    //       style={{
    //         backgroundImage: `url("data:image/svg+xml,${svgBuild(
    //           props.data.width,
    //           props.data.height,
    //           props.data.path,
    //           props.data.mode.toLowerCase()
    //         )}")`,

    //         cursor: "pointer",
    //         backgroundRepeat: "repeat",
    //         backgroundSize: "100% 100% !important",
    //       }}
    //       {...(props.event ?? {})}
    //     >
    //       <FontAwesomeIcon
    //         className={`my-auto mx-auto ${
    //           props.selected ? "d-block" : "d-none"
    //         }`}
    //         icon={faCheckCircle}
    //         size="5x"
    //         fontSize="1rem"
    //       />

    //       <span
    //         hidden={!props.selected}
    //         className={styles["card-middleware"]}
    //       />
    //     </a>
    //   </DisplayDataRecord>
    // </Col>
  );
}
