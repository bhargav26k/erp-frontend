import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import { useLocation } from "react-router";
import {
  checkIsActive,
  toAbsoluteUrl,
  WithChildren,
} from "../../../../helpers";
import { useLayout } from "../../../core";
import "../../../../../app/pages/StaffPages/FinancialManagement/style.css";
type Props = {
  to: string;
  icon?: string;
  menuTrigger?: "click" | "hover";
  menuPlacement?: "right-start" | "bottom-start" | "left-start";
  hasArrow?: boolean;
  hasBullet?: boolean;
  isMega?: boolean;
  title: string;
};

const SidebarMenuItemWithSub: React.FC<Props & WithChildren> = ({
  children,
  to,
  icon,
  menuTrigger,
  menuPlacement,
  title,
}) => {
  const menuItemRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const isActive = checkIsActive(pathname, to);
  const { config } = useLayout();
  const { app } = config;

  useEffect(() => {
    if (menuItemRef.current && menuTrigger && menuPlacement) {
      menuItemRef.current.setAttribute("data-kt-menu-trigger", menuTrigger);
      menuItemRef.current.setAttribute("data-kt-menu-placement", menuPlacement);
    }
  }, [menuTrigger, menuPlacement]);

  return (
    <div
      ref={menuItemRef}
      className={clsx("menu-item", { "here show": isActive }, "menu-accordion")}
      data-kt-menu-trigger="click"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "auto", // Padding is not a valid property here; try margins or proper padding values.
          textAlign: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#2B5093"; // Change background color on hover
          e.currentTarget.style.color = "#ff0000"; // Change text color on hover
          e.currentTarget.style.borderRadius = "10px"; // Add border radius on hover
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent"; // Revert background color
          e.currentTarget.style.color = "#000000"; // Revert text color
          e.currentTarget.style.borderRadius = "0px"; // Add border radius on hover
        }}
      >
        <span
          className={clsx("menu-link", {})}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            padding: "10px 15px", // Add padding to create space around the text
          }}
        >
          {icon && app?.sidebar?.default?.menu?.iconType === "svg" && (
            <span className="menu-icon">
              <img
                alt="Logo"
                src={toAbsoluteUrl(icon)}
                className="h-25px app-sidebar-logo-default"
                style={{ color: "white" }}
              />
            </span>
          )}
          <div
            className="menu-title"
            style={{
              color: "#fff",
              whiteSpace: "nowrap", // Prevent the title from breaking into multiple lines
              overflow: "hidden", // Hide overflowing content
              textOverflow: "ellipsis", // Add ellipsis for overflowed content
              marginLeft: "16px", // Add spacing between icon and title
              opacity: 1,
              fontSize: "14px",
              fontFamily: "Manrope",
              fontWeight: "600",
            }}
          >
            {title}
          </div>
          <span className="menu-arrow"></span>
        </span>
      </div>

      <div
        className={clsx("menu-sub menu-sub-dropdown py-3 px-3 ", {
          // "menu-active-bg": isActive,
        })}
        style={{zIndex:999}}
        data-kt-menu-dismiss="true"
      >
        {children}
      </div>
    </div>
  );
};

export { SidebarMenuItemWithSub };

{
  /* {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )} */
}
{
  //  {fontIcon && (
  //         <span className='menu-icon'>
  //           <i className={clsx('bi fs-3', fontIcon)}></i>
  //         </span>
  //       )}
}

{
  /* {hasArrow && <span className='menu-arrow'></span>} */
}
