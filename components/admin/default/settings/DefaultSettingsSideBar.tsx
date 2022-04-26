import { faCog, faServer, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../SideBar/SideBar";
import SideBarChapter from "../../../SideBar/SideBarChapter";
import SideBarDropDown from "../../../SideBar/SideBarDropDown";
import SideBarItem from "../../../SideBar/SideBarItem";

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

        <SideBarItem
          active={value === "Pattern"}
          event={{ onClick: () => onSelect("Pattern") }}
        >
          <FontAwesomeIcon
            className="mr-3"
            icon={faImage}
            size="1x"
            fontSize="1rem"
          />
          Pattern
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

        <SideBarDropDown title="Accounts">
          <SideBarItem>Action</SideBarItem>
          <SideBarItem>Another action</SideBarItem>
          <SideBarItem>Something else here</SideBarItem>
          <SideBarItem>Separated link</SideBarItem>
        </SideBarDropDown>
      </SideBarChapter>
    </SideBar>
  );
}
