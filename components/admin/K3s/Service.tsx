import {
  faChevronDown,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputList from "../../Inputs/InputDoubleList";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import ListEntity from "../../Inputs/ListEntity";
import styles from "./Default.module.css";
import Port from "./Port";

export interface ServiceProps {
  hidden?: boolean;
  root?: string | (() => void);
  readFrom: string;
  writeTo: string;
}

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

  // useEffect(() => {
  //   onMinimize({
  //     ...minimized,
  //     ports: ports.map((_, i) => minimized.port[i] || true),
  //   });
  // }, [ports.length]);

  return (
    // <div hidden={props.hidden} className="card px-1 py-3">
    //   <InputTemplate
    //     className="px-0"
    //     labelClassName="font-weight-bold mx-2"
    //     label={[
    //       "Metadata ",
    //       <FontAwesomeIcon
    //         key={"icon-metadata"}
    //         icon={faChevronDown}
    //         style={{
    //           transitionDuration: "0.25s",
    //           transitionProperty: "transform",
    //           transform: `rotate(${minimized.metadata ? "0deg" : "-90deg"}`,
    //         }}
    //       />,
    //     ]}
    //     onClick={() =>
    //       onMinimize({ ...minimized, metadata: !minimized.metadata })
    //     }
    //   >
    //     <Collapse in={minimized.metadata}>
    //       <div>
    //         <div className="row border rounded mx-1 py-2">
    //           <InputTemplate className="col-6 px-2" label="Name">
    //             <InputName
    //               char="@"
    //               root={props.root}
    //               readFrom={`${props.readFrom}_metadata_name`}
    //               writeTo={`${props.writeTo}_metadata_name`}
    //               placeholder="void-service"
    //               required
    //             />
    //           </InputTemplate>

    //           <InputTemplate className="col-6 px-2" label="Namespace">
    //             <InputGroup>
    //               <InputValue
    //                 className="rounded"
    //                 root={props.root}
    //                 readFrom={`${props.readFrom}_metadata_namespace`}
    //                 writeTo={`${props.writeTo}_metadata_namespace`}
    //                 placeholder="demo"
    //               />
    //             </InputGroup>
    //           </InputTemplate>
    //         </div>
    //       </div>
    //     </Collapse>
    //   </InputTemplate>

    //   <InputTemplate
    //     className="px-1"
    //     labelClassName="font-weight-bold mx-1"
    //     label={[
    //       "Spec ",
    //       <FontAwesomeIcon
    //         key={"icon-spec"}
    //         icon={faChevronDown}
    //         style={{
    //           transitionDuration: "0.25s",
    //           transitionProperty: "transform",
    //           transform: `rotate(${minimized.spec ? "0deg" : "-90deg"}`,
    //         }}
    //       />,
    //     ]}
    //     onClick={() => onMinimize({ ...minimized, spec: !minimized.spec })}
    //   >
    //     <Collapse in={minimized.spec}>
    //       <div>
    //         <div className="border rounded p-2">
    //           <InputTemplate className="px-1" label="Cluster IP">
    //             <InputName
    //               char="$"
    //               root={props.root}
    //               readFrom={`${props.readFrom}_spec_clusterIP`}
    //               writeTo={`${props.writeTo}_spec_clusterIP`}
    //               placeholder="10.0.171.239"
    //             />
    //           </InputTemplate>

    //           <InputTemplate className="px-1" label="Type">
    //             <InputRadio
    //               className="btn-group btn-group-sm btn-group-toggle"
    //               readFrom={`${props.readFrom}_spec_type`}
    //               writeTo={`${props.writeTo}_spec_type`}
    //               options={[
    //                 "ClusterIP",
    //                 "NodePort",
    //                 "LoadBalancer",
    //                 "ExternalName",
    //               ]}
    //               overflow={{
    //                 on: { className: "d-block d-sm-none", len: 6 },
    //                 off: { className: "d-none d-sm-block", len: 0 },
    //               }}
    //               label="btn-outline-info"
    //             />
    //           </InputTemplate>

    //           <InputTemplate
    //             className="mt-1 px-0"
    //             label={[
    //               "Selector ",
    //               <FontAwesomeIcon
    //                 key={"icon-selector"}
    //                 icon={faChevronDown}
    //                 style={{
    //                   transitionDuration: "0.25s",
    //                   transitionProperty: "transform",
    //                   transform: `rotate(${
    //                     minimized.selector ? "0deg" : "-90deg"
    //                   }`,
    //                 }}
    //               />,
    //             ]}
    //             onClick={() =>
    //               onMinimize({
    //                 ...minimized,
    //                 selector: !minimized.selector,
    //               })
    //             }
    //           >
    //             <Collapse in={minimized.selector}>
    //               <div>
    //                 <div className="border rounded py-2">
    //                   <Container className="px-2">
    //                     <InputList
    //                       char={["var", "="]}
    //                       placeholder={["app", "void"]}
    //                       readFrom={`${props.readFrom}_spec_selector`}
    //                       writeTo={`${props.writeTo}_spec_selector`}
    //                     />
    //                     <ListGroup>
    //                       {Object.entries(labels).map(([name, value], i) => (
    //                         <Row key={`matchLabels-${i}`} className="px-2">
    //                           <ListEntity
    //                             char={["var", "="]}
    //                             value={[name, value]}
    //                             onChange={() => {}}
    //                           />
    //                         </Row>
    //                       ))}
    //                     </ListGroup>
    //                   </Container>
    //                 </div>
    //               </div>
    //             </Collapse>
    //           </InputTemplate>
    //         </div>
    //       </div>
    //     </Collapse>
    //   </InputTemplate>

    //   <InputTemplate
    //     className="px-1"
    //     labelClassName="font-weight-bold mx-1"
    //     label={[
    //       "Ports ",
    //       <FontAwesomeIcon
    //         key={"icon-ports"}
    //         icon={faChevronDown}
    //         style={{
    //           transitionDuration: "0.25s",
    //           transitionProperty: "transform",
    //           transform: `rotate(${minimized.port ? "0deg" : "-90deg"}`,
    //         }}
    //       />,
    //     ]}
    //     onClick={() => onMinimize({ ...minimized, port: !minimized.port })}
    //   >
    //     <Collapse in={minimized.port}>
    //       <div>
    //         <div className="border rounded px-1 py-2">
    //           {minimized.ports.map((show, index) => (
    //             <div
    //               key={`port-${index}`}
    //               className={`mb-3 w-100 ${styles["el-index"]}`}
    //             >
    //               <Row className="mx-1">
    //                 <label
    //                   className="mx-1 mr-auto"
    //                   style={{ cursor: "pointer" }}
    //                   onClick={() => {
    //                     onMinimize({
    //                       ...minimized,
    //                       ports: minimized.ports.map((item, i) =>
    //                         i === index ? !item : item
    //                       ),
    //                     });
    //                   }}
    //                 >
    //                   {`[${index}] `}
    //                   <FontAwesomeIcon
    //                     icon={faChevronDown}
    //                     style={{
    //                       transitionDuration: "0.25s",
    //                       transitionProperty: "transform",
    //                       transform: `rotate(${show ? "0deg" : "-90deg"}`,
    //                     }}
    //                   />
    //                 </label>
    //                 <FontAwesomeIcon
    //                   className={`mr-1 ${styles["el-container"]} text-danger`}
    //                   icon={faTrashAlt}
    //                   size="lg"
    //                   fontSize="1rem"
    //                   onClick={() => {
    //                     onMinimize({
    //                       ...minimized,
    //                       ports: minimized.ports.filter((_, i) => i !== index),
    //                     });

    //                     dispatch({
    //                       type: `${props.writeTo}_spec_ports_del`.toUpperCase(),
    //                       readFrom: `${props.readFrom}_spec_ports_${index}`,
    //                       index: index,
    //                     });
    //                   }}
    //                 />
    //               </Row>
    //               <Collapse in={show}>
    //                 <div>
    //                   <Port
    //                     root={props.root}
    //                     readFrom={`${props.readFrom}_spec_ports_${index}`}
    //                     writeTo={`${props.writeTo}_spec_ports`}
    //                   />
    //                 </div>
    //               </Collapse>
    //             </div>
    //           ))}

    //           <Container className="my-2">
    //             <Button
    //               className="w-100"
    //               name={`${props.readFrom}_port_add`}
    //               variant="outline-success"
    //               onClick={() => {
    //                 onMinimize({
    //                   ...minimized,
    //                   ports: [...minimized.ports, true],
    //                 });
    //                 dispatch({
    //                   type: `${props.writeTo}_spec_ports_add`.toUpperCase(),
    //                   readFrom: `${props.readFrom}_spec_ports`,
    //                 });
    //               }}
    //             >
    //               <FontAwesomeIcon
    //                 className={`text-success ${styles["icon"]}`}
    //                 icon={faPlus}
    //               />
    //             </Button>
    //           </Container>
    //         </div>
    //       </div>
    //     </Collapse>
    //   </InputTemplate>
    // </div>
    <></>
  );
}
