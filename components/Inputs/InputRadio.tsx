import React, { useState } from "react";
import md5 from "../../lib/md5";
import { Event } from "../../pages/admin/projects/add";
import { ProjectElement } from "../../types/projects";

export interface InputRadioProps {
  name: string;
  options: string;
  label?: string;
  row?: boolean;
  onChange: (event: Event) => void;
}

export default function InputRadio(props: InputRadioProps) {
  const values = props.options.split(" ");
  const [selected, onSelected] = useState<string | null>(values[0]);

  return (
    // <div className="input-group">
    <>
      <div className="btn-group btn-group-toggle" data-toggle="buttons">
        {values.map((item) => (
          <label
            key={md5(item + Math.random().toString())}
            className={`btn ${props.label ?? "btn-outline-dark"} ${
              selected === item ? "active" : ""
            }`}
          >
            <input
              type="radio"
              name={props.name}
              value={item}
              key={md5(item + Math.random().toString())}
              autoComplete="off"
              checked={selected === item}
              onChange={(event) => {
                props.onChange(event);
                onSelected(item);
              }}
            />
            {item}
          </label>
        ))}
      </div>
    </>
  );
}