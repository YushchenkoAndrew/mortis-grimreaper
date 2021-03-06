import { AnyAction } from "redux";
import { DeleteK3sConfig, UpdateK3sConfig } from "../../../../lib/public/k3s";
import { Service } from "../../../../types/K3s/Service";
import { GetDynamicParams } from "./namespace";

const PREFIX = "CONFIG_SERVICE";
const INIT_STATE = [] as Service[];

export default function (state = INIT_STATE, action: AnyAction) {
  const index = GetDynamicParams(action.type, action.readFrom ?? "");
  switch (action.type as string) {
    case `${PREFIX}_INIT`:
      return action.value || state;

    case `${PREFIX}_ADD`:
      return [
        ...state,
        {
          apiVersion: "v1",
          kind: "Service",
          metadata: { name: null },
          spec: {
            selector: {},
            type: "LoadBalancer",
            ports: [],
            clusterIP: null,
          },
        },
      ];

    case `${PREFIX}_SPEC_SELECTOR_CHANGED`: {
      const path = `${action.readFrom}_${action.name}`
        .replace(`${PREFIX}_${index[0]}_`.toLowerCase(), "")
        .split("_");

      return state.map((item, i) =>
        i != index[0]
          ? item
          : UpdateK3sConfig(item, path.join("_"), {
              [action.name]: action.value || null,
            })
      );
    }

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
              [path[path.length - 1]]: action.value || null,
            })
      );
    }

    // Update numbers
    case `${PREFIX}_SPEC_PORTS_PORT_CHANGED`:
    case `${PREFIX}_SPEC_PORTS_TARGETPORT_CHANGED`:
    case `${PREFIX}_SPEC_PORTS_NODEPORT_CHANGED`: {
      const value = Number(action.value) || null;
      const path = action.readFrom
        .replace(`${PREFIX}_${index[0]}_`.toLowerCase(), "")
        .split("_");

      return state.map((item, i) =>
        i != index[0] || Number.isNaN(value)
          ? item
          : UpdateK3sConfig(item, path.join("_"), {
              [path[path.length - 1]]: value || null,
            })
      );
    }

    case `${PREFIX}_SPEC_PORTS_ADD`:
      return state.map((item, i) =>
        i != index[0]
          ? item
          : UpdateK3sConfig(item, "spec_ports", [
              {
                name: null,
                nodePort: null,
                port: null,
                protocol: "TCP",
                targetPort: null,
              },
            ])
      );

    case `${PREFIX}_SPEC_PORTS_DEL`: {
      const path = action.readFrom.replace(
        `${PREFIX}_${index[0]}_`.toLowerCase(),
        ""
      );

      return state.map((item, i) =>
        i != index[0] ? item : DeleteK3sConfig(item, path)
      );
    }

    // NOTE: Dont need this because curr config
    // will be stored in yaml file
    // case `${PREFIX}_CACHED`:
    //   fetch(`${basePath}/api/projects/cache?id=${CacheId(PREFIX)}`, {
    //     method: "POST",
    //     body: JSON.stringify(state),
    //   }).catch(() => null);

    default:
      return state;
  }
}
