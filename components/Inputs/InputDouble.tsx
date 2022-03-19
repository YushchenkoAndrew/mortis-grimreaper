import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Event } from "../../pages/admin/projects/operation";
import { LinkData } from "../../types/api";
import InputValue from "./InputValue";

export type DoubleType<Type> = {
  0: Type;
  1: Type;
};
export interface InputValueProps {
  char: DoubleType<string>;
  className?: string;
  root?: string;
  prefix: DoubleType<string>;
  type?: DoubleType<string>;
  required?: DoubleType<boolean>;
  placeholder?: DoubleType<string>;
}

export default function InputDouble(props: InputValueProps) {
  return (
    <div className={`row ${props.className ?? ""}`}>
      <div className="input-group col-md-8 order-sm-1 py-2 pl-3 pr-1">
        <div className="input-group-prepend">
          <span className="input-group-text">{props.char[0]}</span>
        </div>
        <InputValue
          className="rounded-right"
          root={props.root}
          prefix={props.prefix[0]}
          type={props.type?.[0]}
          required={props.required?.[0]}
          placeholder={props.placeholder?.[0]}
        />
      </div>
      <div className="input-group col-md-4 order-sm-2 py-2 pr-3 pl-1">
        <div className="input-group-prepend">
          <span className="input-group-text">{props.char[1]}</span>
        </div>
        <InputValue
          className="rounded-right"
          prefix={props.prefix[1]}
          root={props.root}
          type={props.type?.[1]}
          required={props.required?.[1]}
          placeholder={props.placeholder?.[1]}
        />
      </div>
    </div>
  );
}
