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

// TODO: Use time range !!
// export type TimeRange = { start: number; end: number; step: number };
// function GenerateRange({ start: i, end, step }: TimeRange) {
//   let res = [] as Date[];
//   for (; i < end; i++) {
//     res.push(new Date(new Date().getTime() - i * step));
//   }
//   return res;
// }

export function FormMetrics(metrics: MetricsData[] = []): {
  [name: string]: { cpu: number[]; memory: number[]; labels: Date[] };
} {
  return metrics.reduce(
    (acc, { name, cpu, memory, created_at }) => ({
      ...acc,
      [name]:
        name in acc
          ? {
              cpu: [...acc[name].cpu, cpu],
              memory: [...acc[name].memory, memory],
              labels: [...acc[name].labels, Date.parse(created_at || "")],
            }
          : {
              cpu: [cpu],
              memory: [memory],
              labels: [Date.parse(created_at || "")],
            },
    }),
    {}
  );
}
