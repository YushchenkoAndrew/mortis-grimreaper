import { Col, InputGroup, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { DisplayColors } from '../../../Display/DisplayColors';
import InputColor from '../../../Inputs/InputColor';
import InputTemplate from '../../../Inputs/InputTemplate';
import InputValue from '../../../Inputs/InputValue';

export interface DefaultColorsFormProps {
  root: string;
  readFrom: string;
  writeTo?: string;
}

export default function DefaultColorsForm(props: DefaultColorsFormProps) {
  const pattern = useSelector((state: any) =>
    props.readFrom.split("_").reduce((acc, curr) => acc[curr], state)
  );

  return (
    <>
      <div className="mb-3">
        <div className="d-flex w-100 justify-content-center mb-4">
          <DisplayColors data={pattern} />
        </div>

        <div className="d-flex w-100 justify-content-center">
          {pattern.colors.map((_: never, i: number) => (
            <InputColor
              key={i}
              root={props.root}
              readFrom={`${props.readFrom}_colors_${i}`}
              writeTo={`${props.writeTo || props.readFrom}_colors`}
              className="mx-2"
              disabled={!["create", "update"].includes(pattern.action)}
            />
          ))}
        </div>
      </div>

      <Row>
        {pattern.colors.map((_: never, i: number) => (
          <InputGroup key={i} as={Col} xs="12" sm="6" lg="3" className="pr-0">
            <InputTemplate className="mb-3" label={`Color #${i + 1}`}>
              <InputValue
                root={props.root}
                readFrom={`${props.readFrom}_colors_${i}`}
                writeTo={`${props.readFrom}_colors`}
                className="rounded"
                placeholder="5"
                disabled={!["create", "update"].includes(pattern.action)}
                required
              />
            </InputTemplate>
          </InputGroup>
        ))}
      </Row>
    </>
  );
}
