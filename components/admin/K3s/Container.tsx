import {
  faChevronDown,
  faChevronRight,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  createRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Event } from "../../../pages/admin/projects/operation";
// import { Container } from "../../../types/K3s/Deployment";
import InputList from "../../Inputs/InputDoubleList";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import ListEntity from "../../Inputs/ListEntity";
import ContainerPort from "./ContainerPort";
import styles from "./Default.module.css";

export interface ContainerProps {
  show?: boolean;
  root?: string;
  readFrom: string;
  writeTo: string;
}

// export interface ContainerRef {
//   getValue: () => Container;
// }

export default function Container(props: ContainerProps) {
  const [minimized, onMinimize] = useState({
    resources: false,
    env: false,
    port: true,
    ports: [] as boolean[],
  });

  // const [container, onContainerChange] = useState<Container>({
  //   name: "",
  //   image: "",
  //   imagePullPolicy: "Always",
  //   ports: [],
  //   resources: {},
  // });

  const dispatch = useDispatch();
  const ports = useSelector((state: any) =>
    `${props.readFrom}_ports`.split("_").reduce((acc, curr) => acc[curr], state)
  ) as unknown[];

  // function onChange({ target: { name, value } }: Event) {
  //   onContainerChange({ ...container, [name]: value });
  // }

  // const [env, onEnvAdd] = useState({} as { [name: string]: string });

  // const [ports, onPortChange] = useState<boolean[]>([]);
  // const [portsRef, onPortRefChange] = useState<
  //   React.RefObject<ContainerPortRef>[]
  // >([]);

  // useEffect(() => {
  //   onPortRefChange(
  //     ports.map((_, i) => portsRef[i] || createRef<ContainerRef>())
  //   );
  // }, [ports.length]);

  // useImperativeHandle<unknown, ContainerRef>(ref, () => ({
  //   getValue() {
  //     const envVars = Object.entries(env).map(([name, value]) => ({
  //       name,
  //       value,
  //     }));

  //     return {
  //       ...container,
  //       : portsRef.map((item) => item.current?.getValue()),
  //       ...(envVars.length ? { env: envVars } : {}),
  //     } as Container;
  //   },
  // }));

  return (
    <div
      className={`border rounded mx-1 px-1 py-2 ${props.show ? "" : "d-none"}`}
    >
      <InputTemplate className="mx-1" label="Name">
        <div className="input-group">
          <InputName
            char="#"
            root={props.root}
            readFrom={`${props.readFrom}_name`}
            writeTo={`${props.writeTo}_name`}
            placeholder="void"
            required
          />
        </div>
      </InputTemplate>
      <InputTemplate className="mx-1" label="Image">
        <div className="input-group">
          <InputName
            char="#"
            root={props.root}
            readFrom={`${props.readFrom}_image`}
            writeTo={`${props.writeTo}_image`}
            placeholder="grimreapermortis/void:0.0.2"
            required
          />
        </div>
      </InputTemplate>

      <InputTemplate className="mx-2" label="ImagePullPolicy">
        <InputRadio
          label="btn-outline-info"
          className="btn-group btn-group-sm btn-group-toggle"
          readFrom={`${props.readFrom}_imagePullPolicy`}
          writeTo={`${props.writeTo}_imagePullPolicy`}
          options={["IfNotPresent", "Always", "Never"]}
          overflow={{
            on: { className: "d-block d-sm-none", len: 6 },
            off: { className: "d-none d-sm-block", len: 0 },
          }}
        />
      </InputTemplate>

      <InputTemplate
        className="px-1"
        label={[
          "Ports ",
          <FontAwesomeIcon
            key={"icon-ports"}
            icon={minimized.port ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() => onMinimize({ ...minimized, port: !minimized.port })}
      >
        <div
          className={`border rounded px-1 py-2 ${
            minimized.port ? "" : "d-none"
          }`}
        >
          {ports.map((show, index) => (
            <div
              key={`containerPort-${index}`}
              className={`mb-3 w-100 ${styles["el-index"]}`}
            >
              <div className="row mx-1">
                <label
                  className="ml-1 mr-auto"
                  onClick={() => {
                    onMinimize({
                      ...minimized,
                      ports: minimized.ports.map((item, i) =>
                        i == index ? !item : item
                      ),
                    });
                  }}
                >
                  {`[${index}] `}
                  <FontAwesomeIcon
                    icon={show ? faChevronDown : faChevronRight}
                  />
                </label>
                <FontAwesomeIcon
                  className={`mr-1 ${styles["el-container"]} text-danger`}
                  icon={faTrashAlt}
                  size="lg"
                  fontSize="1rem"
                  onClick={() => {
                    onMinimize({
                      ...minimized,
                      ports: minimized.ports.filter((_, i) => i == index),
                    });

                    dispatch({
                      type: `${props.writeTo}_ports_del`.toUpperCase(),
                      readFrom: `${props.readFrom}_ports`,
                      index: index,
                    });
                  }}
                />
              </div>
              <ContainerPort
                root={props.root}
                show={minimized.ports[index]}
                readFrom={`${props.readFrom}_ports_${index}`}
                writeTo={`${props.writeTo}_ports`}
              />
            </div>
          ))}

          <div className="container my-2">
            <a
              className="btn btn-outline-success w-100"
              onClick={() => {
                onMinimize({ ...minimized, ports: [...minimized.ports, true] });
                dispatch({
                  type: `${props.writeTo}_ports_add`.toUpperCase(),
                  readFrom: `${props.readFrom}_ports`,
                });
              }}
            >
              <FontAwesomeIcon
                className={`text-success ${styles["icon"]}`}
                icon={faPlus}
              />
            </a>
          </div>
        </div>
      </InputTemplate>

      <InputTemplate
        labelClassName="mx-1 mt-1"
        label={[
          "Resources ",
          <FontAwesomeIcon
            key={"icon-resources"}
            icon={minimized.resources ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() =>
          onMinimize({
            ...minimized,
            resources: !minimized.resources,
          })
        }
      >
        <div
          className={`row border rounded mx-1 py-2 ${
            minimized.resources ? "" : "d-none"
          }`}
        >
          <InputTemplate className="col-6" label="CPU">
            <div className="input-group">
              <InputValue
                root={props.root}
                readFrom={`${props.readFrom}_resources_requests_cpu`}
                writeTo={`${props.writeTo}_resources_requests_cpu`}
                className="rounded"
                placeholder="100m"
              />
            </div>
          </InputTemplate>
          <InputTemplate className="col-6" label="RAM">
            <div className="input-group">
              <InputValue
                root={props.root}
                readFrom={`${props.readFrom}_resources_requests_memory`}
                writeTo={`${props.writeTo}_resources_requests_memory`}
                className="rounded"
                placeholder="100Mi"
              />
            </div>
          </InputTemplate>
        </div>
      </InputTemplate>

      <InputTemplate
        className="mt-1"
        labelClassName="mx-1"
        label={[
          "env ",
          <FontAwesomeIcon
            key={"icon-env"}
            icon={minimized.env ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() =>
          onMinimize({
            ...minimized,
            env: !minimized.env,
          })
        }
      >
        <div
          className={`border rounded mx-1 py-2 ${
            minimized.env ? "" : "d-none"
          }`}
        >
          <div className="mb-2 mx-3">
            {/* <InputList
              char={["var", "="]}
              name={["name", "value"]}
              placeholder={["USER", "admin"]}
              onChange={(data) => {
                if (!data["name"] || data["value"] === undefined) return false;
                onEnvAdd({ ...env, [data["name"]]: data["value"] });
                return true;
              }}
            />
            <ul className="list-group">
              {Object.entries(env).map(([name, value], i) => (
                <div key={i} className="row">
                  <ListEntity
                    char={["var", "="]}
                    value={[name, value]}
                    onChange={() => {
                      let temp = { ...env };
                      delete temp[name];
                      onEnvAdd(temp);
                    }}
                  />
                </div>
              ))}
            </ul> */}
          </div>
        </div>
      </InputTemplate>
    </div>
  );
}
