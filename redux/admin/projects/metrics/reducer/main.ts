import { AnyAction } from "redux";
import { AvgMetrics, FormMetrics } from "../../../../../lib/public/metrics";

export const TIME_RANGE = {
  Year: 12 * 30 * 24 * 60 * 60 * 1000,
  Month: 30 * 24 * 60 * 60 * 1000,
  Week: 7 * 24 * 60 * 60 * 1000,
  Day: 24 * 60 * 60 * 1000,
};

const PREFIX = "MAIN";

const INIT_STATE = {
  flag: "Week" as "Year" | "Month" | "Week" | "Day",
  process: "Normal" as "Normal" | "Preprocess",

  total: { pods: [], cpu: [], memory: [] },

  labels: [],
  metrics: { cpu: [], memory: [] },

  backgroundColor: [
    "rgba(249,65,68,  0.4)",
    "rgba(243,114,44, 0.4)",
    "rgba(248,150,30, 0.4)",
    "rgba(249,199,79, 0.4)",
    "rgba(144,190,109,0.4)",
    "rgba(67,170,139, 0.4)",
    "rgba(77,144,142, 0.4)",
    "rgba(87,117,144, 0.4)",
    "rgba(39,125,161, 0.4)",
  ],

  borderColor: [
    "rgba(249,65,68,  1.0)",
    "rgba(243,114,44, 1.0)",
    "rgba(248,150,30, 1.0)",
    "rgba(249,199,79, 1.0)",
    "rgba(144,190,109,1.0)",
    "rgba(67,170,139, 1.0)",
    "rgba(77,144,142, 1.0)",
    "rgba(87,117,144, 1.0)",
    "rgba(39,125,161, 1.0)",
  ],
};

export default function (state = INIT_STATE, action: AnyAction) {
  switch (action.type) {
    case `${PREFIX}_INIT`:
      return { ...state, ...action.value };

    case `${PREFIX}_METRICS_CALC`: {
      const metrics = FormMetrics(action.value);
      const avg = AvgMetrics(action.value);

      return {
        ...state,
        total: {
          pods: Object.keys(avg),
          cpu: Object.values(avg).map(({ cpu, len }) => cpu / len || 1),
          memory: Object.values(avg).map(({ memory: m, len }) => m / len || 1),
        },

        labels: Object.values(metrics).map(({ labels }) => labels)[0],
        metrics: {
          cpu: Object.values(metrics).map(({ cpu }) => cpu),
          memory: Object.values(metrics).map(({ memory }) => memory),
        },
      };
    }

    case `${PREFIX}_FLAG_CHANGED`:
      return { ...state, flag: action.value };

    case `${PREFIX}_PROCESS_CHANGED`:
      return { ...state, process: action.value };

    default:
      return state;
  }
}
