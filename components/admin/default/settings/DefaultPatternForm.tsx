import InputName from "../../../Inputs/InputName";
import InputRadio from "../../../Inputs/InputRadio";
import InputSuffixName from "../../../Inputs/InputSuffixName";
import InputTemplate from "../../../Inputs/InputTemplate";
import InputValue from "../../../Inputs/InputValue";
import { useDispatch, useSelector } from "react-redux";
import { DisplayPattern } from "../../../Display/DisplayPattern";
import { PatternData } from "../../../../types/api";
import { StateToData } from "../../../../redux/admin/settings/reducer/pattern";

export interface DefaultPatternFormProps {
  root: string;
  readFrom: string;
  writeTo?: string;
}

export default function DefaultPatternForm(props: DefaultPatternFormProps) {
  const dispatch = useDispatch();
  const pattern = useSelector((state: any) =>
    props.readFrom.split("_").reduce((acc, curr) => acc[curr], state)
  );

  return (
    <>
      {/* <Row>
        <InputGroup as={Col} xs="12" sm="6" lg="3">
          <InputTemplate className="mb-3" label="Mode">
            <InputRadio
              root={props.root}
              readFrom={`${props.readFrom}_mode`}
              options={["Stroke", "Fill", "Join"]}
              label="btn-sm btn-outline-info"
              // writeTo={(value) => {}}
            />
          </InputTemplate>
        </InputGroup>

        <InputGroup as={Col} xs="12" sm="6" lg="3" className="pr-0">
          <InputTemplate className="mb-3" label="Colors">
            <InputValue
              root={props.root}
              readFrom={`${props.readFrom}_colors`}
              className="rounded"
              placeholder="5"
              disabled={!["create", "update"].includes(pattern.action)}
              required
            />
          </InputTemplate>
        </InputGroup>

        <InputGroup as={Col} xs="12" sm="6" lg="3" className="pr-0">
          <InputTemplate className="mb-3" label="Scale">
            <InputValue
              root={props.root}
              readFrom={`${props.readFrom}_scale`}
              className="rounded"
              placeholder="16"
              disabled={!["create", "update"].includes(pattern.action)}
              required
            />
          </InputTemplate>
        </InputGroup>

        <InputGroup as={Col} xs="12" sm="6" lg="3" className="pr-0">
          <InputTemplate className="mb-3" label="Stroke">
            <InputValue
              root={props.root}
              readFrom={`${props.readFrom}_stroke`}
              className="rounded"
              placeholder="6.5"
              disabled={!["create", "update"].includes(pattern.action)}
              required
            />
          </InputTemplate>
        </InputGroup>
      </Row>

      <Row>
        <InputGroup as={Col} xs="12" sm="6" lg="3" className="pr-0">
          <InputTemplate className="mb-3" label="Spacing">
            <InputName
              char="X"
              root={props.root}
              readFrom={`${props.readFrom}_spacing_x`}
              className="rounded"
              placeholder="0"
              disabled={!["create", "update"].includes(pattern.action)}
              required
            />
          </InputTemplate>
        </InputGroup>

        <InputGroup as={Col} xs="12" sm="6" lg="3" className="pr-0">
          <InputTemplate className="mb-3" label="Spacing">
            <InputName
              char="Y"
              root={props.root}
              readFrom={`${props.readFrom}_spacing_y`}
              className="rounded"
              placeholder="10"
              disabled={!["create", "update"].includes(pattern.action)}
              required
            />
          </InputTemplate>
        </InputGroup>

        <InputGroup as={Col} xs="12" sm="6" lg="3" className="pr-0">
          <InputTemplate className="mb-3" label="Width">
            <InputSuffixName
              char="px"
              root={props.root}
              readFrom={`${props.readFrom}_width`}
              className="rounded"
              placeholder="120"
              disabled={!["create", "update"].includes(pattern.action)}
              required
            />
          </InputTemplate>
        </InputGroup>

        <InputGroup as={Col} xs="12" sm="6" lg="3" className="pr-0">
          <InputTemplate className="mb-3" label="Height">
            <InputSuffixName
              char="px"
              root={props.root}
              readFrom={`${props.readFrom}_height`}
              className="rounded"
              placeholder="80"
              disabled={!["create", "update"].includes(pattern.action)}
              required
            />
          </InputTemplate>
        </InputGroup>
      </Row>

      <div className="d-flex justify-content-center my-3">
        <div className="w-100">
          <Container className="pr-0 d-flex justify-content-center">
            <DisplayPattern data={StateToData(pattern) as PatternData} />
          </Container>

          <Container className="pr-0">
            <Editor
              className="form-control editor h-100"
              value={pattern.path}
              onValueChange={(value) =>
                dispatch({
                  type: `${
                    props.writeTo || props.readFrom
                  }_PATH_CHANGED`.toUpperCase(),
                  value: value,
                })
              }
              disabled={!["create", "update"].includes(pattern.action)}
              onBlur={() =>
                dispatch({ type: `${props.readFrom}_CACHED`.toUpperCase() })
              }
              highlight={(content) => {
                return highlight(content, languages.html, "html")
                  .split("\n")
                  .map(
                    (line, i) =>
                      `<span class='editor-line-number'>${i + 1}</span>${line}`
                  )
                  .join("\n");
              }}
              tabSize={2}
              spellCheck={true}
              textareaId="code-area"
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 18,
                backgroundColor: "#fafafa",
                outline: 0,
              }}
            />
          </Container>
        </div>
      </div> */}
    </>
  );
}
