import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { basePath } from "../../../config";
import { ProjectInfo } from "../../../config/placeholder";
import { tmpFile } from "../../../lib/public/files";
import { ProjectData } from "../../../types/api";
import { DefaultRes } from "../../../types/request";
import Card from "../../Card";
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
          {/* <InputTemplate className="mb-3" label="Name">
            <InputName
              root={PREFIX}
              readFrom={`${PREFIX}_name`}
              char="@"
              disabled={props.update}
              placeholder={ProjectInfo.name}
              required
              isInvalid={async () => {
                try {
                  const res = await fetch(
                    `${basePath}/api/projects/load?name=${preview.name}`
                  );

                  dispatch({ type: "MAIN_VALIDATION_RESET" });
                  const data = (await res.json()) as DefaultRes<ProjectData[]>;

                  if (data.result?.length) {
                    return `Project name '${preview.name}' already in use`;
                  }
                } catch (err) {}
              }}
            />
          </InputTemplate> */}

          <InputTemplate className="mb-3" label="Title size">
            <InputRadio
              readFrom={`${PREFIX}_title`}
              options={["sm", "md", "lg", "xl"]}
              label="btn-outline-secondary"
              // onChange={(value) => {
              //   dispatch({ type: "MAIN_FLAG_CHANGED", value });
              //   dispatch({ type: "PREVIEW_FLAG_CHANGED", value });
              //   dispatch({ type: "CODE_FLAG_CHANGED", value });
              // }}
            />
          </InputTemplate>

          {/* <InputTemplate className="mb-3" label="Description">
            <InputText
              root={PREFIX}
              readFrom={`${PREFIX}_desc`}
              placeholder={ProjectInfo.desc}
              required
            />
          </InputTemplate> */}
        </Form.Group>
      </Form.Row>
      {/* <hr /> */}
      {/* <DefaultPreviewFooter root={PREFIX} readFrom={PREFIX} /> */}
    </div>
  );
}
