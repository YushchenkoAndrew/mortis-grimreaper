import { AnyAction } from 'redux';

import { basePath } from '../../../../config';
import { CacheId } from '../../../../lib/public';
import { CapitalizeString } from '../../../../lib/public/string';

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

const PREFIX = "PATTERN";

const INIT_STATE = {
  info: false,
  action: "info",

  id: -1,
  mode: "Fill",
  colors: "",
  stroke: "",
  scale: "",
  spacing: { x: "", y: "" },
  width: "",
  height: "",
  path: "",

  page: 0,
  items: [],
};

export default function (state = INIT_STATE, action: AnyAction) {
  switch (action.type) {
    case `${PREFIX}_INIT`:
      return { ...state, ...DataToState(action.value) };

    case `${PREFIX}_PAGE_LOADED`:
      return {
        ...state,
        page: state.page + 1,
        items: [...state.items, ...action.value],
      };

    case `${PREFIX}_ACTION_CHANGED`: {
      const prev = state.items.filter(({ id }) => id === state.id);

      return {
        ...state,
        action: action.value,
        info: ["create", "update"].includes(action.value) || state.info,
        ...(action.value === "create"
          ? {
              mode: "Fill",
              colors: "",
              stroke: "",
              scale: "",
              spacing: { x: "", y: "" },
              width: "",
              height: "",
              path: "",
            }
          : DataToState(prev[0])),
      };
    }

    case `${PREFIX}_INFO_CHANGED`:
      return { ...state, info: action.value };

    case `${PREFIX}_MODE_CHANGED`:
      return { ...state, mode: action.value };

    case `${PREFIX}_SCALE_CHANGED`:
    case `${PREFIX}_COLORS_CHANGED`: {
      const value = Number(action.value);
      const key = action.readFrom
        .replace(`${PREFIX}_`.toLowerCase(), "")
        .replace("_CHANGED", "");

      return !Number.isNaN(value) && value < 256
        ? { ...state, [key]: value || null }
        : state;
    }

    case `${PREFIX}_WIDTH_CHANGED`:
    case `${PREFIX}_HEIGHT_CHANGED`:
    case `${PREFIX}_STROKE_CHANGED`: {
      const value = Number(action.value);
      const key = action.readFrom
        .replace(`${PREFIX}_`.toLowerCase(), "")
        .replace("_CHANGED", "");

      return Number.isNaN(value)
        ? state
        : {
            ...state,
            [key]:
              action.value.includes(".") || action.value === ""
                ? action.value
                : value,
          };
    }

    case `${PREFIX}_SPACING_X_CHANGED`:
    case `${PREFIX}_SPACING_Y_CHANGED`: {
      const value = Number(action.value);
      const key = action.readFrom
        .replace(`${PREFIX}_SPACING_`.toLowerCase(), "")
        .replace("_CHANGED", "");

      return Number.isNaN(value)
        ? state
        : {
            ...state,
            spacing: {
              ...state.spacing,
              [key]:
                action.value.includes(".") || action.value === ""
                  ? action.value
                  : value,
            },
          };
    }

    case `${PREFIX}_PATH_CHANGED`:
      return { ...state, path: action.value };

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
