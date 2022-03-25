import React, { useRef, useState } from "react";
import { allowedReader, convertTypes } from "../../lib/public/files";
import { FileData } from "../../types/api";

export interface InputFileProps {
  name: string;
  role: string;
  type?: string;
  required?: boolean;
  multiple?: boolean;
  onUpload: (file: FileData[]) => void;
}

export default function InputFile(props: InputFileProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, onFileUpload] = useState<string | null>(null);

  return (
    <div className="input-group">
      <input
        type="file"
        ref={fileRef}
        name={props.name}
        className="d-none"
        required={props.required}
        multiple={props.multiple}
        accept={props.type}
        onChange={() => {
          if (!fileRef.current?.files?.[0]) return;
          onFileUpload(fileRef.current.files[0].name);

          let files = [] as FileData[];
          for (let i = 0; i < fileRef.current.files.length; i++) {
            const form = new FormData();
            form.append("file", fileRef.current.files[i]);
            files.push({
              file: fileRef.current.files[i],
              name: fileRef.current.files[i].name,
              type:
                convertTypes[fileRef.current.files[i].type] ??
                fileRef.current.files[i].type,
              role: props.role,
              path: "",
            });
          }

          function CreateReader(param: string, func: string) {
            return function ReadFiles(i: number): Promise<void> {
              return new Promise<void>((resolve) => {
                if (!allowedReader[func].includes(files[i].type)) {
                  if (++i == files.length) return resolve();
                  return ReadFiles(i).finally(() => resolve());
                }

                let reader = new FileReader();
                reader[func](files[i].file || new Blob());
                reader.onloadend = (_) => {
                  files[i][param] = String(reader.result);
                  if (++i == files.length) return resolve();
                  return ReadFiles(i).finally(() => resolve());
                };
              });
            };
          }

          Promise.all([
            CreateReader("url", "readAsDataURL")(0),
            CreateReader("content", "readAsText")(0),
          ]).finally(() => props.onUpload(files));
        }}
      />
      <button
        className={`btn ${
          file && !props.multiple ? "btn-success" : "btn-outline-info"
        }`}
        type="button"
        onClick={() => fileRef.current?.click()}
      >
        {file && !props.multiple ? file : "Upload"}
      </button>
      {props.required ? (
        <div className="invalid-tooltip">Thing field is required</div>
      ) : null}
    </div>
  );
}
