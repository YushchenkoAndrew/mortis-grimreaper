import { ProjectInfo } from "../../../../config/placeholder";
import InputFile from "../../../Inputs/InputFile";
import InputRadio from "../../../Inputs/InputRadio";
import InputTemplate from "../../../Inputs/InputTemplate";
import InputValue from "../../../Inputs/InputValue";
import TreeView from "../../../TreeView/TreeView";
import { useDispatch, useSelector } from "react-redux";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-docker";
import "prismjs/themes/prism-coy.css";
import { tmpFile } from "../../../../lib/public/files";
import DefaultMarkdownProject from "../../../default/DefaultMarkdownProject";
import { basePath } from "../../../../config";
import { YamlToJson } from "../../../../lib/public/yaml";
import { CombineK3sConfig } from "../../../../lib/public/k3s";

// const highlightTypes: { [name: string]: [Grammar, string] } = {
//   html: [languages.html, "html"],
//   css: [languages.css, "css"],
//   js: [languages.js, "js"],
//   markdown: [languages.markdown, "markdown"],
//   dockerfile: [languages.docker, "docker"],
// };

export interface DefaultCodeViewProps {
  show?: boolean;
}

const PREFIX = "code";

export default function DefaultCodeView(props: DefaultCodeViewProps) {
  const preview = useSelector((state: any) => state.preview as any);
  const code = useSelector((state: any) => state[PREFIX] as any);
  const config = useSelector((state: any) => state.config as any);
  const dispatch = useDispatch();

  return (
    <></>
    // <div className={props.show ? "" : "d-none"}>
    //   <hr />
    //   <Row>
    //     <Col md={{ span: 7, order: 1 }} className="mb-4">
    //       <h4 className="font-weight-bold mb-3">Projects Files Structure</h4>
    //       <TreeView
    //         name={preview.name || ProjectInfo.name}
    //         role={code.role}
    //         dir={code.path}
    //         root={PREFIX}
    //         prefix={`${PREFIX}_tree`}
    //       />
    //     </Col>

    //     <Col md={{ span: 5, order: 2 }}>
    //       <InputTemplate label="Role">
    //         <InputRadio
    //           readFrom={`${PREFIX}_role`}
    //           // NOTE: For now disable uploading to kubernetes dir
    //           options={["assets", "src", "styles"]}
    //         />
    //       </InputTemplate>

    //       <InputTemplate label="Directory">
    //         <InputValue
    //           root={PREFIX}
    //           readFrom={`${PREFIX}_dir`}
    //           className="rounded"
    //           placeholder="/lua/"
    //         />
    //       </InputTemplate>

    //       <InputTemplate label="File">
    //         <InputFile
    //           name="code_file"
    //           role={code.role}
    //           multiple
    //           onURL={(file) => tmpFile(file, code)}
    //           onUpload={(files) => {
    //             if (!Array.isArray(files)) return;
    //             dispatch({ type: "CODE_FILE_UPLOADED", value: files });

    //             dispatch({ type: "CODE_CACHED" });
    //           }}
    //         />
    //       </InputTemplate>
    //     </Col>
    //   </Row>

    //   <hr />
    //   <div className="d-flex justify-content-center mb-3">
    //     <Col md="11">
    //       <Row className="w-100 d-flex justify-content-between">
    //         <Row>
    //           <h5 className="font-weight-bold mr-2">File:</h5>
    //           <p className="font-italic">{code.path}</p>
    //         </Row>
    //         <Row className="mr-1">
    //           <InputRadio
    //             readFrom="code_template"
    //             hidden={code.type !== "text/markdown"}
    //             className="btn-group btn-group-sm btn-group-toggle mb-2"
    //             options={["Code", "Preview"]}
    //             label="btn-outline-dark"
    //           />
    //         </Row>
    //       </Row>

    //       <DefaultMarkdownProject
    //         hidden={code.type !== "text/markdown" || code.template === "Code"}
    //         className="border rounded mt-3"
    //         name={preview.name}
    //         template={code.content}
    //       />

    //       <Container
    //         hidden={code.type === "text/markdown" && code.template !== "Code"}
    //       >
    //         <Editor
    //           className="form-control editor h-100"
    //           value={code.content}
    //           onValueChange={(value) =>
    //             dispatch({
    //               type: `${PREFIX.toUpperCase()}_CONTENT_CHANGED`,
    //               value: value,
    //             })
    //           }
    //           onBlur={() => {
    //             dispatch({ type: `${PREFIX.toUpperCase()}_CACHED` });

    //             // * Check if file was from k3s config
    //             // * If so then send a request to /api/yaml/json
    //             // * And put parsed result into config tree
    //             (async function () {
    //               switch (code.path) {
    //                 case "kubernetes/namespace.yaml":
    //                 case "kubernetes/deployment.yaml":
    //                 case "kubernetes/service.yaml":
    //                 case "kubernetes/ingress.yaml": {
    //                   const name = code.path.replace(/kubernetes\/|.yaml/g, "");
    //                   const configs = CombineK3sConfig(
    //                     config[name],
    //                     await YamlToJson(code.content)
    //                   );

    //                   dispatch({
    //                     type: `TEMP_CONFIG_${name}_INIT`.toUpperCase(),
    //                     value: configs,
    //                   });

    //                   dispatch({
    //                     type: `CONFIG_${name}_INIT`.toUpperCase(),
    //                     value: configs,
    //                   });

    //                   try {
    //                     let data = [] as string[];
    //                     for (const item of configs)
    //                       data.push(
    //                         await fetch(`${basePath}/api/yaml`, {
    //                           method: "POST",
    //                           headers: { "content-type": "application/json" },
    //                           body: JSON.stringify(item),
    //                         }).then((res) => res.text())
    //                       );

    //                     dispatch({
    //                       type: `CODE_${name}_PARSED`.toUpperCase(),
    //                       value: data.join("---\n"),
    //                     });
    //                   } catch (_) {}
    //                 }
    //               }
    //             })();
    //           }}
    //           highlight={(content) => {
    //             return highlight(
    //               content,
    //               ...(highlightTypes[code.type.split("/")[1] ?? "js"] ??
    //                 highlightTypes.js)
    //             )
    //               .split("\n")
    //               .map(
    //                 (line, i) =>
    //                   `<span class='editor-line-number'>${i + 1}</span>${line}`
    //               )
    //               .join("\n");
    //           }}
    //           tabSize={2}
    //           spellCheck={true}
    //           textareaId="code-area"
    //           padding={10}
    //           style={{
    //             fontFamily: '"Fira code", "Fira Mono", monospace',
    //             fontSize: 18,
    //             backgroundColor: "#fafafa",
    //             outline: 0,
    //           }}
    //         />
    //       </Container>
    //     </Col>
    //   </div>
    // </div>
  );
}

/*
apiVersion: v1
kind: Service
metadata:
  name: kube-test-s
  namespace: demo
spec:
  selector:
    app: kube-test
  type: LoadBalancer
  ports:
    - port: 8888
  clusterIP: ""

*/
