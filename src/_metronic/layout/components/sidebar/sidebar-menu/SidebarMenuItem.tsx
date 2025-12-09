import { FC } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import {
  checkIsActive,
  toAbsoluteUrl,
  WithChildren,
} from "../../../../helpers";
import { useLayout } from "../../../core";

type Props = {
  to: string;
  title: string;
};

const SidebarMenuItem: FC<Props & WithChildren> = ({ children, to, title }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;
  const { config } = useLayout();
  const { app } = config;

  return (
    <div className="menu-item">
      <Link
        className={clsx("menu-link")}
        to={to}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#e4e6ef"; // Change background color on hover
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
          style={{
            color: "#1F4061",
            whiteSpace: "nowrap", // Prevent the title from breaking into multiple lines
            overflow: "hidden", // Hide overflowing content
            textOverflow: "ellipsis", // Add ellipsis for overflowed content
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

export { SidebarMenuItem };
