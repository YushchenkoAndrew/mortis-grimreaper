import styles from "./DisplayColors.module.scss";
import { Col, Row } from "react-bootstrap";
import { ColorData } from "../../types/api";

export interface DisplayColorsProps {
  data: ColorData;
  event?: { href?: string; onClick: () => void };
}

// NOTE: Inspired by https://www.artsy.net/artwork/piet-mondrian-composition-with-large-red-plane-yellow-black-grey-and-blue
enum ColorIndex {
  YELLOW,
  GRAY,
  BLUE,
  RED,
  BLACK,
}

export function DisplayColors(props: DisplayColorsProps) {
  const { colors } = props.data;
  return (
    <Col xs="10" sm="4" md="6" lg="4" className="my-3 text-center">
      {/* <DisplayDataRecord
        delay={650}
        title="Pattern info"
        keys={["id", "created_at", "mode", "width", "height"]}
        data={props.data}
      > */}

      <a className={`card ${styles["card"]}`} style={{ cursor: "pointer" }}>
        {/* <Row className="m-0" style={{ height: "15%" }}>
          <Col
            xs="3"
            className="px-0"
            style={{ background: colors[ColorIndex.GRAY] }}
          />
          <Col
            xs="4"
            className="px-0"
            style={{ background: colors[ColorIndex.GRAY] }}
          />
          <Col
            xs="4"
            className="px-0"
            style={{ background: colors[ColorIndex.YELLOW] }}
          />
          <Col
            xs="1"
            className="px-0"
            style={{ background: colors[ColorIndex.GRAY] }}
          />
        </Row> */}

        <span>
          <span>
            <span style={{ background: colors[ColorIndex.GRAY] }} />
            <span style={{ background: colors[ColorIndex.GRAY] }} />
            <span style={{ background: colors[ColorIndex.YELLOW] }} />
          </span>
          <span>
            <span>
              <span style={{ background: colors[ColorIndex.GRAY] }} />
              <span style={{ background: colors[ColorIndex.GRAY] }} />
              <span style={{ background: colors[ColorIndex.YELLOW] }} />
            </span>
            <span>
              <span>
                <span style={{ background: colors[ColorIndex.RED] }} />
                <span>
                  <span style={{ background: colors[ColorIndex.YELLOW] }} />
                  <span>
                    <span style={{ background: colors[ColorIndex.GRAY] }} />
                    <span style={{ background: colors[ColorIndex.GRAY] }} />
                  </span>
                </span>
              </span>

              <span>
                <span>
                  <span style={{ background: colors[ColorIndex.BLACK] }} />
                  <span style={{ background: colors[ColorIndex.GRAY] }} />
                </span>
                <span>
                  <span>
                    <span>
                      <span style={{ background: colors[ColorIndex.GRAY] }} />
                      <span style={{ background: colors[ColorIndex.GRAY] }} />
                      <span style={{ background: colors[ColorIndex.BLACK] }} />
                    </span>
                    <span>
                      <span style={{ background: colors[ColorIndex.GRAY] }} />
                      <span style={{ background: colors[ColorIndex.BLUE] }} />
                    </span>
                  </span>
                  <span style={{ background: colors[ColorIndex.GRAY] }} />
                </span>
              </span>
            </span>
          </span>
        </span>
        <span>
          <span style={{ background: colors[ColorIndex.GRAY] }} />
          <span style={{ background: colors[ColorIndex.RED] }} />
        </span>

        {/* <Row className="m-0 h-100">
          <Col
            xs="1"
            className="px-0"
            style={{ background: colors[ColorIndex.GRAY] }}
          ></Col>
          <Col
            xs="4"
            className="px-0"
            style={{ background: colors[ColorIndex.BLACK] }}
          ></Col>
          <Col
            xs="4"
            className="px-0"
            style={{ background: colors[ColorIndex.YELLOW] }}
          ></Col>
          <Col
            xs="1"
            className="px-0"
            style={{ background: colors[ColorIndex.GRAY] }}
          ></Col>
        </Row> */}

        {/* <Col xs="4" style={{ background: props.data.colors[0] }}></Col>
        <Col xs="8">
          <Row className="h-50" style={{ flexDirection: "inherit" }}>
            <Col xs="8" style={{ background: props.data.colors[2] }}></Col>
            <Col xs="4">
              <Row
                className="h-25"
                style={{ background: props.data.colors[4] }}
              ></Row>
            </Col>
          </Row>

          <Row
            className="h-50"
            style={{ background: props.data.colors[1] }}
          ></Row>
        </Col> */}
        {/* {props.data.colors.map((item, i) => (
          <div key={i} className="w-auto" style={{ backgroundColor: item }}>
            test
          </div>
        ))} */}
      </a>
      {/* </DisplayDataRecord> */}
    </Col>
  );
}
