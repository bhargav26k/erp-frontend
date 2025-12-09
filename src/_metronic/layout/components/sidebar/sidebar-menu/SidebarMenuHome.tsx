import { FC } from "react";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import {
  checkIsActive,
  toAbsoluteUrl,
  WithChildren,
} from "../../../../helpers";
import { useLayout } from "../../../core";

type Props = {
  to: string;
  icon?: string;
  hasBullet?: boolean;
  title: string;
};

const SidebarMenuHome: FC<Props & WithChildren> = ({
  children,
  to,
  icon,
  title,
}) => {
  const { config } = useLayout();
  const { pathname } = useLocation();
  const isActive = checkIsActive(pathname, to);
  const { app } = config;

  return (
    <div
      className={clsx("menu-item", { active: isActive })}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "auto", // Padding is not a valid property here; try margins or proper padding values.
        textAlign: "center",
        marginLeft:'5px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#2B5093  "; // Change background color on hover
        e.currentTarget.style.color = "#ff0000"; // Change text color on hover
        e.currentTarget.style.borderRadius = "10px";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent"; // Revert background color
        e.currentTarget.style.color = "#000000"; // Revert text color
        e.currentTarget.style.borderRadius = "0px";
      }}
    >
      <Link className="menu-link" to={to}>
        {icon && app?.sidebar?.default?.menu?.iconType === "svg" && (
          <span className="menu-icon">
            <img
              alt="Logo"
              src={toAbsoluteUrl(icon)}
              className="h-26px app-sidebar-logo-default"
              style={{width:'26px'}}
            />
          </span>
        )}
        <span
          className="menu-title"
          style={{
            color: "#fff",
            whiteSpace: "nowrap", // Prevent the title from breaking into multiple lines
            overflow: "hidden", // Hide overflowing content
            textOverflow: "ellipsis", // Add ellipsis for overflowed content
            marginLeft: "15px", // Add spacing between icon and title
            opacity: 1,
            fontSize: "14px",
            fontFamily: "Manrope",
            fontWeight: "600",
          }}
        >
          {title}
        </span>
      </Link>
      {children}
    </div>
  );
};

export { SidebarMenuHome };
