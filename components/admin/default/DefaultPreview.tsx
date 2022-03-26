import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { basePath } from "../../../config";
import { ProjectInfo } from "../../../config/placeholder";
import { CacheId } from "../../../lib/public";
import { ProjectData } from "../../../types/api";
import { DefaultRes } from "../../../types/request";
import Card from "../../Card";
import DefaultProjectInfo from "../../default/DefaultProjectInfo";
import InputDouble from "../../Inputs/InputDouble";
import InputList from "../../Inputs/InputDoubleList";
import InputFile from "../../Inputs/InputFile";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputText from "../../Inputs/InputText";
import InputValue from "../../Inputs/InputValue";
import ListEntity from "../../Inputs/ListEntity";
import DefaultPreviewFooter from "./DefaultPreviewFooter";

export interface DefaultPreviewProps {
  show?: boolean;
  preview?: { [name: string]: any };
}

const PREFIX = "preview";

export default function DefaultPreview(props: DefaultPreviewProps) {
  const preview = useSelector((state) => state[PREFIX]);
  const dispatch = useDispatch();

  return (
    <div className={props.show ? "" : "d-none"}>
      <hr />
      <div className="row">
        <div className="col-md-5 order-md-2 mb-4">
          <Card
            href="#"
            size="title-lg"
            img={preview.img}
            title={preview.title || ProjectInfo.title}
            description={preview.desc || ProjectInfo.desc}
          />
        </div>
        <div className="col-md-7 order-md-1">
          <h4 className="font-weight-bold mb-3">Thumbnail</h4>
          {/* TODO: Check before sending request if such name already exists */}
          <InputTemplate className="mb-3" label="Name">
            <InputName
              root={PREFIX}
              readFrom={`${PREFIX}_name`}
              char="@"
              placeholder={ProjectInfo.name}
              required
            />
          </InputTemplate>

          <InputTemplate className="mb-3" label="Title">
            <div className="input-group">
              <InputValue
                root={PREFIX}
                readFrom={`${PREFIX}_title`}
                className="rounded"
                placeholder={ProjectInfo.title}
                required
              />
            </div>
          </InputTemplate>

          <InputTemplate className="mb-3" label="Description">
            <InputText
              root={PREFIX}
              readFrom={`${PREFIX}_desc`}
              placeholder={ProjectInfo.desc}
              required
            />
          </InputTemplate>

          <div className="input-group d-flex justify-content-between">
            <InputTemplate className="mb-3" label="Image">
              <InputFile
                name="preview_thumbnail"
                role="thumbnail"
                onUpload={(files) => {
                  dispatch({
                    type: "PREVIEW_IMG_UPLOADED",
                    value: files[0]?.url,
                  });

                  dispatch({
                    type: "CODE_FILE_UPLOADED",
                    value: files,
                    info: { dir: "", role: "" },
                  });
                }}
                type="image/*"
                // onChange={(e) => {
                //   setImg(e.target.value[0]?.url ?? img);
                //   props.codeViewRef?.current?.onUpload(e);
                // }}
              />
            </InputTemplate>

            <InputTemplate className="mb-3" label="Flag">
              <InputRadio
                readFrom={`${PREFIX}_flag`}
                options={["JS", "Markdown", "Link", "Docker"]}
                overflow={{
                  on: { className: "d-block d-sm-none", len: 4 },
                  off: { className: "d-none d-sm-block", len: 0 },
                }}
                label="btn-outline-secondary"
                onChange={(value) => {
                  dispatch({ type: "MAIN_FLAG_CHANGED", value });
                  dispatch({ type: "PREVIEW_FLAG_CHANGED", value });
                  dispatch({ type: "CODE_FLAG_CHANGED", value });
                }}
              />
            </InputTemplate>
          </div>
        </div>
      </div>

      <hr />
      <DefaultPreviewFooter root={PREFIX} readFrom={PREFIX} />
    </div>
  );
}
