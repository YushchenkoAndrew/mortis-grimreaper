import React from "react";
import { useDispatch, useSelector } from "react-redux";

export interface InputTextProps {
  root?: string;
  prefix: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}

export default function InputText(props: InputTextProps) {
  const value = useSelector((state: any) =>
    props.prefix.split("_").reduce((acc, curr) => acc[curr], state)
  );
  const dispatch = useDispatch();

  return (
    <div className="input-group">
      <textarea
        value={value}
        className="form-control rounded"
        placeholder={props.placeholder ?? ""}
        rows={props.rows ?? 3}
        required={props.required}
        onChange={({ target: { value } }) =>
          dispatch({ type: `${props.prefix.toUpperCase()}_CHANGED`, value })
        }
        onBlur={() =>
          dispatch({
            type: `${props.root ?? ""}_CACHED`.toUpperCase().replace(/^_/, ""),
          })
        }
      />
      {props.required ? (
        <div className="invalid-tooltip">This field is required</div>
      ) : null}
    </div>
  );
}
