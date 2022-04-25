import { combineReducers, createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";

import mainReducer from "./reducer/main";

export const store = createStore(
  combineReducers({
    main: mainReducer,
    // temp: tempReducer,
    // preview: previewReducer,
    // style: styleReducer,
    // code: codeReducer,
    // config: combineReducers({
    //   namespace: namespaceReducer,
    //   deployment: deploymentReducer,
    //   service: serviceReducer,
    //   ingress: ingressReducer,
    // }),
  }),
  process.env.NODE_ENV === "production"
    ? undefined
    : devToolsEnhancer({ serialize: { map: true } })
);
