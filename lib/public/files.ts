import { basePath, voidUrl } from "../../config";
import { FileData, ProjectData } from "../../types/api";
import { TreeObj } from "../../types/tree";
import { createQuery } from "../api/query";
import md5 from "../md5";

export function formPath(obj?: FileData | string[]) {
  if (!obj) return "";
  if (Array.isArray(obj)) {
    return obj
      .map((item) => item?.replace?.(/^\//, ""))
      .filter((item) => item)
      .join("/");
  }

  return [obj.role, obj.path, obj.name]
    .map((item) => item?.replace?.(/^\//, ""))
    .filter((item) => item)
    .join("/");
}

export const convertTypes = {
  "application/x-javascript": "text/javascript",
  "x-application/x-javascript": "text/javascript",
};

export const allowedReader = [
  // readAsDataURL: [
  //   "image/gif",
  //   "image/jpg",
  //   "image/jpeg",
  //   "image/webp",
  //   "image/png",
  //   "font/ttf",
  // ],
  // readAsText: [
  "text/markdown",
  "text/html",
  "text/css",
  "text/javascript",
  "text/dockerfile",
  "text/yaml",
  "application/json",
  // ],
];

export async function formFile(file: FileData, project: string) {
  if (file.content) {
    return new File(
      [new Blob([file.content], { type: file.type })],
      file.name,
      { type: file.type }
    );
  }

  // if (file.file) return file.file;

  const res = await fetch(
    `${basePath}/api/file/load?path=` +
      (file.url?.replace?.(`${voidUrl}/`, "") ||
        formPath([project, file.role, file.path, file.name]))
  );
  return new File([await res.blob()], file.name, {
    type: file.type,
  });
}
export function getFile(
  tree: TreeObj,
  path: string[],
  i: number = 0
): FileData | null {
  if (!tree[path[i]]) return null;
  if (path.length === i + 1) return tree[path[i]] as FileData;
  return getFile(tree[path[i]] as TreeObj, path, i + 1);
}

export function addFile(
  tree: TreeObj,
  { dir, role }: { dir: string; role: string },
  files?: FileData[]
): TreeObj {
  const path = [
    files?.[0]?.role || role,
    ...dir.split("/").filter((item) => item),
  ];
  return {
    ...tree,
    ...(function combine(
      prev: TreeObj | FileData | null,
      i: number = 0
    ): TreeObj {
      if (i === path.length) {
        return (files ?? []).reduce(
          (acc, curr) => ({
            ...acc,
            [curr.name]: {
              ...curr,
              type: convertTypes[curr.type] ?? curr.type,
              path: path.slice(1).join("/"),
            },
          }),
          {} as TreeObj
        );
      }

      const body = prev && !prev.name ? prev[path[i]] : prev ?? {};
      return !path[i]
        ? { ...body, ...combine(body, i + 1) }
        : { [path[i]]: { ...body, ...combine(body, i + 1) } };
    })(tree),
  };
}

export async function tmpFile(file: File, info: { role: string; dir: string }) {
  const body = new FormData();
  body.append("file", file);

  try {
    await fetch(`${basePath}/api/file/tmp` + createQuery(info), {
      method: "POST",
      body: body,
    });

    return (
      `${voidUrl}/tmp/` +
      md5(formPath([info.role, info.dir, file.name]).replace(/\//g, ""))
    );
  } catch (err) {}
}
