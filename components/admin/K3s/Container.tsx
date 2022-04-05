import {
  faChevronDown,
  faChevronRight,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { InputGroup, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
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
  root?: string | (() => void);
  readFrom: string;
  writeTo: string;
}

export default function Container(props: ContainerProps) {
  const [minimized, onMinimize] = useState({
    resources: false,
    env: false,
    port: true,
    ports: [] as boolean[],
  });

  const dispatch = useDispatch();
  const ports = useSelector((state: any) =>
    `${props.readFrom}_ports`.split("_").reduce((acc, curr) => acc[curr], state)
  ) as unknown[];

  const env = useSelector((state: any) =>
    `${props.readFrom}_env`.split("_").reduce((acc, curr) => acc[curr], state)
  ) as { [name: string]: string };

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
      <InputTemplate className="mx-1 pl-1 pr-2" label="Name">
        <InputGroup>
          <InputName
            char="#"
            root={props.root}
            readFrom={`${props.readFrom}_name`}
            writeTo={`${props.writeTo}_name`}
            placeholder="void"
            required
          />
        </InputGroup>
      </InputTemplate>
      <InputTemplate className="mx-1 pl-1 pr-2" label="Image">
        <InputGroup>
          <InputName
            char="#"
            root={props.root}
            readFrom={`${props.readFrom}_image`}
            writeTo={`${props.writeTo}_image`}
            placeholder="grimreapermortis/void:0.0.2"
            required
          />
        </InputGroup>
      </InputTemplate>

      <InputTemplate className="mx-2 px-1" label="ImagePullPolicy">
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
                      readFrom: `${props.readFrom}_ports_${index}`,
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
        labelClassName="px-1"
        className="px-1"
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
        <Row
          className={`row border rounded mx-0 py-2 ${
            minimized.resources ? "" : "d-none"
          }`}
        >
          <InputTemplate className="col-6 px-2" label="CPU">
            <InputGroup>
              <InputValue
                root={props.root}
                readFrom={`${props.readFrom}_resources_requests_cpu`}
                writeTo={`${props.writeTo}_resources_requests_cpu`}
                className="rounded"
                placeholder="100m"
              />
            </InputGroup>
          </InputTemplate>
          <InputTemplate className="col-6 px-2" label="RAM">
            <InputGroup>
              <InputValue
                root={props.root}
                readFrom={`${props.readFrom}_resources_requests_memory`}
                writeTo={`${props.writeTo}_resources_requests_memory`}
                className="rounded"
                placeholder="100Mi"
              />
            </InputGroup>
          </InputTemplate>
        </Row>
      </InputTemplate>

      <InputTemplate
        labelClassName="px-1"
        className="px-1"
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
        <div className={`border rounded py-2 ${minimized.env ? "" : "d-none"}`}>
          <div className="mb-2 mx-2">
            <InputList
              char={["var", "="]}
              readFrom={`${props.readFrom}_env`}
              writeTo={`${props.writeTo}_env`}
              placeholder={["USER", "admin"]}
            />
            <ListGroup>
              {Object.entries(env).map(([name, value], i) => (
                <Row key={i} className="px-2">
                  <ListEntity
                    char={["var", "="]}
                    value={[name, value]}
                    onChange={() => {}}
                  />
                </Row>
              ))}
            </ListGroup>
          </div>
        </div>
      </InputTemplate>
    </div>
  );
}
