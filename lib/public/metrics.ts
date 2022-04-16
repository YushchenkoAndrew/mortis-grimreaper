import { MetricsData } from "../../types/api";

export function AvgMetrics(metrics: MetricsData[] = []): {
  [name: string]: { len: number; cpu: number; memory: number };
} {
  return metrics.reduce(
    (acc, { name, cpu, memory }) => ({
      ...acc,
      [name]: acc[name]
        ? {
            len: acc[name].len + 1,
            cpu: acc[name].cpu + cpu,
            memory: acc[name].memory + memory,
          }
        : { len: 1, cpu, memory },
    }),
    {}
  );
}

export function FormMetrics(
  metrics: MetricsData[] = [],
  key: "Year" | "Month" | "Week" | "Day"
): {
  [name: string]: { cpu: number[]; memory: number[] };
} {
  return metrics.reduce(
    (acc, { name, cpu, memory }) => ({
      ...acc,
      [name]: acc[name]
        ? {
            cpu: [...acc[name].cpu, cpu],
            memory: [...acc[name].memory, memory],
          }
        : { cpu: [cpu], memory: [memory] },
    }),
    {}
  );
}
