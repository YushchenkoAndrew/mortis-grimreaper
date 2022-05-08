import { AnyAction } from 'redux';

import { basePath } from '../../../../config';
import { CacheId } from '../../../../lib/public';
import { GetDynamicParams } from '../../projects/reducer/namespace';

const PREFIX = "COLORS";

const INIT_STATE = {
  info: false,
  action: "info",

  id: -1,
  colors: ["#FFF", "#FFF", "#FFF", "#FFF", "#FFF"],

  page: 0,
  items: [],
};

export default function (state = INIT_STATE, action: AnyAction) {
  switch (action.type) {
    case `${PREFIX}_INIT`:
      return { ...state, ...action.value };

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
          ? { colors: ["#FFF", "#FFF", "#FFF", "#FFF", "#FFF"] }
          : prev[0]),
      };
    }

    case `${PREFIX}_COLORS_GENERATED`: {
      return {
        ...state,
        action: "create",
        colors: action.value.map((c: string) => c.toUpperCase()),
      };
    }

    case `${PREFIX}_COLORS_CHANGED`: {
      const index = GetDynamicParams(action.type, action.readFrom ?? "");
      const color = action.value.toUpperCase().replace(/[^A-F0-9#]+/g, "");

      return {
        ...state,
        colors: state.colors.map((item, i) =>
          i != index[0] || color.length > 7 ? item : color
        ),
      };
    }

    case `${PREFIX}_INFO_CHANGED`:
      return { ...state, info: action.value };

    case `${PREFIX}_CACHED`:
      fetch(`${basePath}/api/admin/cache?id=${CacheId(PREFIX)}`, {
        method: "POST",
        body: JSON.stringify({ colors: state.colors }),
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
