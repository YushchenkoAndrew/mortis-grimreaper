import { AnyAction } from "redux";
import { UpdateK3sConfig } from "../../../../lib/public/k3s";
import { Namespace } from "../../../../types/K3s/Namespace";

export function GetDynamicParams(type: string, readFrom: string) {
  return type
    .split("_")
    .slice(0, -1)
    .reduce((acc, curr) => acc.replace(curr.toLowerCase(), ""), readFrom)
    .split("_")
    .filter((item) => item)
    .map((item) => Number(item));
}

const PREFIX = "CONFIG_NAMESPACE";
const INIT_STATE = [] as Namespace[];

export default function (state = INIT_STATE, action: AnyAction) {
  const index = GetDynamicParams(action.type, action.readFrom ?? "");
  switch (action.type as string) {
    case `${PREFIX}_INIT`:
      return action.data || state;

    case `${PREFIX}_ADD`:
      return [
        ...state,
        {
          apiVersion: "v1",
          kind: "Namespace",
          metadata: { name: "" },
          spec: {},
          status: {},
        },
      ];

    case `${PREFIX}_METADATA_NAME_CHANGED`:
      return state.map((item, i) =>
        i != index[0]
          ? item
          : UpdateK3sConfig(item, "metadata_name", {
              name: action.value,
            })
      );

    case `${PREFIX}_CACHED`:
    //   fetch(`${basePath}/api/projects/cache?id=${CacheId(PREFIX)}`, {
    //     method: "POST",
    //     body: JSON.stringify(state),
    //   }).catch(() => null);

    default:
      return state;
  }
}
