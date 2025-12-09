import { FC, useEffect } from "react";
// import { KTIcon } from "../../../helpers";
import { useAuth } from "../../../../app/modules/auth";
// import { CreateStudentHomeWorkModal } from "../../modals/create-app-stepper/CreateStudentHomeWorkModal";

const TablesWidget19: FC = () => {
  const { currentUser } = useAuth();
  // const [tableData, setTableData] = useState([]);
  // const [showCreateAppModal, setShowCreateAppModal] = useState(false);
  // console.log(currentUser);

  // function lowercaseExceptFirst(inputString: string | undefined) {
  //     if (typeof inputString !== "string" || inputString.length === 0) {
  //     return inputString;
  //     }
  //     return (
  //     inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase()
  //     );
  // }
  // const formattedFirstName = lowercaseExceptFirst(currentUser?.firstname);

  // const handleModalClose = () => {
  //     setShowCreateAppModal(false);
  // };
  // const handlePrimaryButtonClick = () => {
  //     setShowCreateAppModal(true);
  //     console.log("clicked");
  // };

  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        // const class_id = currentUser?.class_id; // Make sure to replace this with the actual payload values
        // const section_id = currentUser?.section_id; // Make sure to replace this with the actual payload values
        // const student_id = currentUser?.student_id; // Make sure to replace this with the actual payload values
        const response = await fetch(
          "https://erp.innoveraschool.com/site/get_homeworklist",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Add any other necessary headers
            },
            body: JSON.stringify({
              class_id: "1",
              section_id: "1",
              student_id: "930",
              start_date: "",
              end_date: "",
            }),
          }
        );

        const data = await response.json();

        // setTableData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, [currentUser]);

  return (
    <div
      className="col-xxl-12 col-xl-12 col-lg-12 col-md-12"
      style={{
        borderRadius: "16px",
        border: "1px solid #F5F5F5",
        overflowX: "auto",
        maxHeight: "100%",
        height: "696px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Manrope",
      }}
    >
      <div style={{ overflow: "auto", width: "100%", height: "100%" }}>
        <table
          className="col-xxl-12 col-xl-12 col-lg-12 col-md-12"
          style={{
            top: "223px",
            height: "612px",
            maxHeight: "100%",
            borderCollapse: "collapse",
            // tableLayout: "fixed",
            overflowX: "auto",
            whiteSpace: "nowrap",
          }}
        >
          <thead
            className="col-xxl-12"
            style={{
              height: "123px",
              maxHeight: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#F5F5F5",
              // overflowY: "auto",
              // overflowX: "hidden",
              justifyContent: "space-between",
              zIndex: 999,
            }}
          >
            <div>
              <caption
                style={{
                  backgroundColor: "#F5F5F5",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // tableLayout: "fixed",
                  // borderCollapse: "collapse",

                  // border:'1px solid'
                  width: "100%",
                }}
                className="col-xxl-12 col-lg-6"
              >
                <div
                  style={{
                    width: "210px",
                    height: "36px",
                    border: "1px solid #DADADA",
                    borderRadius: "42px",
                    padding: "7px 9px 8px 10px",
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <div
                    className="form-check"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                    }}
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="exampleRadios"
                      id="exampleRadios1"
                      style={{ width: "15px", height: "15px" }}
                      value="Cumulative"
                      defaultChecked
                      // checked={selectedValue === "Cumulative"}
                      // onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="exampleRadios1"
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#252525",
                        fontFamily: "Manrope",
                      }}
                    >
                      All
                    </label>
                  </div>
                  <div
                    className="form-check"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                    }}
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="exampleRadios"
                      id="exampleRadios2"
                      value="MOM"
                      style={{ width: "15px", height: "15px" }}
                      // checked={selectedValue === "MOM"}
                      // onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="exampleRadios2"
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#252525",
                        fontFamily: "Manrope",
                      }}
                    >
                      Todo
                    </label>
                  </div>
                  <div
                    className="form-check"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                    }}
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="exampleRadios"
                      id="exampleRadios2"
                      value="MOM"
                      style={{ width: "15px", height: "15px" }}
                      // checked={selectedValue === "MOM"}
                      // onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="exampleRadios2"
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#252525",
                        fontFamily: "Manrope",
                      }}
                    >
                      Completed
                    </label>
                  </div>
                </div>
              </caption>
            </div>
            <tr
              style={{
                height: "61px",
                display: "flex",
                gap: "36px",
                paddingTop: "10px",
                paddingLeft: "38px",
                width: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                backgroundColor: "#F5F5F5",
                // zIndex: 100,
                // border:'1px solid'
              }}
            >
              <th style={{ width: "8%" }}>
                <div
                  style={{
                    width: "100%",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      lineHeight: "18px",
                      color: "#000",
                      fontFamily: "Manrope",
                    }}
                  >
                    Subject
                  </span>
                </div>
              </th>
              <th style={{ width: "30%" }}>
                <div
                  style={{
                    width: "100%",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#000",
                    }}
                  >
                    Assignment
                  </span>
                </div>
              </th>
              <th style={{ width: "12%" }}>
                <div
                  style={{
                    width: "100%",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#000",
                    }}
                  >
                    Teacher
                  </span>
                </div>
              </th>
              <th style={{ width: "15%" }}>
                <div
                  style={{
                    width: "100%",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#000",
                    }}
                  >
                    Due Date
                  </span>
                </div>
              </th>
              <th style={{ width: "12%" }}>
                <div
                  style={{
                    width: "100%",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#000",
                    }}
                  >
                    Status
                  </span>
                </div>
              </th>
              <th style={{ width: "10%" }}>
                <div
                  style={{
                    width: "100%",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#000",
                    }}
                  >
                    Actions
                  </span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody
            className="col-xxl-12 h-[s]"
            style={{
              // height: "100%",
              maxHeight: "100%",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              overflowX: "hidden",
              width: "100%",
            }}
          >
            <tr
              style={{
                display: "flex",
                height: "89px",
                gap: "36px",
                padding: "16px 38px",
                alignItems: "center",
                width: "100%",
                backgroundColor: "#FFF",
                //
              }}
            >
              <td
                style={{
                  width: "8%",
                  paddingLeft: "18px",
                  paddingRight: "18px",
                }}
              >
                <div
                  style={{
                    width: "90px",
                    display: "flex",
                    justifyContent: "start",
                    // flexDirection: "column",
                    alignItems: "center",
                    gap: "5px",
                    // border:'1px solid'
                  }}
                >
                  <svg
                    width="10"
                    height="11"
                    viewBox="0 0 10 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="5" cy="5.5" r="5" fill="#1D6AFF" />
                  </svg>

                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#000000",
                      // border:'1px solid'
                    }}
                  >
                    Class 1
                  </span>
                </div>
              </td>
              <td
                style={{
                  width: "31%",
                  paddingLeft: "18px",
                  paddingRight: "18px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                    whiteSpace: "pre-wrap",
                    gap: "2px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        lineHeight: "18px",
                        color: "#1F1F1F",
                      }}
                    >
                      Some Header - Write down the moral of the story you think
                      the writer was trying to convey in the ballad of Ice and
                      Fire
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                      padding: "0px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#A3A3A3",
                        fontWeight: "500",
                      }}
                    >
                      {" "}
                      20/05/2022
                    </span>{" "}
                    <svg
                      width="3"
                      height="3"
                      viewBox="0 0 3 3"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="1.5" cy="1.5" r="1.5" fill="#D9D9D9" />
                    </svg>
                    <span
                      style={{
                        color: "rgba(237, 85, 120, 0.61)",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      Important
                    </span>
                  </div>
                </div>
              </td>
              <td
                style={{
                  width: "12%",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                  }}
                >
                  <span
                    data-tooltip-id="my-tooltip-1"
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Rekha Tendulkar
                  </span>
                </div>
              </td>
              {/* <ReactTooltip
                id="my-tooltip-1"
                place="bottom"
                content="Vineet Kumar Mishra"
                style={{
                  zIndex: 999,
                  backgroundColor: "#FFF",
                  boxShadow: "0px 0px 10px 4px #00000026",
                  color: "#000",
                  opacity: 1,
                }}
              /> */}

              <td
                style={{
                  width: "15%",
                  paddingLeft: "18px",
                  paddingRight: "18px",
                }}
              >
                <div
                  style={{
                    width: "115px",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      width: "70px",
                      height: "25px",
                      textAlign: "center",
                      borderRadius: "5px",
                      padding: "4px",
                      fontWeight: "400",
                      lineHeight: "18px",
                      color: "#000",
                    }}
                  >
                    31 Mar 2024
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      width: "70px",
                      height: "25px",
                      textAlign: "center",
                      borderRadius: "5px",
                      padding: "4px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#4BCD60",
                      backgroundColor: "#E7FFEA",
                    }}
                  >
                    12 Days
                  </span>
                </div>
              </td>

              <td
                style={{
                  width: "12%",
                  paddingLeft: "18px",
                  paddingRight: "18px",
                }}
              >
                <div
                  style={{
                    width: "fit-content",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#1F1F1F",
                      padding: "6px",
                      backgroundColor: "#D4D4D4",
                      borderRadius: "6px",
                    }}
                  >
                    Assigned
                  </span>
                </div>
              </td>

              <td
                style={{
                  width: "10%",
                  paddingLeft: "18px",
                  paddingRight: "18px",
                }}
              >
                <div
                  style={{
                    width: "118px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: "6px",
                    backgroundColor: "#1F3259",
                    borderRadius: "8px",
                    padding: "8px 10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#FFF",

                      display: "flex",
                      alignItems: "center",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Start
                  </span>
                </div>
              </td>
            </tr>
            <tr
              style={{
                display: "flex",
                height: "89px",
                gap: "36px",
                padding: "16px 38px",
                alignItems: "center",
                width: "100%",
                backgroundColor: "#FFF",
                //
              }}
            >
              <td
                style={{
                  width: "8%",
                  paddingLeft: "18px",
                  paddingRight: "18px",
                }}
              >
                <div
                  style={{
                    width: "90px",
                    display: "flex",
                    justifyContent: "start",
                    // flexDirection: "column",
                    alignItems: "center",
                    gap: "5px",
                    // border:'1px solid'
                  }}
                >
                  <svg
                    width="10"
                    height="11"
                    viewBox="0 0 10 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="5" cy="5.5" r="5" fill="#1D6AFF" />
                  </svg>

                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#000000",
                      // border:'1px solid'
                    }}
                  >
                    Class 1
                  </span>
                </div>
              </td>
              <td
                style={{
                  width: "31%",
                  paddingLeft: "18px",
                  paddingRight: "18px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                    whiteSpace: "pre-wrap",
                    gap: "2px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        lineHeight: "18px",
                        color: "#1F1F1F",
                      }}
                    >
                      Some Header - Write down the moral of the story you think
                      the writer was trying to convey in the ballad of Ice and
                      Fire <span style={{color:'#1D6AFF', textDecoration: 'underline'  }}>Source Matrial</span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                      padding: "0px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#A3A3A3",
                        fontWeight: "500",
                      }}
                    >
                      {" "}
                      20/05/2022
                    </span>{" "}
                    <svg
                      width="3"
                      height="3"
                      viewBox="0 0 3 3"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="1.5" cy="1.5" r="1.5" fill="#D9D9D9" />
                    </svg>
                    <span
                      style={{
                        color: "rgba(237, 85, 120, 0.61)",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      Important
                    </span>
                  </div>
                </div>
              </td>
              <td
                style={{
                  width: "12%",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                  }}
                >
                  <span
                    data-tooltip-id="my-tooltip-1"
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Rekha Tendulkar
                  </span>
                </div>
              </td>
              {/* <ReactTooltip
                id="my-tooltip-1"
                place="bottom"
                content="Vineet Kumar Mishra"
                style={{
                  zIndex: 999,
                  backgroundColor: "#FFF",
                  boxShadow: "0px 0px 10px 4px #00000026",
                  color: "#000",
                  opacity: 1,
                }}
              /> */}

              <td
                style={{
                  width: "15%",
                  paddingLeft: "18px",
                  paddingRight: "18px",
                }}
              >
                <div
                  style={{
                    width: "115px",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      width: "70px",
                      height: "25px",
                      textAlign: "center",
                      borderRadius: "5px",
                      padding: "4px",
                      fontWeight: "400",
                      lineHeight: "18px",
                      color: "#000",
                    }}
                  >
                    31 Mar 2024
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      width: "70px",
                      height: "25px",
                      textAlign: "center",
                      borderRadius: "5px",
                      padding: "4px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#4BCD60",
                      backgroundColor: "#E7FFEA",
                    }}
                  >
                    12 Days
                  </span>
                </div>
              </td>

              <td
                style={{
                  width: "12%",
                  paddingLeft: "18px",
                  paddingRight: "18px",
                }}
              >
                <div
                  style={{
                    width: "fit-content",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "row",
                    gap:'5px'
                  }}
                >
                   <span
                    style={{
                      fontSize: "12px",
                      width: "80px",
                      height: "25px",
                      textAlign: "center",
                      borderRadius: "5px",
                      padding: "4px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#4BCD60",
                      backgroundColor: "#E7FFEA",
                    }}
                  >
                    InProgress
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      width: "40px",
                      height: "25px",
                      textAlign: "center",
                      borderRadius: "5px",
                      padding: "4px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#ED5578",
                      backgroundColor: "#FFE7E1",
                    }}
                  >
                    Late
                  </span> 
                </div>
              </td>

              <td
                style={{
                  width: "10%",
                  paddingLeft: "18px",
                  paddingRight: "18px",
                }}
              >
                <div
                  style={{
                    width: "118px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: "6px",
                    backgroundColor: "#1F3259",
                    borderRadius: "8px",
                    padding: "8px 10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#FFF",

                      display: "flex",
                      alignItems: "center",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Start
                  </span>
                </div>
              </td>
            </tr>
          
          </tbody>
          {/* end::Table body */}
        </table>

        <div
          className="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog "
            style={{
              display: "flex",
              width: "505px",
              height: "521px",
              padding: "0px",
              // borderRadius:'18px'
            }}
          >
            <div
              className="modal-content"
              style={{ padding: "23px 5px", borderRadius: "17px" }}
            >
              <div
                className="modal-header border-0"
                style={{ width: "100%", height: "17px" }}
              >
                <span
                  className=""
                  id="staticBackdropLabel"
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    fontFamily: "Manrope",
                  }}
                >
                  Filters
                </span>
                <span data-bs-dismiss="modal" aria-label="Close">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="16" cy="16" r="16" fill="#ECECEC" />
                    <path
                      d="M22.8572 9.14294L9.14288 22.8572M9.14288 9.14294L22.8572 22.8572"
                      stroke="#464646"
                      stroke-width="2"
                      stroke-linecap="square"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                    style={{
                      fontSize: "12px",
                      color: "#434343",
                      fontWeight: "500",
                    }}
                  >
                    By Payment Status
                  </label>
                  <div
                    style={{
                      display: "flex",
                      padding: "13px 12px",
                      gap: "12px",
                      border: "1px solid #ECEDF1",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      className="form-check"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gridRadios"
                        id="gridRadios1"
                        value="option1"
                        defaultChecked
                        style={{ width: "15px", height: "15px" }}
                      />
                      <label className="form-check-label" htmlFor="gridRadios1">
                        None
                      </label>
                    </div>
                    <div
                      className="form-check"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gridRadios"
                        id="gridRadios1"
                        value="option1"
                        defaultChecked
                        style={{ width: "15px", height: "15px" }}
                      />
                      <label className="form-check-label" htmlFor="gridRadios1">
                        Percentage
                      </label>
                    </div>
                    <div
                      className="form-check"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gridRadios"
                        id="gridRadios1"
                        value="option1"
                        defaultChecked
                        style={{ width: "15px", height: "15px" }}
                      />
                      <label className="form-check-label" htmlFor="gridRadios1">
                        Fixed Amount
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  style={{
                    width: "118px",
                    height: "36px",
                    padding: "8px 10px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    flexShrink: "0",
                    backgroundColor: "rgba(39, 59, 99, 0.76)",
                  }}
                >
                  <span
                    style={{
                      color: "#FFF",
                      fontFamily: "Manrope",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    Confirm
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end::Table */}
    </div>
  );
};

export { TablesWidget19 };

{
  /* {tableData.map((rowData, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{index + 1}</td>
                    <td>{rowData.subject_name}</td>
                    <td>{rowData.homework_date}</td>
                    <td>{rowData.submit_date}</td>
                    <td>{rowData.evaluation_date ?? "Not evaluated"}</td>
                    <td>
                        {rowData.homework_status === "1"
                        ? "Submitted"
                        : "Not Submitted"}
                    </td>
                    <td>
                        <a href="#" onClick={handlePrimaryButtonClick}>
                        View Details
                        </a>
                    </td>
                    <td>
                        Upload
                    </td>
                    </tr>

                ))} 
            
             <div className="row justify-content-end my-5">
            <nav aria-label="Page navigation example">
            <ul className="pagination">
                <li className="page-item">
                <a className="page-link" href="#">
                    Previous
                </a>
                </li>
                <li className="page-item">
                <a className="page-link" href="#">
                    1
                </a>
                </li>
                <li className="page-item">
                <a className="page-link" href="#">
                    2
                </a>
                </li>
                <li className="page-item">
                <a className="page-link" href="#">
                    3
                </a>
                </li>
                <li className="page-item">
                <a className="page-link" href="#">
                    Next
                </a>
                </li>
            </ul>
            </nav>
        </div>
            */
}
