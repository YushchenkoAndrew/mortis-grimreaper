import React from 'react';
import { basePath } from '../../../config';
import GlitchItem from '../../Navbar/GlitchItem';

export interface DefaultNavProps {
  home?: boolean;
  projects?: boolean;
  settings?: boolean;
  children?: React.ReactNode;
  style?: string;
}

export default function DefaultNav(props: DefaultNavProps) {
  return (
    <>
      <GlitchItem
        name="Home"
        href={`${basePath}/admin`}
        style={props.style}
        active={props.home}
      />
      <GlitchItem
        name="Projects"
        href={`${basePath}/admin/projects`}
        style={props.style}
        active={props.projects}
      />
      {/* <NavItem
        name="Preview"
        href={`${basePath}/`}
        target="_blank"
        style={props.style}
        active={props.settings}
      /> */}
      <GlitchItem
        name="Settings"
        href={`${basePath}/admin/settings`}
        style={props.style}
        active={props.settings}
      />
      <GlitchItem
        name="Logout"
        href={`${basePath}/admin/logout`}
        style={props.style}
      />
      {props.children}
    </>
  );
}
