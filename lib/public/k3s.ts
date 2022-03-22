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

export function DeleteK3sConfig(tree: {}, path: string) {
  const fields = path.split("_");
  return {
    ...tree,
    ...(function combine(prev: any, i: number = 0): {} {
      if (Array.isArray(prev)) {
        const body = prev[fields[i]] ?? {};
        return [
          ...prev.slice(0, Number(fields[i])),
          ...(i !== fields.length - 1
            ? [{ ...body, ...combine(body, i + 1) }]
            : []),
          ...prev.slice(Number(fields[i]) + 1),
        ];
      }

      if (i === fields.length - 1) {
        return Array.isArray(prev)
          ? prev.reduce(
              (acc, item, key) => (
                key == Number(fields[i]) ? acc : acc.push(item), acc
              ),
              []
            )
          : Object.entries(prev).reduce(
              (acc, [key, item]) => (
                key == fields[i] ? acc : (acc[key] = item), acc
              ),
              {}
            );
      }

      const body = prev[fields[i]] || undefined;
      return Array.isArray(body)
        ? { [fields[i]]: [...(combine(body ?? [], i + 1) as [])] }
        : { [fields[i]]: { ...(body ?? {}), ...combine(body ?? {}, i + 1) } };
    })(tree),
  };
}
