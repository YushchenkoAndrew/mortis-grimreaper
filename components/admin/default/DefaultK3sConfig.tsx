import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { basePath } from "../../../config";
import { ToastDefault } from "../../../config/alert";
import { ProjectData } from "../../../types/api";
import Deployment from "../K3s/Deployment";
import Ingress from "../K3s/Ingress";
import K3sField from "../K3s/K3sField";
import Namespace from "../K3s/Namespace";
import Service from "../K3s/Service";
import Terminal, { TerminalRef } from "../Terminal";

export interface K3sConfigProps {
  show?: boolean;
}

export default React.forwardRef((props: K3sConfigProps, ref) => {
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
  // useImperativeHandle<unknown, K3sConfigRef>(ref, () => ({
  //   async onSubmit(data: ProjectData | undefined) {
  //     const formData = props.previewRef?.current?.formData;
  //     if (!formData || !data) {
  //       return new Promise((_, reject) => reject(null));
  //     }

  //     function toastRes(id: React.ReactText, status: Stat, name: string) {
  //       toast.update(id, {
  //         render: status === "OK" ? `Created ${name}` : `${name}: Server Error`,
  //         type: status === "OK" ? "success" : "error",
  //         isLoading: false,
  //         ...ToastDefault,
  //       });
  //     }

  //     function resolvePromise(name: string, promise: Promise<Response>) {
  //       return new Promise((resolve, reject) => {
  //         const toastId = toast.loading("Please wait...");
  //         promise
  //           .then((res) => res.json())
  //           .then((data: DefaultRes) => {
  //             toastRes(toastId, data.status, name);
  //             resolve(data);
  //           })
  //           .catch((err) => {
  //             toastRes(toastId, "ERR", name);
  //             reject(err);
  //           });
  //       });
  //     }

  //     function sendAll(
  //       name: string,
  //       ref: React.RefObject<K3sRef>[]
  //     ): Promise<unknown>[] {
  //       return ref
  //         .filter((item) => item?.current)
  //         .map((item) => {
  //           const value = item.current?.getValue();
  //           const namespace = value?.metadata?.namespace ?? "";
  //           return resolvePromise(
  //             `${name} [${value?.metadata?.name ?? ""}]`,
  //             fetch(
  //               `${basePath}/api/k3s/create?type=${name}` +
  //                 (namespace ? `&namespace=${namespace}` : ""),
  //               {
  //                 method: "POST",
  //                 headers: { "content-type": "application/json" },
  //                 body: JSON.stringify(value),
  //               }
  //             )
  //           );
  //         });
  //     }

  //     try {
  //       await new Promise<void>((resolve) => {
  //         // NOTE: If tag was not setted then just don't build a project
  //         // because it's doesn't contains anything except of thumbnail img
  //         const tag = props.previewRef?.current?.tag;
  //         if (!tag?.[0] || !tag?.[1]) return resolve();
  //         const repo = `${tag[0]}:${tag[1]}`;

  //         const toastId = toast.loading("Please wait...");
  //         fetch(
  //           `${basePath}/api/docker/build?tag=${repo}&path=/${
  //             props.previewRef?.current?.formData?.name ?? ""
  //           }`,
  //           {
  //             method: "POST",
  //             headers: { "content-type": "application/json" },
  //           }
  //         )
  //           .then((res) => res.text())
  //           .then((data) => {
  //             resolve();
  //             toastRes(toastId, "OK", "Docker image was created successfully");
  //             terminalRef.current?.runCommand?.(
  //               `docker build . -t ${repo}`,
  //               data
  //             );
  //           })
  //           .catch((err) => {
  //             resolve();
  //             toastRes(toastId, "ERR", "Error with Docker image creation");
  //             terminalRef.current?.runCommand?.(
  //               `docker build . -t ${repo}`,
  //               err
  //             );
  //           });
  //       });

  //       await Promise.all(sendAll("namespace", namespaceRef));
  //       await Promise.all(sendAll("deployment", deploymentRef));
  //       await Promise.all(sendAll("service", serviceRef));
  //       await Promise.all(sendAll("ingress", ingressRef));

  //       // Create Metrics ....
  //       await Promise.all(
  //         deploymentRef
  //           .filter((item) => item?.current)
  //           .map((item) => {
  //             const id = data.id || formData.id;
  //             const value = item.current?.getValue();
  //             const namespace = value?.metadata?.namespace ?? "";
  //             return (value?.spec?.template?.spec?.containers ?? []).map(
  //               (item) =>
  //                 resolvePromise(
  //                   `metrics [${item.name}]`,
  //                   fetch(
  //                     `${basePath}/api/k3s/metrics/create?prefix=${item.name}&namespace=${namespace}&id=${id}`,
  //                     { method: "POST" }
  //                   )
  //                 )
  //             );
  //           })
  //       );
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   },
  // }));

  return (
    <div className={`${props.show ? "" : "d-none"}`}>
      <div className="container mb-5">
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
                root="config_namespace"
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
                root="config_deployment"
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
                root="config_service"
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
                root="config_ingress"
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
          <Terminal ref={terminalRef} show={minimized.terminal} />
        </K3sField>
      </div>
    </div>
  );
});
