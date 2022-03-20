import React, { FormEventHandler, useRef, useState } from "react";
import DefaultHeader from "./DefaultHeader";
import DefaultHead from "../../default/DefaultHead";
import { checkIfUserExist } from "../../../lib/api/session";
import { TreeObj } from "../../../types/tree";
import { basePath, voidUrl } from "../../../config";
import { FileData, LinkData, ProjectData } from "../../../types/api";
import { withIronSession } from "next-iron-session";
import { NextSessionArgs } from "../../../types/session";
import sessionConfig from "../../../config/session";
import { formFile, formPath, getPath } from "../../../lib/public/files";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputRadio from "../../Inputs/InputRadio";
import CodeView from "./DefaultCodeView";
import { ToastDefault } from "../../../config/alert";
import K3sConfig from "./DefaultK3sConfig";
import { Provider, useDispatch, useSelector } from "react-redux";
import reducers from "../../../redux/admin/projects/reducer";
import { devToolsEnhancer } from "redux-devtools-extension";
import { createStore } from "redux";
import { CacheId } from "../../../lib/public";
import { DefaultRes } from "../../../types/request";
import DefaultPreview from "./DefaultPreview";

export const store = createStore(
  reducers,
  devToolsEnhancer({ serialize: { map: true } })
);

export interface DefaultOperationsFormProps {
  type: string;
  formData: ProjectData;
  treeStructure: TreeObj;
  template: FileData;
  links: { [name: string]: LinkData };
}

export default function DefaultOperationsForm(
  props: DefaultOperationsFormProps
) {
  const root = useSelector((state: any) => state);
  const [validated, setValidated] = useState(false);
  // const dispatch = useDispatch();

  // const [config, onSetConfig] = useState("Preview");

  // const formRef = useRef<HTMLFormElement>(null);
  // const previewRef = useRef<PreviewRef>(null);
  // const codeViewRef = useRef<CodeViewRef>(null);
  // const k3sConfigRef = useRef<K3sConfigRef>(null);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event?.preventDefault();

    if (!event?.currentTarget?.checkValidity()) {
      setValidated(true);
      return;
    }

    try {
      // Send PREVIEW data
      const data = await new Promise<ProjectData>((resolve, reject) => {
        const toastId = toast.loading("Please wait...");
        fetch(`${basePath}/api/projects/${props.type}?id=${CacheId()}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(root.preview),
        })
          .then((res) => res.json())
          .then((data: DefaultRes<ProjectData[]>) => {
            if (data.status !== "OK" || !data.result?.[0]) {
              return reject({ id: toastId, message: data.message });
            }

            resolve(data.result[0]);
            toast.update(toastId, {
              render: "Project: Record is created",
              type: "success",
              isLoading: false,
              ...ToastDefault,
            });
          })
          .catch(() =>
            reject({ id: toastId, message: "Project: Server error" })
          );
      });

      // FIXME: Run some operations depend on window stat !!!!

      // Send LINK data
      await new Promise<void>((resolve, reject) => {
        const toastId = toast.loading("Please wait...");
        fetch(`${basePath}/api/link/add?id=${data.id}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(root.preview.links),
        })
          .then((res) => res.json())
          .then((data: DefaultRes) => {
            resolve();
            return toast.update(toastId, {
              render: `Link: ${data.message}`,
              type: data.status === "OK" ? "success" : "error",
              isLoading: false,
              ...ToastDefault,
            });
          })
          .catch(() => reject({ id: toastId, message: "Link: Server error" }));
      });

      // Upload files
      await (function parseTree(tree: TreeObj | FileData | null) {
        return new Promise<void>(async (resolve, reject) => {
          // Check if obj is FileData and if File not exist then break
          if (!tree?.name || !tree.file) {
            if (tree && tree.name) return resolve();
            for (let [_, value] of Object.entries(tree || {})) {
              await parseTree(value);
            }
            return resolve();
          }

          const toastId = toast.loading("Please wait...");
          const body = new FormData();
          body.append("file", formFile(tree as FileData));

          return fetch(
            `${basePath}/api/file/add?id=${data.id}&project=${
              root.preview.name
            }&role=${tree.role}${getPath(tree.path as string | undefined)}${
              tree.id ? `&file_id=${tree.id}` : ""
            }`,
            { method: "POST", body }
          )
            .then((res) => res.json())
            .then((data: DefaultRes) => {
              resolve();
              toast.update(toastId, {
                render: `File [${tree.name}]: ${data.message}`,
                type: data.status === "OK" ? "success" : "error",
                isLoading: false,
                ...ToastDefault,
              });
            })
            .catch(() => {
              reject({
                id: toastId,
                message: `File [${tree.name}]: crashed at upload`,
              });
            });
        });
      })(root.code.tree);

      //   const data = await previewRef?.current?.onSubmit?.();
      //   await codeViewRef?.current?.onSubmit?.(data);
      //   await previewRef?.current?.onLinkSubmit?.(data);
      //   await k3sConfigRef?.current?.onSubmit?.(data);

      // FIXME: Was commented only for debug propose
      // setTimeout(
      //   () => (window.location.href = `${basePath}/admin/projects/`),
      //   2000
      // );
    } catch (err: any) {
      if (!err) return;
      toast.update(err.id, {
        render: err.message ?? "Client error",
        type: "error",
        isLoading: false,
        ...ToastDefault,
      });
    }
  };

  return (
    <form
      className={`container needs-validation ${
        validated ? "was-validated" : ""
      }  mt-3`}
      noValidate
      onSubmit={onSubmit as FormEventHandler<HTMLFormElement>}
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

      <DefaultPreview show={root.main.window === "Preview"} />
      <CodeView show={root.main.window === "Code"} />
      <K3sConfig show={root.main.window === "Config"} />
    </form>
  );
}
