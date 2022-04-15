import Card from "../../info/Card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Col, Form, Row } from "react-bootstrap";
import InputTemplate from "../../Inputs/InputTemplate";
import InputRadio from "../../Inputs/InputRadio";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface DefaultMetricsProps {
  show?: boolean;
  update?: boolean;
}

const PREFIX = "main";

export default function DefaultMetrics(props: DefaultMetricsProps) {
  return (
    <>
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

      <Card title="CPU Usage">
        <Line
          height={1500}
          width={3000}
          options={{
            animation: { duration: 1000 },
            // backgroundColor: "#000",

            responsive: true,
            // plugins: { legend: { position: "top" } },
            // scales: {
            //   y: {
            //     ticks: {
            //       callback: (value) =>
            //         `${((Number(value) / 4) * 100).toFixed(2)} %`,
            //     },
            //   },
            // },
          }}
          data={{
            // labels: props.containers.labels.map((item) => {
            labels: [12, 19, 3, 5, 2, 3],
            //   const date = new Date(Date.parse(item));
            //   return [
            //     `${date.getDate()} ${MONTH[date.getMonth()]}`,
            //     `0${date.getHours()}:`.slice(-3) +
            //       `0${date.getMinutes()}`.slice(-2),
            //   ];
            // }),
            // datasets: props.containers.data.map((data, i) => ({
            datasets: [
              {
                label: "Dataset 1",
                data: [12, 19, 3, 5, 2, 3],
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
              },
              {
                label: "Dataset 2",
                data: [10, 15, 1, 8, 2, 4],
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.5)",
              },
            ],
          }}
        />
      </Card>
    </>
  );
}
