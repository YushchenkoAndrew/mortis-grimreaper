import { combineReducers, AnyAction } from "redux";
import main from "./main";
import preview from "./preview";
import code from "./code";
import namespace from "./namespace";

export default combineReducers({
  main,
  preview,
  code,
  config: combineReducers({
    namespace,
  }),
});
