import { AnyAction } from "redux";
import { AvgMetrics, FormMetrics } from "../../../../../lib/public/metrics";

const PREFIX = "MAIN";

const INIT_STATE = {
  flag: "Week" as "Year" | "Month" | "Week" | "Day",
  total: { pods: [], cpu: [], memory: [] },

  label: [],
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
    case `${PREFIX}_INIT`: {
      const metrics = FormMetrics(action.value, state.flag);
      const avg = AvgMetrics(action.value);

      console.log(metrics);

      return {
        ...state,
        total: {
          pods: Object.keys(avg),
          cpu: Object.values(avg).map(({ cpu, len }) => cpu / len || 1),
          memory: Object.values(avg).map(({ memory: m, len }) => m / len || 1),
        },

        labels: Object.values(metrics).map(({ cpu }) =>
          cpu.map((_, i) => i)
        )[0],
        metrics: {
          cpu: Object.values(metrics).map(({ cpu }) => cpu),
          memory: Object.values(metrics).map(({ memory }) => memory),
        },
      };
    }

    case `${PREFIX}_FLAG_CHANGED`:
      return { ...state, flag: action.value };

    default:
      return state;
  }
}
