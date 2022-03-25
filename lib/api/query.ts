export function createQuery(obj: { [key: string]: any }) {
  const result = Object.entries(obj)
    .filter(([_, value]) => value)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  return result === "" ? "" : "?" + result;
}

export function GetParam(value: string | string[]): string {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}
