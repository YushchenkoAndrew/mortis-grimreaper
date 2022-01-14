import React, {
  createRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { basePath } from "../../../config";
import Deployment, { DeploymentRef } from "../K3s/Deployment";
import K3sField from "../K3s/K3sField";
import Namespace, { NamespaceRef } from "../K3s/Namespace";
import Service, { ServiceRef } from "../K3s/Service";
import Terminal, { TerminalRef } from "../Terminal";

export interface K3sConfigProps {
  show?: boolean;
}

export interface K3sConfigRef {
  onSubmit: () => Promise<any>;
}

export default React.forwardRef((props: K3sConfigProps, ref) => {
  const [minimized, onMinimize] = useState({
    namespace: true,
    deployment: true,
    service: true,
    ingress: true,
    terminal: true,
  });

  const [namespace, onNamespaceChange] = useState<boolean[]>([]);
  const [namespaceRef, onNamespaceRefChange] = useState<
    React.RefObject<NamespaceRef>[]
  >([]);

  useEffect(() => {
    onNamespaceRefChange(
      namespace.map((_, i) => namespaceRef[i] || createRef<NamespaceRef>())
    );
  }, [namespace.length]);

  const [deployment, onDeploymentChange] = useState<boolean[]>([]);
  const [deploymentRef, onDeploymentRefChange] = useState<
    React.RefObject<DeploymentRef>[]
  >([]);

  useEffect(() => {
    onDeploymentRefChange(
      deployment.map((_, i) => deploymentRef[i] || createRef<DeploymentRef>())
    );
  }, [deployment.length]);

  const [service, onServiceChange] = useState<boolean[]>([]);
  const [serviceRef, onServiceRefChange] = useState<
    React.RefObject<ServiceRef>[]
  >([]);

  useEffect(() => {
    onServiceRefChange(
      service.map((_, i) => serviceRef[i] || createRef<ServiceRef>())
    );
  }, [service.length]);

  let [ingress, onChangeIngress] = useState([]);

  const terminalRef = useRef<TerminalRef>(null);

  useImperativeHandle<unknown, K3sConfigRef>(ref, () => ({
    onSubmit() {
      return Promise.all([
        ...namespaceRef
          .filter((item) => item?.current)
          .map(
            (item) =>
              new Promise((resolve, reject) => {
                fetch(`${basePath}/api/admin/k3s/namespace/create`, {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify(item.current?.getValue()),
                })
                  .then((res) => res.json())
                  .then((data) => resolve(resolve))
                  .catch((err) => reject(err));
              })
          ),
        ...deploymentRef
          .filter((item) => item?.current)
          .map(
            (item) =>
              new Promise((resolve, reject) => {
                fetch(`${basePath}/api/admin/k3s/deployment/create`, {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify(item.current?.getValue()),
                })
                  .then((res) => res.json())
                  .then((data) => resolve(resolve))
                  .catch((err) => reject(err));
              })
          ),
        ...serviceRef
          .filter((item) => item?.current)
          .map(
            (item) =>
              new Promise((resolve, reject) => {
                fetch(`${basePath}/api/admin/k3s/service/create`, {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify(item.current?.getValue()),
                })
                  .then((res) => res.json())
                  .then((data) => resolve(resolve))
                  .catch((err) => reject(err));
              })
          ),
      ]);
    },
  }));

  return (
    <div className={props.show ? "" : "d-none"}>
      <div className="container mb-5">
        <K3sField
          name="Namespace"
          show={minimized.namespace}
          onAdd={() => onNamespaceChange([...namespace, true])}
          onHide={() =>
            onMinimize({ ...minimized, namespace: !minimized.namespace })
          }
        >
          {namespace.map((item, index) => (
            <Namespace
              key={`deployment-${index}`}
              ref={namespaceRef[index]}
              show={minimized.namespace}
            />
          ))}
        </K3sField>

        <K3sField
          name="Deployment"
          show={minimized.deployment}
          onAdd={() => onDeploymentChange([...deployment, true])}
          onHide={() =>
            onMinimize({ ...minimized, deployment: !minimized.deployment })
          }
        >
          {deployment.map((item, index) => (
            <Deployment
              ref={deploymentRef[index]}
              key={`deployment-${index}`}
              show={minimized.deployment}
            />
          ))}
        </K3sField>

        <K3sField
          name="Service"
          show={minimized.service}
          onAdd={() => onServiceChange([...service, true])}
          onHide={() =>
            onMinimize({ ...minimized, service: !minimized.service })
          }
        >
          {service.map((item, index) => (
            <Service
              ref={serviceRef[index]}
              key={index}
              show={minimized.service}
            />
          ))}
        </K3sField>

        {/* <K3sField
          name="Ingress"
          show={minimized.ingress}
          onHide={() =>
            onMinimize({ ...minimized, ingress: !minimized.ingress })
          }
        >
          {ingress.map((item, index) => (
            <Ingress key={index} show={minimized.ingress} />
          ))}
        </K3sField> */}

        <K3sField
          name="Terminal"
          show={minimized.terminal}
          onHide={() =>
            onMinimize({ ...minimized, terminal: !minimized.terminal })
          }
        >
          <Terminal ref={terminalRef} show={minimized.terminal} />
        </K3sField>
      </div>
    </div>
  );
});
