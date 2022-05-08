import { AnyAction } from 'redux';

import { basePath } from '../../../../config';
import { CacheId } from '../../../../lib/public';

const PREFIX = "STYLE";

const INIT_STATE = {
  // name: "",
  // flag: "JS",
  title: "md",

  pattern_id: -1,
  pattern_page: 0,
  patterns: [],

  color_id: -1,
  colors_page: 0,
  colors: [],

  // zoom: "0",
  // angle: "0",
  // colors: "5",
};

export default function (state = INIT_STATE, action: AnyAction) {
  switch (action.type as string) {
    case `${PREFIX}_INIT`:
      return {
        ...state,
        ...(action.value || {}),
      };

    case `${PREFIX}_PATTERN_PAGE_LOADED`:
      return {
        ...state,
        pattern_page: state.pattern_page + 1,
        patterns: [...state.patterns, ...action.value],
      };

    case `${PREFIX}_COLORS_PAGE_LOADED`:
      return {
        ...state,
        colors_page: state.colors_page + 1,
        colors: [...state.colors, ...action.value],
      };

    case `${PREFIX}_TITLE_CHANGED`:
      return { ...state, title: action.value };

    case `${PREFIX}_ZOOM_CHANGED`:
      return { ...state, zoom: action.value };

    case `${PREFIX}_ANGLE_CHANGED`:
      return { ...state, angle: action.value };

    case `${PREFIX}_PATTERN_ID_CHANGED`:
      return { ...state, pattern_id: action.value };

    case `${PREFIX}_COLOR_ID_CHANGED`:
      return { ...state, color_id: action.value };

    case `${PREFIX}_COLORS_CHANGED`:
      return {
        ...state,
        colors: action.value,
        pallet: ["#ddd", "#ddd", "#ddd", "#ddd", "#ddd"].slice(0, action.value),
      };

    // case `${PREFIX}_PALLET_CHANGED`: {
    //   const index = GetDynamicParams(action.type, action.readFrom ?? "");
    //   return {
    //     ...state,
    //     pallet: state.pallet.map((item, i) =>
    //       i != index[0] ? item : action.value
    //     ),
    //   };
    // }

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
