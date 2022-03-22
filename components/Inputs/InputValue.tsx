import React from "react";
import { useDispatch, useSelector } from "react-redux";

export interface InputValueProps {
  root?: string;
  readFrom: string;
  writeTo?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export default function InputValue(props: InputValueProps) {
  const value = useSelector((state: any) =>
    props.readFrom.split("_").reduce((acc, curr) => acc[curr], state)
  );
  const dispatch = useDispatch();

  return (
    <>
      <input
        value={value}
        type={props.type ?? "text"}
        name={props.writeTo ?? props.readFrom}
        className={`form-control ${props.className}`}
        placeholder={props.placeholder ?? ""}
        required={props.required}
        onChange={({ target: { value } }) =>
          dispatch({
            type: `${(props.writeTo ?? props.readFrom).toUpperCase()}_CHANGED`,
            readFrom: props.readFrom,
            value: value,
          })
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
    </>
  );
}
