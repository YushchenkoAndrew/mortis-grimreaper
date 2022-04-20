import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { basePath } from "../../config";
import styles from "./Terminal.module.css";

export interface TerminalProps {
  hidden?: boolean;

  root?: string;
  readFrom: string;
  writeTo?: string;
}

export interface TerminalRef {
  runCommand: (command: string, result?: string) => void;
}

export default React.forwardRef(function Terminal(props: TerminalProps, ref) {
  const cmdRef = useRef<HTMLDivElement>(null);
  const cmdLineRef = useRef<HTMLInputElement>(null);

  const [line, setLine] = useState("");

  const dispatch = useDispatch();
  const history = useSelector((state: any) =>
    props.readFrom.split("_").reduce((acc, curr) => acc[curr], state)
  ) as string[];

  useImperativeHandle<unknown, TerminalRef>(ref, () => ({ runCommand }));
  async function runCommand(command: string) {
    let data: string;

    try {
      const res = await fetch(`${basePath}/api/k3s/exec`, {
        method: "POST",
        headers: { "content-type": "text/plain" },
        body: command,
      });

      data = await res.text();
    } catch (err) {
      data = String(err);
    }

    dispatch({
      type: `${props.writeTo ?? props.readFrom}_CHANGED`.toUpperCase(),
      value: `> ${command}\n${data}`,
    });
  }

  useEffect(() => {
    cmdLineRef?.current?.focus();
    cmdRef?.current?.scrollTo({
      behavior: "smooth",
      top: cmdRef?.current?.scrollHeight,
    });
  }, [history]);

  return (
    <Container hidden={props.hidden} className="rounded bg-dark p-1">
      <div
        ref={cmdRef}
        className={`bg-dark py-3 pl-3 ${styles["terminal"]}`}
        onClick={() => cmdLineRef?.current?.focus()}
      >
        {history.map((item, key) => (
          <pre key={key} className="text-light mb-0">
            {item}
          </pre>
        ))}
        <div>
          <span className="text-light mr-2">$</span>
          <input
            ref={cmdLineRef}
            type="text"
            value={line}
            className={`w-75 bg-dark border-0 text-light ${styles["terminal-line"]}`}
            onChange={(e) => setLine(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              e.preventDefault();

              if (line !== "") {
                runCommand(line);
                return setLine("");
              }

              dispatch({
                type: `${
                  props.writeTo ?? props.readFrom
                }_CHANGED`.toUpperCase(),
                value: "",
              });
            }}
            onBlur={() => {
              if (!props.root) return;
              dispatch({ type: `${props.root}_CACHED`.toUpperCase() });
            }}
          />
        </div>
      </div>
    </Container>
  );
});
