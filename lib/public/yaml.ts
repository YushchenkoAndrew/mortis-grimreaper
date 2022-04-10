import { basePath } from "../../config";

export async function YamlToJson(code: string) {
  let data = [] as unknown[];
  const configs = code.split("\n---\n");

  for (const item of configs) {
    try {
      data.push(
        await fetch(`${basePath}/api/yaml?out=json`, {
          method: "POST",
          body: item,
        }).then((res) => res.json())
      );
    } catch (_) {}
  }

  return data;
}
