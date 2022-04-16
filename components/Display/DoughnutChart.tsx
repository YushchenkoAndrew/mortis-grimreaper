import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement } from "chart.js";
import Card from "../info/Card";
import { useSelector } from "react-redux";
import { memo } from "react";

ChartJS.register(ArcElement);

export interface DoughnutChartProps {
  root: string;
  readFrom: string;
  title: string;
  size?: { hight: number; width: number };
}

export default function DoughnutChart(props: DoughnutChartProps) {
  const root = useSelector((state: any) =>
    props.root.split("_").reduce((acc, curr) => acc[curr], state)
  );

  const data = useSelector((state: any) =>
    props.readFrom.split("_").reduce((acc, curr) => acc[curr], state)
  );

  return (
    <Card title={props.title}>
      <Doughnut
        height={props.size?.hight || 100}
        width={props.size?.width || 100}
        options={{
          responsive: true,
          animation: { duration: 1000 },
          plugins: { legend: { display: false } },
        }}
        data={{
          // labels: root[la],
          datasets: [
            {
              data,
              backgroundColor: root["backgroundColor"],
              hoverBackgroundColor: root["hoverBackgroundColor"],
            },
          ],
        }}
      />
    </Card>
  );
}
