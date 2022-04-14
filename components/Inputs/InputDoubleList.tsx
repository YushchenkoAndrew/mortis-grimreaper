import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import InputValue from "./InputValue";

export type DoubleType<Type> = {
  0: Type;
  1: Type;
};

export type ChangeIn = {
  readFrom: string;
  writeTo?: string;
};
export interface InputValueProps {
  char: DoubleType<string>;
  className?: string;
  root?: string | (() => void);
  readFrom: string;
  writeTo?: string;
  changeIn?: ChangeIn[];
  type?: DoubleType<string>;
  required?: DoubleType<boolean>;
  placeholder?: DoubleType<string>;
}

export default function InputList(props: InputValueProps) {
  const values = useSelector((state: any) =>
    `temp_${props.readFrom}`.split("_").reduce((acc, curr) => acc[curr], state)
  );
  const dispatch = useDispatch();

  const writeTo = `temp_${props.writeTo ?? props.readFrom}`;
  const readFrom: DoubleType<string> = [
    `temp_${props.readFrom}_0`,
    `temp_${props.readFrom}_1`,
  ];

  return (
    <Form.Row className={props.className}>
      <InputGroup as={Col} md="6" sm={{ order: 1 }} className="p-2">
        <InputGroup.Prepend>
          <InputGroup.Text>{props.char[0]}</InputGroup.Text>
        </InputGroup.Prepend>
        <InputValue
          className="rounded-right"
          readFrom={readFrom[0]}
          writeTo={writeTo}
          type={props.type?.[0]}
          required={props.required?.[0]}
          placeholder={props.placeholder?.[0]}
        />
      </InputGroup>
      <InputGroup as={Col} md="6" sm={{ order: 2 }} className="p-2">
        <InputGroup.Prepend>
          <InputGroup.Text>{props.char[1]}</InputGroup.Text>
        </InputGroup.Prepend>
        <InputValue
          readFrom={readFrom[1]}
          writeTo={writeTo}
          type={props.type?.[1]}
          required={props.required?.[1]}
          placeholder={props.placeholder?.[1]}
        />
        <InputGroup.Append>
          <Button
            name={readFrom[0]}
            variant="primary"
            onClick={() => {
              if (!values[0] || !values[1]) return;

              dispatch({
                type: `${
                  props.writeTo ?? props.readFrom
                }_CHANGED`.toUpperCase(),
                readFrom: props.readFrom,
                name: values[0],
                value: values[1],
              });

              for (const { writeTo, readFrom } of props.changeIn ?? []) {
                dispatch({
                  type: `${writeTo ?? readFrom}_CHANGED`.toUpperCase(),
                  readFrom: readFrom,
                  name: values[0],
                  value: values[1],
                });
              }

              dispatch({
                type: `${writeTo}_CHANGED`.toUpperCase(),
                readFrom: readFrom[0],
                value: "",
              });

              dispatch({
                type: `${writeTo}_CHANGED`.toUpperCase(),
                readFrom: readFrom[1],
                value: "",
              });

              if (!props.root) return;
              if (typeof props.root === "function") return props.root();
              dispatch({ type: `${props.root}_CACHED`.toUpperCase() });
            }}
          >
            Create
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form.Row>
  );
}
