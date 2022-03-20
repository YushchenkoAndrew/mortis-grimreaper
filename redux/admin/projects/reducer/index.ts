import { combineReducers, AnyAction } from "redux";
import main from "./main";
import preview from "./preview";
import code from "./code";
import namespace from "./namespace";
import deployment from "./deployment";
import service from "./service";
import ingress from "./ingress";

export default combineReducers({
  main,
  preview,
  code,
  config: combineReducers({
    namespace,
    deployment,
    service,
    ingress,
  }),
});
