import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { basePath } from "../../../config";
import { ProjectInfo } from "../../../config/placeholder";
import { tmpFile } from "../../../lib/public/files";
import { ProjectData } from "../../../types/api";
import { DefaultRes } from "../../../types/request";
import Card from "../../Card";
import InputColor from "../../Inputs/InputColor";
import InputFile from "../../Inputs/InputFile";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputText from "../../Inputs/InputText";
import InputValue from "../../Inputs/InputValue";
import DefaultPreviewFooter from "./DefaultPreviewFooter";

export interface DefaultStyleViewProps {
  show?: boolean;
}

const PREFIX = "style";

// TODO:
// * Add Dynamic Pattern generator
// * Something similar to this (https://pattern.monster/circles-5/)

export default function DefaultStyleView(props: DefaultStyleViewProps) {
  const style = useSelector((state) => state[PREFIX]);
  const preview = useSelector((state: any) => state.preview);
  // const dispatch = useDispatch();

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
          <InputTemplate className="mb-3" label="Title size">
            <Row>
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
          </InputTemplate>
        </Form.Group>
      </Form.Row>

      {/* <hr /> */}
      {/* <DefaultPreviewFooter root={PREFIX} readFrom={PREFIX} /> */}
    </div>
  );
}
