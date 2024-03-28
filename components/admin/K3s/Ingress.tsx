import {
  faChevronDown,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputName from "../../Inputs/InputName";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import styles from "./Default.module.css";
import Rules from "./Rules";

export interface IngressProps {
  hidden?: boolean;
  root?: string | (() => void);
  readFrom: string;
  writeTo: string;
}

export default function Ingress(props: IngressProps) {
  const [minimized, onMinimize] = useState({
    metadata: true,
    spec: true,
    rule: true,
    rules: [] as boolean[],
  });

  const dispatch = useDispatch();
  const rules = useSelector((state: any) =>
    `${props.readFrom}_spec_rules`
      .split("_")
      .reduce((acc, curr) => acc[curr], state)
  ) as unknown[];

  useEffect(() => {
    onMinimize({
      ...minimized,
      rules: rules.map((_, i) => minimized.rules[i] || true),
    });
  }, [rules.length]);

  return (
    // <div hidden={props.hidden} className="card py-3">
    //   <InputTemplate
    //     className="px-2"
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
    //         <div className="row border rounded mx-0 py-2">
    //           <InputTemplate className="col-6 px-2" label="Name">
    //             <InputName
    //               char="@"
    //               root={props.root}
    //               readFrom={`${props.readFrom}_metadata_name`}
    //               writeTo={`${props.writeTo}_metadata_name`}
    //               placeholder="void-ingress"
    //               required
    //             />
    //           </InputTemplate>

    //           <InputTemplate className="col-6" label="Namespace">
    //             <div className="input-group">
    //               <InputValue
    //                 className="rounded"
    //                 root={props.root}
    //                 readFrom={`${props.readFrom}_metadata_namespace`}
    //                 writeTo={`${props.writeTo}_metadata_namespace`}
    //                 placeholder="demo"
    //               />
    //             </div>
    //           </InputTemplate>
    //         </div>
    //       </div>
    //     </Collapse>
    //   </InputTemplate>

    //   <InputTemplate
    //     className="mt-1 px-1"
    //     labelClassName="font-weight-bold ml-2"
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
    //         <div className="border rounded mx-1 py-2">
    //           <InputTemplate label="Secret Name" className="px-2">
    //             <div className="input-group">
    //               <InputValue
    //                 root={props.root}
    //                 readFrom={`${props.readFrom}_spec_tls_0_secretName`}
    //                 writeTo={`${props.writeTo}_spec_tls_secretName`}
    //                 placeholder="mortis-tls"
    //                 required
    //               />
    //             </div>
    //           </InputTemplate>

    //           <InputTemplate
    //             className="px-2"
    //             labelClassName="font-weight-bold mx-1"
    //             label={[
    //               "Rules ",
    //               <FontAwesomeIcon
    //                 key={"icon-rules"}
    //                 icon={faChevronDown}
    //                 style={{
    //                   transitionDuration: "0.25s",
    //                   transitionProperty: "transform",
    //                   transform: `rotate(${minimized.rule ? "0deg" : "-90deg"}`,
    //                 }}
    //               />,
    //             ]}
    //             onClick={() =>
    //               onMinimize({ ...minimized, rule: !minimized.rule })
    //             }
    //           >
    //             <Collapse in={minimized.rule}>
    //               <div>
    //                 <div className="border rounded px-1 py-2">
    //                   {minimized.rules.map((show, index) => (
    //                     <div
    //                       key={index}
    //                       className={`mb-3 w-100 ${styles["el-index"]}`}
    //                     >
    //                       <div className="row mx-1">
    //                         <label
    //                           className="ml-1 mr-auto"
    //                           style={{ cursor: "pointer" }}
    //                           onClick={() => {
    //                             onMinimize({
    //                               ...minimized,
    //                               rules: minimized.rules.map((item, i) =>
    //                                 i === index ? !item : item
    //                               ),
    //                             });
    //                           }}
    //                         >
    //                           {`[${index}] `}
    //                           <FontAwesomeIcon
    //                             icon={faChevronDown}
    //                             style={{
    //                               transitionDuration: "0.25s",
    //                               transitionProperty: "transform",
    //                               transform: `rotate(${
    //                                 show ? "0deg" : "-90deg"
    //                               }`,
    //                             }}
    //                           />
    //                         </label>
    //                         <FontAwesomeIcon
    //                           className={`mr-1 ${styles["el-container"]} text-danger`}
    //                           icon={faTrashAlt}
    //                           size="lg"
    //                           fontSize="1rem"
    //                           onClick={() => {
    //                             onMinimize({
    //                               ...minimized,
    //                               rules: minimized.rules.filter(
    //                                 (_, i) => i === index
    //                               ),
    //                             });

    //                             dispatch({
    //                               type: `${props.writeTo}_spec_rules_del`.toUpperCase(),
    //                               readFrom: `${props.readFrom}_spec_rules_${index}`,
    //                               index: index,
    //                             });
    //                           }}
    //                         />
    //                       </div>

    //                       <Collapse in={show}>
    //                         <div>
    //                           <Rules
    //                             root={props.root}
    //                             readFrom={`${props.readFrom}_spec_rules_${index}`}
    //                             writeTo={`${props.writeTo}_spec_rules`}
    //                           />
    //                         </div>
    //                       </Collapse>
    //                     </div>
    //                   ))}

    //                   <div className="container my-2">
    //                     <a
    //                       className="btn btn-outline-success w-100"
    //                       onClick={() => {
    //                         onMinimize({
    //                           ...minimized,
    //                           rules: [...minimized.rules, true],
    //                         });

    //                         dispatch({
    //                           type: `${props.writeTo}_spec_rules_add`.toUpperCase(),
    //                           readFrom: `${props.readFrom}_spec_rules`,
    //                         });
    //                       }}
    //                     >
    //                       <FontAwesomeIcon
    //                         className={`text-success ${styles["icon"]}`}
    //                         icon={faPlus}
    //                       />
    //                     </a>
    //                   </div>
    //                 </div>
    //               </div>
    //             </Collapse>
    //           </InputTemplate>
    //         </div>
    //       </div>
    //     </Collapse>
    //   </InputTemplate>
    // </div>
    <></>
  );
}
