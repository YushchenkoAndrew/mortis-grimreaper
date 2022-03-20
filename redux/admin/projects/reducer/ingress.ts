import { AnyAction } from "redux";
import { UpdateK3sConfig } from "../../../../lib/public/k3s";
import { Ingress } from "../../../../types/K3s/Ingress";
import { GetDynamicParams } from "./namespace";

const PREFIX = "CONFIG_INGRESS";
const INIT_STATE = [] as Ingress[];

export default function (state = INIT_STATE, action: AnyAction) {
  const index = GetDynamicParams(action.type, action.readFrom ?? "");
  switch (action.type as string) {
    case `${PREFIX}_INIT`:
      return action.data || state;

    case `${PREFIX}_ADD`:
      return [
        ...state,
        {
          apiVersion: "extensions/v1beta1",
          kind: "Ingress",
          metadata: { name: "" },
          spec: { tls: [{ secretName: "" }], rules: [] },
        },
      ];

    case `${PREFIX}_METADATA_NAME_CHANGED`:
    case `${PREFIX}_METADATA_NAMESPACE_CHANGED`:

    case `${PREFIX}_SPEC_TLS_SECRETNAME_CHANGED`:

    case `${PREFIX}_SPEC_RULES_HTTP_PATHS_PATH_CHANGED`:
    case `${PREFIX}_SPEC_RULES_HTTP_PATHS_PATHTYPE_CHANGED`:

    case `${PREFIX}_SPEC_RULES_HTTP_PATHS_BACKEND_SERVICENAME_CHANGED`: {
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

    case `${PREFIX}_SPEC_RULES_HOST_CHANGED`: {
      const path = action.readFrom
        .replace(`${PREFIX}_${index[0]}_`.toLowerCase(), "")
        .split("_");

      return state.map((item, i) =>
        i != index[0]
          ? item
          : UpdateK3sConfig(item, path.join("_"), {
              [path[path.length - 1]]: action.value.replace(
                /http:\/\/|https:\/\//g,
                ""
              ),
            })
      );
    }

    // Update numbers
    case `${PREFIX}_SPEC_RULES_HTTP_PATHS_BACKEND_SERVICEPORT_CHANGED`: {
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

    case `${PREFIX}_SPEC_RULES_ADD`:
      return state.map((item, i) =>
        i != index[0]
          ? item
          : UpdateK3sConfig(item, "spec_rules", [
              { host: "", http: { paths: [] } },
            ])
      );

    case `${PREFIX}_SPEC_RULES_HTTP_PATHS_ADD`: {
      const path = action.readFrom.replace(
        `${PREFIX}_${index[0]}_`.toLowerCase(),
        ""
      );

      return state.map((item, i) =>
        i != index[0]
          ? item
          : UpdateK3sConfig(item, path, [
              {
                path: "",
                pathType: "Prefix",
                backend: {
                  serviceName: "",
                  servicePort: "",
                },
              },
            ])
      );
    }

    // case `${PREFIX}_CACHED`:
    //   fetch(`${basePath}/api/projects/cache?id=${CacheId(PREFIX)}`, {
    //     method: "POST",
    //     body: JSON.stringify(state),
    //   }).catch(() => null);

    default:
      return state;
  }
}
