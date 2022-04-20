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
import Container from "./Container";
import styles from "./Default.module.css";

export interface DeploymentProps {
  hidden?: boolean;
  root?: string | (() => void);
  readFrom: string;
  writeTo: string;
}

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

  useEffect(() => {
    onMinimize({
      ...minimized,
      containers: containers.map((_, i) => minimized.containers[i] || true),
    });
  }, [containers.length]);

  return (
    <div hidden={props.hidden} className="card px-1 py-3">
      <InputTemplate
        className="px-0"
        labelClassName="font-weight-bold ml-2"
        label={[
          "Metadata ",
          <FontAwesomeIcon
            key={"icon-metadata"}
            icon={faChevronDown}
            style={{
              transitionDuration: "0.25s",
              transitionProperty: "transform",
              transform: `rotate(${minimized.metadata ? "0deg" : "-90deg"}`,
            }}
          />,
        ]}
        onClick={() =>
          onMinimize({ ...minimized, metadata: !minimized.metadata })
        }
      >
        <Collapse in={minimized.metadata}>
          <div>
            <Row className="border rounded mx-1 px-1 py-2">
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
          </div>
        </Collapse>
      </InputTemplate>

      <InputTemplate
        className="mt-1 px-0"
        labelClassName="font-weight-bold ml-2"
        label={[
          "Spec ",
          <FontAwesomeIcon
            key={"icon-spec"}
            icon={faChevronDown}
            style={{
              transitionDuration: "0.25s",
              transitionProperty: "transform",
              transform: `rotate(${minimized.spec ? "0deg" : "-90deg"}`,
            }}
          />,
        ]}
        onClick={() => onMinimize({ ...minimized, spec: !minimized.spec })}
      >
        <Collapse in={minimized.spec}>
          <div>
            <div className="border rounded mx-1 px-2 py-2">
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
                    icon={faChevronDown}
                    style={{
                      transitionDuration: "0.25s",
                      transitionProperty: "transform",
                      transform: `rotate(${
                        minimized.matchLabels ? "0deg" : "-90deg"
                      }`,
                    }}
                  />,
                ]}
                onClick={() =>
                  onMinimize({
                    ...minimized,
                    matchLabels: !minimized.matchLabels,
                  })
                }
              >
                <Collapse in={minimized.matchLabels}>
                  <div>
                    <div className="border rounded px-0 py-2">
                      <div className="container px-2">
                        <InputList
                          root={props.root}
                          char={["var", "="]}
                          readFrom={`${props.readFrom}_spec_selector_matchLabels`}
                          writeTo={`${props.writeTo}_spec_selector_matchLabels`}
                          changeIn={[
                            {
                              readFrom: `${props.readFrom}_spec_template_metadata_labels`,
                              writeTo: `${props.writeTo}_spec_template_metadata_labels`,
                            },
                          ]}
                          placeholder={["app", "void"]}
                        />
                        <ListGroup>
                          {Object.entries(labels).map(([name, value], i) => (
                            <Row key={`matchLabels-${i}`} className="px-2">
                              <ListEntity
                                char={["var", "="]}
                                value={[name, value]}
                                onChange={() => {
                                  dispatch({
                                    type: `${props.readFrom}_spec_selector_matchLabels_del`.toUpperCase(),
                                    value: name,
                                  });
                                  dispatch({
                                    type: `${props.readFrom}_spec_template_metadata_labels_del`.toUpperCase(),
                                    value: name,
                                  });
                                }}
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
          </div>
        </Collapse>
      </InputTemplate>

      <InputTemplate
        className="mt-1 px-0"
        labelClassName="font-weight-bold ml-2"
        label={[
          "Containers ",
          <FontAwesomeIcon
            key="icon-containers"
            icon={faChevronDown}
            style={{
              transitionDuration: "0.25s",
              transitionProperty: "transform",
              transform: `rotate(${minimized.container ? "0deg" : "-90deg"}`,
            }}
          />,
        ]}
        onClick={() =>
          onMinimize({ ...minimized, container: !minimized.container })
        }
      >
        <Collapse in={minimized.container}>
          <div>
            <div className="border rounded px-1 py-2 mx-1">
              {minimized.containers.map((show, index) => (
                <div
                  key={`container-${index}`}
                  className={`mb-3 w-100 ${styles["el-index"]}`}
                >
                  <Row className="mx-1">
                    <label
                      className="ml-1 mr-auto"
                      style={{ cursor: "pointer" }}
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
                          type: `${props.writeTo}_spec_template_spec_containers_del`.toUpperCase(),
                          readFrom: `${props.readFrom}_spec_template_spec_containers_${index}`,
                        });
                      }}
                    />
                  </Row>
                  <Collapse in={show}>
                    <div>
                      <Container
                        root={props.root}
                        readFrom={`${props.readFrom}_spec_template_spec_containers_${index}`}
                        writeTo={`${props.writeTo}_spec_template_spec_containers`}
                      />
                    </div>
                  </Collapse>
                </div>
              ))}

              <div className="container my-2">
                <Button
                  className="w-100"
                  name={`${props.readFrom}_container_add`}
                  variant="outline-success"
                  onClick={() => {
                    dispatch({
                      type: `${props.writeTo}_spec_template_spec_containers_add`.toUpperCase(),
                      readFrom: `${props.readFrom}_spec_template_spec_containers`,
                    });

                    // Copy deployment structure to the project
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
                </Button>
              </div>
            </div>
          </div>
        </Collapse>
      </InputTemplate>
    </div>
  );
}
