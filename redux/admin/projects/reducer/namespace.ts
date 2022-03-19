import { AnyAction } from "redux";
import { basePath } from "../../../../config";
import { CacheId } from "../../../../lib/public";

const PREFIX = "CONFIG";

const INIT_STATE = {
  role: "assets",
  path: "",

  name: "",
  type: "",
  content: "",
};

export default function (state = INIT_STATE, action: AnyAction) {
  switch (action.type as string) {
    case `${PREFIX}_INIT`:
      return action.data || state;

    case `${PREFIX}_ROLE_CHANGED`:
      return { ...state, role: action.value };

    case `${PREFIX}_PATH_CHANGED`:
      return { ...state, path: action.value };

    case `${PREFIX}_CONTENT_CHANGED`:
      return { ...state, content: action.value };

    case `${PREFIX}_CACHED`:
      fetch(`${basePath}/api/projects/cache?id=${CacheId(PREFIX)}`, {
        method: "POST",
        body: JSON.stringify(state),
      }).catch(() => null);

    default:
      return state;
  }
}
