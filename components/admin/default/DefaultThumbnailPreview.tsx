import React from "react";
import { ProjectInfo } from "../../../config/placeholder";
import { Event } from "../../../pages/admin/projects/operation";
import { ProjectForm } from "../../../types/projects";
import Card from "../../Card";
import InputFile from "../../Inputs/InputFile";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputText from "../../Inputs/InputText";
import InputValue from "../../Inputs/InputValue";

export interface DefaultThumbnailPreviewProps {
  formData: ProjectForm;
  onChange: (event: Event) => void;
  onBlur?: (event: Event) => void;
}

export default function DefaultThumbnailPreview(
  props: DefaultThumbnailPreviewProps
) {
  return (
    <div className="row">
      <div className="col-md-5 order-md-2 mb-4">
        <Card
          img={props.formData.img?.url || (ProjectInfo.img.url ?? "")}
          title={props.formData.title || ProjectInfo.title}
          size="title-lg"
          href="#"
          description={props.formData.desc || ProjectInfo.desc}
        />
      </div>
      <div className="col-md-7 order-md-1">
        <h4 className="font-weight-bold mb-3">Thumbnail</h4>
        <InputTemplate label="Name">
          <InputName
            char="@"
            name="name"
            required
            value={props.formData.name}
            placeholder={ProjectInfo.name}
            onChange={props.onChange}
            onBlur={props.onBlur}
          />
        </InputTemplate>

        <InputTemplate label="Title">
          <div className="input-group">
            <InputValue
              name="title"
              required
              className="rounded"
              value={props.formData.title}
              placeholder={ProjectInfo.title}
              onChange={props.onChange}
              onBlur={props.onBlur}
            />
          </div>
        </InputTemplate>

        <InputTemplate label="Description">
          <InputText
            name="desc"
            required
            value={props.formData.desc}
            placeholder={ProjectInfo.desc}
            onChange={props.onChange}
            onBlur={props.onBlur}
          />
        </InputTemplate>

        <div className="input-group d-flex justify-content-between">
          <InputTemplate label="Image">
            <InputFile
              name="img"
              role="thumbnail"
              type="image/*"
              required
              onChange={props.onChange}
            />
          </InputTemplate>

          <InputTemplate label="Flag">
            <InputRadio
              name="flag"
              options={["JS", "Markdown", "Link"]}
              label="btn-outline-secondary"
              onChange={props.onChange}
            />
          </InputTemplate>
        </div>
      </div>
    </div>
  );
}
