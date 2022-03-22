import { AnyAction } from "redux";
import { UpdateK3sConfig } from "../../../../lib/public/k3s";
import code from "./code";
import { GetDynamicParams } from "./namespace";

const PREFIX = "TEMP";

const INIT_STATE = {
  preview: {
    links: { 0: "", 1: "" },
  },

  config: {
    deployment: [],
    service: [],
  },
};

export default function (state = INIT_STATE, action: AnyAction) {
  switch (action.type as string) {
    case `${PREFIX}_PREVIEW_LINKS_CHANGED`: {
      const index = GetDynamicParams(action.type, action.readFrom ?? "");
      return {
        ...state,
        preview: {
          ...state.preview,
          links: {
            ...state.preview.links,
            [index[0]]: action.value.replace(/http:\/\/|https:\/\//g, ""),
          },
        },
      };
    }

    case `${PREFIX}_CONFIG_SERVICE_ADD`:
      return {
        ...state,
        config: {
          ...state.config,
          service: [
            ...state.config.service,
            { spec: { selector: { 0: "", 1: "" } } },
          ],
        },
      };

    case `${PREFIX}_CONFIG_DEPLOYMENT_ADD`:
      return {
        ...state,
        config: {
          ...state.config,
          deployment: [
            ...state.config.deployment,
            {
              spec: {
                selector: { matchLabels: { 0: "", 1: "" } },
                template: { metadata: {}, spec: { containers: [] } },
              },
            },
          ],
        },
      };

    case `${PREFIX}_CONFIG_DEPLOYMENT_SPEC_TEMPLATE_SPEC_CONTAINERS_ADD`:
      const index = GetDynamicParams(action.type, action.readFrom ?? "");
      const path = action.readFrom
        .replace(`${PREFIX}_CONFIG_DEPLOYMENT_${index[0]}_`.toLowerCase(), "")
        .split("_");

      return {
        ...state,
        config: {
          ...state.config,
          deployment: state.config.deployment.map((item, i) =>
            i != index[0]
              ? item
              : UpdateK3sConfig(item, path.join("_"), [
                  { env: { 0: "", 1: "" } },
                ])
          ),
        },
      };

    case `${PREFIX}_CONFIG_SERVICE_SPEC_SELECTOR_CHANGED`: {
      const index = GetDynamicParams(action.type, action.readFrom ?? "");
      const path = action.readFrom
        .replace(`${PREFIX}_CONFIG_SERVICE_${index[0]}_`.toLowerCase(), "")
        .split("_");

      return {
        ...state,
        config: {
          ...state.config,
          service: state.config.service.map((item, i) =>
            i != index[0]
              ? item
              : UpdateK3sConfig(item, path.join("_"), {
                  [path[path.length - 1]]: action.value,
                })
          ),
        },
      };
    }

    case `${PREFIX}_CONFIG_DEPLOYMENT_SPEC_SELECTOR_MATCHLABELS_CHANGED`:
    case `${PREFIX}_CONFIG_DEPLOYMENT_SPEC_TEMPLATE_SPEC_CONTAINERS_ENV_CHANGED`: {
      const index = GetDynamicParams(action.type, action.readFrom ?? "");
      const path = action.readFrom
        .replace(`${PREFIX}_CONFIG_DEPLOYMENT_${index[0]}_`.toLowerCase(), "")
        .split("_");

      return {
        ...state,
        config: {
          ...state.config,
          deployment: state.config.deployment.map((item, i) =>
            i != index[0]
              ? item
              : UpdateK3sConfig(item, path.join("_"), {
                  [path[path.length - 1]]: action.value,
                })
          ),
        },
      };
    }

    default:
      return state;
  }
}
