import React, { ChangeEvent, useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";


interface Enquiry {
  date: string;
  class?: number; // Adjust type as per actual data structure
  name: string;
  source: string;
  email: string;
  follow_up_date: string;
  father_name: string;
  status: string;
  // Add more fields as per your actual data structure
}

const TablesWidget33: React.FC = () => {
  const [data, setData] = useState<Enquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-enquires/1`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData: Enquiry[] = await response.json();
        const formattedData = responseData.map((item) => ({
          ...item,
          date: new Date(item.date).toISOString().split("T")[0],
          follow_up_date: new Date(item.follow_up_date) 
            .toISOString()
            .split("T")[0],
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEnquiries();
  }, []);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter((item) => {
    const dateMatch = item.date.includes(searchQuery);
    const classMatch = item.class && item.class.toString().includes(searchQuery);
    const nameMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const sourceMatch = item.source.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = item.email.toLowerCase().includes(searchQuery.toLowerCase());
    const followUpDateMatch = item.follow_up_date.includes(searchQuery);
    const fatherNameMatch = item.father_name.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = item.status.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      dateMatch ||
      classMatch ||
      nameMatch ||
      sourceMatch ||
      emailMatch ||
      followUpDateMatch ||
      fatherNameMatch ||
      statusMatch
    );
  });

  return (
    <div
      className="col-xxl-12"
      style={{
        borderRadius: "16px",
        border: "1px solid #5D637A",
        overflowX: "hidden",
        minHeight: "100%",
        marginBottom: "20px",
        height: "770px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Manrope",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <div style={{ width: "auto", height: "100%", overflow: "hidden" }}>
        <table
          //   className="col-xxl-12"
          style={{
            top: "223px",
            height: "612px",
            maxHeight: "100%",
            borderCollapse: "collapse",
            // tableLayout: "fixed",
            overflowX: "hidden",
            overflowY: "auto",
            whiteSpace: "nowrap",
            width: "100%",
            // border:'8px solid black'
          }}
        >
          <thead
            className=""
            style={{
              height: "123px",
              maxHeight: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#1C335C",
              //   width:'fit-content',
              // overflowY: "auto",
              // overflowX: "hidden",
              justifyContent: "space-between",
              zIndex: 999,
            }}
          >
            <div>
              <caption
                style={{
                  backgroundColor: "#1C335C",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // tableLayout: "fixed",
                  // borderCollapse: "collapse",

                  // border:'1px solid'
                  width: "98%",
                }}
                className="col-xxl-12 col-lg-6"
              >
                <div>
                  <span
                    style={{
                      color: "#FFF",
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                  >
                    Enquiry Breakdown
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    className="input-group flex-nowrap"
                    style={{
                      width: "300px",
                      height: "36px",
                      borderRadius: "8px",
                      border: "1px solid #D9D9D9",
                    }}
                  >
                    <span
                      className="input-group-text border-0 pe-1 pr-0"
                      style={{ backgroundColor: "transparent" }}
                      id="addon-wrapping"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_582_4295)">
                          <circle
                            cx="8.50002"
                            cy="7.66665"
                            r="6.33333"
                            stroke="white"
                            stroke-width="1.5"
                          />
                          <path
                            d="M14.1667 13.3333L15.5 14.6666"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_582_4295">
                            <rect
                              width="16"
                              height="16"
                              fill="white"
                              transform="translate(0.833374)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                    <input
                      type="text"
                      style={{
                        backgroundColor: "transparent",
                        color: "#FFFFFF",
                      }}
                      className="form-control border-0"
                      placeholder="Search ...."
                      aria-label="Search"
                      aria-describedby="addon-wrapping"
                      onChange={handleSearch}
                    />
                  </div>
                  <div>
                    <span
                      className=""
                      style={{
                        height: "36px",
                        border: "1px solid #D9D9D9",
                        width: "100px",
                        borderRadius: "8px",
                        padding: "8px 10px 8px 10px",
                        gap: "10px",
                        display: "flex",
                        alignItems: "center",
                        color: "#FFF",
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#staticBackdrop"
                    >
                      <svg
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.16672 9.3333C8.27129 9.3333 9.16672 10.2287 9.16672 11.3333C9.16672 12.4379 8.27129 13.3333 7.16672 13.3333C6.06215 13.3333 5.16672 12.4379 5.16672 11.3333C5.16672 10.2287 6.06215 9.3333 7.16672 9.3333Z"
                          stroke="white"
                        />
                        <path
                          d="M10.5 2.66667C9.39546 2.66667 8.50003 3.5621 8.50003 4.66667C8.50003 5.77124 9.39546 6.66667 10.5 6.66667C11.6046 6.66667 12.5 5.77124 12.5 4.66667C12.5 3.5621 11.6046 2.66667 10.5 2.66667Z"
                          stroke="white"
                        />
                        <path
                          d="M10.8334 11.3057L15.5 11.3057"
                          stroke="white"
                          stroke-linecap="round"
                        />
                        <path
                          d="M6.83337 4.63898L2.16671 4.63898"
                          stroke="white"
                          stroke-linecap="round"
                        />
                        <path
                          d="M2.16672 11.3057L3.50005 11.3057"
                          stroke="white"
                          stroke-linecap="round"
                        />
                        <path
                          d="M15.5 4.63898L14.1667 4.63898"
                          stroke="white"
                          stroke-linecap="round"
                        />
                      </svg>
                      Filter
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.00004 1.25L4.91671 4.75L0.833374 1.25"
                          stroke="white"
                          stroke-linecap="square"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </caption>
            </div>
            <tr
              style={{
                height: "61px",
                gap: "40px",
                display: "flex",
                paddingTop: "10px",
                paddingLeft: "55px",
                // paddingBottom:'10px',
                // position: "sticky",
                // top: 0,
                width: "auto",
                // border:'1px solid white',
                overflowY: "auto",
                overflowX: "hidden",
                backgroundColor: "#1C335C",
                // zIndex: 100,
              }}
            >
              <th>
                <div style={{ width: "85px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    Date
                  </span>
                </div>
              </th>
              <th>
                <div style={{ width: "100px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    Class
                  </span>
                </div>
              </th>
              <th>
                <div style={{ width: "200px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    Student Name
                  </span>
                </div>
              </th>
              <th>
                <div style={{ width: "145px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    Source
                  </span>
                </div>
              </th>
              <th>
                <div style={{ width: "250px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    Email
                  </span>
                </div>
              </th>
              <th>
                <div style={{ width: "145px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    FollowUp-Date
                  </span>
                </div>
              </th>

              <th>
                <div style={{ width: "195px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    Father Name
                  </span>
                </div>
              </th>
              {/* <th>
                <div
                  style={{
                    width: "150px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    Last Payment Date
                  </span>
                </div>
              </th> */}
              <th>
                <div
                  style={{
                    width: "70px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    Status
                  </span>
                </div>
              </th>

              <th>
                <div
                  style={{
                    width: "80px",
                    // textAlign:'left'
                    // border:'1px solid',
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    Action
                  </span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody
            className="col-xxl-12 h-[s]"
            style={{
              height: "105%",
              // maxHeight: "100%",
              display: "flex",
              flexDirection: "column",
              minHeight: "calc(100vh - 550px)",
              overflowY: "auto",
            }}
          >
             {filteredData.map((item, index) => (
              <tr
                key={index}
                style={{
                  height: "61px",
                  gap: "40px",
                  paddingLeft: "55px",
                  paddingRight: "55px",
                  paddingTop: "16px",
                  width: "100%",
                  display: "flex",
                  backgroundColor: index % 2 === 0 ? "#F5F5F5" : "#FFF",
                  // border:'1px solid'
                }}
              >
                <td>
                  <div
                    style={{
                      width: "85px",
                      display: "flex",
                      justifyContent: "start",
                      flexDirection: "column",
                      // border:'1px solid'
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        lineHeight: "18px",
                        color: "#000000",
                        // border:'1px solid'
                      }}
                    >
                      {item.date}
                    </span>
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      width: "100px",
                      display: "flex",
                      justifyContent: "start",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        lineHeight: "18px",
                        color: "#1F1F1F",
                      }}
                    >
                      Class {item.class}
                    </span>
                  </div>
                </td>
                <td>
                  <div
                    className="overflow-hidden whitespace-nowrap"
                    style={{
                      width: "200px",
                      // paddingLeft:'5px',
                      display: "flex",
                      justifyContent: "start",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      data-tooltip-id={`tooltip-${index}`}
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        lineHeight: "18px",
                        color: "#1F1F1F",
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                  <ReactTooltip
                    id={`tooltip-${index}`}
                    place="bottom"
                    content={item.name}
                    opacity={1}
                    style={{
                      zIndex: 999,
                      backgroundColor: "#FFF",
                      boxShadow: "0px 0px 10px 4px #00000026",
                      color: "#000",
                    }}
                  />
                </td>
                <td>
                  <div
                    className=" flex justify-start flex-col overflow-hidden whitespace-nowrap text-ellipsis"
                    style={{ width: "145px" }}
                  >
                    <span
                      className="font-normal leading-6 text-gray-800 w-100 overflow-hidden"
                      style={{
                        width: "100px",
                        overflow: "hidden",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.source}
                    </span>
                  </div>
                </td>
                <td>
                  <div
                    className=" flex justify-start flex-col overflow-hidden whitespace-nowrap text-ellipsis"
                    style={{ width: "250px" }}
                  >
                    <span
                      data-tooltip-id={`tooltip-${index}`}
                      className="font-normal leading-6 text-gray-800 w-100 overflow-hidden"
                      style={{
                        width: "100px",
                        overflow: "hidden",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.email}
                    </span>
                  </div>
                  <ReactTooltip
                    id={`tooltip-${index}`}
                    place="bottom"
                    content={item.email}
                    opacity={1}
                    style={{
                      zIndex: 999,
                      backgroundColor: "#FFF",
                      boxShadow: "0px 0px 10px 4px #00000026",
                      color: "#000",
                    }}
                  />
                </td>

                {/* <td>
                <div
                  style={{
                    width: "145px",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      width: "50px",
                      textAlign: "center",
                      borderRadius: "5px",
                      padding: "5px",
                      fontWeight: "500",
                      lineHeight: "18px",
                      color: "#ED5578",
                      backgroundColor: "#FFE7E1",
                    }}
                  >
                    Due
                  </span>
                </div>
              </td> */}
                <td>
                  <div
                    style={{
                      width: "145px",
                      display: "flex",
                      justifyContent: "start",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        width: "100px",
                        textAlign: "center",
                        borderRadius: "5px",
                        padding: "5px",
                        fontWeight: "500",
                        lineHeight: "18px",
                        color: "#ED5578",
                        backgroundColor: "#FFE7E1",
                      }}
                    >
                      {item.follow_up_date}
                    </span>
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      width: "195px",
                      display: "flex",
                      justifyContent: "start",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        lineHeight: "18px",
                        color: "#000",
                      }}
                    >
                      {item.father_name}
                    </span>
                    {/* <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "18px",
                      color: "#737373",
                      fontFamily: "Manrope",
                    }}
                  >
                    31 Mar 2024
                  </span> */}
                  </div>
                </td>
                {/* <td>
                <div
                  style={{
                    width: "150px",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      lineHeight: "18px",
                      color: "#ED5578",
                    }}
                  >
                    ₹200,000
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "18px",
                      color: "#737373",
                      fontFamily: "Manrope",
                    }}
                  >
                    31 Mar 2024
                  </span>
                </div>
              </td> */}
                <td>
                  <div
                    style={{
                      width: "70px",
                      display: "flex",
                      justifyContent: "start",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        lineHeight: "18px",
                        color: "#1F1F1F",
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      width: "90px",
                      display: "flex",
                      justifyContent: "space-around ",
                      flexDirection: "row",
                      gap: "6px",
                      marginTop: "-8px",
                      // border:'1px solid'
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        lineHeight: "18px",
                        color: "#1F1F1F",
                        // border:'1px solid',
                        padding: "10px 8px",
                        backgroundColor: "#F5F5F5",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 11C2 8.17157 2 6.75736 2.87868 5.87868C3.75736 5 5.17157 5 8 5H13C15.8284 5 17.2426 5 18.1213 5.87868C19 6.75736 19 8.17157 19 11C19 13.8284 19 15.2426 18.1213 16.1213C17.2426 17 15.8284 17 13 17H8C5.17157 17 3.75736 17 2.87868 16.1213C2 15.2426 2 13.8284 2 11Z"
                          stroke="#1C274C"
                          stroke-width="1.5"
                        />
                        <path
                          d="M19.0002 8.07617C19.9753 8.17208 20.6317 8.38885 21.1216 8.87873C22.0002 9.75741 22.0002 11.1716 22.0002 14.0001C22.0002 16.8285 22.0002 18.2427 21.1216 19.1214C20.2429 20.0001 18.8287 20.0001 16.0002 20.0001H11.0002C8.17181 20.0001 6.7576 20.0001 5.87892 19.1214C5.38903 18.6315 5.17226 17.9751 5.07635 17"
                          stroke="#1C274C"
                          stroke-width="1.5"
                        />
                        <path
                          d="M13 11C13 12.3807 11.8807 13.5 10.5 13.5C9.11929 13.5 8 12.3807 8 11C8 9.61929 9.11929 8.5 10.5 8.5C11.8807 8.5 13 9.61929 13 11Z"
                          stroke="#1C274C"
                          stroke-width="1.5"
                        />
                        <path
                          d="M16 13L16 9"
                          stroke="#1C274C"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                        <path
                          d="M5 13L5 9"
                          stroke="#1C274C"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                      </svg>
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        lineHeight: "18px",
                        color: "#FFF",
                        // border:'1px solid',
                        padding: "10px 10px",
                        backgroundColor: "#1F3259",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
                          stroke="#FFF"
                          stroke-width="1.5"
                        />
                        <path
                          d="M8.5 12.5L10.5 14.5L15.5 9.5"
                          stroke="#FFF"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </td>
              </tr>
            ))}
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

export { TablesWidget33 };

