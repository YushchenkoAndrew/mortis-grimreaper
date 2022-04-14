import { AnyAction } from "redux";
import {
  CombineK3sConfig,
  DeleteK3sConfig,
  UpdateK3sConfig,
} from "../../../../lib/public/k3s";
import { Deployment } from "../../../../types/K3s/Deployment";
import { GetDynamicParams } from "./namespace";

const PREFIX = "CONFIG_DEPLOYMENT";
const INIT_STATE = [] as Deployment[];

export default function (state = INIT_STATE, action: AnyAction) {
  const index = GetDynamicParams(action.type, action.readFrom ?? "");
  switch (action.type as string) {
    case `${PREFIX}_INIT`:
      return action.value || state;

    case `${PREFIX}_ADD`:
      return [
        ...state,
        {
          apiVersion: "app/v1",
          kind: "Deployment",
          metadata: { name: null, namespace: null },
          spec: {
            replicas: null,
            strategy: { type: "RollingUpdate" },
            selector: { matchLabels: {} },
            template: {
              metadata: { labels: {} },
              spec: { containers: [] },
            },
          },
        },
      ];

    case `${PREFIX}_SPEC_SELECTOR_MATCHLABELS_CHANGED`:
    case `${PREFIX}_SPEC_TEMPLATE_METADATA_LABELS_CHANGED`: {
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

    case `${PREFIX}_SPEC_SELECTOR_MATCHLABELS_DEL`:
    case `${PREFIX}_SPEC_TEMPLATE_METADATA_LABELS_DEL`:
    case `${PREFIX}_SPEC_TEMPLATE_SPEC_CONTAINERS_ENV_DEL`: {
      const path = `${action.readFrom}_${action.name}`
        .replace(`${PREFIX}_${index[0]}_`.toLowerCase(), "")
        .split("_");

      // FIXME: !!!
      return state;
      // return state.map((item, i) =>
      //   i != index[0]
      //     ? item
      //     : // : UpdateK3sConfig(item, path.join("_"), {
      //       //     [action.name]: action.value,
      //       //   })

      //       DeleteK3sConfig(item, path.join("_"))
      // );

      // links: Object.entries(state.links).reduce(
      //   (acc, [key, item]) => (
      //     key == action.value ? acc : (acc[key] = item), acc
      //   ),
    }

    case `${PREFIX}_METADATA_NAME_CHANGED`:
    case `${PREFIX}_METADATA_NAMESPACE_CHANGED`:

    case `${PREFIX}_SPEC_STRATEGY_TYPE_CHANGED`:

    case `${PREFIX}_SPEC_TEMPLATE_SPEC_CONTAINERS_NAME_CHANGED`:
    case `${PREFIX}_SPEC_TEMPLATE_SPEC_CONTAINERS_IMAGE_CHANGED`:
    case `${PREFIX}_SPEC_TEMPLATE_SPEC_CONTAINERS_IMAGEPULLPOLICY_CHANGED`:

    case `${PREFIX}_SPEC_TEMPLATE_SPEC_CONTAINERS_RESOURCES_REQUESTS_CPU_CHANGED`:
    case `${PREFIX}_SPEC_TEMPLATE_SPEC_CONTAINERS_RESOURCES_REQUESTS_MEMORY_CHANGED`:

    case `${PREFIX}_SPEC_TEMPLATE_SPEC_CONTAINERS_PORTS_NAME_CHANGED`:
    case `${PREFIX}_SPEC_TEMPLATE_SPEC_CONTAINERS_PORTS_PROTOCOL_CHANGED`:
    case `${PREFIX}_SPEC_TEMPLATE_SPEC_CONTAINERS_PORTS_HOSTIP_CHANGED`: {
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
    case `${PREFIX}_SPEC_REPLICAS_CHANGED`:

    case `${PREFIX}_SPEC_TEMPLATE_SPEC_CONTAINERS_PORTS_CONTAINERPORT_CHANGED`:
    case `${PREFIX}_SPEC_TEMPLATE_SPEC_CONTAINERS_PORTS_HOSTPORT_CHANGED`: {
      const value = Number(action.value);
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

    case `${PREFIX}_SPEC_TEMPLATE_SPEC_CONTAINERS_ADD`:
      return state.map((item, i) =>
        i != index[0]
          ? item
          : UpdateK3sConfig(item, "spec_template_spec_containers", [
              {
                name: null,
                image: null,
                imagePullPolicy: "Always",
                ports: [],
                env: [],
                resources: { requests: { cpu: null, memory: null } },
              },
            ])
      );

    case `${PREFIX}_SPEC_TEMPLATE_SPEC_CONTAINERS_DEL`: {
      const path = action.readFrom.replace(
        `${PREFIX}_${index[0]}_`.toLowerCase(),
        ""
      );

      return state.map((item, i) =>
        i != index[0] ? item : DeleteK3sConfig(item, path)
      );
    }

    case `${PREFIX}_SPEC_TEMPLATE_SPEC_CONTAINERS_PORTS_ADD`: {
      const path = action.readFrom.replace(
        `${PREFIX}_${index[0]}_`.toLowerCase(),
        ""
      );

      return state.map((item, i) =>
        i != index[0]
          ? item
          : UpdateK3sConfig(item, path, [
              {
                containerPort: null,
                hostIP: null,
                hostPort: null,
                name: null,
                protocol: "TCP",
              },
            ])
      );
    }

    case `${PREFIX}_SPEC_TEMPLATE_SPEC_CONTAINERS_PORTS_DEL`: {
      const path = action.readFrom.replace(
        `${PREFIX}_${index[0]}_`.toLowerCase(),
        ""
      );

      return state.map((item, i) =>
        i != index[0] ? item : DeleteK3sConfig(item, path)
      );
    }

    case `${PREFIX}_SPEC_TEMPLATE_SPEC_CONTAINERS_ENV_CHANGED`: {
      const path = action.readFrom.replace(
        `${PREFIX}_${index[0]}_`.toLowerCase(),
        ""
      );

      return state.map((item, i) =>
        i != index[0]
          ? item
          : UpdateK3sConfig(item, path, [
              { name: action.name, value: action.value },
            ])
      );
    }

    case `${PREFIX}_PARSED`: {
      // TODO:
      // * Write function for combining two k3s config in one

      console.log(CombineK3sConfig(state, action.value));

      return CombineK3sConfig(state, action.value);
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
