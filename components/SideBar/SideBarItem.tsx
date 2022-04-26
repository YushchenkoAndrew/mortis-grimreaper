import styles from "./SideBarItem.module.scss";

export interface SideBarItemProps {
  active?: boolean;
  className?: string;

  event?: { href?: string; onClick?: () => void };
  children: React.ReactNode;
}

export default function SideBarItem(props: SideBarItemProps) {
  return (
    <li className="nav-item w-100 px-2">
      <a
        href="#"
        className={`nav-link ${styles["side-bar-item"]} ${
          props.active ? "bg-dark text-light" : "text-dark"
        } ${props.className || ""}`}
        aria-current="page"
        {...(props.event ?? {})}
      >
        {props.children}
      </a>
    </li>
  );
}
