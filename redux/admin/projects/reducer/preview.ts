import { AnyAction } from "redux";
import { basePath } from "../../../../config";
import { CacheId } from "../../../../lib/public";

const PREFIX = "PREVIEW";
export const CRON_TIME = ["sec", "min", "hour", "day", "month", "week"];

const INIT_STATE = {
  id: -1,
  name: "",
  flag: "JS",
  title: "",
  desc: "",
  note: "",
  // img: `${basePath}/img/CodeRain.webp`,
  img: [],

  repo: { name: "", version: "" },
  cron: { week: "*", month: "*", day: "*/1", hour: "0", min: "0", sec: "0" },

  links: { main: "" },
};

export default function (state = INIT_STATE, action: AnyAction) {
  switch (action.type as string) {
    case `${PREFIX}_INIT`:
      return {
        ...state,
        ...(action.value || {}),
      };

    case `${PREFIX}_ID_CHANGED`: {
      const value = Number(action.value);
      return {
        ...state,
        id: Number.isNaN(value) ? state.id : value,
      };
    }

    case `${PREFIX}_NAME_CHANGED`:
      return {
        ...state,
        name: action.value.replace(" ", ""),
      };

    case `${PREFIX}_TITLE_CHANGED`:
      return { ...state, title: action.value };

    case `${PREFIX}_FLAG_CHANGED`:
      return { ...state, flag: action.value };

    case `${PREFIX}_DESC_CHANGED`:
      return { ...state, desc: action.value };

    case `${PREFIX}_NOTE_CHANGED`:
      return { ...state, note: action.value };

    case `${PREFIX}_IMG_UPLOADED`:
      return { ...state, img: action.value || state.img };

    case `${PREFIX}_LINKS_CHANGED`:
      return {
        ...state,
        links: {
          ...state.links,
          [action.value]: action.name.replace(/http:\/\/|https:\/\//g, ""),
        },
      };

    case `${PREFIX}_LINKS_MAIN_CHANGED`:
      return {
        ...state,
        links: {
          ...state.links,
          main: action.value.replace(/http:\/\/|https:\/\//g, ""),
        },
      };

    case `${PREFIX}_LINKS_DEL`:
      return {
        ...state,
        links: Object.entries(state.links).reduce(
          (acc, [key, item]) => (
            key == action.value ? acc : (acc[key] = item), acc
          ),
          {}
        ),
        // links: {
        //   ...state.links,
        //   [action.name ?? "main"]: action.value.replace(
        //     /http:\/\/|https:\/\//g,
        //     ""
        //   ),
        // },
      };

    case `${PREFIX}_REPO_NAME_CHANGED`:
      return { ...state, repo: { ...state.repo, name: action.value } };

    case `${PREFIX}_REPO_VERSION_CHANGED`:
      return { ...state, repo: { ...state.repo, version: action.value } };

    case `${PREFIX}_CRON_WEEK_CHANGED`:
      return { ...state, cron: { ...state.cron, week: action.value } };

    case `${PREFIX}_CRON_MONTH_CHANGED`:
      return { ...state, cron: { ...state.cron, month: action.value } };

    case `${PREFIX}_CRON_DAY_CHANGED`:
      return { ...state, cron: { ...state.cron, day: action.value } };

    case `${PREFIX}_CRON_HOUR_CHANGED`:
      return { ...state, cron: { ...state.cron, hour: action.value } };

    case `${PREFIX}_CRON_MIN_CHANGED`:
      return { ...state, cron: { ...state.cron, min: action.value } };

    case `${PREFIX}_CRON_SEC_CHANGED`:
      return { ...state, cron: { ...state.cron, sec: action.value } };

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
