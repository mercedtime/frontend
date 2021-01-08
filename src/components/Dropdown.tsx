import { PropsWithChildren, useState, useEffect } from "react";
import "./Dropdown.scss";

const Dropdown = (
  props: PropsWithChildren<{
    display?: JSX.Element;
    style?: React.CSSProperties;
    className?: string;
    open?: boolean;
    autoCollapse?: boolean;
  }>
) => {
  const auto = props.autoCollapse || false;
  const [open, setOpen] = useState(props.open || false);
  let cls = "dropdown";
  if (props.className) {
    cls += ` ${props.className}`;
  }

  let effect = () => {};
  if (auto) {
    effect = () => {
      if (!open) {
        // Don't add the event listener
        // if the dropdown is not open.
        return;
      }

      const callback = (event: Event): void => {
        let elms = document.getElementsByClassName(cls);
        if (elms.length > 1) {
          // Cannot deturmin which dropdown we have clicked on
          console.warn("Cannot deturmine which dropdown to close", elms);
          return;
        }
        let dropdown: EventTarget = elms[0];
        let path = event.composedPath();
        for (let i in path) {
          if (path[i] === dropdown) {
            // This click event was inside the dropdown
            // and we should not close the dropdown.
            return;
          }
        }
        // Click event occured outside the dropdown
        // and we need to close the dropdown.
        setOpen(false);
      };
      window.addEventListener("click", callback);
      return () => window.removeEventListener("click", callback);
    };
  }

  useEffect(effect, [open, cls]);

  return (
    <>
      {props.display && (
        <span onClick={() => setOpen(!open)}>{props.display}</span>
      )}
      {open && (
        <div className={cls} style={props.style}>
          <div className="dropdown-childdren">{props.children}</div>
        </div>
      )}
    </>
  );
};

export default Dropdown;
