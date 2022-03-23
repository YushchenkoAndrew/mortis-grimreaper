import { AnyAction } from "redux";

const PREFIX = "MAIN";

const WINDOW_STATE = {
  JS: {
    operations: ["PREVIEW", "LINK", "FILES"],
    disabled: ["Config"],
  },
  Markdown: {
    operations: ["PREVIEW", "LINK", "FILES"],
    disabled: ["Config"],
  },
  Link: {
    operations: ["PREVIEW", "LINK"],
    disabled: ["Config", "Code"],
  },
  Docker: {
    operations: ["PREVIEW", "LINK", "FILES", "K3S"],
    disabled: [],
  },
};

const INIT_STATE = {
  state: "PREVIEW",
  window: "Preview",
  operations: WINDOW_STATE.JS.operations,
  disabled: WINDOW_STATE.JS.disabled,
};

export default function (state = INIT_STATE, action: AnyAction) {
  switch (action.type) {
    // TODO:
    // * SAVE main value in cache !!!
    // * Delete all cache after some specific request
    // * Revisit some api routes and delete func 'FlushValue'

    case `${PREFIX}_WINDOW_CHANGED`:
      return { ...state, window: action.value };

    case `${PREFIX}_SUBMIT_STATE_CHANGED`:
      return { ...state, state: action.value };

    case `${PREFIX}_FLAG_CHANGED`: {
      const len = state.operations.length;
      const windowState = WINDOW_STATE[action.value || "Preview"];
      return {
        ...state,
        state:
          state.state === "END" && windowState.operations.length > len
            ? windowState.operations[len]
            : state.state,
        operations: windowState.operations,
        disabled: windowState.disabled,
      };
    }

    default:
      return state;
  }
}
