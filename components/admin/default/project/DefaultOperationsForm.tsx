import 'react-toastify/dist/ReactToastify.css';

import { ReactText, useEffect, useState } from 'react';
import { Button, Container, Form, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Bounce, toast, ToastContainer } from 'react-toastify';

import { basePath } from '../../../../config';
import { ToastDefault } from '../../../../config/alert';
import { createQuery } from '../../../../lib/api/query';
import { CacheId } from '../../../../lib/public';
import { formFile } from '../../../../lib/public/files';
import { CombineK3sConfig } from '../../../../lib/public/k3s';
import { CapitalizeString } from '../../../../lib/public/string';
import { YamlToJson } from '../../../../lib/public/yaml';
import { FileData, ProjectData } from '../../../../types/api';
import { DefaultRes } from '../../../../types/request';
import { TreeObj } from '../../../../types/tree';
import InputRadio from '../../../Inputs/InputRadio';
import DefaultCodeView from './DefaultCodeView';
import DefaultK3sConfig from './DefaultK3sConfig';
import DefaultPreview from './DefaultPreview';
import DefaultStyleView from './DefaultStyleView';

export interface DefaultOperationsFormProps {
  operation: string;
  preview?: { [name: string]: any };
  code?: { tree: TreeObj };
}

// FIXME: Redux to slow on tree update (/Config)
// TODO: READ THIS !!!!!!!!!!
// https://reactrocket.com/post/react-redux-optimization/
// https://redux.js.org/usage/structuring-reducers/normalizing-state-shape

export default function DefaultOperationsForm(
  props: DefaultOperationsFormProps
) {
  const dispatch = useDispatch();
  const root = useSelector((state: any) => state);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    (async function () {
      // Load Cache in order
      await fetch(`${basePath}/api/admin/cache?id=${CacheId("PREVIEW")}`)
        .then((res) => res.json())
        .then((data) => {
          if (!(data = data.result || props.preview)) return;
          dispatch({ type: "PREVIEW_INIT", value: data });
          dispatch({ type: "MAIN_FLAG_CHANGED", value: data.flag });
          dispatch({ type: "CODE_FLAG_CHANGED", value: data.flag });
        })
        .catch(() => null);

      try {
        const res = await fetch(
          `${basePath}/api/admin/cache?id=${CacheId("CODE")}`
        );
        let data = await res.json();
        if (!(data = data.result || props.code)) return;
        dispatch({ type: `CODE_INIT`, value: data });

        // Load K3s config from yaml files
        for (const key in data.tree.kubernetes) {
          const name = key.replace(/.yaml/g, "");
          const configs = CombineK3sConfig(
            root.config[name],
            await YamlToJson(data.tree.kubernetes[key].content || "")
          );

          dispatch({
            type: `TEMP_CONFIG_${name}_INIT`.toUpperCase(),
            value: configs,
          });

          dispatch({
            type: `CONFIG_${name}_INIT`.toUpperCase(),
            value: configs,
          });
        }
      } catch (_) {}
    })();
  }, []);

  function SubmitStateMachine(state: string, id: number) {
    switch (state) {
      case "PREVIEW":
        return new Promise<number>(async (resolve, reject) => {
          const toastId = toast.loading("Please wait...");

          try {
            const res = await fetch(
              `${basePath}/api/projects/${props.operation}?id=${CacheId()}`,
              {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(root.preview),
              }
            );
            const data = (await res.json()) as DefaultRes<ProjectData[]>;
            if (data.status !== "OK" || !data.result?.[0]) {
              return reject({ id: toastId, state, message: data.message });
            }

            dispatch({
              type: "PREVIEW_ID_CHANGED",
              value: data.result[0].id || id,
            });

            resolve(data.result[0].id || id);
            toast.update(toastId, {
              render: "Project: Record is created",
              type: "success",
              isLoading: false,
              ...ToastDefault,
            });
          } catch (err) {
            reject({ id: toastId, state, message: "Project: Server error" });
          }
        });

      case "LINK":
        return new Promise<number>(async (resolve, reject) => {
          const toastId = toast.loading("Please wait...");

          try {
            const res = await fetch(
              `${basePath}/api/link/${props.operation}?id=${id}`,
              {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(root.preview.links),
              }
            );
            const data = (await res.json()) as DefaultRes;
            if (data.status !== "OK") {
              return reject({ id: toastId, state, message: data.message });
            }

            resolve(id);
            return toast.update(toastId, {
              render: `Link: ${data.message}`,
              type: "success",
              isLoading: false,
              ...ToastDefault,
            });
          } catch (err) {
            reject({ id: toastId, state, message: "Link: Server error" });
          }
        });

      case "FILES":
        return (function parseTree(tree: TreeObj | FileData | null) {
          let toastId: ReactText | null = null;
          return new Promise<number>(async (resolve, reject) => {
            try {
              // Check if obj is FileData and if File not exist then break
              if (!tree?.name) {
                if (tree && tree.name) return resolve(id);
                for (let [_, value] of Object.entries(tree || {})) {
                  await parseTree(value);
                }

                return resolve(id);
              }

              toastId = toast.loading("Please wait...");
              const file = await formFile(tree as FileData, root.preview.name);

              const body = new FormData();
              body.append("file", file);

              const res = await fetch(
                `${basePath}/api/file/${tree.id ? props.operation : "create"}` +
                  createQuery({
                    project_id: id,
                    role: tree.role,
                    id: tree.id ?? null,
                    project: root.preview.name,
                    path:
                      "/" + ((tree.path as string) ?? "").replace(/^\//, ""),
                  }),
                { method: "POST", body }
              );

              const data = (await res.json()) as DefaultRes;
              if (data.status !== "OK") {
                return reject({ id: toastId, state, message: data.message });
              }

              toast.update(toastId, {
                render: `File [${tree.name}]: ${data.message}`,
                type: "success",
                isLoading: false,
                ...ToastDefault,
              });

              return resolve(id);
            } catch (err: any) {
              if (err.id) return reject(err);
              reject({ id: toastId, state, message: err });
            }
          });
        })(root.code.tree);

      case "DOCKER":
        return new Promise<number>(async (resolve, reject) => {
          // NOTE: If tag was not setted then just don't build a project
          // because it's doesn't contains anything except of thumbnail img
          const { repo, name } = root.preview;
          if (!repo.name || !repo.version) {
            return resolve(id);
          }

          const toastId = toast.loading("Building docker image...");
          dispatch({
            type: "CODE_TERMINAL_CHANGED",
            value: `> docker build . -t ${repo.name}:${repo.version}`,
          });

          try {
            const res = await fetch(
              `${basePath}/api/docker/build?tag=${repo.name}:${repo.version}&path=/${name}`,
              { method: "POST" }
            );

            if (!res.body) return;
            const reader = res.body.getReader();

            reader.read().then(function next({ done, value }) {
              if (done) {
                resolve(id);
                return toast.update(toastId, {
                  render: `Docker image '${repo.name}:${repo.version}' was builded successfully`,
                  type: "success",
                  isLoading: false,
                  ...ToastDefault,
                });
              }

              reader.read().then(next);
              dispatch({
                type: "CODE_TERMINAL_CHANGED",
                value: Buffer.from(value).toString(),
              });
            });
          } catch (err) {
            reject({
              id: toastId,
              state,
              message: "Docker: Server side error",
            });

            dispatch({
              type: "CODE_TERMINAL_CHANGED",
              value: String(err),
            });
          }
        });

      case "DOCKER_PUSH":
        return new Promise<number>(async (resolve, reject) => {
          // NOTE: If tag was not setted then just don't build a project
          // because it's doesn't contains anything except of thumbnail img
          const { name, version } = root.preview.repo;
          if (!name || !version) {
            return resolve(id);
          }

          const toastId = toast.loading("Pushing docker image...");
          dispatch({
            type: "CODE_TERMINAL_CHANGED",
            value: `> docker push ${name}:${version}`,
          });

          try {
            const res = await fetch(
              `${basePath}/api/docker/push?tag=${name}:${version}`,
              { method: "POST" }
            );

            const data = (await res.json()) as DefaultRes;
            if (data.status !== "OK") {
              return reject({ id: toastId, state, message: data.message });
            }

            resolve(id);
            dispatch({ type: "CODE_TERMINAL_CHANGED", value: "Success !!" });
            toast.update(toastId, {
              render: `Docker image '${name}:${version}' was pushed successfully`,
              type: "success",
              isLoading: false,
              ...ToastDefault,
            });
          } catch (err) {
            reject({
              id: toastId,
              state,
              message: "Docker: Server side error",
            });

            dispatch({
              type: "CODE_TERMINAL_CHANGED",
              value: String(err),
            });
          }
        });

      case "K3S_NAMESPACE":
      case "K3S_DEPLOYMENT":
      case "K3S_SERVICE":
      case "K3S_INGRESS":
        return new Promise<number>(async (resolve, reject) => {
          let index = root.main.stateIndex;
          const name = state.replace(/K3S_/, "").toLowerCase();
          const toastId = toast.loading("Please wait...");

          try {
            for (; index < root.config[name].length; index++) {
              const res = await fetch(
                `${basePath}/api/k3s/${props.operation}${createQuery({
                  type: name,
                  namespace: root.config[name][index].metadata.namespace,
                })}`,
                {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify(root.config[name][index]),
                }
              );

              const data = (await res.json()) as DefaultRes;
              if (data.status === "ERR") {
                return reject({
                  id: toastId,
                  state,
                  index,
                  message: `${CapitalizeString(name)}: Error ${data.message}`,
                });
              }
            }

            resolve(id);
            toast.update(toastId, {
              render: `${CapitalizeString(name)} was created successfully`,
              type: "success",
              isLoading: false,
              ...ToastDefault,
            });
          } catch (err) {
            reject({
              id: toastId,
              state,
              index,
              message: `${CapitalizeString(name)}: Server side error`,
            });
          }
        });

      case "K3S_PODS_METRICS":
        return new Promise<number>(async (resolve, reject) => {
          let index = root.main.stateIndex;
          const toastId = toast.loading("Please wait...");
          const { sec, min, hour, day, month, week } = root.preview.cron;

          try {
            for (; index < root.config.deployment.length; index++) {
              const matchLabels =
                root.config.deployment[index].spec?.selector?.matchLabels;
              if (!matchLabels) continue;

              // FIXME: Somehow save this key on error
              for (const name in matchLabels) {
                const res = await fetch(
                  `${basePath}/api/k3s/metrics/${props.operation}${createQuery({
                    project_id: id,
                    label: `${name}=${matchLabels[name]}`,
                    namespace: root.config.deployment[index].metadata.namespace,
                  })}`,
                  {
                    method: "POST",
                    body: `${sec} ${min} ${hour} ${day} ${month} ${week}`,
                  }
                );

                const data = (await res.json()) as DefaultRes;
                if (data.status === "ERR") {
                  return reject({
                    id: toastId,
                    state,
                    index,
                    message: `Metrics: Error ${data.message}`,
                  });
                }
              }
            }

            resolve(id);
            toast.update(toastId, {
              render: "Metrics was created successfully",
              type: "success",
              isLoading: false,
              ...ToastDefault,
            });
          } catch (err) {
            reject({
              id: toastId,
              state,
              index,
              message: "Metrics: Server side error",
            });
          }
        });

      default:
        return new Promise<number>((resolve) => resolve(id));
    }
  }

  return (
    <Form
      noValidate
      validated={validated}
      className={`container mt-3`}
      onSubmit={async (event) => {
        event?.preventDefault();
        if (!event.currentTarget.checkValidity()) {
          event.stopPropagation();
          return setValidated(true);
        }

        try {
          const index = root.main.operations.indexOf(root.main.state);
          if (index === -1) {
            return dispatch({
              type: "MAIN_SUBMIT_STATE_CHANGED",
              value: { state: "END" },
            });
          }

          let id = root.preview.id;
          for (let state of root.main.operations.slice(index)) {
            id = await SubmitStateMachine(state, id);
          }

          dispatch({ type: "PREVIEW_CACHE_FLUSH" });
          dispatch({ type: "CODE_CACHE_FLUSH" });
          dispatch({
            type: "MAIN_SUBMIT_STATE_CHANGED",
            value: { state: "END" },
          });
        } catch (err: any) {
          if (!err?.state) return;
          dispatch({
            type: "MAIN_SUBMIT_STATE_CHANGED",
            value: { state: err.state, stateIndex: err.index ?? 0 },
          });

          if (!err?.id) return;
          toast.update(err.id, {
            render: err.message ?? "Client error",
            type: "error",
            isLoading: false,
            ...ToastDefault,
          });
        }
      }}
    >
      <ToastContainer
        // position="top-right"
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        transition={Bounce}
        closeOnClick
        rtl={false}
        draggable
      />

      <Container className="mb-1">
        <Row className="w-100 d-flex justify-content-between">
          <span></span>
          <Row>
            <div>
              <InputRadio
                readFrom="main_window"
                className="btn-group btn-group-sm btn-group-toggle mb-2"
                options={["Preview", "Style", "Code", "Config"]}
                label="btn-outline-dark"
                disabled={root.main.disabled}
              />
            </div>

            <OverlayTrigger
              show={root.main.state == "END"}
              placement="bottom"
              overlay={
                <Popover id="popover-submit-button">
                  <Popover.Title as="h4">{`Project was ${props.operation}d successfully`}</Popover.Title>
                  <Popover.Content className="d-flex justify-content-center">
                    <Button
                      size="sm"
                      variant="primary"
                      href={`${basePath}/${root.preview.name}`}
                    >
                      Open the project
                    </Button>
                  </Popover.Content>
                </Popover>
              }
            >
              <Button
                size="sm"
                type="submit"
                variant="outline-success"
                className="mb-2 ml-4"
              >
                Submit
              </Button>
            </OverlayTrigger>
          </Row>
        </Row>
      </Container>

      <DefaultPreview
        show={root.main.window === "Preview"}
        update={props.operation === "update"}
      />
      <DefaultStyleView show={root.main.window === "Style"} />
      <DefaultCodeView show={root.main.window === "Code"} />
      <DefaultK3sConfig show={root.main.window === "Config"} />
    </Form>
  );
}
