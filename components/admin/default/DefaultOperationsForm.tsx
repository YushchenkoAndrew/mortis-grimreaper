import { useState } from "react";
import { TreeObj } from "../../../types/tree";
import { basePath } from "../../../config";
import { FileData, ProjectData } from "../../../types/api";
import { formFile, getPath } from "../../../lib/public/files";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputRadio from "../../Inputs/InputRadio";
import DefaultPreview from "./DefaultPreview";
import DefaultCodeView from "./DefaultCodeView";
import DefaultK3sConfig from "./DefaultK3sConfig";
import { ToastDefault } from "../../../config/alert";
import { useDispatch, useSelector } from "react-redux";
import { CacheId } from "../../../lib/public";
import { DefaultRes } from "../../../types/request";

export interface DefaultOperationsFormProps {
  operation: string;
  preview?: { [name: string]: any };
  code?: { tree: TreeObj };
}

export default function DefaultOperationsForm(
  props: DefaultOperationsFormProps
) {
  const dispatch = useDispatch();
  const root = useSelector((state: any) => state);
  const [validated, setValidated] = useState(false);

  function SubmitStateMachine(state: string, id: number) {
    switch (state) {
      case "PREVIEW":
        return new Promise<number>((resolve, reject) => {
          const toastId = toast.loading("Please wait...");
          fetch(`${basePath}/api/projects/${props.operation}?id=${CacheId()}`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(root.preview),
          })
            .then((res) => res.json())
            .then((data: DefaultRes<ProjectData[]>) => {
              if (data.status !== "OK" || !data.result?.[0]) {
                return reject({
                  id: toastId,
                  state: "PREVIEW",
                  message: data.message,
                });
              }

              dispatch({
                type: "PREVIEW_ID_CHANGED",
                value: data.result[0].id,
              });
              resolve(data.result[0].id as number);
              toast.update(toastId, {
                render: "Project: Record is created",
                type: "success",
                isLoading: false,
                ...ToastDefault,
              });
            })
            .catch(() =>
              reject({
                id: toastId,
                state: "PREVIEW",
                message: "Project: Server error",
              })
            );
        });

      case "LINK":
        return new Promise<number>((resolve, reject) => {
          const toastId = toast.loading("Please wait...");
          fetch(`${basePath}/api/link/${props.operation}?id=${id}`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(root.preview.links),
          })
            .then((res) => res.json())
            .then((data: DefaultRes) => {
              if (data.status !== "OK") {
                return reject({
                  id: toastId,
                  state: "LINK",
                  message: data.message,
                });
              }

              resolve(id);
              return toast.update(toastId, {
                render: `Link: ${data.message}`,
                type: "success",
                isLoading: false,
                ...ToastDefault,
              });
            })
            .catch(() =>
              reject({
                id: toastId,
                state: "LINK",
                message: "Link: Server error",
              })
            );
        });

      case "FILES":
        return (function parseTree(tree: TreeObj | FileData | null) {
          return new Promise<number>(async (resolve, reject) => {
            // Check if obj is FileData and if File not exist then break
            if (!tree?.name) {
              if (tree && tree.name) return resolve(id);
              console.log(Object.entries(tree || {}));

              for (let [_, value] of Object.entries(tree || {})) {
                await parseTree(value);
              }
              return resolve(id);
            }

            const toastId = toast.loading("Please wait...");
            const body = new FormData();
            body.append("file", formFile(tree as FileData));

            return fetch(
              `${basePath}/api/file/${props.operation}?id=${id}&project=${
                root.preview.name
              }&role=${tree.role}${getPath(tree.path as string | undefined)}${
                tree.id ? `&file_id=${tree.id}` : ""
              }`,
              { method: "POST", body }
            )
              .then((res) => res.json())
              .then((data: DefaultRes) => {
                if (data.status !== "OK") {
                  return reject({
                    id: toastId,
                    state: "FILES",
                    message: data.message,
                  });
                }

                resolve(id);
                toast.update(toastId, {
                  render: `File [${tree.name}]: ${data.message}`,
                  type: "success",
                  isLoading: false,
                  ...ToastDefault,
                });
              })
              .catch(() => {
                reject({
                  id: toastId,
                  state: "FILES",
                  message: `File [${tree.name}]: crashed at upload`,
                });
              });
          });
        })(root.code.tree);

      case "K3S":
        return new Promise<number>((resolve) => resolve(id));

      default:
        return new Promise<number>((resolve) => resolve(id));
    }
  }

  return (
    <form
      className={`container needs-validation ${
        validated ? "was-validated" : ""
      }  mt-3`}
      noValidate
      onSubmit={async (event) => {
        event?.preventDefault();
        if (!event?.currentTarget?.checkValidity()) {
          return setValidated(true);
        }

        try {
          const index = root.main.operations.indexOf(root.main.state);
          if (index === -1) {
            return dispatch({
              type: "MAIN_SUBMIT_STATE_CHANGED",
              value: "END",
            });
          }

          let id = root.preview.id;
          for (let state of root.main.operations.slice(index)) {
            id = await SubmitStateMachine(state, id);
          }

          dispatch({ type: "MAIN_SUBMIT_STATE_CHANGED", value: "END" });

          // FIXME: Was commented only for debug propose
          // setTimeout(
          //   () => (window.location.href = `${basePath}/admin/projects/`),
          //   2000
          // );
        } catch (err: any) {
          if (!err) return;

          dispatch({ type: "MAIN_SUBMIT_STATE_CHANGED", value: err.state });
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
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        transition={Bounce}
        closeOnClick
        rtl={false}
        draggable
      />

      <div className="container mb-1">
        <div className="row w-100 d-flex justify-content-between">
          <span></span>
          <div className="row">
            <div>
              <InputRadio
                readFrom="main_window"
                className="btn-group btn-group-sm btn-group-toggle mb-2"
                options={["Preview", "Code", "Config"]}
                label="btn-outline-dark"
                disabled={root.main.disabled}
              />
            </div>

            <button
              type="submit"
              className="btn btn-sm btn-outline-success mb-2 ml-4"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <DefaultPreview
        show={root.main.window === "Preview"}
        preview={props.preview}
      />
      <DefaultCodeView show={root.main.window === "Code"} code={props.code} />
      <DefaultK3sConfig show={root.main.window === "Config"} />
    </form>
  );
}
