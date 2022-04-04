import { AnyAction } from "redux";
import { basePath } from "../../../../config";
import { CODE_TEMPLATE } from "../../../../config/placeholder";
import { createQuery } from "../../../../lib/api/query";
import { CacheId } from "../../../../lib/public";
import { addFile, getFile } from "../../../../lib/public/files";
import { FileData } from "../../../../types/api";
import { TreeObj } from "../../../../types/tree";

const PREFIX = "CODE";

export const INIT_STATE = {
  // Add new file
  role: "assets",
  dir: "",

  // Curr showed file
  type: CODE_TEMPLATE.JS.type,
  path: `${CODE_TEMPLATE.JS.role}/${CODE_TEMPLATE.JS.name}`,
  template: "Code",

  content: CODE_TEMPLATE.JS.content,
  terminal: [],

  // Project Tree
  tree: {
    assets: {},
    src: {},
    thumbnail: {},
    styles: {},
    template: { "index.html": CODE_TEMPLATE.JS },
    kubernetes: {},
  } as TreeObj,
};

export default function (state = INIT_STATE, action: AnyAction) {
  switch (action.type as string) {
    case `${PREFIX}_INIT`:
      return {
        ...state,
        ...(action.value || {}),
      };

    case `${PREFIX}_TEMPLATE_CHANGED`:
      return { ...state, template: action.value };

    case `${PREFIX}_TERMINAL_CHANGED`:
      return { ...state, terminal: [...state.terminal, action.value] };

    case `${PREFIX}_ROLE_CHANGED`:
      return { ...state, role: action.value };

    case `${PREFIX}_DIR_CHANGED`:
      return { ...state, dir: action.value };

    case `${PREFIX}_PATH_CHANGED`: {
      const file = getFile(state.tree, action.value as string[], 0);
      return {
        ...state,
        path: action.value.join("/"),
        // name: (file ?? state).name,
        type: (file ?? state).type,
        content: file?.content ?? state.content,
      };
    }

    case `${PREFIX}_FILE_UPLOADED`:
      // FIXME: ???
      // const html = parseHTML(state.content, action.value);
      // if (html) setFile({ ...file, content: html });

      const info = action.info ?? { dir: state.dir, role: state.role };
      return { ...state, tree: addFile(state.tree, info, action.value) };

    case `${PREFIX}_CONTENT_CHANGED`: {
      const file = getFile(
        state.tree,
        state.path.split("/").filter((item) => item)
      );

      if (!file) return state;
      return {
        ...state,
        content: action.value,
        tree: addFile(
          state.tree,
          {
            dir: file.path,
            role: file.role,
          },
          [
            {
              ...file,
              content: action.value,
            },
          ]
        ),
      };
    }

    case `${PREFIX}_FLAG_CHANGED`: {
      const file = CODE_TEMPLATE[action.value || "Preview"];
      if (!file) return state;
      return {
        ...state,
        type: file.type,
        path: `${file.role}/${file.name}`.replace(/^\//, ""),
        content: file.content,
        tree: addFile(
          state.tree,
          {
            dir: file.path,
            role: file.role,
          },
          [file]
        ),
      };
    }

    case `${PREFIX}_CACHED`:
      fetch(`${basePath}/api/admin/cache?id=${CacheId(PREFIX)}`, {
        method: "POST",
        body: JSON.stringify(state),
      }).catch(() => null);
      return state;

    case `${PREFIX}_CACHE_FLUSH`:
      fetch(`${basePath}/api/admin/cache?id=${CacheId(PREFIX)}`, {
        method: "DELETE",
      });

    default:
      return state;
  }
}
