import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Col, Collapse, Form, InputGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ProjectInfo } from "../../../../config/placeholder";
import Card from "../../../Card";
import InputColor from "../../../Inputs/InputColor";
import InputRadio from "../../../Inputs/InputRadio";
import InputRange from "../../../Inputs/InputRange";
import InputTemplate from "../../../Inputs/InputTemplate";

export interface DefaultStyleViewProps {
  show?: boolean;
}

const PREFIX = "style";

// TODO:
// * Add Dynamic Pattern generator
// * Something similar to this (https://pattern.monster/circles-5/)

export default function DefaultStyleView(props: DefaultStyleViewProps) {
  const [minimized, onMinimize] = useState(false);

  const style = useSelector((state) => state[PREFIX]);
  const preview = useSelector((state: any) => state.preview);
  const dispatch = useDispatch();

  return (
    <div className={props.show ? "" : "d-none"}>
      <hr />
      <Form.Row>
        <Form.Group as={Col} md={{ order: 2, span: 5 }} mb="4">
          <Card
            href="#"
            size={style.title}
            img={
              preview.img.length > 1
                ? preview.img
                : preview.img?.[0] || ProjectInfo.img
            }
            title={preview.title || ProjectInfo.title}
            description={preview.desc || ProjectInfo.desc}
          />
        </Form.Group>
        <Form.Group as={Col} md={{ order: 1, span: 7 }}>
          <h4 className="font-weight-bold mb-3">Thumbnail</h4>
          <InputTemplate className="mb-3" label="Title size">
            <InputRadio
              root={PREFIX}
              readFrom={`${PREFIX}_title`}
              options={["sm", "md", "lg", "xl"]}
              label="btn-outline-secondary"
            />
          </InputTemplate>
        </Form.Group>

        <Form.Group as={Col} md={{ order: 1, span: 7 }}>
          <h4 className="font-weight-bold mb-3">Thumbnail</h4>
          <InputTemplate
            className="px-0"
            labelClassName="font-weight-bold ml-2"
            label={[
              "Metadata ",
              <FontAwesomeIcon
                key={"icon-metadata"}
                icon={faChevronDown}
                style={{
                  transitionDuration: "0.25s",
                  transitionProperty: "transform",
                  transform: `rotate(${minimized ? "0deg" : "-90deg"}`,
                }}
              />,
            ]}
            onClick={() => onMinimize(!minimized)}
          >
            <Collapse in={minimized}>
              <div>
                <InputRange
                  root={PREFIX}
                  label="Zoom"
                  readFrom={`${PREFIX}_zoom`}
                  property={{ min: 0, max: 30 }}
                />
                <InputRange
                  root={PREFIX}
                  label="Angle"
                  readFrom={`${PREFIX}_angle`}
                  property={{ min: 0, max: 180 }}
                />
                <InputRange
                  root={PREFIX}
                  label="Colors"
                  readFrom={`${PREFIX}_colors`}
                  property={{ min: 2, max: 5 }}
                />
              </div>
            </Collapse>
          </InputTemplate>

          <Row className="justify-content-between pt-2 mx-3">
            <Col xs="9" md="9" lg="10" className="px-0">
              <Row className="pt-2">
                {(style.pallet as string[]).map((_, i) => (
                  <Form.Group key={`pallet-color-${i}`} className="mx-2">
                    <InputColor
                      root={PREFIX}
                      readFrom={`${PREFIX}_pallet_${i}`}
                      writeTo={`${PREFIX}_pallet`}
                    />
                  </Form.Group>
                ))}
              </Row>
            </Col>

            <Col xs="3" sm="2" md="3" lg="2" className="my-auto px-2">
              <Button
                variant="outline-primary"
                onClick={() =>
                  dispatch({ type: `${PREFIX}_shuffle`.toUpperCase() })
                }
              >
                Shuffle
              </Button>
            </Col>
          </Row>
        </Form.Group>
      </Form.Row>

      {/* <hr /> */}
      {/* <DefaultPreviewFooter root={PREFIX} readFrom={PREFIX} /> */}
    </div>
  );
}
