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
import styles from "./Default.module.css";
import Path from "./Path";

export interface RulesProps {
  hidden?: boolean;
  root?: string | (() => void);
  readFrom: string;
  writeTo: string;
}

export default function Rules(props: RulesProps) {
  const [minimized, onMinimize] = useState({
    path: true,
    paths: [] as boolean[],
  });

  const dispatch = useDispatch();
  const paths = useSelector((state: any) =>
    `${props.readFrom}_http_paths`
      .split("_")
      .reduce((acc, curr) => acc[curr], state)
  ) as unknown[];

  useEffect(() => {
    onMinimize({
      ...minimized,
      paths: paths.map((_, i) => minimized.paths[i] || true),
    });
  }, [paths.length]);

  return (
    // <div hidden={props.hidden} className="border rounded mx-1 py-2">
    //   <InputTemplate className="px-2" label="Host">
    //     <InputName
    //       char="http://"
    //       root={props.root}
    //       readFrom={`${props.readFrom}_host`}
    //       writeTo={`${props.writeTo}_host`}
    //       placeholder="mortis-grimreaper.ddns.net"
    //     />
    //   </InputTemplate>

    //   <InputTemplate
    //     className="px-2"
    //     labelClassName="font-weight-bold mx-1"
    //     label={[
    //       "Path ",
    //       <FontAwesomeIcon
    //         key={"icon-path"}
    //         icon={faChevronDown}
    //         style={{
    //           transitionDuration: "0.25s",
    //           transitionProperty: "transform",
    //           transform: `rotate(${minimized.path ? "0deg" : "-90deg"}`,
    //         }}
    //       />,
    //     ]}
    //     onClick={() =>
    //       onMinimize({
    //         ...minimized,
    //         path: !minimized.path,
    //       })
    //     }
    //   >
    //     <Collapse in={minimized.path}>
    //       <div>
    //         <div className="border rounded p-2">
    //           {minimized.paths.map((show, index) => (
    //             <div key={index} className={`mb-3 w-100 ${styles["el-index"]}`}>
    //               <Row className="mx-0">
    //                 <label
    //                   className="ml-1 mr-auto"
    //                   style={{ cursor: "pointer" }}
    //                   onClick={() => {
    //                     onMinimize({
    //                       ...minimized,
    //                       paths: minimized.paths.map((item, i) =>
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
    //                       paths: minimized.paths.filter((_, i) => i !== index),
    //                     });

    //                     dispatch({
    //                       type: `${props.writeTo}_http_paths_del`.toUpperCase(),
    //                       readFrom: `${props.readFrom}_http_paths_${index}`,
    //                       index: index,
    //                     });
    //                   }}
    //                 />
    //               </Row>

    //               <Collapse in={show}>
    //                 <div>
    //                   <Path
    //                     root={props.root}
    //                     readFrom={`${props.readFrom}_http_paths_${index}`}
    //                     writeTo={`${props.writeTo}_http_paths`}
    //                   />
    //                 </div>
    //               </Collapse>
    //             </div>
    //           ))}

    //           <Container className="my-2">
    //             <a
    //               className="btn btn-outline-success w-100"
    //               onClick={() => {
    //                 onMinimize({
    //                   ...minimized,
    //                   paths: [...minimized.paths, true],
    //                 });

    //                 dispatch({
    //                   type: `${props.writeTo}_http_paths_add`.toUpperCase(),
    //                   readFrom: `${props.readFrom}_http_paths`,
    //                 });
    //               }}
    //             >
    //               <FontAwesomeIcon
    //                 className={`text-success ${styles["icon"]}`}
    //                 icon={faPlus}
    //               />
    //             </a>
    //           </Container>
    //         </div>
    //       </div>
    //     </Collapse>
    //   </InputTemplate>
    // </div>
    <></>
  );
}
