import { AnyAction } from "redux";

const PREFIX = "MAIN";
const WINDOWS = ["Preview", "Code", "Config"];

const DISABLED_WINDOW = {
  JS: ["Config"],
  Markdown: ["Config"],
  Link: ["Config", "Code"],
  Docker: [],
};

const INIT_STATE = {
  window: "Preview",
  disabled: DISABLED_WINDOW.JS,
};

export default function (state = INIT_STATE, action: AnyAction) {
  switch (action.type) {
    case `${PREFIX}_WINDOW_CHANGED`:
      return { ...state, window: action.value };

    case `${PREFIX}_FLAG_CHANGED`:
      return { ...state, disabled: DISABLED_WINDOW[action.value || "Preview"] };

    default:
      return state;
  }
}
