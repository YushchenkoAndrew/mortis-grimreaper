import React, { memo } from "react";
import NavBar from "../NavBar/NavBar";
import NavContainer from "../NavBar/NavContainer";
import DefaultNav from "./DefaultNav";
import DisplayRunningLine from "../Display/DisplayRunningLine";

export interface DefaultHeaderProps {
  name?: string;
  home?: boolean;
  api?: boolean;
  projects?: boolean;
  info?: boolean;
  children?: React.ReactNode;
}

export default memo(function DefaultHeader(props: DefaultHeaderProps) {
  return (
    <header className="masthead">
      <NavBar>
        <NavContainer>
          <DefaultNav
            home={props.home}
            api={props.api}
            projects={props.projects}
            info={props.info}
          ></DefaultNav>
        </NavContainer>

        {props.name && <DisplayRunningLine text={props.name} size={8} />}
      </NavBar>
      {props.children}
    </header>
  );
});
