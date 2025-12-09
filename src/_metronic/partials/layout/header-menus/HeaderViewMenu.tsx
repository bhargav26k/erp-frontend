import React, { FC } from "react";

type HeaderViewMenuProps = {
  onToggle: (newOption: string) => void;
};

const HeaderViewMenu: FC<HeaderViewMenuProps> = ({ onToggle }) => {

  
  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold p-4 w-175px"
      data-kt-menu="true"
      style={{
        background: "#F3F3F3",
        // width: "130px",
        gap: "10px",
        padding: "8px 10px 8px 10px",
        boxShadow: "0px 2px 16.600000381469727px 0px #00000026",
        fontWeight: "300",
      }}
    >
      <div
        className={`menu-item`}
        onClick={() => onToggle("chart")}
        style={{ padding: "5px",fontFamily:"Manrope", }}
        onMouseOver={(e) => (
          (e.currentTarget.style.backgroundColor = "lightgray"),
          (e.currentTarget.style.cursor = "pointer"),
          (e.currentTarget.style.borderRadius = "5px")
        )}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#F3F3F3")}
      >
        Chart View
      </div>
      <div
        className={`menu-item`}
        onClick={() => onToggle("list")}
        style={{ padding: "5px",fontFamily:"Manrope", }}
        onMouseOver={(e) => (
          (e.currentTarget.style.backgroundColor = "lightgray"),
          (e.currentTarget.style.cursor = "pointer"),
          (e.currentTarget.style.borderRadius = "5px")
        )}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#F3F3F3")}
      >
        List View
      </div>
    </div>
  );
};

export { HeaderViewMenu };
