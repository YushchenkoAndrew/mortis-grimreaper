import { Nav } from "react-bootstrap";

export interface SideBarItemProps {
  // name: string;
  // href: string;
  // style?: string;
  // target?: React.HTMLAttributeAnchorTarget;
  active?: boolean;

  event?: { href?: string; onClick?: () => void };
  children: React.ReactNode;
}

export default function SideBarItem(props: SideBarItemProps) {
  return (
    <Nav.Item className="px-2">
      <a
        href="#"
        className={`nav-link ${
          props.active ? "bg-dark text-light" : "text-dark"
        }`}
        aria-current="page"
        {...(props.event ?? {})}
      >
        {props.children}
      </a>
    </Nav.Item>
  );
}
