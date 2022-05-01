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
        ...["id", "colors", "path", "width", "height"].reduce(
          (acc, key) => ({ ...acc, [key]: data[key] }),
          {}
        ),

        ...["stroke", "scale"].reduce(
          (acc, key) => ({ ...acc, [`max_${key}`]: data[key] }),
          {}
        ),

        mode: data.mode.toLowerCase(),
        max_spacing_x: data.spacing.x,
        max_spacing_y: data.spacing.y,
      }
    : {};
}

const PREFIX = "PATTERN";

const WINDOW_STATE = {};

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

  items: [
    {
      id: 512,
      mode: "stroke",
      colors: 5,
      max_stroke: 6.5,
      max_scale: 16,
      max_spacing_x: 0,
      max_spacing_y: 10,
      width: 120,
      height: 80,
      v_height: 20,
      path: "<path d='M-50.129 12.685C-33.346 12.358-16.786 4.918 0 5c16.787.082 43.213 10 60 10s43.213-9.918 60-10c16.786-.082 33.346 7.358 50.129 7.685'/>~<path d='M-50.129 32.685C-33.346 32.358-16.786 24.918 0 25c16.787.082 43.213 10 60 10s43.213-9.918 60-10c16.786-.082 33.346 7.358 50.129 7.685'/>~<path d='M-50.129 52.685C-33.346 52.358-16.786 44.918 0 45c16.787.082 43.213 10 60 10s43.213-9.918 60-10c16.786-.082 33.346 7.358 50.129 7.685'/>~<path d='M-50.129 72.685C-33.346 72.358-16.786 64.918 0 65c16.787.082 43.213 10 60 10s43.213-9.918 60-10c16.786-.082 33.346 7.358 50.129 7.685'/>",
    },
    {
      id: 513,
      mode: "stroke",
      colors: 5,
      max_stroke: 5.5,
      max_scale: 16,
      max_spacing_x: 0,
      max_spacing_y: 10,
      width: 80,
      height: 80,
      v_height: 20,
      path: "<path d='M-20.133 4.568C-13.178 4.932-6.452 7.376 0 10c6.452 2.624 13.036 5.072 20 5 6.967-.072 13.56-2.341 20-5 6.44-2.659 13.033-4.928 20-5 6.964-.072 13.548 2.376 20 5s13.178 5.068 20.133 5.432'/>~<path d='M-20.133 24.568C-13.178 24.932-6.452 27.376 0 30c6.452 2.624 13.036 5.072 20 5 6.967-.072 13.56-2.341 20-5 6.44-2.659 13.033-4.928 20-5 6.964-.072 13.548 2.376 20 5s13.178 5.068 20.133 5.432'/>~<path d='M-20.133 44.568C-13.178 44.932-6.452 47.376 0 50c6.452 2.624 13.036 5.072 20 5 6.967-.072 13.56-2.341 20-5 6.44-2.659 13.033-4.928 20-5 6.964-.072 13.548 2.376 20 5s13.178 5.068 20.133 5.432'/>~<path d='M-20.133 64.568C-13.178 64.932-6.452 67.376 0 70c6.452 2.624 13.036 5.072 20 5 6.967-.072 13.56-2.341 20-5 6.44-2.659 13.033-4.928 20-5 6.964-.072 13.548 2.376 20 5s13.178 5.068 20.133 5.432'/>",
    },
    {
      id: 514,
      mode: "stroke",
      colors: 5,
      max_stroke: 5.5,
      max_scale: 16,
      max_spacing_x: 0,
      max_spacing_y: 10,
      width: 40,
      height: 80,
      v_height: 20,
      path: "<path d='M-4.798 13.573C-3.149 12.533-1.446 11.306 0 10c2.812-2.758 6.18-4.974 10-5 4.183.336 7.193 2.456 10 5 2.86 2.687 6.216 4.952 10 5 4.185-.315 7.35-2.48 10-5 1.452-1.386 3.107-3.085 4.793-4.176'/>~<path d='M-4.798 33.573C-3.149 32.533-1.446 31.306 0 30c2.812-2.758 6.18-4.974 10-5 4.183.336 7.193 2.456 10 5 2.86 2.687 6.216 4.952 10 5 4.185-.315 7.35-2.48 10-5 1.452-1.386 3.107-3.085 4.793-4.176'/>~<path d='M-4.798 53.573C-3.149 52.533-1.446 51.306 0 50c2.812-2.758 6.18-4.974 10-5 4.183.336 7.193 2.456 10 5 2.86 2.687 6.216 4.952 10 5 4.185-.315 7.35-2.48 10-5 1.452-1.386 3.107-3.085 4.793-4.176'/>~<path d='M-4.798 73.573C-3.149 72.533-1.446 71.306 0 70c2.812-2.758 6.18-4.974 10-5 4.183.336 7.193 2.456 10 5 2.86 2.687 6.216 4.952 10 5 4.185-.315 7.35-2.48 10-5 1.452-1.386 3.107-3.085 4.793-4.176'/>",
    },
    {
      id: 515,
      mode: "fill",
      colors: 3,
      max_stroke: 1,
      max_scale: 10,
      max_spacing_x: 0,
      max_spacing_y: 0,
      width: 15.825,
      height: 26.667,
      v_height: 0,
      path: "<path d='M-3.176 15.632a1.467 1.467 0 00-.294.038 1.463 1.463 0 00-1.08 1.754l.013.05c.503 2.134 1.828 3.999 3.533 5.201a9.21 9.21 0 005.803 1.68c2.012-.098 3.962-.883 5.422-2.17a8.142 8.142 0 001.93-2.494 9.028 9.028 0 002.67 2.984 9.213 9.213 0 005.803 1.68c2.012-.098 3.962-.883 5.422-2.17 1.472-1.277 2.454-3.068 2.7-4.944a.217.217 0 00-.16-.234c-.11-.036-.221.037-.246.148a7.302 7.302 0 01-2.932 4.207 7.598 7.598 0 01-4.772 1.325c-1.656-.098-3.227-.76-4.392-1.815-1.178-1.043-1.938-2.478-2.098-3.95a.392.392 0 00-.036-.172 1.463 1.463 0 00-1.755-1.08 1.463 1.463 0 00-1.079 1.754l.012.05c.121.512.29 1.008.5 1.484a7.35 7.35 0 01-2.205 2.404 7.601 7.601 0 01-4.772 1.325c-1.656-.098-3.227-.76-4.392-1.815-1.178-1.043-1.938-2.478-2.098-3.95a.392.392 0 00-.036-.172 1.464 1.464 0 00-1.461-1.118z'/>~<path d='M-11.51 2.298a1.463 1.463 0 00-1.373 1.792l.013.05c.503 2.135 1.828 4 3.533 5.202a9.21 9.21 0 005.802 1.68c2.012-.098 3.962-.883 5.422-2.171a8.142 8.142 0 001.931-2.493 9.028 9.028 0 002.67 2.983 9.213 9.213 0 005.802 1.68c2.012-.097 3.962-.882 5.422-2.17 1.473-1.276 2.454-3.067 2.7-4.944a.217.217 0 00-.16-.233c-.11-.037-.22.037-.245.147a7.302 7.302 0 01-2.933 4.208 7.598 7.598 0 01-4.771 1.325c-1.656-.098-3.227-.76-4.392-1.816-1.178-1.043-1.939-2.478-2.098-3.95a.392.392 0 00-.037-.172 1.463 1.463 0 00-1.754-1.08 1.463 1.463 0 00-1.08 1.755l.013.05c.12.512.29 1.007.5 1.483A7.35 7.35 0 011.25 8.03a7.601 7.601 0 01-4.773 1.325c-1.656-.098-3.226-.76-4.392-1.816-1.177-1.043-1.938-2.478-2.097-3.95a.392.392 0 00-.037-.172 1.464 1.464 0 00-1.46-1.118z'/>",
    },
    {
      id: 516,
      mode: "fill",
      colors: 3,
      max_stroke: 1,
      max_scale: 10,
      max_spacing_x: 0,
      max_spacing_y: 0,
      width: 16.591,
      height: 26.667,
      v_height: 0,
      path: "<path d='M-4.887 15.766c-.06 0-.123.04-.123.102-.102 1.023.082 2.086.471 3.089a7.997 7.997 0 001.8 2.72A8.89 8.89 0 00.064 23.52a8.884 8.884 0 003.334.655 8.807 8.807 0 003.335-.655c1.064-.43 2.025-1.044 2.803-1.841a7.997 7.997 0 001.8-2.721 7.655 7.655 0 00.353-1.178 7.62 7.62 0 00.363 1.239 7.994 7.994 0 001.8 2.72 8.449 8.449 0 002.803 1.842 8.807 8.807 0 003.334.655 8.807 8.807 0 003.335-.655 8.89 8.89 0 002.803-1.841 7.711 7.711 0 001.8-2.721c.164-.389.266-.798.368-1.207v-1.984c-.06-.02-.102 0-.143.04-.9 1.78-2.086 3.15-3.518 4.092a8.773 8.773 0 01-4.665 1.412 8.624 8.624 0 01-4.665-1.391c-1.419-.913-2.615-2.269-3.493-4.045-.002-.023-.002-.045-.005-.067 0-.02-.02-.062-.06-.082-.062-.02-.144 0-.165.06-.88 1.8-2.086 3.172-3.518 4.093a8.476 8.476 0 01-4.665 1.41c-1.636 0-3.232-.47-4.664-1.39-1.432-.92-2.619-2.311-3.519-4.091-.02-.041-.06-.062-.102-.102z'/>~<path d='M-11.553 2.432c-.062 0-.123.04-.123.102-.103 1.023.082 2.087.47 3.09a7.997 7.997 0 001.8 2.72 8.89 8.89 0 002.803 1.841 8.884 8.884 0 003.335.655 8.807 8.807 0 003.335-.655c1.063-.43 2.025-1.043 2.802-1.84a7.997 7.997 0 001.8-2.722 7.655 7.655 0 00.353-1.178 7.62 7.62 0 00.364 1.24 7.994 7.994 0 001.8 2.72 8.449 8.449 0 002.802 1.841 8.807 8.807 0 003.335.655 8.807 8.807 0 003.335-.655 8.89 8.89 0 002.802-1.84 7.711 7.711 0 001.801-2.722c.164-.388.266-.797.368-1.206V2.493c-.061-.02-.102 0-.143.04-.9 1.78-2.086 3.15-3.518 4.092a8.773 8.773 0 01-4.665 1.412 8.624 8.624 0 01-4.665-1.391C7.22 5.733 6.022 4.377 5.145 2.6l-.005-.067c0-.02-.02-.062-.06-.082-.062-.02-.145 0-.165.061-.88 1.8-2.086 3.171-3.518 4.092a8.476 8.476 0 01-4.665 1.411c-1.637 0-3.232-.47-4.664-1.39-1.432-.922-2.619-2.312-3.519-4.092-.02-.041-.061-.062-.102-.102z'/>",
    },
    {
      id: 554,
      mode: "stroke",
      colors: 3,
      max_stroke: 7,
      max_scale: 16,
      max_spacing_x: 0,
      max_spacing_y: 0,
      width: 40,
      height: 40,
      v_height: 0,
      path: "<path d='M0 10v20m40-20v20M10 40h20M10 0h20m10 50c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zM10 40c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10m30-30c-5.523 0-10-4.477-10-10s4.477-10 10-10S50-5.523 50 0s-4.477 10-10 10zM10 0c0 5.523-4.477 10-10 10S-10 5.523-10 0s4.477-10 10-10S10-5.523 10 0'/>~<path d='M20-10v20m0 20v20m-30-30h20m20 0h20m-20 0c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10'/>",
    },
    {
      id: 555,
      mode: "stroke",
      colors: 3,
      max_stroke: 7,
      max_scale: 16,
      max_spacing_x: 0,
      max_spacing_y: 0,
      width: 40,
      height: 40,
      v_height: 0,
      path: "<path d='M40 10v20M0 10v20M10 0h20M10 40h20m10 10L30 40l10-10 10 10zM0 50l-10-10L0 30l10 10zm40-40L30 0l10-10L50 0zM0 10L-10 0 0-10 10 0z'/>~<path d='M20-10v20m0 20v20m-30-30h20m20 0h20M20 30L10 20l10-10 10 10z'/>",
    },
  ],
};

export default function (state = INIT_STATE, action: AnyAction) {
  switch (action.type) {
    case `${PREFIX}_INIT`:
      return { ...state, ...DataToState(action.value) };

    // TODO:
    // * SAVE main value in cache !!!

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
      return { ...state, info: action.value, action: "info" };

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

    default:
      return state;
  }
}
