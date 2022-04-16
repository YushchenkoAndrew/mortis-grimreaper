import { Col, Container, Form, Row } from "react-bootstrap";
import InputRadio from "../../Inputs/InputRadio";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import DefaultTotalMetrics from "./DefaultTotalMetrics";
import { MetricsData } from "../../../types/api";
import LineChart from "../../Display/LineChart";

export interface DefaultMetricsProps {
  metrics: MetricsData[];
}

const PREFIX = "main";

export default function DefaultMetrics(props: DefaultMetricsProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: `${PREFIX}_INIT`.toUpperCase(), value: props.metrics });
  }, []);

  return (
    <Container>
      <DefaultTotalMetrics root={PREFIX} readFrom={`${PREFIX}_total`} />

      <Row>
        <Form.Group as={Col} className="mb-2">
          <InputRadio
            readFrom={`${PREFIX}_flag`}
            options={["Year", "Month", "Week", "Day"]}
            className="btn-group btn-group-sm btn-group-toggle mb-2"
            label="btn-outline-dark"
          />
        </Form.Group>
      </Row>

      <LineChart
        root={PREFIX}
        title="CPU Usage"
        size={{ hight: 1500, width: 3000 }}
        readFrom={`${PREFIX}_metrics_cpu`}
      />

      <LineChart
        root={PREFIX}
        title="Memory Usage"
        size={{ hight: 1500, width: 3000 }}
        readFrom={`${PREFIX}_metrics_memory`}
      />
    </Container>
  );
}
