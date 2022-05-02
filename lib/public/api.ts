import { basePath } from "../../config";
import { ApiError, ApiRes } from "../../types/api";
import { createQuery } from "../api/query";

export function preloadData<Type = any>(
  path: string,
  page: number,
  args?: { [name: string]: any }
) {
  return new Promise<Type[]>((resolve, reject) => {
    fetch(
      `${basePath}/api/${path}/load?page=${page}${
        args ? createQuery(args) : ""
      }`
    )
      .then((res) => res.json())
      .then((data: ApiRes<Type[]> | ApiError) => {
        if (data.status === "ERR" || !data.result.length) return reject();

        resolve(data.result);
      })
      .catch(() => reject());
  });
}
