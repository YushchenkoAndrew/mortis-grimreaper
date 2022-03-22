import { combineReducers, AnyAction } from "redux";
import main from "./main";
import temp from "./temp";
import preview from "./preview";
import code from "./code";
import namespace from "./namespace";
import deployment from "./deployment";
import service from "./service";
import ingress from "./ingress";

export default combineReducers({
  main,
  temp,
  preview,
  code,
  config: combineReducers({
    namespace,
    deployment,
    service,
    ingress,
  }),
});
