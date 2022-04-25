import { AnyAction } from "redux";

const PREFIX = "MAIN";

const WINDOW_STATE = {};

const INIT_STATE = {
  window: "General",
};

export default function (state = INIT_STATE, action: AnyAction) {
  switch (action.type) {
    // TODO:
    // * SAVE main value in cache !!!

    case `${PREFIX}_WINDOW_CHANGED`:
      return { ...state, window: action.value };

    default:
      return state;
  }
}
