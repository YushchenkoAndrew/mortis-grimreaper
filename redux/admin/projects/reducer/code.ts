import { AnyAction } from "redux";
import { basePath } from "../../../../config";
import { CODE_TEMPLATE } from "../../../../config/placeholder";
// import { codeTemplate } from "../../../../config/placeholder";
import { CacheId } from "../../../../lib/public";
import { addFile } from "../../../../lib/public/files";
import { parseHTML } from "../../../../lib/public/markers";
import { FileData } from "../../../../types/api";
import { TreeObj } from "../../../../types/tree";

const PREFIX = "CODE";

const INIT_STATE = {
  // Add new file
  role: "assets",
  dir: "",

  // Curr showed file
  // name: CODE_TEMPLATE.JS.name,
  type: CODE_TEMPLATE.JS.type,
  path: `${CODE_TEMPLATE.JS.role}/${CODE_TEMPLATE.JS.name}`,
  content: CODE_TEMPLATE.JS.content,

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
      return action.data || state;

    case `${PREFIX}_ROLE_CHANGED`:
      return { ...state, role: action.value };

    case `${PREFIX}_DIR_CHANGED`:
      return { ...state, dir: action.value };

    case `${PREFIX}_PATH_CHANGED`: {
      const file = (function GetFile(
        tree: TreeObj,
        i: number
      ): FileData | null {
        if (!tree[action.value[i]]) return null;
        if (action.value.length === i + 1)
          return tree[action.value[i]] as FileData;
        return GetFile(tree[action.value[i]] as TreeObj, i + 1);
      })(state.tree, 0);
      return {
        ...state,
        path: action.value.join("/"),
        // name: (file ?? state).name,
        type: (file ?? state).type,
        content: file?.content ?? state.content,
      };
    }

    case `${PREFIX}_FILE_UPLOADED`:
      if (!Array.isArray(action.value)) return state;

      // FIXME: ???
      // const html = parseHTML(state.content, action.value);
      // if (html) setFile({ ...file, content: html });

      return {
        ...state,
        tree: addFile(
          state.tree,
          action.info ?? { dir: state.dir, role: state.role },
          action.value
        ),
      };

    case `${PREFIX}_CONTENT_CHANGED`:
      return { ...state, content: action.value };

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
      fetch(`${basePath}/api/projects/cache?id=${CacheId(PREFIX)}`, {
        method: "POST",
        body: JSON.stringify(state),
      }).catch(() => null);

    default:
      return state;
  }
}
