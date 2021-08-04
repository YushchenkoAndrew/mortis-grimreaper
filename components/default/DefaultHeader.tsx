import React from "react";
import NavBar from "../NavBar";
import NavItem from "../NavItem";

export interface DefaultHeaderProps {
  home?: boolean;
  api?: boolean;
  projects?: boolean;
  info?: boolean;
  children?: React.ReactNode;
}

export default function DefaultHeader(props: DefaultHeaderProps) {
  return (
    <header className="masthead">
      <NavBar>
        <NavItem name="Home" href="/projects" active={props.home} />
        <NavItem name="API" href="/api/doc" active={props.api} />
        <NavItem
          name="Projects"
          href="/projects/projects"
          active={props.projects}
        />
        <NavItem name="Info" href="/projects/info" active={props.info} />
      </NavBar>
      {props.children}
    </header>
  );
}
