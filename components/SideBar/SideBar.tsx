import {
  Navbar,
  Container,
  Col,
  Dropdown,
  DropdownButton,
  Nav,
  Row,
} from "react-bootstrap";
import SideBarChapter from "./SideBarChapter";

export interface SideBarProps {
  children: React.ReactNode;
}

export default function SideBar(props: SideBarProps) {
  return (
    <Col className="px-3 p-md-3 bg-light" xs="12" md="4" lg="3">
      <Nav className="nav-pills flex-column mb-auto">{props.children}</Nav>

      <hr />

      <DropdownButton className="w-100" variant="outline-dark" title="Dropdown">
        <Dropdown.Item href="#">Action</Dropdown.Item>
        <Dropdown.Item href="#">Another action</Dropdown.Item>
        <Dropdown.Item href="#">Something else here</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item href="#">Separated link</Dropdown.Item>
      </DropdownButton>

      <Dropdown>
        <a
          href="#"
          className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle"
          id="dropdownUser2"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://github.com/mdo.png"
            alt=""
            className="rounded-circle me-2"
            width="32"
            height="32"
          />
          <strong>mdo</strong>
        </a>
        <ul
          className="dropdown-menu text-small shadow"
          aria-labelledby="dropdownUser2"
        >
          <li>
            <a className="dropdown-item" href="#">
              New project...
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Settings
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Profile
            </a>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Sign out
            </a>
          </li>
        </ul>
      </Dropdown>
    </Col>
  );
}
