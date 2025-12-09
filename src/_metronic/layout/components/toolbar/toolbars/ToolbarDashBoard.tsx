import clsx from "clsx";
import { useEffect, useState } from "react";
import { useLayout } from "../../../core";
import { useNavigate } from "react-router-dom";
import HeaderCalendar from "../../../../partials/layout/header-menus/HeaderCalendar";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import "../../../../../app/pages/StaffPages/FinancialManagement/style.css";

const ToolbarDashBoard = () => {
  const [selectedRange, setSelectedRange] = useState([
    {
      startDate: startOfDay(subDays(new Date(), 1)),
      endDate: endOfDay(new Date()),
      key: "selection",
    },
  ]);
  const [selectedClasses, setSelectedClasses] = useState([0]);
  const [selectedSections, setSelectedSections] = useState<string[]>(['All']);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const navigate = useNavigate();
  const { config, classes } = useLayout();

  //checkbox
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
  const handleCheckboxChangeSections = (event) => {
    const value = event.target.value;

    if (value === 'All') {
      // If "All Classes" checkbox is selected, toggle its selection
      setSelectedSections((prevState) => {
        if (prevState.includes('All')) {
          // If "All" is already selected, deselect all sections
          return [];
        } else {
          // If "All" is not selected, select all sections
          return ['All','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        }
      });
    } else {
      // If any other checkbox is selected
      setSelectedSections((prevState) => {
        if (prevState.includes('All')) {
          // If "All" is selected, deselect it and select only the current section
          return prevState.filter((classValue) => classValue !== "All");
        } else {
          // Toggle selection of the clicked checkbox
          if (prevState.includes(value)) {
            // If the section is already selected, deselect it
            return prevState.filter((sectionValue) => sectionValue !== value);
          } else {
            // If the section is not selected, select it
            return [...prevState, value];
          }
        }
      });
    }
  };
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
  const handleCheckboxChangeClasses = (event) => {
    const value = parseInt(event.target.value);

    if (value === 0) {
      // If "All Classes" checkbox is selected, toggle its selection
      setSelectedClasses((prevState) => {
        if (prevState.includes(0)) {
          // If "All Classes" is already selected, deselect all classes
          return [];
        } else {
          // If "All Classes" is not selected, select all classes
          return [0, 1, 2, 3, 4, 5, 6, 7, 8];
        }
      });
    } else {
      // If any other checkbox is selected
      setSelectedClasses((prevState) => {
        if (prevState.includes(0)) {
          // If "All Classes" is selected, deselect it
          return prevState.filter((classValue) => classValue !== 0);
        } else {
          // Toggle selection of the clicked checkbox
          if (prevState.includes(value)) {
            return prevState.filter((classValue) => classValue !== value);
          } else {
            return [...prevState, value];
          }
        }
      });
    }
  };

  const isAllSelectedClasses = selectedClasses.includes(0);
  const isAllSelectedSection = selectedSections.includes('All');

  // calender

  useEffect(() => {
    // console.log(selectedRange);
  }, [selectedRange]);

  if (!config.app?.toolbar?.display) {
    return null;
  }

  const handleClick = () => {
    navigate("#");
  };

  const handleRangeUpdate = (range: any) => {
    // Update the selected range in the main component
    setSelectedRange([range]);
  };

  const handleCalendarToggle = () => {
    setIsCalendarOpen(!isCalendarOpen);
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
          config.app?.toolbar?.minimize?.enabled ? "app-toolbar-minimize" : "",

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
          <div className="d-flex align-items-center justify-content-center my-auto">
            <div className="me-3 ">
              <div className="dropdown">
                <button
                  className="dropdown-toggle  px-2"
                  style={{
                    width: "124px",
                    height: "36px",
                    backgroundColor: "#F3F3F3",
                    padding: "8px 10px 8px 10px",
                    fontFamily: "Manrope",
                    outline: "none",
                    border: "none",
                    fontSize: "12px",
                    fontWeight: 500,
                    borderRadius: "8px",
                  }}
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Select Classes
                </button>
                <ul
                  className="dropdown-menu"
                  style={{
                    width: "113px",
                    height: "296px",
                    textAlign: "left",
                    padding: "13px 0px 13px 40px",
                    marginTop: "6px",
                    // gap:'16px',
                    borderRadius:'12px',
                    alignItems: "flex-start",
                  }}
                  aria-labelledby="dropdownMenuButton"
                >
                  <div
                    style={{
                      display: "flex",
                      width: "113px",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <li>
                      <div
                        className="form-check"
                        style={{
                          display: "flex",
                          width: "102px",
                          height: "12px",
                          alignItems: "center",
                          gap: "5px",
                          // paddingLeft: "29px",
                          padding: "0px",
                        }}
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={isAllSelectedClasses}
                          onChange={handleCheckboxChangeClasses}
                          disabled={
                            !isAllSelectedClasses && selectedClasses.length > 1
                          }
                          value="0"
                          id="class-0"
                          style={{
                            height: "16px",
                            borderRadius: "5px",
                            width: "16px",
                            outline: "black",
                          }}
                        />
                        <label
                          className="form-check-label"
                          style={{
                            fontSize: "14px",
                            fontWeight: "400",
                            fontFamily: "Manrope",
                            color: "#000",
                            paddingBottom:'2px'
                          }}
                          htmlFor="class-0"
                        >
                          All Classes
                        </label>
                      </div>
                    </li>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((classValue) => (
                      <li key={classValue}>
                        <div
                          className="form-check"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            // paddingLeft: "29px",
                            width: "102px",
                            height: "12px",
                            padding: "0px",
                          }}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedClasses.includes(classValue)}
                            value={classValue}
                            id={`class-${classValue}`}
                            onChange={handleCheckboxChangeClasses}
                            disabled={isAllSelectedClasses}
                            style={{
                              height: "16px",
                              borderRadius: "5px",
                              width: "16px",
                              outline: "black",
                            }}
                          />
                          <label
                            className="form-check-label"
                            style={{
                              fontSize: "14px",
                              fontWeight: "400",
                              fontFamily: "Manrope",
                              color: "#000",
                              // border:'1px solid',
                              paddingBottom:'2px'
                            }}
                            htmlFor={`class-${classValue}`}
                          >
                            Class {classValue}
                          </label>
                        </div>
                      </li>
                    ))}
                  </div>
                </ul>
              </div>

              {/* end::Select */} 
            </div>
            <div className="m-0 ">
             
              <div className="dropdown">
                <button
                  className="dropdown-toggle px-2"
                  style={{
                    width: "124px",
                    height: "36px",
                    backgroundColor: "#F3F3F3",
                    padding: "8px 10px 8px 10px",
                    fontFamily: "Manrope",
                    outline: "none",
                    border: "none",
                    fontSize: "12px",
                    fontWeight: 500,
                    borderRadius: "8px",
                  }}
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Select Sections
                </button>
                <ul
                  className="dropdown-menu border"
                  style={{
                    width: "113px",
                    height: "296px",
                    textAlign: "left",
                    padding: "13px 0px 13px 40px",
                    marginTop: "6px",
                    borderRadius:'12px',
                    alignItems: "flex-start",
                  }}
                  aria-labelledby="dropdownMenuButton"
                >
                    <div
                    style={{
                      display: "flex",
                      width: "113px",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                  <li>
                    <div
                      className="form-check"
                      style={{
                        display: "flex",
                        width: "102px",
                        height: "12px",
                        alignItems: "center",
                        gap: "5px",
                        // paddingLeft: "10px",
                        padding: "0px",
                      }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={isAllSelectedSection}
                        onChange={handleCheckboxChangeSections}
                        disabled={
                          !isAllSelectedSection && selectedSections.length > 1
                        }
                        value="All"
                        id="class-All"
                        style={{
                          height: "16px",
                          borderRadius: "5px",
                          width: "16px",
                          outline: "black",
                        }}
                      />
                      <label
                        className="form-check-label"
                        style={{
                          fontSize: "14px",
                          fontWeight: "400",
                          fontFamily: "Manrope",
                          color: "#000",
                          paddingBottom:'2px'
                        }}
                        htmlFor="class-All"
                      >
                        All Sections
                      </label>
                    </div>
                  </li>
                  {["A", 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((sectionValue) => (
                  <li key={sectionValue}>
                    <div
                      className="form-check"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        width: "102px",
                        height: "12px",
                        padding: "0px",
                      }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedSections.includes(sectionValue)}
                        value={sectionValue}
                        id={`section-${sectionValue}`}
                        onChange={handleCheckboxChangeSections}
                        disabled={isAllSelectedSection}
                        style={{
                          height: "16px",
                          borderRadius: "5px",
                          width: "16px",
                          outline: "black",
                        }}
                      />
                      <label
                        className="form-check-label"
                        style={{
                          fontSize: "14px",
                          fontWeight: "400",
                          fontFamily: "Manrope",
                          color: "#000",
                          paddingBottom:'2px'
                        }}
                        htmlFor={`class-${sectionValue}`}
                      >
                        Section {sectionValue}
                      </label>
                    </div>
                  </li>
                  ))}
                  </div>
                </ul>
              </div>
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
                      width: "40px",
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
                    3M
                  </a>
                </li>
                <li className="nav-item rounded">
                  <a
                    className="btn me-1 d-flex justify-content-center align-items-center"
                    data-bs-toggle="tab"
                    href="#"
                    onClick={handleClick}
                    style={{
                      width: "40px",
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
                    6M
                  </a>
                </li>
                <li className="nav-item rounded">
                  <a
                    className="btn me-1 d-flex justify-content-center align-items-center"
                    data-bs-toggle="tab"
                    href="#"
                    onClick={handleClick}
                    style={{
                      width: "105px",
                      height: "36px",
                      color: "#FFFFFF",
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
                    Acadmic Year
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            data-kt-menu-trigger="{default: 'click'}"
            data-kt-menu-attach="parent"
            data-kt-menu-placement="bottom-end"
            className="btn d-flex justify-content-center align-items-center gap-2"
            style={{
              width: "216px",
              height: "36px",
              backgroundColor: "#F3F3F3",
              padding: "8px 10px 8px 10px",
              borderRadius: "8px",
              fontWeight: "500",
              fontSize: "12px",
              lineHeight: "16.39px",
              color: "#252525",
              fontFamily: "Manrope",
            }}
          >
            <div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.66675 9.99998C1.66675 6.85728 1.66675 5.28593 2.64306 4.30962C3.61937 3.33331 5.19072 3.33331 8.33341 3.33331H11.6667C14.8094 3.33331 16.3808 3.33331 17.3571 4.30962C18.3334 5.28593 18.3334 6.85728 18.3334 9.99998V11.6666C18.3334 14.8093 18.3334 16.3807 17.3571 17.357C16.3808 18.3333 14.8094 18.3333 11.6667 18.3333H8.33341C5.19072 18.3333 3.61937 18.3333 2.64306 17.357C1.66675 16.3807 1.66675 14.8093 1.66675 11.6666V9.99998Z"
                  stroke="#1C274C"
                  stroke-width="1.5"
                />
                <path
                  d="M5.83325 3.33331V2.08331"
                  stroke="#1C274C"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M14.1667 3.33331V2.08331"
                  stroke="#1C274C"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M2.08325 7.5H17.9166"
                  stroke="#1C274C"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M14.9999 14.1667C14.9999 14.6269 14.6268 15 14.1666 15C13.7063 15 13.3333 14.6269 13.3333 14.1667C13.3333 13.7064 13.7063 13.3333 14.1666 13.3333C14.6268 13.3333 14.9999 13.7064 14.9999 14.1667Z"
                  fill="#1C274C"
                />
                <path
                  d="M14.9999 10.8333C14.9999 11.2936 14.6268 11.6667 14.1666 11.6667C13.7063 11.6667 13.3333 11.2936 13.3333 10.8333C13.3333 10.3731 13.7063 10 14.1666 10C14.6268 10 14.9999 10.3731 14.9999 10.8333Z"
                  fill="#1C274C"
                />
                <path
                  d="M10.8334 14.1667C10.8334 14.6269 10.4603 15 10.0001 15C9.53984 15 9.16675 14.6269 9.16675 14.1667C9.16675 13.7064 9.53984 13.3333 10.0001 13.3333C10.4603 13.3333 10.8334 13.7064 10.8334 14.1667Z"
                  fill="#1C274C"
                />
                <path
                  d="M10.8334 10.8333C10.8334 11.2936 10.4603 11.6667 10.0001 11.6667C9.53984 11.6667 9.16675 11.2936 9.16675 10.8333C9.16675 10.3731 9.53984 10 10.0001 10C10.4603 10 10.8334 10.3731 10.8334 10.8333Z"
                  fill="#1C274C"
                />
                <path
                  d="M6.66667 14.1667C6.66667 14.6269 6.29357 15 5.83333 15C5.3731 15 5 14.6269 5 14.1667C5 13.7064 5.3731 13.3333 5.83333 13.3333C6.29357 13.3333 6.66667 13.7064 6.66667 14.1667Z"
                  fill="#1C274C"
                />
                <path
                  d="M6.66667 10.8333C6.66667 11.2936 6.29357 11.6667 5.83333 11.6667C5.3731 11.6667 5 11.2936 5 10.8333C5 10.3731 5.3731 10 5.83333 10C6.29357 10 6.66667 10.3731 6.66667 10.8333Z"
                  fill="#1C274C"
                />
              </svg>
            </div>
            <div>
              {selectedRange.length > 0 && (
                <div>
                  {`${format(
                    selectedRange[0].startDate,
                    "dd MMM yyyy"
                  )} - ${format(selectedRange[0].endDate, "dd MMM yyyy")}`}
                </div>
              )}
            </div>
            <HeaderCalendar
              onUpdateRange={handleRangeUpdate}
              onToggle={handleCalendarToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { ToolbarDashBoard };
