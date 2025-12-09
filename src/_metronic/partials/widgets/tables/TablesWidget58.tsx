/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
import { ReviewApplication } from "../../modals/create-app-stepper/ReviewApplication";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { CreateAdmissionEnquiryReject } from "../../modals/create-app-stepper/CreateAdmissionEnquiryReject";

interface DataItem {
  status: string;
  name: string;
}
interface FilterData {
  student_email: string;
  student_name: string;
  id: number;
  enquiry_id: string;
  date: string;
  class: string;
  name: string;
  source: string;
  email: string;
  follow_up_date: string;
  status: string;
  enquiry_type: string;
  updated_at: string;
  student_phone: string;

  // Add other properties as needed
}

const TablesWidget58: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);

  const [filteredData, setFilteredData] = useState<FilterData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useAuth();

  const schoolId = currentUser?.school_id;

  const [showEditModal, setShowEditModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [enqId, setEnqId] = useState("");
  const [isReviwed, setIsReviwed] = useState("");

  const [referesh, setRefresh] = useState(false);

  // const handleActionModal = (value: string) => {
  //   setEnqId(value);
  // };

  const handleActionModal = (value: string) => {
    setEnqId(value);
    setShowActionModal(true);
  };
  const handleActionModalClose = () => {
    setEnqId("");
    setIsReviwed("");
    setShowActionModal(false);
  };

  const handleModalEdit = (value: string, review: string) => {
    setEnqId(value);
    setIsReviwed(review);
    setShowEditModal(true);
    setRefresh(false);
  };

  const handleModalEditClose = () => {
    setEnqId("");
    setIsReviwed("");
    setShowEditModal(false);
  };

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-reviewlist/${schoolId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();

        setData(responseData);
        setFilteredData(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEnquiries();
    setRefresh(false);
  }, [schoolId, referesh]);

  const handleSearch = (e: any) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = data.filter(
      (item) =>
        item.status.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query)
    );
    /* @ts-ignore */
    setFilteredData(filtered);
  };

  const formatDate = (dateString: string | number | Date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    /* @ts-ignore */
    return date.toLocaleDateString("en-GB", options);
  };

  return (
    <div
      className="card-style"
      style={{
        width: "100%",
        borderRadius: "16px",
        backgroundColor: "rgb(242, 246, 255)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        marginTop: "20px",
        padding: "20px",
      }}
    >
      <div
        className="card-header"
        style={{
          backgroundColor: "rgb(242, 246, 255)",
          padding: "16px 20px",
          borderBottom: "1px solid #E0E4F0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#1C335C",
            fontFamily: "Manrope",
          }}
        >
          Applications Review List
        </span>
        <div
          className="input-group flex-nowrap"
          style={{
            width: "300px",
            height: "36px",
            borderRadius: "8px",
            border: "1px solid #1C335C",
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
                  stroke="#1C335C"
                  stroke-width="1.5"
                />
                <path
                  d="M14.1667 13.3333L15.5 14.6666"
                  stroke="#1C335C"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_582_4295">
                  <rect
                    width="16"
                    height="16"
                    fill="#1C335C"
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
              color: "#1C335C",
            }}
            className="form-control border-0"
            placeholder="Search ...."
            aria-label="Search"
            aria-describedby="addon-wrapping"
            onChange={handleSearch}
            value={searchQuery}
          />
        </div>
      </div>
      <div
        style={{
          height: "680px", // Fixed height for the table container
          overflowY: "auto", // Enable vertical scrolling
        }}
      >
        <table
          className="table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#FFFFFF", // White background for the table
            borderRadius: "12px", // Round corners for the table
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)", // Light shadow for the table
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "rgb(242, 246, 255)", // Header background color
                borderBottom: "1px solid #E0E4F0",
                fontFamily: "Manrope",
                fontWeight: "600",
                color: "#1C335C",
                fontSize: "14px",
              }}
            >
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Appliation Id
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Applicant Name
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Class Applied For
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Application Date
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Student Email
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Student Contact
              </th>

              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Reviewer
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Status
              </th>

              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "right",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? "rgb(242, 246, 255)" : "#FFFFFF",
                    borderBottom: "1px solid #E0E4F0",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    color: "#1C335C",
                  }}
                >
                  <td
                    style={{
                      padding: "20px 20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#1F4061",
                      fontFamily: "Manrope",
                    }}
                  >
                    {item.id}
                  </td>
                  <td
                    style={{
                      padding: "20px 20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#1F4061",
                      fontFamily: "Manrope",
                    }}
                  >
                    {item.student_name}
                  </td>
                  <td
                    style={{
                      padding: "20px 20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#1F4061",
                      fontFamily: "Manrope",
                    }}
                  >
                    {item.class}
                  </td>
                  <td
                    style={{
                      padding: "20px 20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#1F4061",
                      fontFamily: "Manrope",
                    }}
                  >
                    {formatDate(item.updated_at)}
                  </td>
                  <td
                    style={{
                      padding: "20px 20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#1F4061",
                      fontFamily: "Manrope",
                    }}
                  >
                    {item.student_email}
                  </td>

                  <td
                    style={{
                      padding: "20px 20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#1F4061",
                      fontFamily: "Manrope",
                    }}
                  >
                    {item.student_phone}
                  </td>

                  <td
                    style={{
                      padding: "20px 20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#1F4061",
                      fontFamily: "Manrope",
                    }}
                  >
                    {currentUser?.name + " " + currentUser?.surname}
                  </td>
                  <td
                    style={{
                      padding: "20px 20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#1F4061",
                      fontFamily: "Manrope",
                    }}
                  >
                    <div
                      style={{
                        width: "80px",
                        display: "flex",
                        justifyContent: "start",
                        flexDirection: "column",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "auto",
                          fontFamily: "Manrope",
                          borderRadius: "5px",
                          fontSize: "12px",
                          fontWeight: "500",
                          textAlign: "center",
                          color:
                            item.status === "isReviewed"
                              ? "#4BCD60"
                              : item.status === "isSubmited"
                              ? "#D4840C"
                              : "#ED5578",
                          backgroundColor:
                            item.status === "isReviewed"
                              ? "#E7FFEA"
                              : item.status === "isSubmited"
                              ? "#FFF8B6"
                              : "#FFE7E1",
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      display: "flex",
                      gap: "10px", // Adds space between the buttons
                      justifyContent: "end", // Aligns buttons horizontally in the center
                      alignItems: "center", // Vertically centers the buttons
                      padding: "12px 20px",
                      border: "none",
                    }}
                  >
                    <div
                      onClick={() =>
                        handleModalEdit(item.enquiry_id, item.status)
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px 12px",
                        backgroundColor: "#1C335C",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#16294D")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#1C335C")
                      }
                    >
                      <span
                        style={{
                          marginRight: "8px",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "700",
                          fontFamily: "Manrope",
                        }}
                      >
                        Review Application
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="16px"
                        height="16px"
                        fill="#ffffff"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M3 17.25V21h3.75l11-11.03-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      </svg>
                    </div>
                    <div
                      onClick={() => {
                        if (item.status !== "isReviewed") {
                          handleActionModal(item.enquiry_id);
                        }
                      }}
                      style={{
                        gap: "10px",
                        backgroundColor: "#FFE7E1",
                        cursor:
                          item.status !== "isReviewed"
                            ? "pointer"
                            : "not-allowed", // Apply conditional cursor style
                        display: "flex",
                        alignItems: "center",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        transition: "background-color 0.3s",
                      }}
                    >
                      <span
                        style={{
                          marginRight: "8px",
                          color: "#ED5578",
                          fontSize: "14px",
                          fontWeight: "700",
                          fontFamily: "Manrope",
                        }}
                      >
                        Reject
                      </span>
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="12"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    fontFamily: "Manrope",
                    fontSize: "16px",
                    color: "#1F4061",
                  }}
                >
                  No enquiries added yet. Please add a new enquiry first.
                </td>
              </tr>
            )}
          </tbody>
          <ReviewApplication
            show={showEditModal}
            handleClose={handleModalEditClose}
            enqId={enqId}
            isReviwed={isReviwed}
            setRefresh={setRefresh}
          />
          <CreateAdmissionEnquiryReject
            show={showActionModal}
            handleClose={handleActionModalClose}
            enqId={enqId}
            setRefresh={setRefresh}
          />
        </table>
      </div>
    </div>
  );
};

export { TablesWidget58 };
