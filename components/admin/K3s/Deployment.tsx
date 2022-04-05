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
// import { Deployment, Spec, Status } from "../../../types/K3s/Deployment";
import { Metadata } from "../../../types/K3s/Metadata";
import InputList from "../../Inputs/InputDoubleList";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import ListEntity from "../../Inputs/ListEntity";
import Container from "./Container";
import styles from "./Default.module.css";

export interface DeploymentProps {
  show?: boolean;
  // index: number;
  root?: string | (() => void);
  readFrom: string;
  writeTo: string;
}
// export interface DeploymentRef {
//   getValue: () => Deployment;
// }

export default function Deployment(props: DeploymentProps) {
  const [minimized, onMinimize] = useState({
    metadata: true,
    spec: true,
    matchLabels: true,
    container: true,
    containers: [] as boolean[],
  });

  const labels = useSelector((state: any) =>
    `${props.readFrom}_spec_selector_matchLabels`
      .split("_")
      .reduce((acc, curr) => acc[curr], state)
  ) as { [name: string]: string };

  const dispatch = useDispatch();
  const containers = useSelector((state: any) =>
    `${props.readFrom}_spec_template_spec_containers`
      .split("_")
      .reduce((acc, curr) => acc[curr], state)
  ) as unknown[];

  // const [deployment, onDeploymentChange] = useState<Deployment>({
  //   apiVersion: "app/v1",
  //   kind: "Deployment",
  //   metadata: {},
  //   spec: {
  //     selector: { matchLabels: {} },
  //     template: {
  //       metadata: {},
  //       spec: {
  //         containers: [],
  //       },
  //     },
  //   },
  // });

  // const containers = useSelector((state: any) =>
  //   props.readFrom.split("_").reduce((acc, curr) => acc[curr], state)
  // );

  // const [containers, onContainerChange] = useState<boolean[]>([]);
  // const [containersRef, onContainerRefChange] = useState<
  //   React.RefObject<ContainerRef>[]
  // >([]);

  // useEffect(() => {
  //   onContainerChange(
  //     containers.map((_, i) => containersRef[i] || createRef<ContainerRef>())
  //   );
  // }, [deployment.spec.template.spec.containers.length]);

  // let [labels, onLabelsChange] = useState({} as { [key: string]: string });

  // useImperativeHandle<unknown, DeploymentRef>(ref, () => ({
  //   getValue() {
  //     return {
  //       ...deployment,
  //       spec: {
  //         ...deployment.spec,
  //         replicas: Number(deployment.spec?.replicas ?? 1),
  //         selector: { matchLabels: { ...labels } },
  //         template: {
  //           ...deployment.spec?.template,
  //           metadata: {
  //             ...deployment.spec?.template?.metadata,
  //             labels: { ...labels },
  //           },
  //           spec: {
  //             ...deployment.spec?.template?.spec,
  //             containers: containersRef.map((item) => item.current?.getValue()),
  //           },
  //         },
  //       },
  //     } as Deployment;
  //   },
  // }));

  return (
    <div className={`card px-1 py-3 ${props.show ? "" : "d-none"}`}>
      <InputTemplate
        className="px-0"
        labelClassName="font-weight-bold ml-2"
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
        <Row
          className={`border rounded mx-1 px-1 py-2 ${
            minimized.metadata ? "" : "d-none"
          }`}
        >
          <InputTemplate className="col-6 px-2" label="Name">
            <InputName
              char="@"
              required
              root={props.root}
              readFrom={`${props.readFrom}_metadata_name`}
              writeTo={`${props.writeTo}_metadata_name`}
              placeholder="void-deployment"
            />
          </InputTemplate>

          <InputTemplate className="col-6" label="Namespace">
            <InputGroup>
              <InputValue
                className="rounded"
                root={props.root}
                readFrom={`${props.readFrom}_metadata_namespace`}
                writeTo={`${props.writeTo}_metadata_namespace`}
                placeholder="demo"
              />
            </InputGroup>
          </InputTemplate>
        </Row>
      </InputTemplate>

      <InputTemplate
        className="mt-1 px-0"
        labelClassName="font-weight-bold ml-2"
        label={[
          "Spec ",
          <FontAwesomeIcon
            key={"icon-spec"}
            icon={minimized.spec ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() => onMinimize({ ...minimized, spec: !minimized.spec })}
      >
        <div
          className={`border rounded mx-1 px-2 py-2 ${
            minimized.spec ? "" : "d-none"
          }`}
        >
          <Row className="px-1">
            <InputTemplate className="col-6" label="Replicas">
              <InputGroup>
                <InputName
                  char="$"
                  required
                  root={props.root}
                  readFrom={`${props.readFrom}_spec_replicas`}
                  writeTo={`${props.writeTo}_spec_replicas`}
                  placeholder="1"
                />
              </InputGroup>
            </InputTemplate>

            <InputTemplate className="col-6 px-0" label="Strategy">
              <InputRadio
                readFrom={`${props.readFrom}_spec_strategy_type`}
                writeTo={`${props.writeTo}_spec_strategy_type`}
                className="btn-group btn-group-sm btn-group-toggle"
                options={["RollingUpdate", "Recreate"]}
                label="btn-outline-info"
                overflow={{
                  on: { className: "d-block d-sm-none", len: 6 },
                  off: { className: "d-none d-sm-block", len: 0 },
                }}
              />
            </InputTemplate>
          </Row>

          <InputTemplate
            className="mt-1 px-0"
            label={[
              "MatchLabels ",
              <FontAwesomeIcon
                key={"icon-match-labels"}
                icon={minimized.matchLabels ? faChevronDown : faChevronRight}
              />,
            ]}
            onClick={() =>
              onMinimize({
                ...minimized,
                matchLabels: !minimized.matchLabels,
              })
            }
          >
            <div
              className={`border rounded px-0 py-2 ${
                minimized.matchLabels ? "" : "d-none"
              }`}
            >
              <div className="container px-2">
                <InputList
                  char={["var", "="]}
                  readFrom={`${props.readFrom}_spec_selector_matchLabels`}
                  writeTo={`${props.writeTo}_spec_selector_matchLabels`}
                  placeholder={["app", "void"]}
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
              </div>
            </div>
          </InputTemplate>
        </div>
      </InputTemplate>

      <InputTemplate
        className="mt-1 px-0"
        labelClassName="font-weight-bold ml-2"
        label={[
          "Containers ",
          <FontAwesomeIcon
            key={"icon-containers"}
            icon={minimized.container ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() =>
          onMinimize({ ...minimized, container: !minimized.container })
        }
      >
        <div
          className={`border rounded px-1 py-2 mx-1 ${
            minimized.container ? "" : "d-none"
          }`}
        >
          {containers.map((_, index) => (
            <div
              key={`container-${index}`}
              className={`mb-3 w-100 ${styles["el-index"]}`}
            >
              <Row className="mx-1">
                <label
                  className="ml-1 mr-auto"
                  onClick={() =>
                    onMinimize({
                      ...minimized,
                      containers: minimized.containers.map((item, i) =>
                        i != index ? item : !item
                      ),
                    })
                  }
                >
                  {`[${index}] `}
                  <FontAwesomeIcon
                    icon={
                      minimized.containers[index]
                        ? faChevronDown
                        : faChevronRight
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
                      containers: minimized.containers.filter(
                        (_, i) => i != index
                      ),
                    });

                    dispatch({
                      type: `${props.writeTo}_spec_template_spec_containers_del`.toUpperCase(),
                      readFrom: `${props.readFrom}_spec_template_spec_containers_${index}`,
                    });
                  }}
                />
              </Row>
              <Container
                root={props.root}
                show={minimized.containers[index]}
                readFrom={`${props.readFrom}_spec_template_spec_containers_${index}`}
                writeTo={`${props.writeTo}_spec_template_spec_containers`}
              />
            </div>
          ))}

          <div className="container my-2">
            <a
              className="btn btn-outline-success w-100"
              onClick={() => {
                onMinimize({
                  ...minimized,
                  containers: [...minimized.containers, true],
                });

                dispatch({
                  type: `${props.writeTo}_spec_template_spec_containers_add`.toUpperCase(),
                  readFrom: `${props.readFrom}_spec_template_spec_containers`,
                });

                dispatch({
                  type: `temp_${props.writeTo}_spec_template_spec_containers_add`.toUpperCase(),
                  readFrom: `temp_${props.readFrom}_spec_template_spec_containers`,
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
    </div>
  );
}
