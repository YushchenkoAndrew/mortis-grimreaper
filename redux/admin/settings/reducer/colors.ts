import { AnyAction } from "redux";
import { basePath } from "../../../../config";
import { CacheId } from "../../../../lib/public";
import { CapitalizeString } from "../../../../lib/public/string";

export function DataToState(data?: { [name: string]: any }) {
  return data
    ? {
        ...["id", "colors", "path", "width", "height"].reduce(
          (acc, key) => ({ ...acc, [key]: data[key] }),
          {}
        ),

        ...["stroke", "scale"].reduce(
          (acc, key) => ({ ...acc, [key]: data[`max_${key}`] }),
          {}
        ),

        mode: CapitalizeString(data.mode),
        spacing: {
          x: `${data.max_spacing_x}`,
          y: `${data.max_spacing_y}`,
        },
      }
    : {};
}

export function StateToData(data?: { [name: string]: any }) {
  return data
    ? {
        ...["id", "colors", "path"].reduce(
          (acc, key) => ({ ...acc, [key]: data[key] }),
          {}
        ),

        ...["width", "height"].reduce(
          (acc, key) => ({ ...acc, [key]: Number(data[key]) }),
          {}
        ),

        ...["stroke", "scale"].reduce(
          (acc, key) => ({ ...acc, [`max_${key}`]: Number(data[key]) }),
          {}
        ),

        mode: data.mode.toLowerCase(),
        max_spacing_x: Number(data.spacing.x),
        max_spacing_y: Number(data.spacing.y),
      }
    : {};
}

const PREFIX = "COLORS";

const INIT_STATE = {
  info: false,
  action: "info",

  // id: -1,
  // mode: "Fill",
  // colors: "",
  // stroke: "",
  // scale: "",
  // spacing: { x: "", y: "" },
  // width: "",
  // height: "",
  // path: "",

  page: 0,
  items: [
    { colors: ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"] },
    { colors: ["#E63946", "#F1FAEE", "#A8DADC", "#457B9D", "#1D3557"] },
    { colors: ["#FFCDB2", "#FFB4A2", "#E5989B", "#B5838D", "#6D6875"] },
    { colors: ["#CB997E", "#EDDCD2", "#FFF1E6", "#F0EFEB", "#DDBEA9"] },
    { colors: ["#003049", "#D62828", "#F77F00", "#FCBF49", "#EAE2B7"] },
    { colors: ["#000000", "#14213D", "#FCA311", "#E5E5E5", "#FFFFFF"] },
    { colors: ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF"] },
    { colors: ["#03045E", "#023E8A", "#0077B6", "#0096C7", "#00B4D8"] },
    { colors: ["#2B2D42", "#8D99AE", "#EDF2F4", "#EF233C", "#D90429"] },
    { colors: ["#05668D", "#028090", "#00A896", "#02C39A", "#F0F3BD"] },
    { colors: ["#03071E", "#370617", "#6A040F", "#9D0208", "#D00000"] },
    { colors: ["#FFB5A7", "#FCD5CE", "#F8EDEB", "#F9DCC4", "#FEC89A"] },
    { colors: ["#D8E2DC", "#FFE5D9", "#FFCAD4", "#F4ACB7", "#9D8189"] },
    { colors: ["#EF476F", "#FFD166", "#06D6A0", "#118AB2", "#073B4C"] },
    { colors: ["#606C38", "#283618", "#FEFAE0", "#DDA15E", "#BC6C25"] },
    { colors: ["#011627", "#FDFFFC", "#2EC4B6", "#E71D36", "#FF9F1C"] },
    { colors: ["#FFBE0B", "#FB5607", "#FF006E", "#8338EC", "#3A86FF"] },
    { colors: ["#7400B8", "#6930C3", "#5E60CE", "#5390D9", "#4EA8DE"] },
    { colors: ["#006D77", "#83C5BE", "#EDF6F9", "#FFDDD2", "#E29578"] },
  ],
};

export default function (state = INIT_STATE, action: AnyAction) {
  switch (action.type) {
    case `${PREFIX}_INIT`:
      return { ...state, ...DataToState(action.value) };

    case `${PREFIX}_PATTERN_LOADED`:
      return {
        ...state,
        page: state.page + 1,
        items: [...state.items, ...action.value],
      };

    case `${PREFIX}_ACTION_CHANGED`: {
      // const prev = state.items.filter(({ id }) => id === state.id);

      return {
        ...state,
        action: action.value,
        // info: ["create", "update"].includes(action.value) || state.info,
        // ...(action.value === "create"
        //   ? {
        //       mode: "Fill",
        //       colors: "",
        //       stroke: "",
        //       scale: "",
        //       spacing: { x: "", y: "" },
        //       width: "",
        //       height: "",
        //       path: "",
        //     }
        //   : DataToState(prev[0])),
      };
    }

    case `${PREFIX}_INFO_CHANGED`:
      return { ...state, info: action.value, action: "info" };

    case `${PREFIX}_MODE_CHANGED`:
      return { ...state, mode: action.value };

    case `${PREFIX}_CACHED`:
      fetch(`${basePath}/api/admin/cache?id=${CacheId(PREFIX)}`, {
        method: "POST",
        body: JSON.stringify(StateToData(state)),
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
