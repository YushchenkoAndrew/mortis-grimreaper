import { forwardRef, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { basePath } from "../../../config";
import Deployment from "../K3s/Deployment";
import Ingress from "../K3s/Ingress";
import K3sField from "../K3s/K3sField";
import Namespace from "../K3s/Namespace";
import Service from "../K3s/Service";
import Terminal, { TerminalRef } from "../Terminal";

export interface K3sConfigProps {
  show?: boolean;
}

export default forwardRef((props: K3sConfigProps, ref) => {
  const [minimized, onMinimize] = useState({
    namespace: true,
    deployment: true,
    service: true,
    ingress: true,
    terminal: true,
  });

  const dispatch = useDispatch();
  const namespaces = useSelector(
    (state: any) => state.config.namespace as unknown[]
  );

  const deployments = useSelector(
    (state: any) => state.config.deployment as unknown[]
  );

  const services = useSelector(
    (state: any) => state.config.service as unknown[]
  );

  const ingress = useSelector(
    (state: any) => state.config.ingress as unknown[]
  );
  const terminalRef = useRef<TerminalRef>(null);

  async function ParseConfig(configs: unknown[], writeTo: string) {
    try {
      let data = [] as string[];
      for (const item of configs)
        data.push(
          await fetch(`${basePath}/api/yaml`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(item),
          }).then((res) => res.text())
        );

      dispatch({
        type: `${writeTo}_PARSED`.toUpperCase(),
        value: data.join("---\n"),
      });
    } catch (_) {}
  }

  return (
    <div className={`${props.show ? "" : "d-none"}`}>
      <Container className="mb-5">
        <K3sField
          name="Namespace"
          show={minimized.namespace}
          onAdd={() => dispatch({ type: "CONFIG_NAMESPACE_ADD" })}
          onHide={() =>
            onMinimize({ ...minimized, namespace: !minimized.namespace })
          }
        >
          {namespaces.map((_, index) => (
            <div
              key={index}
              className="col-12 col-sm-11 col-md-8 col-lg-6 col-xl-5 p-0 p-md-2"
            >
              <Namespace
                root={() => ParseConfig(namespaces, "CODE_NAMESPACE")}
                readFrom={`config_namespace_${index}`}
                writeTo="config_namespace"
                show={minimized.namespace}
              />
            </div>
          ))}
        </K3sField>

        <K3sField
          name="Deployment"
          show={minimized.deployment}
          onAdd={() => {
            dispatch({ type: "CONFIG_DEPLOYMENT_ADD" });
            dispatch({ type: "TEMP_CONFIG_DEPLOYMENT_ADD" });
          }}
          onHide={() =>
            onMinimize({ ...minimized, deployment: !minimized.deployment })
          }
        >
          {deployments.map((_, index) => (
            <div
              key={index}
              className="col-12 col-sm-11 col-md-8 col-lg-6 col-xl-5 p-0 p-md-2"
            >
              <Deployment
                root={() => ParseConfig(deployments, "CODE_DEPLOYMENT")}
                readFrom={`config_deployment_${index}`}
                writeTo="config_deployment"
                show={minimized.deployment}
              />
            </div>
          ))}
        </K3sField>

        <K3sField
          name="Service"
          show={minimized.service}
          onAdd={() => {
            dispatch({ type: "CONFIG_SERVICE_ADD" });
            dispatch({ type: "TEMP_CONFIG_SERVICE_ADD" });
          }}
          onHide={() =>
            onMinimize({ ...minimized, service: !minimized.service })
          }
        >
          {services.map((_, index) => (
            <div
              key={index}
              className="col-12 col-sm-11 col-md-8 col-lg-6 col-xl-5 p-0 p-md-2"
            >
              <Service
                root={() => ParseConfig(services, "CODE_SERVICE")}
                readFrom={`config_service_${index}`}
                writeTo="config_service"
                show={minimized.service}
              />
            </div>
          ))}
        </K3sField>

        <K3sField
          name="Ingress"
          show={minimized.ingress}
          onAdd={() => dispatch({ type: "CONFIG_INGRESS_ADD" })}
          onHide={() =>
            onMinimize({ ...minimized, ingress: !minimized.ingress })
          }
        >
          {ingress.map((_, index) => (
            <div
              key={index}
              className="col-12 col-sm-11 col-md-8 col-lg-6 col-xl-5 p-0 p-md-2"
            >
              <Ingress
                root={() => {
                  dispatch({ type: "CONFIG_INGRESS_CACHED" });
                  ParseConfig(ingress, "CODE_INGRESS");
                }}
                readFrom={`config_ingress_${index}`}
                writeTo="config_ingress"
                show={minimized.ingress}
              />
            </div>
          ))}
        </K3sField>

        <K3sField
          name="Terminal"
          show={minimized.terminal}
          onHide={() =>
            onMinimize({ ...minimized, terminal: !minimized.terminal })
          }
        >
          <Terminal
            ref={terminalRef}
            show={minimized.terminal}
            readFrom="code_terminal"
          />
        </K3sField>
      </Container>
    </div>
  );
});
