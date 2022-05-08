import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col } from 'react-bootstrap';

import { ColorData } from '../../types/api';
import styles from './DisplayColors.module.scss';

export interface DisplayColorsProps {
  data: ColorData;
  event?: { href?: string; onClick: () => void };
  selected?: boolean;
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
    <Col xs="10" sm="6" md="6" lg="4" xl="3" className="my-3 text-center">
      {/* // TODO: Maybe one day to use this !!! */}
      {/* <DisplayDataRecord
        delay={650}
        title="Pattern info"
        keys={["id", "created_at", "colors", "width", "height"]}
        data={props.data}
      > */}

      <a
        className={styles["card"]}
        style={{
          cursor: "pointer",
        }}
        {...(props.event ?? {})}
      >
        <FontAwesomeIcon
          className={`my-auto mx-auto ${props.selected ? "d-block" : "d-none"}`}
          icon={faCheckCircle}
          size="5x"
          fontSize="1rem"
        />

        <span hidden={!props.selected} className={styles["card-middleware"]} />
        <span className={styles["card-body"]}>
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
                        <span
                          style={{ background: colors[ColorIndex.BLACK] }}
                        />
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
        </span>
      </a>
      {/* </DisplayDataRecord> */}
    </Col>
  );
}
