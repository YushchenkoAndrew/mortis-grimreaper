import {
  faChevronDown,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Collapse, InputGroup, ListGroup, Row } from "react-bootstrap";
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
  hidden?: boolean;
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
  ) as { name: string; value: string }[];

  useEffect(() => {
    onMinimize({
      ...minimized,
      ports: ports.map((_, i) => minimized.port[i] || true),
    });
  }, [ports.length]);

  return (
    <div hidden={props.hidden} className="border rounded mx-1 px-1 py-2">
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
            icon={faChevronDown}
            style={{
              transitionDuration: "0.25s",
              transitionProperty: "transform",
              transform: `rotate(${minimized.port ? "0deg" : "-90deg"}`,
            }}
          />,
        ]}
        onClick={() => onMinimize({ ...minimized, port: !minimized.port })}
      >
        <Collapse in={minimized.port}>
          <div>
            <div className="border rounded px-1 py-2">
              {minimized.ports.map((show, index) => (
                <div
                  key={`containerPort-${index}`}
                  className={`mb-3 w-100 ${styles["el-index"]}`}
                >
                  <div className="row mx-1">
                    <label
                      className="ml-1 mr-auto"
                      style={{ cursor: "pointer" }}
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
                        icon={faChevronDown}
                        style={{
                          transitionDuration: "0.25s",
                          transitionProperty: "transform",
                          transform: `rotate(${show ? "0deg" : "-90deg"}`,
                        }}
                      />
                    </label>
                    <FontAwesomeIcon
                      className={`mr-1 ${styles["el-container"]} text-danger`}
                      icon={faTrashAlt}
                      size="lg"
                      fontSize="1rem"
                      onClick={() => {
                        dispatch({
                          type: `${props.writeTo}_ports_del`.toUpperCase(),
                          readFrom: `${props.readFrom}_ports_${index}`,
                        });
                      }}
                    />
                  </div>
                  <Collapse in={show}>
                    <div>
                      <ContainerPort
                        root={props.root}
                        readFrom={`${props.readFrom}_ports_${index}`}
                        writeTo={`${props.writeTo}_ports`}
                      />
                    </div>
                  </Collapse>
                </div>
              ))}

              <div className="container my-2">
                <Button
                  className="w-100"
                  name={`${props.readFrom}_port_add`}
                  variant="outline-success"
                  onClick={() => {
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
                </Button>
              </div>
            </div>
          </div>
        </Collapse>
      </InputTemplate>

      <InputTemplate
        labelClassName="px-1"
        className="px-1"
        label={[
          "Resources ",
          <FontAwesomeIcon
            key={"icon-resources"}
            icon={faChevronDown}
            style={{
              transitionDuration: "0.25s",
              transitionProperty: "transform",
              transform: `rotate(${minimized.resources ? "0deg" : "-90deg"}`,
            }}
          />,
        ]}
        onClick={() =>
          onMinimize({
            ...minimized,
            resources: !minimized.resources,
          })
        }
      >
        <Collapse in={minimized.resources}>
          <div>
            <Row className="border rounded mx-0 py-2">
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
          </div>
        </Collapse>
      </InputTemplate>

      <InputTemplate
        labelClassName="px-1"
        className="px-1"
        label={[
          "env ",
          <FontAwesomeIcon
            key={"icon-env"}
            icon={faChevronDown}
            style={{
              transitionDuration: "0.25s",
              transitionProperty: "transform",
              transform: `rotate(${minimized.env ? "0deg" : "-90deg"}`,
            }}
          />,
        ]}
        onClick={() =>
          onMinimize({
            ...minimized,
            env: !minimized.env,
          })
        }
      >
        <Collapse in={minimized.env}>
          <div>
            <div className="border rounded py-2">
              <div className="mb-2 mx-2">
                <InputList
                  char={["var", "="]}
                  readFrom={`${props.readFrom}_env`}
                  writeTo={`${props.writeTo}_env`}
                  placeholder={["USER", "admin"]}
                />
                <ListGroup>
                  {env.map(({ name, value }, i) => (
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
          </div>
        </Collapse>
      </InputTemplate>
    </div>
  );
}
