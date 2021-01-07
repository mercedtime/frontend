import React, {
  PropsWithChildren,
  MouseEvent,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { CSSTransition } from "react-transition-group";

import { logout } from "../api";
import { EmptyUser, ChevronIcon, SignOutIcon, SettingsIcon } from "../Icons";
import "./DropdownMenu.scss";

export default function DropdownMenu(props: {
  setLoggedIn?: Dispatch<SetStateAction<boolean>>;
}) {
  const [activeMenu, setActiveMenu] = useState("main");
  const [height, setHeight] = useState<number | undefined>(undefined);
  const calcHeight = (el: HTMLElement) => {
    const h = el.offsetHeight + 32;
    setHeight(h);
    console.log(el.offsetWidth);
  };
  return (
    <>
      <Dropdown
        display={<EmptyUser className="user-icon" width="45" />}
        style={{ height: height }}
      >
        <CSSTransition
          in={activeMenu === "main"}
          unmountOnExit
          timeout={500}
          classNames="menu-primary"
          onEnter={calcHeight}
        >
          <div>
            <DropdownItem lefticon={<EmptyUser fill="white" width="45" />}>
              Profile
            </DropdownItem>
            <DropdownItem>Notifications</DropdownItem>
            <DropdownItem
              lefticon={<SettingsIcon width="22" fill="white" />}
              righticon={<ChevronIcon width="15" fill="white" />}
              onClick={() => setActiveMenu("settings")}
            >
              Settings
            </DropdownItem>
            <DropdownItem
              lefticon={<SignOutIcon width="24" fill="white" />}
              onClick={() => {
                logout();
                props.setLoggedIn && props.setLoggedIn(false);
              }}
            >
              Sign out
            </DropdownItem>
          </div>
        </CSSTransition>

        <CSSTransition
          in={activeMenu === "settings"}
          unmountOnExit
          timeout={500}
          classNames="menu-secondary"
          onEnter={calcHeight}
        >
          <div>
            <DropdownItem
              lefticon={
                <ChevronIcon width="20" fill="white" transform="rotate(180)" />
              }
              onClick={() => setActiveMenu("main")}
            >
              back
            </DropdownItem>
            <DropdownItem>Settings One</DropdownItem>
            <DropdownItem>Settings Two</DropdownItem>
            <DropdownItem>Wow, all the settings</DropdownItem>
          </div>
        </CSSTransition>
      </Dropdown>
    </>
  );
}

function Dropdown(
  props: PropsWithChildren<{
    display: JSX.Element;
    style?: React.CSSProperties;
    className?: string;
  }>
) {
  const [open, setOpen] = useState(false);
  let cls = "dropdown";
  if (props.className) {
    cls += ` ${props.className}`;
  }
  return (
    <>
      <span onClick={() => setOpen(!open)}>{props.display}</span>
      {open && (
        <div className={cls} style={props.style}>
          {props.children}
        </div>
      )}
    </>
  );
}

function DropdownItem(
  props: PropsWithChildren<{
    lefticon?: JSX.Element;
    righticon?: JSX.Element;
    onClick?: (event: MouseEvent<any>) => void;
  }>
) {
  return (
    <>
      <div className="menu-item" onClick={props.onClick}>
        <span className="menu-icon-left">{props.lefticon}</span>
        {props.children}
        <span className="menu-icon-right">{props.righticon}</span>
      </div>
    </>
  );
}
