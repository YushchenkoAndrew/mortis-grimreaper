import md5 from "../md5";

export function CacheId(prefix: string = "") {
  return md5(
    (localStorage.getItem("salt") ?? "") +
      (localStorage.getItem("id") ?? "") +
      window.location.href +
      prefix
  );
}
