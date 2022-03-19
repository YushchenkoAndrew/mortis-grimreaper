import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Event } from "../../pages/admin/projects/operation";

export interface InputValueProps {
  root?: string;
  prefix: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export default function InputValue(props: InputValueProps) {
  const value = useSelector((state: any) =>
    props.prefix.split("_").reduce((acc, curr) => acc[curr], state)
  );
  const dispatch = useDispatch();

  return (
    <>
      <input
        value={value}
        type={props.type ?? "text"}
        className={`form-control ${props.className}`}
        placeholder={props.placeholder ?? ""}
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
    </>
  );
}
