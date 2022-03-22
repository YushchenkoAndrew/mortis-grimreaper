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
import { useDispatch, useSelector } from "react-redux";
// import { Ingress } from "../../../types/K3s/Ingress";
import InputName from "../../Inputs/InputName";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import styles from "./Default.module.css";
import Rules from "./Rules";

export interface IngressProps {
  show?: boolean;
  root?: string;
  readFrom: string;
  writeTo: string;
}

// export interface IngressRef {
//   getValue: () => Ingress;
// }

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

  // const [ingress, onIngressChange] = useState<Ingress>({
  // });

  // const [rules, onRulesChange] = useState<boolean[]>([]);
  // const [rulesRef, onRulesRefChange] = useState<React.RefObject<RulesRef>[]>(
  //   []
  // );

  // useEffect(() => {
  //   onRulesRefChange(rules.map((_, i) => rulesRef[i] || createRef<RulesRef>()));
  // }, [rules.length]);

  // useImperativeHandle<unknown, IngressRef>(ref, () => ({
  //   getValue() {
  //     return {
  //       apiVersion: "extensions/v1beta1",
  //       ...ingress,
  //       spec: {
  //         ...ingress.spec,
  //         tls: [
  //           {
  //             ...(ingress.spec?.tls?.[0] ?? {}),
  //             hosts: rulesRef.map(
  //               (item) => item.current?.getValue?.()?.host ?? ""
  //             ),
  //           },
  //         ],
  //         rules: rulesRef.map((item) => item.current?.getValue()),
  //       },
  //     } as Ingress;
  //   },
  // }));

  return (
    <div className={`card px-1 py-3 ${props.show ? "" : "d-none"}`}>
      <InputTemplate
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
          className={`row border rounded px-1 mx-1 py-2 ${
            minimized.metadata ? "" : "d-none"
          }`}
        >
          <InputTemplate className="col-6" label="Name">
            <InputName
              char="@"
              root={props.root}
              readFrom={`${props.readFrom}_metadata_name`}
              writeTo={`${props.writeTo}_metadata_name`}
              placeholder="void-ingress"
              required
              // value={ingress.metadata?.name ?? ""}
              // onChange={({ target: { name, value } }) => {
              //   onIngressChange({
              //     ...ingress,
              //     metadata: {
              //       ...ingress.metadata,
              //       [name]: value,
              //     },
              //   });
              // }}
              // onBlur={onDataCache}
            />
          </InputTemplate>

          <InputTemplate className="col-6" label="Namespace">
            <div className="input-group">
              <InputValue
                className="rounded"
                root={props.root}
                readFrom={`${props.readFrom}_metadata_namespace`}
                writeTo={`${props.writeTo}_metadata_namespace`}
                placeholder="demo"
                // name="namespace"
                // value={ingress.metadata?.namespace ?? ""}
                // onChange={({ target: { name, value } }) => {
                //   onIngressChange({
                //     ...ingress,
                //     metadata: {
                //       ...ingress.metadata,
                //       [name]: value,
                //     },
                //   });
                // }}
                // onBlur={onDataCache}
              />
            </div>
          </InputTemplate>
        </div>
      </InputTemplate>

      <InputTemplate
        className="mt-1"
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
          <InputTemplate label="Secret Name">
            <div className="input-group">
              <InputValue
                root={props.root}
                readFrom={`${props.readFrom}_spec_tls_0_secretName`}
                writeTo={`${props.writeTo}_spec_tls_secretName`}
                placeholder="mortis-tls"
                required
                // name="secretName"
                // value={`${ingress.spec?.tls?.[0]?.secretName ?? ""}`}
                // onChange={({ target: { name, value } }) => {
                //   onIngressChange({
                //     ...ingress,
                //     spec: {
                //       ...ingress.spec,
                //       tls: [{ [name]: value }],
                //     },
                //   });
                // }}
                // onBlur={onDataCache}
              />
            </div>
          </InputTemplate>

          <InputTemplate
            className="mx-1"
            labelClassName="font-weight-bold mx-1"
            label={[
              "Rules ",
              <FontAwesomeIcon
                key={"icon-rules"}
                icon={minimized.rule ? faChevronDown : faChevronRight}
              />,
            ]}
            onClick={() => onMinimize({ ...minimized, rule: !minimized.rules })}
          >
            <div
              className={`border rounded px-1 py-2 ${
                minimized.rule ? "" : "d-none"
              }`}
            >
              {rules.map((_, index) => (
                <div key={index} className={`mb-3 w-100 ${styles["el-index"]}`}>
                  <div className="row mx-1">
                    <label
                      className="ml-1 mr-auto"
                      onClick={() => {
                        onMinimize({
                          ...minimized,
                          rules: minimized.rules.map((item, i) =>
                            i === index ? !item : item
                          ),
                        });
                      }}
                    >
                      {`[${index}] `}
                      <FontAwesomeIcon
                        icon={minimized.rules ? faChevronDown : faChevronRight}
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
                          rules: minimized.rules.filter((_, i) => i === index),
                        });

                        dispatch({
                          type: `${props.writeTo}_spec_rules_del`.toUpperCase(),
                          readFrom: `${props.readFrom}_spec_rules_${index}`,
                          index: index,
                        });
                      }}
                    />
                  </div>
                  <Rules
                    root={props.root}
                    show={minimized.rules[index]}
                    readFrom={`${props.readFrom}_spec_rules_${index}`}
                    writeTo={`${props.writeTo}_spec_rules`}
                  />
                </div>
              ))}

              <div className="container my-2">
                <a
                  className="btn btn-outline-success w-100"
                  onClick={() => {
                    onMinimize({
                      ...minimized,
                      rules: [...minimized.rules, true],
                    });

                    dispatch({
                      type: `${props.writeTo}_spec_rules_add`.toUpperCase(),
                      readFrom: `${props.readFrom}_spec_rules`,
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
      </InputTemplate>
    </div>
  );
}
