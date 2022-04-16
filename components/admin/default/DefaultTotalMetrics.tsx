import { Col, Row } from "react-bootstrap";
import Card from "../../info/Card";
import DoughnutChart from "../../Display/DoughnutChart";
import { useSelector } from "react-redux";

export interface DefaultTotalMetricsProps {
  root: string;
  readFrom: string;
}

export default function DefaultTotalMetrics(props: DefaultTotalMetricsProps) {
  const root = useSelector((state: any) =>
    props.root.split("_").reduce((acc, curr) => acc[curr], state)
  );

  const pods = useSelector((state: any) =>
    `${props.readFrom}_pods`.split("_").reduce((acc, curr) => acc[curr], state)
  ) as string[];

  return (
    <Row className="mt-4 h-100">
      <Col md="6" lg={{ order: 1, span: 4 }} className="mb-4">
        <DoughnutChart
          title="Avg CPU Usage"
          root={props.root}
          readFrom={`${props.readFrom}_cpu`}
        />
      </Col>

      <Col md="6" lg={{ order: 3, span: 4 }} className="mb-4">
        <DoughnutChart
          title="Avg Memory Usage"
          root={props.root}
          readFrom={`${props.readFrom}_memory`}
        />
      </Col>

      <Col md="12" lg={{ order: 2, span: 4 }} className="mb-4">
        <Card title="Pods Names">
          {pods.map((item, i) => (
            <Row key={`pod-${i}`} className="mx-3">
              <span
                className="text-dark mx-2 my-1"
                style={{
                  width: 15,
                  height: 15,
                  backgroundColor:
                    root["backgroundColor"][i % root["backgroundColor"].length],
                  display: "flex",
                }}
              ></span>
              <p>{item}</p>
            </Row>
          ))}
        </Card>
      </Col>
    </Row>
  );
}
