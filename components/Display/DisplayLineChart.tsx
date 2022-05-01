import { Line } from "react-chartjs-2";
import InfoCard from "../Cards/InfoCard";
import { useSelector } from "react-redux";
import "chartjs-adapter-moment";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend,
  ScaleOptionsByType,
  CartesianScaleTypeRegistry,
} from "chart.js";
import { _DeepPartialObject } from "chart.js/types/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend
);

export interface DisplayLineChartProps {
  root: string;
  readFrom: string;
  title: string;
  size?: { hight: number; width: number };
  scale?: _DeepPartialObject<{
    [key: string]: ScaleOptionsByType<keyof CartesianScaleTypeRegistry>;
  }>;
}

export default function DisplayLineChart(props: DisplayLineChartProps) {
  const root = useSelector((state: any) =>
    props.root.split("_").reduce((acc, curr) => acc[curr], state)
  );

  const data = useSelector((state: any) =>
    props.readFrom.split("_").reduce((acc, curr) => acc[curr], state)
  ) as number[][];

  return (
    <InfoCard title={props.title} className="mb-3">
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
          scales: props.scale,
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
    </InfoCard>
  );
}
