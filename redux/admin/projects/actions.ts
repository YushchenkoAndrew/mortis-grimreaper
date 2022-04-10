import { Action } from "redux";

export const previewReducer = (state: number = 0, action: Action<any>) => {
  switch (action.type) {
    case "YES":
      return state + 1;

    default:
      return state;
  }
};

// export const defaultAction = () =>
