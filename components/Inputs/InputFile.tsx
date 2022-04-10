import { useRef, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { allowedReader, convertTypes } from "../../lib/public/files";
import { FileData } from "../../types/api";

export interface InputFileProps {
  name: string;
  role: string;
  type?: string;
  required?: boolean;
  multiple?: boolean;
  onUpload: (file: FileData[]) => void;
  onURL?: (file: File) => Promise<string | undefined>;
}

export default function InputFile(props: InputFileProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, onFileUpload] = useState<string | null>(null);

  return (
    <InputGroup hasValidation>
      <Form.Control
        type="file"
        ref={fileRef}
        name={props.name}
        className="d-none"
        required={props.required}
        multiple={props.multiple}
        accept={props.type}
        onChange={() => {
          if (!fileRef.current?.files?.[0]) return;

          const files = fileRef.current.files;
          onFileUpload(files[0].name);

          let data = [] as FileData[];
          for (let i = 0; i < files.length; i++) {
            data.push({
              name: fileRef.current.files[i].name,
              type:
                convertTypes[fileRef.current.files[i].type] ??
                fileRef.current.files[i].type,
              role: props.role,
              path: "",
            });
          }

          (async function () {
            for (let i in data) {
              if (!allowedReader.includes(data[i].type)) {
                data[i].url = await props.onURL?.(files[i]);
                continue;
              }

              await new Promise<void>((resolve) => {
                let reader = new FileReader();
                reader.readAsText(files[i]);
                reader.onloadend = () => {
                  data[i].content = String(reader.result);
                  resolve();
                };
              });
            }
          })().finally(() => props.onUpload(data));
        }}
      />
      <Button
        type="button"
        variant={file && !props.multiple ? "success" : "outline-info"}
        onClick={() => fileRef.current?.click()}
      >
        {file && !props.multiple ? file : "Upload"}
      </Button>
      <Form.Control.Feedback hidden={!props.required} type="invalid" tooltip>
        Please upload file
      </Form.Control.Feedback>
    </InputGroup>
  );
}
