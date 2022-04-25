import { faCog, faServer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../SideBar/SideBar";
import SideBarChapter from "../../SideBar/SideBarChapter";
import SideBarItem from "../../SideBar/SideBarItem";

export interface DefaultSettingsSideBarProps {
  readFrom: string;
  writeTo?: string;
}

export default function DefaultSettingsSideBar(
  props: DefaultSettingsSideBarProps
) {
  const dispatch = useDispatch();
  const value = useSelector((state: any) =>
    props.readFrom.split("_").reduce((acc, curr) => acc[curr], state)
  );

  function onSelect(value: string) {
    dispatch({
      type: `${props.writeTo || props.readFrom}_CHANGED`.toUpperCase(),
      value,
    });
  }

  return (
    <SideBar>
      <SideBarItem
        active={value === "General"}
        event={{ onClick: () => onSelect("General") }}
      >
        <FontAwesomeIcon
          className="mr-3"
          icon={faCog}
          size="1x"
          fontSize="1rem"
        />
        General
      </SideBarItem>

      <SideBarChapter name="test">
        <SideBarItem
          active={value === "Home"}
          event={{ onClick: () => onSelect("Home") }}
        >
          <FontAwesomeIcon
            className="mr-3"
            icon={faServer}
            size="1x"
            fontSize="1rem"
          />
          Home
        </SideBarItem>

        <SideBarItem>Dashboard</SideBarItem>
        <SideBarItem>Orders</SideBarItem>
        <SideBarItem>Customers</SideBarItem>
      </SideBarChapter>

      <SideBarChapter name="test">
        <SideBarItem>Home</SideBarItem>
        <SideBarItem>Dashboard</SideBarItem>
        <SideBarItem>Orders</SideBarItem>
        <SideBarItem>Customers</SideBarItem>
      </SideBarChapter>
    </SideBar>
  );
}
