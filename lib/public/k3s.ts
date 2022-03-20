import { a } from "react-spring";

export function UpdateK3sConfig(tree: {}, path: string, value: any) {
  const fields = path.split("_");
  return {
    ...tree,
    ...(function combine(prev: any, i: number = 0): {} {
      if (Array.isArray(prev)) {
        const body = prev[fields[i]] ?? {};
        return [
          ...prev.slice(0, Number(fields[i])),
          { ...body, ...combine(body, i + 1) },
          ...prev.slice(Number(fields[i]) + 1),
        ];
      }

      if (i === fields.length - 1)
        return Array.isArray(value)
          ? { ...prev, [fields[i]]: [...(prev[fields[i]] ?? []), ...value] }
          : { ...prev, ...value };

      const body = prev[fields[i]] || undefined;
      return Array.isArray(body)
        ? { [fields[i]]: [...(combine(body ?? [], i + 1) as [])] }
        : { [fields[i]]: { ...(body ?? {}), ...combine(body ?? {}, i + 1) } };
    })(tree),
  };
}
