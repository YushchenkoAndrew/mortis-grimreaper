import styles from "./Pattern.module.scss";
import { Col } from "react-bootstrap";
import { svgBuild } from "../../lib/public/svg";

export interface PatternProps {
  mode: string;
  path: string;
  width: number;
  height: number;
  event?: { href?: string; onClick: () => void };
}

export function Pattern(props: PatternProps) {
  return (
    <Col xs="10" sm="4" md="6" lg="4" className="my-3 text-center">
      <a
        className={`card p-2 square ${styles["card"]}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,${svgBuild(
            props.width,
            props.height,
            props.path,
            props.mode.toLowerCase()
          )}")`,

          cursor: "pointer",
          backgroundRepeat: "repeat",
          backgroundSize: "100% 100% !important",
        }}
        {...(props.event ?? {})}
      ></a>
    </Col>
  );
}
