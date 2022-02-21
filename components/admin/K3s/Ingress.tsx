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
import { Ingress } from "../../../types/K3s/Ingress";
import InputName from "../../Inputs/InputName";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import styles from "./Default.module.css";
import Rules, { RulesRef } from "./Rules";

export interface IngressProps {
  show?: boolean;
}

export interface IngressRef {
  getValue: () => Ingress;
}

export default React.forwardRef((props: IngressProps, ref) => {
  const [minimized, onMinimize] = useState({
    metadata: true,
    spec: true,
    rules: true,
  });

  const [ingress, onIngressChange] = useState<Ingress>({
    apiVersion: "extensions/v1beta1",
    kind: "Ingress",
    metadata: { name: "" },
    spec: { tls: [{ secretName: "" }] },
  });

  const [rules, onRulesChange] = useState<boolean[]>([]);
  const [rulesRef, onRulesRefChange] = useState<React.RefObject<RulesRef>[]>(
    []
  );

  useEffect(() => {
    onRulesRefChange(rules.map((_, i) => rulesRef[i] || createRef<RulesRef>()));
  }, [rules.length]);

  useImperativeHandle<unknown, IngressRef>(ref, () => ({
    getValue() {
      return {
        apiVersion: "extensions/v1beta1",
        ...ingress,
        spec: {
          ...ingress.spec,
          tls: [
            {
              ...(ingress.spec?.tls?.[0] ?? {}),
              hosts: rulesRef.map(
                (item) => item.current?.getValue?.()?.host ?? ""
              ),
            },
          ],
          rules: rulesRef.map((item) => item.current?.getValue()),
        },
      } as Ingress;
    },
  }));

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
              name="name"
              required
              value={ingress.metadata?.name ?? ""}
              placeholder="void-ingress"
              onChange={({ target: { name, value } }) => {
                onIngressChange({
                  ...ingress,
                  metadata: {
                    ...ingress.metadata,
                    [name]: value,
                  },
                });
              }}
              // onBlur={onDataCache}
            />
          </InputTemplate>

          <InputTemplate className="col-6" label="Namespace">
            <div className="input-group">
              <InputValue
                name="namespace"
                className="rounded"
                value={ingress.metadata?.namespace ?? ""}
                placeholder="demo"
                onChange={({ target: { name, value } }) => {
                  onIngressChange({
                    ...ingress,
                    metadata: {
                      ...ingress.metadata,
                      [name]: value,
                    },
                  });
                }}
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
                name="secretName"
                required
                value={`${ingress.spec?.tls?.[0]?.secretName ?? ""}`}
                placeholder="mortis-tls"
                onChange={({ target: { name, value } }) => {
                  onIngressChange({
                    ...ingress,
                    spec: {
                      ...ingress.spec,
                      tls: [{ [name]: value }],
                    },
                  });
                }}
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
                icon={minimized.rules ? faChevronDown : faChevronRight}
              />,
            ]}
            onClick={() =>
              onMinimize({ ...minimized, rules: !minimized.rules })
            }
          >
            <div
              className={`border rounded px-1 py-2 ${
                minimized.rules ? "" : "d-none"
              }`}
            >
              {rules.map((show, index) => (
                <div key={index} className={`mb-3 w-100 ${styles["el-index"]}`}>
                  <div className="row mx-1">
                    <label
                      className="ml-1 mr-auto"
                      onClick={() => {
                        onRulesChange({ ...rules, [index]: !rules[index] });
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
                        onRulesChange([
                          ...rules.slice(0, index),
                          ...rules.slice(index + 1),
                        ]);
                      }}
                    />
                  </div>
                  <Rules ref={rulesRef[index]} show={show} />
                </div>
              ))}

              <div className="container my-2">
                <a
                  className="btn btn-outline-success w-100"
                  onClick={() => onRulesChange([...rules, true])}
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
});
