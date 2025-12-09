import clsx from "clsx";
import { useEffect, useState } from "react";
import { useLayout } from "../../../core";
import { useNavigate } from "react-router-dom";
import "../../../../../app/pages/StaffPages/FinancialManagement/style.css";

const ToolbarStudent = ({ onViewChange, toolbarCall, DateText, clickCount }:any) => {


  

  const navigate = useNavigate();
  const { config, classes } = useLayout();
  // const [currentDate, setCurrentDate] = useState(new Date());


  const handleToolbarClick = (action: 'prev' | 'next') => {
    toolbarCall(action);
    clickCount((prevCount: number) => prevCount + 1);
  };
  clickCount(0);
  // const handlePrevClick = () => {
  //   toolbarCall('prev')
  // };

  // const handleNextClick = () => {
  //   toolbarCall('next');
  // };

  // calender

  
  if (!config.app?.toolbar?.display) {
    return null;
  }

  const handleClick = () => {
    navigate("#");
  };



  return (
    <div
      id="kt_app_toolbar"
      className={clsx("app-toolbar", config?.app?.toolbar?.class)}
      style={{
        height: "35px",
        // width:"1368px",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        gap: "160px",
        top: "88px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div
        id="kt_app_toolbar_container "
        className={clsx(
          "app-container",
          classes.toolbarContainer.join(" "),
          config.app?.toolbar?.containerClass,
          config.app?.toolbar?.minimize?.enabled ? "app-toolbar-minimize" : "true",

          {
            "container-fluid": config.app?.toolbar?.container === "fluid",
            "container-xxl": config.app?.toolbar?.container === "fixed",
            "d-flex": true,
            "justify-content-between": true,
            "align-items-start": true,
            "p-0": true,
            "m-0": true,
          }
        )}
        style={{
          height: "35px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            className="d-flex align-items-center justify-content-center my-auto"
            style={{ gap: "13px" }}
          >
            <div
              style={{
                display: "flex",
                height: "36px",
                padding: "8px 10px",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                borderRadius: "8px",
                border: " 1px solid #E1E1E1",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "Manrope",
                  fontWeight: "500",
                  color: "#252525",
                }}
              >
                Today
              </span>
            </div>
            <div
              style={{
                width: "165px",
                textAlign: "center",
                border: "1px solid #E1E1E1",
                borderRadius: "8px",
                height: "36px",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: "#000",
                  fontFamily: "Manrope",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
        {DateText}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                height: "36px",
                padding: "8px 10px",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                borderRadius: "8px",
                border: "1px solid #E1E1E1",
                cursor: "pointer",
              }}
              onClick={()=>handleToolbarClick('prev')}
            >
              <span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.75 11.0834L5.25 7.00002L8.75 2.91669"
                    stroke="#1C274C"
                    stroke-linecap="square"
                  />
                </svg>
              </span>
            </div>
            <div
              style={{
                display: "flex",
                height: "36px",
                padding: "8px 10px",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                borderRadius: "8px",
                border: "1px solid #E1E1E1",
                cursor: "pointer",
              }}
              onClick={()=>handleToolbarClick('next')}
            >
              <span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.25 2.91665L8.75 6.99998L5.25 11.0833"
                    stroke="#1C274C"
                    stroke-linecap="square"
                  />
                </svg>
              </span>
            </div>
            <div
              style={{
                display: "flex",
                height: "36px",
                padding: "8px 10px",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                borderRadius: "8px",
                border: " 1px solid #E1E1E1",
                cursor: "pointer",
              }}
              onClick={() => onViewChange('day')}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "Manrope",
                  fontWeight: "500",
                  color: "#252525",
                }}
              >
                Day
              </span>
            </div>
            <div
              style={{
                display: "flex",
                height: "36px",
                padding: "8px 10px",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                borderRadius: "8px",
                border: " 1px solid #E1E1E1",
                cursor: "pointer",
              }}
              onClick={() => onViewChange('week')}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "Manrope",
                  fontWeight: "500",
                  color: "#252525",
                }}
              >
                Week
              </span>
            </div>
            <div
              style={{
                display: "flex",
                height: "36px",
                padding: "8px 10px",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                borderRadius: "8px",
                border: " 1px solid #E1E1E1",
                cursor: "pointer",
              }}
              onClick={() => onViewChange('month')}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "Manrope",
                  fontWeight: "500",
                  color: "#252525",
                }}
              >
                Month
              </span>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center  gap-2 gap-lg-3">
          <div className="d-flex align-items-center flex-shrink-0">
            <div className="flex-shrink-0">
              <ul className="nav gap-3">
                <li className="nav-item rounded">
                  <a
                    className="btn me-1 d-flex justify-content-center align-items-center"
                    data-bs-toggle="tab"
                    href="#"
                    onClick={handleClick}
                    style={{
                      width: "36px",
                      height: "36px",
                      color: "#FFF",
                      backgroundColor: "#1F3259",
                      borderRadius: "8px",
                      padding: "8px 10px 8px 10px",
                      gap: "10px",
                      fontSize: "12px",
                      lineHeight: "16.39px",
                      fontWeight: "500",
                      fontFamily: "Manrope",
                    }}
                  >
                    All
                  </a>
                </li>
                <li className="nav-item rounded">
                  <a
                    className="btn me-1 d-flex justify-content-center align-items-center"
                    data-bs-toggle="tab"
                    href="#"
                    onClick={handleClick}
                    style={{
                      width: "64px",
                      height: "36px",
                      color: "#252525",
                      backgroundColor: "#F3F3F3",
                      borderRadius: "8px",
                      padding: "8px 10px 8px 10px",
                      gap: "10px",
                      fontSize: "12px",
                      lineHeight: "16.39px",
                      fontWeight: "500",
                      fontFamily: "Manrope",
                    }}
                  >
                    Classes
                  </a>
                </li>
                <li className="nav-item rounded">
                  <a
                    className="btn me-1 d-flex justify-content-center align-items-center"
                    data-bs-toggle="tab"
                    href="#"
                    onClick={handleClick}
                    style={{
                      width: "74px",
                      height: "36px",
                      color: "#000",
                      backgroundColor: "#F3F3F3",
                      borderRadius: "8px",
                      padding: "8px 10px 8px 10px",
                      gap: "10px",
                      fontSize: "12px",
                      lineHeight: "16.39px",
                      fontWeight: "500",
                      fontFamily: "Manrope",
                    }}
                  >
                    Activities
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ToolbarStudent };
