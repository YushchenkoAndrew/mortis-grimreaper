import { AnyAction } from "redux";

const PREFIX = "MAIN";

const INIT_STATE = {
  flag: "Week",
};

export default function (state = INIT_STATE, action: AnyAction) {
  switch (action.type) {
    // TODO:
    // * SAVE main value in cache !!!

    case `${PREFIX}_FLAG_CHANGED`:
      return { ...state, flag: action.value };

    default:
      return state;
  }
}
