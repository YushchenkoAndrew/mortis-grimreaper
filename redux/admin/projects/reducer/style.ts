import { AnyAction } from "redux";
import { basePath } from "../../../../config";
import { CacheId } from "../../../../lib/public";
import { GetDynamicParams } from "./namespace";

const PREFIX = "STYLE";

const INIT_STATE = {
  // name: "",
  // flag: "JS",
  title: "md",

  pattern: "",
  pallet: ["#ddd", "#ddd"],
  // desc: "",
  // note: "",
  // // img: `${basePath}/img/CodeRain.webp`,
  // img: [],

  // repo: { name: "", version: "" },
  // cron: { week: "*", month: "*", day: "*/1", hour: "0", min: "0", sec: "0" },

  // links: { main: "" },
};

export default function (state = INIT_STATE, action: AnyAction) {
  switch (action.type as string) {
    case `${PREFIX}_INIT`:
      return {
        ...state,
        ...(action.value || {}),
      };

    case `${PREFIX}_TITLE_CHANGED`:
      return { ...state, title: action.value };

    case `${PREFIX}_PALLET_CHANGED`: {
      const index = GetDynamicParams(action.type, action.readFrom ?? "");
      return {
        ...state,
        pallet: state.pallet.map((item, i) =>
          i != index[0] ? item : action.value
        ),
      };
    }

    case `${PREFIX}_CACHED`:
      fetch(`${basePath}/api/admin/cache?id=${CacheId(PREFIX)}`, {
        method: "POST",
        body: JSON.stringify({ ...state }),
      }).catch(() => null);
      return state;

    case `${PREFIX}_CACHE_FLUSH`:
      fetch(`${basePath}/api/admin/cache?id=${CacheId(PREFIX)}`, {
        method: "DELETE",
      }).catch(() => null);

    default:
      return state;
  }
}