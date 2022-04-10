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
  useState,
} from "react";
import { Button, Container, InputGroup, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Metadata } from "../../../types/K3s/Metadata";
// import { Service } from "../../../types/K3s/Service";
import InputList from "../../Inputs/InputDoubleList";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import ListEntity from "../../Inputs/ListEntity";
import styles from "./Default.module.css";
import Port from "./Port";

export interface ServiceProps {
  show?: boolean;
  root?: string | (() => void);
  readFrom: string;
  writeTo: string;
}

// export interface ServiceRef {
//   getValue: () => Service;
// }

export default function Service(props: ServiceProps) {
  const [minimized, onMinimize] = useState({
    metadata: true,
    spec: true,
    selector: true,
    port: true,
    ports: [] as boolean[],
  });

  const dispatch = useDispatch();
  const ports = useSelector((state: any) =>
    `${props.readFrom}_spec_ports`
      .split("_")
      .reduce((acc, curr) => acc[curr], state)
  ) as unknown[];

  const labels = useSelector((state: any) =>
    `${props.readFrom}_spec_selector`
      .split("_")
      .reduce((acc, curr) => acc[curr], state)
  ) as { [name: string]: string };

  // const [ports, onPortChange] = useState<boolean[]>([]);
  // const [portsRef, onPortRefChange] = useState<React.RefObject<PortRef>[]>([]);

  // useEffect(() => {
  //   onPortRefChange(ports.map((_, i) => portsRef[i] || createRef<PortRef>()));
  // }, [ports.length]);

  // let [labels, onLabelsChange] = useState({} as { [key: string]: string });

  // useImperativeHandle<unknown, ServiceRef>(ref, () => ({
  //   getValue() {
  //     return {
  //       ...service,
  //       spec: {
  //         ...service.spec,
  //         selector: { ...labels },
  //         ports: portsRef.map((item) => item.current?.getValue()),
  //       },
  //     } as Service;
  //   },
  // }));

  return (
    <div className={`card px-1 py-3 ${props.show ? "" : "d-none"}`}>
      <InputTemplate
        className="px-0"
        labelClassName="font-weight-bold mx-2"
        label={[
          "Metadata ",
          <FontAwesomeIcon
            key={"icon-metadata"}
            icon={minimized.metadata ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() =>
          onMinimize({ ...minimized, metadata: !minimized.metadata })
        }
      >
        <div
          className={`row border rounded mx-1 py-2 ${
            minimized.metadata ? "" : "d-none"
          }`}
        >
          <InputTemplate className="col-6 px-2" label="Name">
            <InputName
              char="@"
              root={`${props.root}`}
              readFrom={`${props.readFrom}_metadata_name`}
              writeTo={`${props.writeTo}_metadata_name`}
              placeholder="void-service"
              required
            />
          </InputTemplate>

          <InputTemplate className="col-6 px-2" label="Namespace">
            <InputGroup>
              <InputValue
                className="rounded"
                root={`${props.root}`}
                readFrom={`${props.readFrom}_metadata_namespace`}
                writeTo={`${props.writeTo}_metadata_namespace`}
                placeholder="demo"
              />
            </InputGroup>
          </InputTemplate>
        </div>
      </InputTemplate>

      <InputTemplate
        className="px-1"
        labelClassName="font-weight-bold mx-1"
        label={[
          "Spec ",
          <FontAwesomeIcon
            key={"icon-spec"}
            icon={minimized.spec ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() => onMinimize({ ...minimized, spec: !minimized.spec })}
      >
        <div className={`border rounded p-2 ${minimized.spec ? "" : "d-none"}`}>
          <InputTemplate className="px-1" label="Cluster IP">
            <InputName
              char="$"
              root={`${props.root}`}
              readFrom={`${props.readFrom}_spec_clusterIP`}
              writeTo={`${props.writeTo}_spec_clusterIP`}
              placeholder="10.0.171.239"
            />
          </InputTemplate>

          <InputTemplate className="px-1" label="Type">
            <InputRadio
              className="btn-group btn-group-sm btn-group-toggle"
              readFrom={`${props.readFrom}_spec_type`}
              writeTo={`${props.writeTo}_spec_type`}
              options={[
                "ClusterIP",
                "NodePort",
                "LoadBalancer",
                "ExternalName",
              ]}
              overflow={{
                on: { className: "d-block d-sm-none", len: 6 },
                off: { className: "d-none d-sm-block", len: 0 },
              }}
              label="btn-outline-info"
            />
          </InputTemplate>

          <InputTemplate
            className="mt-1 px-0"
            label={[
              "Selector ",
              <FontAwesomeIcon
                key={"icon-selector"}
                icon={minimized.selector ? faChevronDown : faChevronRight}
              />,
            ]}
            onClick={() =>
              onMinimize({
                ...minimized,
                selector: !minimized.selector,
              })
            }
          >
            <div
              className={`border rounded py-2 ${
                minimized.selector ? "" : "d-none"
              }`}
            >
              <Container className="px-2">
                <InputList
                  char={["var", "="]}
                  placeholder={["app", "void"]}
                  readFrom={`${props.readFrom}_spec_selector`}
                  writeTo={`${props.writeTo}_spec_selector`}
                />
                <ListGroup>
                  {Object.entries(labels).map(([name, value], i) => (
                    <Row key={`matchLabels-${i}`} className="px-2">
                      <ListEntity
                        char={["var", "="]}
                        value={[name, value]}
                        onChange={() => {}}
                      />
                    </Row>
                  ))}
                </ListGroup>
              </Container>
            </div>
          </InputTemplate>
        </div>
      </InputTemplate>

      <InputTemplate
        className="px-1"
        labelClassName="font-weight-bold mx-1"
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
          {ports.map((_, index) => (
            <div
              key={`port-${index}`}
              className={`mb-3 w-100 ${styles["el-index"]}`}
            >
              <Row className="mx-1">
                <label
                  className="mx-1 mr-auto"
                  onClick={() => {
                    onMinimize({
                      ...minimized,
                      ports: minimized.ports.map((item, i) =>
                        i === index ? !item : item
                      ),
                    });
                  }}
                >
                  {`[${index}] `}
                  <FontAwesomeIcon
                    icon={
                      minimized.ports[index] ? faChevronDown : faChevronRight
                    }
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
                      ports: minimized.ports.filter((_, i) => i !== index),
                    });

                    dispatch({
                      type: `${props.writeTo}_spec_ports_del`.toUpperCase(),
                      readFrom: `${props.readFrom}_spec_ports_${index}`,
                      index: index,
                    });
                  }}
                />
              </Row>
              <Port
                root={props.root}
                show={minimized.ports[index]}
                readFrom={`${props.readFrom}_spec_ports_${index}`}
                writeTo={`${props.writeTo}_spec_ports`}
              />
            </div>
          ))}

          <Container className="my-2">
            <Button
              className="w-100"
              name={`${props.readFrom}_port_add`}
              variant="outline-success"
              onClick={() => {
                onMinimize({ ...minimized, ports: [...minimized.ports, true] });
                dispatch({
                  type: `${props.writeTo}_spec_ports_add`.toUpperCase(),
                  readFrom: `${props.readFrom}_spec_ports`,
                });
              }}
            >
              <FontAwesomeIcon
                className={`text-success ${styles["icon"]}`}
                icon={faPlus}
              />
            </Button>
          </Container>
        </div>
      </InputTemplate>
    </div>
  );
}
