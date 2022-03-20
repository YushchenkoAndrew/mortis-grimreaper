import { AnyAction } from "redux";
import { UpdateK3sConfig } from "../../../../lib/public/k3s";
import { Service } from "../../../../types/K3s/Service";
import { GetDynamicParams } from "./namespace";

const PREFIX = "CONFIG_SERVICE";
const INIT_STATE = [] as Service[];

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
          kind: "Service",
          metadata: { name: "" },
          spec: {
            selector: {},
            type: "LoadBalancer",
            ports: [],
            clusterIP: "",
          },
        },
      ];

    case `${PREFIX}_METADATA_NAME_CHANGED`:
    case `${PREFIX}_METADATA_NAMESPACE_CHANGED`:

    case `${PREFIX}_SPEC_TYPE_CHANGED`:
    case `${PREFIX}_SPEC_CLUSTERIP_CHANGED`:

    case `${PREFIX}_SPEC_PORTS_NAME_CHANGED`:
    case `${PREFIX}_SPEC_PORTS_PROTOCOL_CHANGED`: {
      const path = action.readFrom
        .replace(`${PREFIX}_${index[0]}_`.toLowerCase(), "")
        .split("_");

      return state.map((item, i) =>
        i != index[0]
          ? item
          : UpdateK3sConfig(item, path.join("_"), {
              [path[path.length - 1]]: action.value,
            })
      );
    }

    // Update numbers
    case `${PREFIX}_SPEC_PORTS_PORT_CHANGED`:
    case `${PREFIX}_SPEC_PORTS_TARGETPORT_CHANGED`:
    case `${PREFIX}_SPEC_PORTS_NODEPORT_CHANGED`: {
      const value = Number(action.value || undefined);
      const path = action.readFrom
        .replace(`${PREFIX}_${index[0]}_`.toLowerCase(), "")
        .split("_");

      return state.map((item, i) =>
        i != index[0] || (Number.isNaN(value) && action.value !== "")
          ? item
          : UpdateK3sConfig(item, path.join("_"), {
              [path[path.length - 1]]: value || "",
            })
      );
    }

    case `${PREFIX}_SPEC_PORTS_ADD`:
      return state.map((item, i) =>
        i != index[0]
          ? item
          : UpdateK3sConfig(item, "spec_ports", [
              {
                name: "",
                nodePort: "",
                port: "",
                protocol: "TCP",
                targetPort: "",
              },
            ])
      );

    // case `${PREFIX}_CACHED`:
    //   fetch(`${basePath}/api/projects/cache?id=${CacheId(PREFIX)}`, {
    //     method: "POST",
    //     body: JSON.stringify(state),
    //   }).catch(() => null);

    default:
      return state;
  }
}
