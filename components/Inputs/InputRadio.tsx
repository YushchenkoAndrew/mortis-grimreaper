import { Form, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import md5 from "../../lib/md5";

export type GridOption = "sm" | "md" | "lg" | "xl";
export type Overflow = {
  on: { className: string; len: number };
  off: { className: string; len: number };
};
export interface InputRadioProps {
  readFrom: string;
  writeTo?: string;
  className?: string;
  options: string[];
  label?: string;
  disabled?: string[];
  overflow?: Overflow;
  onChange?: (item: string) => void;
}

export default function InputRadio(props: InputRadioProps) {
  const value = useSelector((state: any) =>
    props.readFrom.split("_").reduce((acc, curr) => acc[curr], state)
  );
  const dispatch = useDispatch();

  return (
    <InputGroup>
      <div
        className={props.className ?? "btn-group btn-group-toggle"}
        data-toggle="buttons"
      >
        {props.options
          .filter((item) => !(props.disabled ?? []).includes(item))
          .map((item) => (
            <label
              key={`${props.readFrom}_${item}`}
              className={`btn ${props.label ?? "btn-outline-dark"} ${
                value === item ? "active" : ""
              }`}
            >
              <Form.Control
                type="radio"
                value={item}
                name={`${props.writeTo ?? props.readFrom}_${item}`}
                autoComplete="off"
                checked={value === item}
                onChange={() =>
                  props.onChange
                    ? props.onChange(item)
                    : dispatch({
                        type: `${(
                          props.writeTo ?? props.readFrom
                        ).toUpperCase()}_CHANGED`,
                        value: item,
                        readFrom: props.readFrom,
                      })
                }
              />
              {props.overflow ? (
                <>
                  <span className={props.overflow.on.className}>
                    {props.overflow.on.len
                      ? item.slice(0, props.overflow.on.len) +
                        (item.length > props.overflow.on.len ? "..." : "")
                      : item}
                  </span>
                  <span className={props.overflow.off.className}>
                    {props.overflow.off.len
                      ? item.slice(0, props.overflow.off.len) +
                        (item.length > props.overflow.off.len ? "..." : "")
                      : item}
                  </span>
                </>
              ) : (
                item
              )}
            </label>
          ))}
      </div>
    </InputGroup>
  );
}
