import React from "react";
import DefaultNav from "./DefaultNav";
import NavBar from "../../NavBar/NavBar";
import NavContainer from "../../NavBar/NavContainer";
import DisplayRunningLine from "../../Display/DisplayRunningLine";

export interface DefaultHeaderProps {
  name?: string;
  home?: boolean;
  projects?: boolean;
  settings?: boolean;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}

export default function DefaultHeader(props: DefaultHeaderProps) {
  return (
    <header className="masthead">
      <NavBar>
        <NavContainer className="mx-auto">
          <DefaultNav
            home={props.home}
            projects={props.projects}
            settings={props.settings}
          ></DefaultNav>
        </NavContainer>

        {props.overlay || (
          <DisplayRunningLine text={props.name || "admin"} size={7} />
        )}
      </NavBar>
      {props.children}
    </header>
  );
}
