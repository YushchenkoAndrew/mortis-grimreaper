import React, { useEffect, useImperativeHandle, useState } from "react";
import { ProjectInfo } from "../../../config/placeholder";
import InputFile from "../../Inputs/InputFile";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import TreeView from "../../TreeView/TreeView";
import Editor from "react-simple-code-editor";
import { Grammar, highlight, languages } from "prismjs";
import { basePath } from "../../../config";
import { DefaultRes } from "../../../types/request";
import { useDispatch, useSelector } from "react-redux";
import { CacheId } from "../../../lib/public";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-docker";
import "prismjs/themes/prism-coy.css";

const highlightTypes: { [name: string]: [Grammar, string] } = {
  html: [languages.html, "html"],
  css: [languages.css, "css"],
  js: [languages.js, "js"],
  markdown: [languages.markdown, "markdown"],
  dockerfile: [languages.docker, "docker"],
};

export interface DefaultCodeViewProps {
  show?: boolean;
}

const PREFIX = "code";

export default function DefaultCodeView(props: DefaultCodeViewProps) {
  const preview = useSelector((state: any) => state.preview as any);
  const code = useSelector((state: any) => state[PREFIX] as any);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(`${basePath}/api/projects/cache?id=${CacheId(PREFIX.toUpperCase())}`)
      .then((res) => res.json())
      .then((data: DefaultRes) => {
        if (data.status !== "OK") return;
        dispatch({ type: `${PREFIX.toUpperCase()}_INIT`, data: data.result });
      })
      .catch((err) => null);
  }, []);

  return (
    <div className={props.show ? "" : "d-none"}>
      <hr />
      <div className="row">
        <div className="col-md-7 order-md-1 mb-4">
          <h4 className="font-weight-bold mb-3">Projects Files Structure</h4>
          <TreeView
            name={preview.name || ProjectInfo.name}
            role={code.role}
            dir={code.path}
            root={PREFIX}
            prefix={`${PREFIX}_tree`}
          />
        </div>
        <div className="col-md-5 order-md-2">
          <InputTemplate label="Role">
            <InputRadio
              readFrom={`${PREFIX}_role`}
              options={["assets", "src", "styles", "kubernetes"]}
            />
          </InputTemplate>

          <InputTemplate label="Directory">
            <InputValue
              root={PREFIX}
              readFrom={`${PREFIX}_dir`}
              className="rounded"
              placeholder="/lua/"
            />
          </InputTemplate>

          <InputTemplate label="File">
            <InputFile
              role={code.role}
              multiple
              onUpload={(value) =>
                dispatch({ type: "CODE_FILE_UPLOADED", value })
              }
            />
          </InputTemplate>
        </div>
      </div>

      <hr />
      <div className="d-flex justify-content-center mb-3">
        <div className="col-md-11">
          <div className="row">
            <h5 className="font-weight-bold mr-2">File:</h5>
            <p className="font-italic">{code.path}</p>
          </div>

          <div>
            <Editor
              className="form-control editor"
              value={code.content}
              onValueChange={(value) =>
                dispatch({
                  type: `${PREFIX.toUpperCase()}_CONTENT_CHANGED`,
                  value: value,
                })
              }
              onBlur={() =>
                dispatch({ type: `${PREFIX.toUpperCase()}_CACHED` })
              }
              highlight={(content) => {
                return highlight(
                  content,
                  ...(highlightTypes[code.type.split("/")[1] ?? "js"] ??
                    highlightTypes.js)
                )
                  .split("\n")
                  .map(
                    (line, i) =>
                      `<span class='editor-line-number'>${i + 1}</span>${line}`
                  )
                  .join("\n");
              }}
              tabSize={2}
              textareaId="code-area"
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 18,
                backgroundColor: "#fafafa",
                outline: 0,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
