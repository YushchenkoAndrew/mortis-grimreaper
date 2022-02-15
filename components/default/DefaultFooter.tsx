import next from "next";
import React, { useEffect, useRef, useState } from "react";
import styles from "./DefaultFooter.module.css";
import DefaultLinks from "./DefaultLinks";

export interface DefaultFooterProps {
  className?: string;
  name: string;
  children: React.ReactNode;
  background?: boolean;
}

export default function DefaultFooter(props: DefaultFooterProps) {
  // const [isHover, onHover] = useState(false);
  const [prev, setPos] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <div className="container">
      <footer
        id={props.background ? styles["pattern6"] : undefined}
        className={props.className ?? `pt-4 mt-md-5 pt-md-5 border-top py-2`}
        style={{
          // FIXME: Right now it's looks kinda SUS !! Too low refresh rate !!!!
          backgroundImage: props.background
            ? `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='100' height='100' patternTransform='scale(3) rotate(150)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 100%, 1)'/><path d='M92.4 11.82a1.2 1.2 0 011.11 1.74 6.47 6.47 0 0011.49 5.9 1.2 1.2 0 011.6-.52c.28.14.49.39.59.7.08.27.05.6-.1.88a8.78 8.78 0 01-5.14 4.36 8.79 8.79 0 01-11.1-5.7 8.79 8.79 0 01.54-6.72 1.17 1.17 0 011-.64zm-100 0a1.2 1.2 0 011.11 1.74 6.47 6.47 0 002.8 8.68 6.47 6.47 0 008.68-2.78 1.2 1.2 0 011.6-.52c.3.14.5.39.6.7.08.27.05.6-.1.88a8.77 8.77 0 01-5.14 4.36 8.8 8.8 0 01-11.1-5.7 8.79 8.79 0 01.54-6.72 1.17 1.17 0 011-.64zm61.5 15.26c1.84.06 3.58.76 4.98 1.99a1.08 1.08 0 01.34 1.01 1.09 1.09 0 01-.98.87c-.29.02-.56-.07-.78-.27a5.84 5.84 0 00-7.72 8.74 1.04 1.04 0 01.1 1.5c-.2.22-.45.35-.74.37-.28.02-.56-.08-.77-.27a7.92 7.92 0 01-2.68-5.48 7.92 7.92 0 017.46-8.45c.26-.02.53-.02.79-.01zm-7.18 23.34a9.42 9.42 0 11-1.32 18.66 9.4 9.4 0 011.32-18.66zm.06 1.78a7.62 7.62 0 10.47 15.24 7.62 7.62 0 00-.47-15.24zm-21.4 16.73l4.83 9.23-13.73 7.17-4.82-9.22z'  stroke-width='1' stroke='none' fill='hsla(187, 66%, 48%, 0.89)'/><path d='M107.9 52.52c1.6 0 3-.98 3.78-2.61.54-1.13 1.47-1.8 2.5-1.8 1.04 0 1.98.67 2.51 1.8.78 1.64 2.2 2.6 3.8 2.6 1.59 0 3-.97 3.78-2.6.53-1.13 1.47-1.8 2.5-1.8.86 0 1.65.46 2.2 1.27.2.29.58.4.89.25h.02a.7.7 0 00.29-1.02 4.08 4.08 0 00-3.4-1.92c-1.6 0-3 .98-3.78 2.61-.54 1.12-1.48 1.8-2.5 1.8-1.04 0-1.98-.68-2.51-1.8-.78-1.64-2.2-2.6-3.8-2.6-1.59 0-3 .97-3.78 2.6-.53 1.12-1.47 1.8-2.5 1.8-1.04 0-1.97-.68-2.5-1.8-.78-1.64-2.2-2.6-3.8-2.6-1.58 0-3 .95-3.77 2.58a.74.74 0 00.25.94c.37.23.85.08 1.03-.3.53-1.12 1.47-1.8 2.5-1.8 1.04 0 1.97.68 2.5 1.8.77 1.63 2.2 2.6 3.79 2.6zm-.04-4.91c1.6 0 3.01-.98 3.79-2.61.53-1.13 1.47-1.8 2.5-1.8 1.04 0 1.97.67 2.5 1.8.78 1.64 2.2 2.6 3.8 2.6 1.6 0 3-.97 3.78-2.6.54-1.13 1.47-1.8 2.5-1.8 1.04 0 1.98.67 2.51 1.8a.72.72 0 001.3-.62c-.78-1.64-2.2-2.6-3.8-2.6-1.59 0-3 .97-3.78 2.6-.54 1.13-1.47 1.8-2.5 1.8-1.04 0-1.98-.67-2.51-1.8-.78-1.64-2.2-2.6-3.79-2.6-1.6 0-3.01.97-3.79 2.6-.53 1.13-1.47 1.8-2.5 1.8s-1.97-.67-2.5-1.8c-.78-1.64-2.2-2.6-3.8-2.6-1.59 0-3 .97-3.78 2.6a.72.72 0 001.3.62c.53-1.13 1.46-1.8 2.5-1.8 1.03 0 1.97.67 2.5 1.8.76 1.63 2.18 2.6 3.77 2.6zm-65-66.88L25.77-6.92 8.72 5.44l19.23 8.6 19.24 8.61L45.02 1.7zm0 100L25.77 93.08 8.72 105.44l19.23 8.6 19.24 8.61-2.17-20.96zM7.9 52.52c1.6 0 3-.98 3.78-2.61.54-1.13 1.47-1.8 2.5-1.8 1.04 0 1.98.67 2.51 1.8.78 1.64 2.2 2.6 3.8 2.6 1.59 0 3-.97 3.78-2.6.53-1.13 1.47-1.8 2.5-1.8.86 0 1.65.46 2.2 1.27.2.29.57.4.89.25h.02a.7.7 0 00.29-1.02 4.08 4.08 0 00-3.4-1.92c-1.6 0-3.01.98-3.78 2.61-.54 1.12-1.48 1.8-2.5 1.8-1.04 0-1.98-.68-2.51-1.8-.78-1.64-2.2-2.6-3.8-2.6-1.59 0-3 .97-3.78 2.6-.53 1.12-1.47 1.8-2.5 1.8-1.04 0-1.97-.68-2.5-1.8-.78-1.64-2.2-2.6-3.8-2.6-1.58 0-3 .95-3.77 2.58a.74.74 0 00.25.94c.37.23.85.08 1.03-.3.53-1.12 1.47-1.8 2.5-1.8 1.04 0 1.97.68 2.5 1.8.77 1.63 2.19 2.6 3.79 2.6zm-.04-4.91c1.6 0 3.01-.98 3.79-2.61.53-1.13 1.47-1.8 2.5-1.8 1.04 0 1.97.67 2.5 1.8.78 1.64 2.2 2.6 3.8 2.6 1.59 0 3-.97 3.78-2.6.54-1.13 1.47-1.8 2.5-1.8 1.04 0 1.98.67 2.51 1.8a.72.72 0 001.3-.62c-.78-1.64-2.2-2.6-3.8-2.6-1.59 0-3 .97-3.78 2.6-.54 1.13-1.47 1.8-2.5 1.8-1.04 0-1.98-.67-2.51-1.8-.78-1.64-2.2-2.6-3.79-2.6-1.6 0-3.01.97-3.79 2.6-.53 1.13-1.47 1.8-2.5 1.8s-1.97-.67-2.5-1.8c-.78-1.64-2.2-2.6-3.8-2.6-1.59 0-3 .97-3.78 2.6a.72.72 0 001.3.62c.53-1.13 1.46-1.8 2.5-1.8 1.03 0 1.97.67 2.5 1.8.76 1.63 2.17 2.6 3.77 2.6z'  stroke-width='1' stroke='none' fill='hsla(240, 9%, 91%, 0.88)'/><path d='M53.04 81.06a2 2 0 003.95-.66 2 2 0 00-3.95.66zM14.89 63.92a3.28 3.28 0 004.63-4.63 3.28 3.28 0 00-4.63 0 3.26 3.26 0 000 4.63zm52.8-52.54a5.99 5.99 0 0011.8-1.97 5.99 5.99 0 00-11.8 1.97z'  stroke-width='1' stroke='none' fill='hsla(0, 99%, 64%, 0.72)'/><path d='M80.37 64.6a13.58 13.58 0 11-1.14 27.15 13.58 13.58 0 011.14-27.14zM26.83 26.14l-1.67 4.77-1.68 4.78-3.3-3.84L16.9 28l4.97-.93zm54.32 15.72l1.76 4.73 1.78 4.74-4.99-.83-4.99-.84 3.22-3.9z'  stroke-width='1' stroke='none' fill='hsla(45, 99%, 70%, 1)'/></pattern></defs><rect width='800%' height='800%' transform='translate(${
                offset.x * 2
              }, ${offset.y * 2})' fill='url(%23a)'/></svg>")`
            : undefined,
        }}
        onMouseMove={(e) => {
          if (!props.background) return;
          const vel = {
            x: Math.round(e.pageX / 20) - prev.x,
            y: Math.round(e.pageY / 20) - prev.y,
          };
          const velLen = Math.sqrt(vel.x * vel.x + vel.y * vel.y || 1);
          const next = {
            x: offset.x - Math.round((vel.x / velLen) * 10) / 10,
            y: offset.y - Math.round((vel.y / velLen) * 10) / 10,
          };
          const nextLen = Math.sqrt(next.x * next.x + next.y * next.y || 1);
          setPos({
            x: Math.round(e.pageX / 20),
            y: Math.round(e.pageY / 20),
          });
          setOffset({
            x: next.x / nextLen,
            y: next.y / nextLen,
          });
        }}
        onMouseLeave={(e) => {
          if (!props.background) return;
          setOffset({ x: 0, y: 0 });
        }}
      >
        <div className="row justify-content-center">
          <div className="col-11">
            <div className="row">
              <div className="col col-md-5 col-sm-7 mx-sm-auto">
                <div className="d-flex flex-column h-100">
                  <h3
                    className={`text-dark row justify-content-sm-center ${styles["author"]}`}
                  >
                    Andrew Y
                  </h3>

                  <div className="d-none d-sm-block d-md-block d-lg-block d-xl-block mt-auto">
                    <div className="row justify-content-center">
                      <DefaultLinks />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-9 col-md-4 col-sm-5">
                <h6 className="mb-3 mb-lg-4 bold-text ">
                  <b>{props.name}</b>
                </h6>
                {props.children}
              </div>
            </div>

            <div className="d-sm-none row justify-content-center">
              <DefaultLinks />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
