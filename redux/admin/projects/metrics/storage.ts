import { combineReducers, createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";

import mainReducer from "./reducer/main";

export const store = createStore(
  combineReducers({ main: mainReducer }),
  process.env.NODE_ENV === "production"
    ? undefined
    : devToolsEnhancer({ serialize: { map: true } })
);
