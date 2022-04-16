import { Line } from "react-chartjs-2";
import Card from "../info/Card";
import { useSelector } from "react-redux";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend
);

export interface LineChartProps {
  root: string;
  readFrom: string;
  title: string;
  size?: { hight: number; width: number };
}

export default function LineChart(props: LineChartProps) {
  const root = useSelector((state: any) =>
    props.root.split("_").reduce((acc, curr) => acc[curr], state)
  );

  const data = useSelector((state: any) =>
    props.readFrom.split("_").reduce((acc, curr) => acc[curr], state)
  ) as number[][];

  return (
    <Card title={props.title}>
      <Line
        height={props.size?.hight || 100}
        width={props.size?.width || 100}
        options={{
          responsive: true,
          animation: { duration: 1000 },
          plugins: { legend: { display: false } },
          interaction: {
            mode: "index",
            intersect: false,
          },
        }}
        data={{
          labels: root["labels"],
          datasets: data.map((item, i) => ({
            data: item,
            fill: i ? i - 1 : true,
            backgroundColor:
              root["backgroundColor"] &&
              root["backgroundColor"][i % root["backgroundColor"].length],
            borderColor:
              root["borderColor"] &&
              root["borderColor"][i % root["borderColor"].length],
          })),
        }}
      />
    </Card>
  );
}
