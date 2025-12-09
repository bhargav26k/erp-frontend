/* eslint-disable @typescript-eslint/no-unused-vars */

import { FC, useEffect, useState } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { HeaderWrapper } from "../../../../_metronic/layout/components/header_staff";
import { Content } from "../../../../_metronic/layout/components/content";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";


interface Visitor {
  id: string; // Replace with actual types as needed
  name: string;
  purpose: string;
  contact: string;
  no_of_people: string;
  id_proof: string;
  date: string;
  in_time: string;
  out_time: string;
  // Add other fields here
}

const VisitorManagementPage: FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const {currentUser} = useAuth();
  const [refreshData, setRefreshData] = useState(false);
  const navigate = useNavigate();
  
  // console.log(visitors);
  const schoolId = currentUser?.school_id;
  

  useEffect(() => {
    // Function to fetch academies data from API
    const fetchAcademies = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-visitors/${schoolId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch academies");
        }
        const data = await response.json();
        setVisitors(data);
      } catch (error) {
        console.error("Error fetching academies:", error);
      }
    };

    fetchAcademies();
  }, [refreshData]);

  // const handlePrimaryButtonClick = () => {
  //   setShowCreateAppModal(true);
  // };

  // const handleModalClose = () => {
  //   setShowCreateAppModal(false);
  // };

  // const handleCloseModal = () => {
  //   setShowModal(false);
  // };
  // const handleViewschool = (value) => {
  //   const schoolId = value;
  //   console.log(schoolId);

  //   navigate(`/superadmin/school-profile/${schoolId}`);
  // };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="bg-white">
      <HeaderWrapper toggleView={() => {}} />

      <Content>
        <div
          className="col-xxl-12"
          style={{
            borderRadius: "16px",
            border: "1px solid #5D637A",
            overflowX: "hidden",
            minHeight: "100%",
            marginBottom: "20px",
            height: "807px",
            display: "flex",
            flexDirection: "column",
            fontFamily: "Manrope",
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          <div style={{ overflow: "auto", width: "100%", height: "100%" }}>
            <table
              style={{
                top: "223px",
                height: "672px",
                maxHeight: "100%",
                borderCollapse: "collapse",
                // tableLayout: "fixed",
                overflowX: "hidden",
                overflowY: "auto",
                whiteSpace: "nowrap",
                width: "100%",
              }}
            >
              <thead
                className="col-xxl-12"
                style={{
                  position: "sticky",
                  top: "0",
                  zIndex: "1",
                  height: "133px",
                  maxHeight: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#1C335C",
                  justifyContent: "space-between",
                  gap: "0px",
                  padding: "9px 24px 9px 24px",
                }}
              >
                <caption
                  className="col-xxl-12"
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    position: "relative",
                  }}
                >
                  <div style={{ width: "224px", height: "12px" }}>
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        lineHeight: "21.86px",
                        color: "#FFFFFF",
                        fontFamily: "Manrope",
                      }}
                    >
                      Visitor's Book
                    </span>
                  </div>
                  <div
                    className="card-header"
                    style={{
                      width: "497px",
                      height: "37px",
                      display: "flex",
                      gap: "8px",
                      justifyContent: "end",
                    }}
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
                        className="form-control border-0 "
                        placeholder="Search ...."
                        aria-label="Username"
                        aria-describedby="addon-wrapping"
                      />
                    </div>

                    <span
                      // onClick={handlePrimaryButtonClick}
                      style={{
                        // width: "137px",
                        height: "36px",
                        borderRadius: "8px",
                        padding: "8px 10px 8px 10px",
                        gap: "5px",
                        backgroundColor: "#FFFFFF",
                        display: "flex",
                        flexDirection: "row",
                        cursor: "pointer",
                      }}
                      // onClick={handlePrimaryButtonClick}
                      data-bs-toggle="modal"
                      data-bs-target="#staticBackdrop"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_103_1850)">
                          <path
                            d="M1.66663 10C1.66663 6.07165 1.66663 4.10746 2.88701 2.88708C4.1074 1.66669 6.07159 1.66669 9.99996 1.66669C13.9283 1.66669 15.8925 1.66669 17.1129 2.88708C18.3333 4.10746 18.3333 6.07165 18.3333 10C18.3333 13.9284 18.3333 15.8926 17.1129 17.113C15.8925 18.3334 13.9283 18.3334 9.99996 18.3334C6.07159 18.3334 4.1074 18.3334 2.88701 17.113C1.66663 15.8926 1.66663 13.9284 1.66663 10Z"
                            stroke="black"
                            stroke-width="1.5"
                          />
                          <path
                            d="M12.5 10L10 10M10 10L7.5 10M10 10L10 7.5M10 10L10 12.5"
                            stroke="black"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_103_1850">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <div style={{ width: "95px", height: "9px" }}>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#000000",
                            lineHeight: "16.39px",
                            fontFamily: "Manrope",
                          }}
                        >
                          Add New Visitor
                        </span>
                      </div>
                    </span>
                  </div>
                  {/* <AddschoolModal
                    show={showCreateAppModal}
                    handleClose={handleModalClose}
                    refresh={function (refresh: boolean): void {
                      throw new Error("Function not implemented.");
                    }}
                  /> */}
                </caption>

                <tr
                  style={{
                    // gap: "40px",
                    display: "flex",
                    paddingTop: "15px",
                    justifyContent: "space-between",
                    paddingLeft: "30px",
                    paddingRight: "85px",
                    // border:'1px solid black',
                    // width: "100%",

                    backgroundColor: "#1C335C",
                  }}
                >
                  <th>
                    <div
                      style={{
                        flex: "1",
                        maxWidth: "355px",
                        minWidth: "80px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          lineHeight: "18px",
                          color: "#FFFFFF",
                          position: "sticky",
                          top: "0",
                          zIndex: "1",
                          fontFamily: "Manrope",
                        }}
                      >
                        Sr.no
                      </span>
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        flex: "1",
                        maxWidth: "350px",
                        minWidth: "200px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          lineHeight: "18px",
                          color: "#FFFFFF",
                          position: "sticky",
                          top: "0",
                          zIndex: "1",
                          fontFamily: "Manrope",
                        }}
                      >
                        Visitor's Name
                      </span>
                    </div>
                  </th>
                  {/* <th>
                    <div
                      style={{
                        flex: "1",
                        maxWidth: "380px",
                        minWidth: "200px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          lineHeight: "18px",
                          color: "#FFFFFF",
                          fontFamily: "Manrope",
                        }}
                      >
                        Visitor's Email
                      </span>
                    </div>
                  </th> */}
                  <th>
                    <div
                      style={{
                        flex: "1",
                        maxWidth: "680px",
                        minWidth: "180px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          lineHeight: "18px",
                          color: "#FFFFFF",
                          fontFamily: "Manrope",
                        }}
                      >
                        Visitor's Phone
                      </span>
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        flex: "1",
                        maxWidth: "650px",
                        minWidth: "180px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          lineHeight: "18px",
                          color: "#FFFFFF",
                          fontFamily: "Manrope",
                        }}
                      >
                        Visitor's Purpose
                      </span>
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        flex: "1",
                        maxWidth: "680px",
                        minWidth: "150px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          lineHeight: "18px",
                          color: "#FFFFFF",
                          fontFamily: "Manrope",
                        }}
                      >
                        No. Of Visitors 
                      </span>
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        flex: "1",
                        maxWidth: "680px",
                        minWidth: "180px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          lineHeight: "18px",
                          color: "#FFFFFF",
                          fontFamily: "Manrope",
                        }}
                      >
                        Visitor's Id Proff
                      </span>
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        flex: "1",
                        maxWidth: "680px",
                        minWidth: "100px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          lineHeight: "18px",
                          color: "#FFFFFF",
                          fontFamily: "Manrope",
                        }}
                      >
                        Date
                      </span>
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        flex: "1",
                        maxWidth: "680px",
                        minWidth: "100px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          lineHeight: "18px",
                          color: "#FFFFFF",
                          fontFamily: "Manrope",
                        }}
                      >
                        In Time
                      </span>
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        flex: "1",
                        maxWidth: "680px",
                        minWidth: "100px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          lineHeight: "18px",
                          color: "#FFFFFF",
                          fontFamily: "Manrope",
                        }}
                      >
                        Out Time  
                      </span>
                    </div>
                  </th>
                  <th>
                    <div
                      style={{ flex: "1", maxWidth: "115px", minWidth: "50px" }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          lineHeight: "18px",
                          color: "#FFFFFF",
                          fontFamily: "Manrope",
                        }}
                      >
                        Actions
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody
                className="col-xxl-12"
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  // width:'100%',
                  // border: "1px solid #CCCCCC",
                }}
              >
                {visitors.map((group, index) => (
                  <tr
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      height: "fit-content",
                      paddingTop: "15px",
                      paddingLeft: "60px",
                      paddingRight: "75px",
                      paddingBottom: "15px",
                      alignItems:'center',
                      borderBottom:'1px solid lightgray'
                    }}
                  >
                    <td
                      style={{
                        maxWidth: "345px",
                        minWidth: "80px",
                      }}
                    >
                      <div style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          fontFamily: "Manrope",
                        }}
                        >
                          {group.id}
                      </div>
                    </td>
                    <td style={{ maxWidth: "355px", minWidth: "200px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          fontFamily: "Manrope",
                        }}
                      >
                          {group.name || "N/A"}
                      </div>
                    </td>
                    <td style={{ maxWidth: "355px", minWidth: "180px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          fontFamily: "Manrope",
                        }}
                      >
                         {group.contact || "N/A"} 
                      </div>
                    </td>
                    <td style={{ maxWidth: "355px", minWidth: "180px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          fontFamily: "Manrope",
                        }}
                      >
                        {group.purpose || "N/A"}
                      </div>
                    </td>
                    <td
                      style={{ maxWidth: "355px", minWidth: "150px" }}
                    >
                      <div
                        className="overflow-hidden whitespace-nowrap"
                        style={{
                          width: "80%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          fontFamily: "Manrope",
                        }}
                      >
                         {group.no_of_people || "N/A"}
                      </div>
                    </td>
                    <td
                      style={{ maxWidth: "355px", minWidth: "180px" }}
                    >
                      <div
                        className="overflow-hidden whitespace-nowrap"
                        style={{
                          width: "80%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          fontFamily: "Manrope",
                        }}
                      >
                        {group.id_proof || "N/A"}
                      </div>
                    </td>
                    <td
                      style={{ maxWidth: "355px", minWidth: "100px" }}
                    >
                      <div
                        className="overflow-hidden whitespace-nowrap"
                        style={{
                          width: "80%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          fontFamily: "Manrope",
                        }}
                      >
                         {formatDate(group.date) || "N/A"}
                      </div>
                    </td>
                    <td
                      style={{ maxWidth: "355px", minWidth: "100px" }}
                    >
                      <div
                        className="overflow-hidden whitespace-nowrap"
                        style={{
                          width: "80%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          fontFamily: "Manrope",
                        }}
                      >
                          {group.in_time || "N/A"}
                      </div>
                    </td>
                    <td
                      style={{ maxWidth: "355px", minWidth: "100px" }}
                    >
                      <div
                        className="overflow-hidden whitespace-nowrap"
                        style={{
                          width: "80%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          fontFamily: "Manrope",
                        }}
                      >
                         {group.out_time || "N/A"}
                      </div>
                    </td>

                    <td style={{ maxWidth: "115px", minWidth: "50px" }}>
                      <div
                        style={{
                          width: "135px",
                          height: "40px",
                          display: "flex",
                          flexDirection: "row",
                          gap: "6px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "40px",
                            borderRadius: "6px",
                            padding: "10px 6px 10px 6px",
                            gap: "10px",
                            backgroundColor: "#F5F5F5",
                            display: "flex",
                            // alignItems: "center",
                          }}
                          // onClick={() => handleViewschool(group.id)}
                        >
                          <img
                            src="/media/svg/files/view.svg"
                            style={{ width: "20px", height: "20px" }}
                          />
                          {/* <button
                            type="button"
                            className="btn btn-primary"
                            
                            style={{
                              fontFamily: "Manrope",
                              fontSize: "13px",
                              fontWeight: "500",
                            }}
                          >
                            View
                          </button> */}
                          {/* <CreateschoolDetailModal
                            show={showModal}
                            onHide={handleCloseModal}
                            school={selectedschool}
                          /> */}
                        </div>
                        <div
                          style={{
                            width: "32px",
                            height: "40px",
                            borderRadius: "6px",
                            padding: "10px 6px 10px 6px",
                            gap: "10px",
                            backgroundColor: "#FFE7E1",
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17.0834 5H2.91663"
                              stroke="#ED5578"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            />
                            <path
                              d="M15.6944 7.08331L15.3111 12.8326C15.1637 15.045 15.0899 16.1512 14.3691 16.8256C13.6482 17.5 12.5396 17.5 10.3222 17.5H9.67775C7.46042 17.5 6.35175 17.5 5.63091 16.8256C4.91007 16.1512 4.83632 15.045 4.68883 12.8326L4.30554 7.08331"
                              stroke="#ED5578"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            />
                            <path
                              d="M7.91663 9.16669L8.33329 13.3334"
                              stroke="#ED5578"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            />
                            <path
                              d="M12.0833 9.16669L11.6666 13.3334"
                              stroke="#ED5578"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            />
                            <path
                              d="M5.41663 5C5.46319 5 5.48648 5 5.50758 4.99947C6.19379 4.98208 6.79915 4.54576 7.03264 3.90027C7.03982 3.88041 7.04719 3.85832 7.06191 3.81415L7.14282 3.57143C7.21188 3.36423 7.24642 3.26063 7.29222 3.17267C7.47497 2.82173 7.81308 2.57803 8.2038 2.51564C8.30173 2.5 8.41094 2.5 8.62934 2.5H11.3706C11.589 2.5 11.6982 2.5 11.7961 2.51564C12.1868 2.57803 12.525 2.82173 12.7077 3.17267C12.7535 3.26063 12.788 3.36423 12.8571 3.57143L12.938 3.81415C12.9527 3.85826 12.9601 3.88042 12.9673 3.90027C13.2008 4.54576 13.8061 4.98208 14.4923 4.99947C14.5134 5 14.5367 5 14.5833 5"
                              stroke="#ED5578"
                              stroke-width="1.5"
                            />
                          </svg>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Content>
    </div>
  );
};

const VisitorManagement: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.VisitorManagement" })}
      </PageTitle>
      <VisitorManagementPage />
    </>
  );
};

export default VisitorManagement;
