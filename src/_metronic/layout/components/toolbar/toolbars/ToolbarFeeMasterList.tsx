import clsx from "clsx";
import { useState } from "react";
import "../../../../../app/pages/StaffPages/FinancialManagement/style.css";
import { useLayout } from "../../../core";
import { Tooltip as ReactTooltip } from "react-tooltip";

const ToolbarFeeMasterList = () => {
  const { config, classes } = useLayout();
  if (!config.app?.toolbar?.display) {
    return null;
  }

  const [selectedClasses, setSelectedClasses] = useState([0]);
  const [selectedSections, setSelectedSections] = useState<string[]>(["All"]);

  //checkbox
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const handleCheckboxChangeSections = (event) => {
    const value = event.target.value;

    if (value === "All") {
      // If "All Classes" checkbox is selected, toggle its selection
      setSelectedSections((prevState) => {
        if (prevState.includes("All")) {
          // If "All" is already selected, deselect all sections
          return [];
        } else {
          // If "All" is not selected, select all sections
          return ["All", "A", "B", "C", "D", "E", "F", "G", "H"];
        }
      });
    } else {
      // If any other checkbox is selected
      setSelectedSections((prevState) => {
        if (prevState.includes("All")) {
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
  const isAllSelectedSection = selectedSections.includes("All");

  return (
    <div
      id="kt_app_toolbar"
      className={clsx(
        "app-toolbar",
        // classes.toolbar.join(" "),
        config?.app?.toolbar?.class
      )}
      style={{
        height: "30px",
        // border: "1px solid black",
        alignItems: "baseline",
        marginBottom: "20px",
      }}
    >
      <div
        id="kt_app_toolbar_container"
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
      >
        {/* {isPageTitleVisible && <PageTitleWrapper />} */}
        <div>
          {/* <div>
          <Link to={"/fee-details"}>
            <a href="#" className="d-flex my-auto">
              <KTIcon iconName="left" className="fs-1" />
              Go Back
            </a>
          </Link>
        </div> */}
          <div>
            <div className="d-flex align-items-center justify-content-center my-auto">
              <div className="me-3">
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
                      borderRadius: "12px",
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
                              !isAllSelectedClasses &&
                              selectedClasses.length > 1
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
                              paddingBottom: "2px",
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
                                paddingBottom: "2px",
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
              </div>
              {/* begin::Input group- */}
              {/* <div className="m-0 ">
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
              </div> */}
            </div>
          </div>
        </div>

        {/* hello  */}

        <div className="d-flex align-items-center gap-2 gap-lg-3">
          <span
            style={{
              outline: "none",
              border: "none",
              backgroundColor: "#F3F3F3",
              padding: "8px 10px 8px 10px",
              borderRadius: "8px",
              width: "51px",
            }}
            data-tooltip-id="my-tooltip-1"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 25H15C18.7712 25 20.6569 25 21.8284 23.7113C23 22.4225 23 20.3484 23 16.2V15.7192C23 13.7891 23 10.8241 22.654 9.96951C22.308 9.11492 21.6559 8.46935 20.3517 7.1782L18.3929 5.25901C17.2651 4.14243 16.7012 3.58414 16.0092 3.29207C15.3173 3 12.5548 3 11.0298 3C7.23869 3 5.34315 3 4.17157 4.28873C3 5.57746 3 7.65164 3 11.8V16.2C3 20.3484 3 22.4225 4.17157 23.7113C5.34315 25 7.22876 25 11 25Z"
                fill="#1C274C"
              />
              <path
                d="M18.3929 5.25901L17.8653 5.79201L17.8681 5.79473L18.3929 5.25901ZM20.3517 7.1782L20.8794 6.6452L20.8766 6.64248L20.3517 7.1782ZM22.654 9.96951L21.9588 10.251V10.251L22.654 9.96951ZM4.17157 23.7113L4.72653 23.2068H4.72653L4.17157 23.7113ZM21.8284 23.7113L21.2735 23.2068V23.2068L21.8284 23.7113ZM15 24.25H11V25.75H15V24.25ZM3.75 16.2V11.8H2.25V16.2H3.75ZM22.25 15.7192V16.2H23.75V15.7192H22.25ZM17.8681 5.79473L19.8268 7.71392L20.8766 6.64248L18.9178 4.7233L17.8681 5.79473ZM23.75 15.7192C23.75 14.7571 23.7501 13.5181 23.7062 12.4113C23.6842 11.8581 23.6508 11.3266 23.5992 10.8723C23.5501 10.4396 23.4773 10.0045 23.3492 9.68804L21.9588 10.251C22.0037 10.3618 22.0607 10.6178 22.1088 11.0417C22.1545 11.4441 22.1861 11.9347 22.2073 12.4708C22.2499 13.5426 22.25 14.7512 22.25 15.7192H23.75ZM19.8241 7.71119C21.171 9.04465 21.6839 9.57188 21.9588 10.251L23.3492 9.68804C22.9321 8.65797 22.1408 7.89405 20.8794 6.64521L19.8241 7.71119ZM11.0298 3.75C11.7947 3.75 12.8524 3.75009 13.8036 3.78598C14.2798 3.80394 14.718 3.8305 15.0732 3.86888C15.4571 3.91036 15.6578 3.95782 15.7176 3.98304L16.3009 2.60111C16.0147 2.48029 15.6106 2.41822 15.2343 2.37756C14.8293 2.33379 14.3518 2.30559 13.8602 2.28704C12.876 2.24991 11.7899 2.25 11.0298 2.25V3.75ZM18.9206 4.72602C17.8367 3.65297 17.1576 2.96274 16.3009 2.60111L15.7176 3.98304C16.2447 4.20554 16.6935 4.63189 17.8653 5.792L18.9206 4.72602ZM11 24.25C9.09112 24.25 7.74235 24.2481 6.72064 24.097C5.72841 23.9502 5.15365 23.6766 4.72653 23.2068L3.61662 24.2158C4.36107 25.0347 5.31491 25.4054 6.50119 25.5808C7.65799 25.7519 9.13764 25.75 11 25.75V24.25ZM2.25 16.2C2.25 18.2549 2.24868 19.8647 2.40199 21.119C2.55711 22.3881 2.88145 23.4071 3.61662 24.2158L4.72653 23.2068C4.29013 22.7267 4.02868 22.0642 3.89091 20.937C3.75132 19.795 3.75 18.2935 3.75 16.2H2.25ZM15 25.75C16.8624 25.75 18.342 25.7519 19.4988 25.5808C20.6851 25.4054 21.6389 25.0347 22.3834 24.2158L21.2735 23.2068C20.8464 23.6766 20.2716 23.9502 19.2794 24.097C18.2577 24.2481 16.9089 24.25 15 24.25V25.75ZM22.25 16.2C22.25 18.2935 22.2487 19.795 22.1091 20.937C21.9713 22.0642 21.7099 22.7267 21.2735 23.2068L22.3834 24.2158C23.1186 23.4071 23.4429 22.3881 23.598 21.119C23.7513 19.8647 23.75 18.2549 23.75 16.2H22.25ZM3.75 11.8C3.75 9.7065 3.75132 8.20504 3.89091 7.06299C4.02868 5.93577 4.29013 5.27328 4.72653 4.79323L3.61662 3.78423C2.88145 4.59291 2.55711 5.61188 2.40199 6.88101C2.24868 8.13533 2.25 9.74514 2.25 11.8H3.75ZM11.0298 2.25C9.15742 2.25 7.6706 2.2481 6.50912 2.41909C5.31874 2.59434 4.36168 2.96466 3.61662 3.78423L4.72653 4.79323C5.15304 4.32407 5.72954 4.05003 6.7276 3.90309C7.75456 3.7519 9.11106 3.75 11.0298 3.75V2.25Z"
                fill="#1C274C"
              />
              <path
                d="M15 3.66667V1L25 9H20.5556C17.9366 9 16.6272 9 15.8136 8.21895C15 7.4379 15 6.18082 15 3.66667Z"
                fill="#8694C4"
              />
              <path
                d="M15 1L15.4685 0.414348C15.2434 0.234246 14.935 0.199133 14.6751 0.324023C14.4153 0.448913 14.25 0.711696 14.25 1L15 1ZM25 9V9.75C25.3185 9.75 25.6023 9.54882 25.7077 9.24825C25.8132 8.94769 25.7172 8.61332 25.4685 8.41435L25 9ZM15.8136 8.21895L15.2942 8.75999H15.2942L15.8136 8.21895ZM14.25 1V3.66667H15.75V1H14.25ZM20.5556 9.75H25V8.25H20.5556V9.75ZM14.25 3.66667C14.25 4.90168 14.2483 5.9065 14.3589 6.69675C14.4731 7.51182 14.7195 8.2083 15.2942 8.75999L16.333 7.67791C16.0941 7.44856 15.9337 7.12597 15.8445 6.4887C15.7517 5.82661 15.75 4.94581 15.75 3.66667H14.25ZM20.5556 8.25C19.2257 8.25 18.3008 8.24853 17.6036 8.15854C16.9249 8.07094 16.5762 7.91139 16.333 7.67791L15.2942 8.75999C15.8646 9.30756 16.5774 9.53854 17.4116 9.6462C18.2272 9.75147 19.2665 9.75 20.5556 9.75V8.25ZM14.5315 1.58565L24.5315 9.58565L25.4685 8.41435L15.4685 0.414348L14.5315 1.58565Z"
                fill="#F3F3F3"
              />
              <path
                d="M4.7 22V14.8H7.61C7.68 14.8 7.76667 14.8033 7.87 14.81C7.97333 14.8133 8.07167 14.8233 8.165 14.84C8.565 14.9033 8.89833 15.04 9.165 15.25C9.435 15.46 9.63667 15.725 9.77 16.045C9.90333 16.365 9.97 16.7183 9.97 17.105C9.97 17.495 9.90333 17.85 9.77 18.17C9.63667 18.49 9.435 18.755 9.165 18.965C8.89833 19.175 8.565 19.3117 8.165 19.375C8.07167 19.3883 7.97167 19.3983 7.865 19.405C7.76167 19.4117 7.67667 19.415 7.61 19.415H5.745V22H4.7ZM5.745 18.425H7.57C7.63667 18.425 7.71 18.4217 7.79 18.415C7.87333 18.4083 7.95167 18.3967 8.025 18.38C8.23833 18.33 8.41 18.2383 8.54 18.105C8.67 17.9683 8.76333 17.8117 8.82 17.635C8.87667 17.4583 8.905 17.2817 8.905 17.105C8.905 16.9283 8.87667 16.7533 8.82 16.58C8.76333 16.4033 8.67 16.2483 8.54 16.115C8.41 15.9783 8.23833 15.885 8.025 15.835C7.95167 15.815 7.87333 15.8017 7.79 15.795C7.71 15.7883 7.63667 15.785 7.57 15.785H5.745V18.425ZM10.9695 22V14.8H13.2245C13.2912 14.8 13.4145 14.8017 13.5945 14.805C13.7779 14.8083 13.9529 14.8217 14.1195 14.845C14.6829 14.915 15.1562 15.1167 15.5395 15.45C15.9262 15.7833 16.2179 16.2067 16.4145 16.72C16.6112 17.23 16.7095 17.79 16.7095 18.4C16.7095 19.0133 16.6112 19.5767 16.4145 20.09C16.2179 20.6 15.9262 21.0217 15.5395 21.355C15.1562 21.685 14.6829 21.885 14.1195 21.955C13.9529 21.9783 13.7779 21.9917 13.5945 21.995C13.4145 21.9983 13.2912 22 13.2245 22H10.9695ZM12.0395 21.005H13.2245C13.3379 21.005 13.4729 21.0017 13.6295 20.995C13.7862 20.9883 13.9245 20.975 14.0445 20.955C14.4112 20.885 14.7079 20.7267 14.9345 20.48C15.1645 20.23 15.3329 19.9233 15.4395 19.56C15.5462 19.1967 15.5995 18.81 15.5995 18.4C15.5995 17.9767 15.5445 17.585 15.4345 17.225C15.3245 16.8617 15.1545 16.5583 14.9245 16.315C14.6979 16.0683 14.4045 15.9117 14.0445 15.845C13.9245 15.8217 13.7845 15.8083 13.6245 15.805C13.4679 15.7983 13.3345 15.795 13.2245 15.795H12.0395V21.005ZM17.8738 22V14.8H22.1388V15.845H18.9188V17.875H21.5388V18.925H18.9188V22H17.8738Z"
                fill="white"
              />
            </svg>
          </span>
          <ReactTooltip
            id="my-tooltip-1"
            place="top-end"
            content="Download PDF"
            style={{
              zIndex: 999,
              borderRadius: "10px",
              color: "#212121",
              fontWeight: "600",
              fontFamily: "Manrope",
              fontSize: "12px",
              boxShadow: "0px 2px 16.6px 0px rgba(0, 0, 0, 0.15)",
            }}
            className="no-arrow bg-white text-black custom-tooltip-style"
            border={0} // Set border width to 0 to remove the arrow
            arrowColor={"transparent"}
            opacity={"no"}
          />
          {/* <div className="bullet bg-secondary h-35px w-1px mx-1"></div> */}

          <span
            style={{
              outline: "none",
              border: "none",
              backgroundColor: "#F3F3F3",
              padding: "8px 10px 8px 10px",
              borderRadius: "8px",
              width: "51px",
            }}
            data-tooltip-id="my-tooltip-2"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.7322 3.25901L15.2305 3.81648L15.7322 3.25901ZM20.0869 7.1782L19.5852 7.73567L20.0869 7.1782ZM22.6194 9.96951L21.9343 10.2746V10.2746L22.6194 9.96951ZM2.28873 21.7113L2.81906 21.1809H2.81906L2.28873 21.7113ZM21.7113 21.7113L21.1809 21.1809L21.1809 21.1809L21.7113 21.7113ZM14.2 22.25H9.8V23.75H14.2V22.25ZM1.75 14.2V9.8H0.25V14.2H1.75ZM22.25 13.7192V14.2H23.75V13.7192H22.25ZM15.2305 3.81648L19.5852 7.73567L20.5886 6.62073L16.234 2.70154L15.2305 3.81648ZM23.75 13.7192C23.75 11.8554 23.7651 10.6986 23.3045 9.66438L21.9343 10.2746C22.2349 10.9496 22.25 11.7229 22.25 13.7192H23.75ZM19.5852 7.73567C21.069 9.07113 21.6337 9.59971 21.9343 10.2746L23.3045 9.66438C22.8439 8.63013 21.974 7.86756 20.5886 6.62073L19.5852 7.73567ZM9.83277 1.75C11.5671 1.75 12.2402 1.76158 12.8414 1.99229L13.3788 0.591855C12.4578 0.238421 11.4535 0.25 9.83277 0.25V1.75ZM16.234 2.70154C15.0352 1.62264 14.2998 0.945248 13.3788 0.591855L12.8414 1.99229C13.4428 2.22303 13.948 2.66222 15.2305 3.81648L16.234 2.70154ZM9.8 22.25C7.70462 22.25 6.20853 22.2484 5.07194 22.0956C3.95693 21.9457 3.30085 21.6627 2.81906 21.1809L1.7584 22.2416C2.56534 23.0485 3.59072 23.4099 4.87207 23.5822C6.13184 23.7516 7.74702 23.75 9.8 23.75V22.25ZM0.25 14.2C0.25 16.253 0.248407 17.8682 0.417779 19.1279C0.590052 20.4093 0.951458 21.4347 1.7584 22.2416L2.81906 21.1809C2.33727 20.6992 2.05431 20.0431 1.9044 18.9281C1.75159 17.7915 1.75 16.2954 1.75 14.2H0.25ZM14.2 23.75C16.253 23.75 17.8682 23.7516 19.1279 23.5822C20.4093 23.4099 21.4347 23.0485 22.2416 22.2416L21.1809 21.1809C20.6992 21.6627 20.0431 21.9457 18.9281 22.0956C17.7915 22.2484 16.2954 22.25 14.2 22.25V23.75ZM22.25 14.2C22.25 16.2954 22.2484 17.7915 22.0956 18.9281C21.9457 20.0431 21.6627 20.6992 21.1809 21.1809L22.2416 22.2416C23.0485 21.4347 23.4099 20.4093 23.5822 19.1279C23.7516 17.8682 23.75 16.253 23.75 14.2H22.25ZM1.75 9.8C1.75 7.70462 1.75159 6.20853 1.9044 5.07194C2.05431 3.95692 2.33727 3.30085 2.81906 2.81906L1.7584 1.7584C0.951458 2.56534 0.590052 3.59072 0.417779 4.87207C0.248407 6.13184 0.25 7.74702 0.25 9.8H1.75ZM9.83277 0.25C7.7688 0.25 6.14567 0.248421 4.88071 0.417719C3.59473 0.58983 2.56593 0.950874 1.7584 1.7584L2.81906 2.81906C3.30026 2.33786 3.95838 2.05454 5.07969 1.90446C6.222 1.75158 7.72654 1.75 9.83277 1.75V0.25Z"
                fill="#1C274C"
              />
              <path
                d="M13 1V4C13 6.82843 13 8.24264 13.8136 9.12132C14.6272 10 15.9366 10 18.5556 10H23"
                stroke="#1C274C"
                stroke-width="1.5"
              />
              <path
                d="M3.1 20L5.575 16.355L3.165 12.8H4.25L6.115 15.605L7.975 12.8H9.065L6.655 16.355L9.125 20H8.04L6.115 17.11L4.19 20H3.1ZM10.0207 20V12.8H10.9107V19.155H14.2507V20H10.0207ZM17.6515 20.15C17.1415 20.15 16.6815 20.0633 16.2715 19.89C15.8648 19.7167 15.5282 19.47 15.2615 19.15C14.9982 18.8267 14.8265 18.445 14.7465 18.005L15.6665 17.86C15.7832 18.3133 16.0248 18.6683 16.3915 18.925C16.7615 19.1783 17.1965 19.305 17.6965 19.305C18.0198 19.305 18.3115 19.255 18.5715 19.155C18.8348 19.0517 19.0432 18.905 19.1965 18.715C19.3498 18.525 19.4265 18.3 19.4265 18.04C19.4265 17.88 19.3982 17.7433 19.3415 17.63C19.2882 17.5133 19.2132 17.415 19.1165 17.335C19.0232 17.2517 18.9165 17.1817 18.7965 17.125C18.6765 17.0683 18.5515 17.0217 18.4215 16.985L16.5865 16.44C16.3865 16.38 16.1932 16.305 16.0065 16.215C15.8198 16.1217 15.6532 16.0067 15.5065 15.87C15.3598 15.73 15.2432 15.5633 15.1565 15.37C15.0698 15.1733 15.0265 14.9417 15.0265 14.675C15.0265 14.2483 15.1365 13.885 15.3565 13.585C15.5798 13.2817 15.8815 13.05 16.2615 12.89C16.6415 12.73 17.0698 12.6517 17.5465 12.655C18.0298 12.6583 18.4615 12.745 18.8415 12.915C19.2248 13.0817 19.5415 13.3217 19.7915 13.635C20.0448 13.9483 20.2148 14.3233 20.3015 14.76L19.3565 14.925C19.3065 14.6317 19.1948 14.38 19.0215 14.17C18.8515 13.9567 18.6382 13.7933 18.3815 13.68C18.1248 13.5633 17.8432 13.5033 17.5365 13.5C17.2432 13.4967 16.9782 13.5433 16.7415 13.64C16.5048 13.7367 16.3165 13.8717 16.1765 14.045C16.0365 14.215 15.9665 14.4117 15.9665 14.635C15.9665 14.855 16.0298 15.0333 16.1565 15.17C16.2832 15.3033 16.4382 15.41 16.6215 15.49C16.8082 15.5667 16.9898 15.63 17.1665 15.68L18.5365 16.075C18.6932 16.1183 18.8732 16.1783 19.0765 16.255C19.2832 16.3317 19.4832 16.44 19.6765 16.58C19.8698 16.7167 20.0298 16.9 20.1565 17.13C20.2832 17.3567 20.3465 17.6433 20.3465 17.99C20.3465 18.3367 20.2765 18.645 20.1365 18.915C19.9998 19.185 19.8082 19.4117 19.5615 19.595C19.3148 19.775 19.0282 19.9117 18.7015 20.005C18.3748 20.1017 18.0248 20.15 17.6515 20.15Z"
                fill="#1C274C"
              />
            </svg>
          </span>
          <ReactTooltip
            id="my-tooltip-2"
            place="top-start"
            content="Download Excel"
            style={{
              zIndex: 999,
              borderRadius: "10px",
              color: "#212121",
              fontWeight: "600",
              fontFamily: "Manrope",
              fontSize: "12px",
              boxShadow: "0px 2px 16.6px 0px rgba(0, 0, 0, 0.15)",
            }}
            className="no-arrow bg-white text-black custom-tooltip-style"
            border={0} // Set border width to 0 to remove the arrow
            arrowColor={"transparent"}
            opacity={"no"}
          />
        </div>
      </div>
    </div>
  );
};

export { ToolbarFeeMasterList };

{
  /* {config.app?.toolbar?.primaryButton && (
            <a
              href="#"
              onClick={handlePrimaryButtonClick}
              className="btn btn-sm fw-bold btn-primary"
            >
              <KTIcon iconName="file" className="fs-1 ms-2 me-0" />
              Add Fee Master
            </a>
          )}
          <CreateAppModal
            show={showCreateAppModal}
            handleClose={handleModalClose}
            selectDate={handleDateChange}
          /> */
}
