import { combineReducers, createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";

import mainReducer from "./reducer/main";
import tempReducer from "./reducer/temp";
import previewReducer from "./reducer/preview";
import styleReducer from "./reducer/style";
import codeReducer from "./reducer/code";
import namespaceReducer from "./reducer/namespace";
import deploymentReducer from "./reducer/deployment";
import serviceReducer from "./reducer/service";
import ingressReducer from "./reducer/ingress";

export const store = createStore(
  combineReducers({
    main: mainReducer,
    temp: tempReducer,
    preview: previewReducer,
    style: styleReducer,
    code: codeReducer,
    config: combineReducers({
      namespace: namespaceReducer,
      deployment: deploymentReducer,
      service: serviceReducer,
      ingress: ingressReducer,
    }),
  }),
  process.env.NODE_ENV === "production"
    ? undefined
    : devToolsEnhancer({ serialize: { map: true } })
);
