import { Col, Container, Row } from "react-bootstrap";
import Card from "../../info/Card";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement } from "chart.js";

ChartJS.register(ArcElement);

export interface DefaultTotalMetricsProps {
  show?: boolean;
  update?: boolean;
}

export default function DefaultTotalMetrics(props: DefaultTotalMetricsProps) {
  return (
    <Row className="mt-4 h-100">
      <Col md="6" lg={{ order: 1, span: 4 }} className="mb-4">
        <Card title="Avg CPU Usage">
          <Doughnut
            height={100}
            width={100}
            options={{ animation: { duration: 1000 } }}
            data={{
              // labels: props.containers.data.map((data) => data.name),
              datasets: [
                {
                  // data: props.containers.data.map((data) =>
                  //   data.cpu.reduce((acc, curr) => acc + curr)
                  // ),
                  data: [12, 19, 3, 5, 2, 3],
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                  ],
                  // backgroundColor: COLORS.slice(3, 6).map(
                  //   (color) => `rgba(${color.join(",")},0.6)`
                  // ),
                  // hoverBackgroundColor: COLORS.slice(3, 6).map(
                  //   (color) => `rgb(${color.join(",")})`
                  // ),
                },
              ],
            }}
          />
        </Card>
      </Col>

      <Col md="6" lg={{ order: 3, span: 4 }} className="mb-4">
        <Card title="Avg Memory Usage">
          <Doughnut
            height={100}
            width={100}
            options={{ animation: { duration: 1000 } }}
            data={{
              // labels: props.containers.data.map((data) => data.name),
              datasets: [
                {
                  // data: props.containers.data.map((data) =>
                  //   data.cpu.reduce((acc, curr) => acc + curr)
                  // ),
                  data: [12, 19, 3, 5, 2, 3],
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                  ],
                  // backgroundColor: COLORS.slice(3, 6).map(
                  //   (color) => `rgba(${color.join(",")},0.6)`
                  // ),
                  // hoverBackgroundColor: COLORS.slice(3, 6).map(
                  //   (color) => `rgb(${color.join(",")})`
                  // ),
                },
              ],
            }}
          />
        </Card>
      </Col>

      <Col md="12" lg={{ order: 2, span: 4 }} className="mb-4">
        <Card title="Avg Memory Usage">
          <h2>Pods in use</h2>
        </Card>
      </Col>
    </Row>
  );
}
