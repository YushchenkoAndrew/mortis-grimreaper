import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { basePath } from "../../../../config";
import { ProjectInfo } from "../../../../config/placeholder";
import { tmpFile } from "../../../../lib/public/files";
import { ProjectData } from "../../../../types/api";
import { DefaultRes } from "../../../../types/request";
import ProjectCard from "../../../Cards/ProjectCard";
import InputFile from "../../../Inputs/InputFile";
import InputName from "../../../Inputs/InputName";
import InputRadio from "../../../Inputs/InputRadio";
import InputTemplate from "../../../Inputs/InputTemplate";
import InputText from "../../../Inputs/InputText";
import InputValue from "../../../Inputs/InputValue";
import DefaultPreviewFooter from "./DefaultPreviewFooter";

export interface DefaultPreviewProps {
  show?: boolean;
  update?: boolean;
}

const PREFIX = "preview";

export default function DefaultPreview(props: DefaultPreviewProps) {
  const style = useSelector((state: any) => state.style);
  const preview = useSelector((state) => state[PREFIX]);
  const dispatch = useDispatch();

  return (
    <div className={props.show ? "" : "d-none"}>
      <hr />
      <Form.Row>
        <Form.Group as={Col} md={{ order: 2, span: 5 }} mb="4">
          <ProjectCard
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
          <InputTemplate className="mb-3" label="Name">
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
          </InputTemplate>

          <InputTemplate className="mb-3" label="Title">
            <InputGroup>
              <InputValue
                root={PREFIX}
                readFrom={`${PREFIX}_title`}
                className="rounded"
                placeholder={ProjectInfo.title}
                required
              />
            </InputGroup>
          </InputTemplate>

          <InputTemplate className="mb-3" label="Description">
            <InputText
              root={PREFIX}
              readFrom={`${PREFIX}_desc`}
              placeholder={ProjectInfo.desc}
              required
            />
          </InputTemplate>

          <InputGroup className="d-flex justify-content-between">
            <InputTemplate className="mb-3" label="Image">
              <InputFile
                name="preview_thumbnail"
                role="thumbnail"
                // FIXME:
                // required
                // value={preview.img || undefined}
                onURL={(file) => tmpFile(file, { role: "thumbnail", dir: "" })}
                onUpload={(files) => {
                  if (!Array.isArray(files)) return;

                  dispatch({
                    type: "PREVIEW_IMG_UPLOADED",
                    value: files.map((item) => item.url),
                  });

                  dispatch({
                    type: "CODE_FILE_UPLOADED",
                    value: files,
                    info: { dir: "", role: "thumbnail" },
                  });

                  dispatch({ type: "PREVIEW_CACHED" });
                  dispatch({ type: "CODE_CACHED" });
                }}
                type="image/*"
                multiple
              />
            </InputTemplate>

            <InputTemplate className="mb-3" label="Flag">
              <InputRadio
                root={PREFIX}
                readFrom={`${PREFIX}_flag`}
                options={["JS", "Markdown", "Link", "Docker"]}
                overflow={{
                  on: { className: "d-block d-sm-none", len: 4 },
                  off: { className: "d-none d-sm-block", len: 0 },
                }}
                label="btn-outline-secondary"
                writeTo={(value) => {
                  dispatch({ type: "MAIN_FLAG_CHANGED", value });
                  dispatch({ type: "PREVIEW_FLAG_CHANGED", value });
                  dispatch({ type: "CODE_FLAG_CHANGED", value });
                }}
              />
            </InputTemplate>
          </InputGroup>
        </Form.Group>
      </Form.Row>
      <hr />
      <DefaultPreviewFooter root={PREFIX} readFrom={PREFIX} />
    </div>
  );
}
