/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// import { Tooltip as ReactTooltip } from "react-tooltip";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { CreateAdmissionEnquiryReject } from "../../modals/create-app-stepper/CreateAdmissionEnquiryReject";
import { AdmissionFeesHistory } from "../../modals/create-app-stepper/AdmissionFeesHistory";
import { useNavigate } from "react-router-dom";

interface DataItem {
  status: string;
  name: string;
}
interface FilterData {
  admission_enquiry_id: string;
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

const TablesWidget59: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);

  const [filteredData, setFilteredData] = useState<FilterData[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useAuth();
  const Navigate = useNavigate();
  const schoolId = currentUser?.school_id;
  const [showActionModal, setShowActionModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [getClass, setClass] = useState("");
  const [getSession, setSession] = useState("");
  const [referesh, setRefresh] = useState(false);
  const [admissionEnqId, setAdmissionEnqId] = useState("");
  const [enqId, setEnqId] = useState("");

  // const handleActionModal = (value: string) => {
  //   setEnqId(value);
  // };

  const handleActionModal = (value: string) => {
    setClass(value);
    setSession(value);
    setShowActionModal(true);
  };
  const handleActionModalClose = () => {
    setClass("");
    setSession("");
    setShowActionModal(false);
  };
  const handleViewTransaction = (enquiry_id: string) => {

    // Set the admission enquiry ID to show transaction history
    setAdmissionEnqId(enquiry_id);

    // Show the transaction history modal
    setShowHistoryModal(true);
  };

  // Function to close the transaction history modal
  const handleViewTransactionClose = () => {
    setAdmissionEnqId("")
    setShowHistoryModal(false);
    setRefresh(true); // You can use this to refresh data if needed
  };
  const handleModalCollectFees = (
    class_id: string,
    session_id: string,
    admission_enquiry_id: string,
    enquiry_id: string
  ) => {
    setClass(class_id);
    setSession(session_id);
    setAdmissionEnqId(admission_enquiry_id);
    setEnqId(enquiry_id);
    Navigate(`/fee-collect/fee-admission-master?classId=${class_id}&admissionEnquiryId=${admission_enquiry_id}`);
  };

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-admissionfees/${schoolId}`
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
          Admission Fees
        </span>
        {/* <div
          // onClick={showAddModal}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
            backgroundColor: "transparent",
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
        > */}
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
        {/* </div> */}
      </div>
      <div
        style={{
          height: "650px", // Fixed height for the table container
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
                  textAlign: "center",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item, index) => (
              <tr
              key={index}
              style={{
                backgroundColor:
                  index % 2 === 0 ? "rgb(242, 246, 255)" : "#FFFFFF",
                borderBottom: "1px solid #E0E4F0",
                fontFamily: "Manrope",
                fontSize: "14px",
                color: "#1C335C",
                height:'auto',
              }}
            >
                <td
                  style={{
                    padding: "20px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#1F4061",
                    fontFamily: "Manrope"
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
                    fontFamily: "Manrope"
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
                    fontFamily: "Manrope"
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
                    fontFamily: "Manrope"
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
                    fontFamily: "Manrope"
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
                    fontFamily: "Manrope"
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
                    fontFamily: "Manrope"
                  }}
                >
                  {currentUser?.name + "" + currentUser?.surname}
                </td>
                <td
                style={{
                  padding: "20px 10px",
                  fontSize: "14px",
                    fontWeight: "500",
                    color: "#1F4061",
                    fontFamily: "Manrope"
                }}
                >
                  <div
                    style={{
                      width: "90px",
                      display: "flex",
                      justifyContent: "start",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        fontFamily: "Manrope",
                        borderRadius: "5px",
                        fontSize: "12px",
                        fontWeight: "500",
                        color:
                          item.status === "active"
                            ? "#4BCD60"
                            : item.status === "lost"
                            ? "#000000"
                            : "#ED5578",
                        backgroundColor:
                          item.status === "active"
                            ? "#E7FFEA"
                            : item.status === "lost"
                            ? "#FF8B20"
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
                    border:'none'
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "10px", // Adds space between the buttons
                      justifyContent: "center", // Aligns buttons horizontally in the center
                      alignItems: "center", // Vertically centers the buttons
                      padding: "12px 20px",
                    }}
                  >
                    {item.status === "isCompleted" && (
                      <div
                      onClick={() => handleViewTransaction(item.admission_enquiry_id)}
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
                      >View History
                      </span>
                    </div>
                    )}
                    {item.status !== "isCompleted" && (
                      <>
                        <div
                          onClick={() =>
                            handleModalCollectFees(
                              item.class_id,
                              item.session_id,
                              item.admission_enquiry_id,
                              item.enquiry_id
                            )
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 12px",
                            backgroundColor: "#1C335C",
                            borderRadius: "8px",
                            cursor:
                              item.status === "isCompleted"
                                ? "not-allowed"
                                : "pointer", // Disable pointer when 'isCompleted'
                            transition: "background-color 0.3s",
                            opacity: item.status === "isCompleted" ? 0.5 : 1, // Lower opacity when the status is 'isCompleted'
                          }}
                          onMouseEnter={(e) => {
                            if (item.status !== "isCompleted") {
                              e.currentTarget.style.backgroundColor = "#16294D";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (item.status !== "isCompleted") {
                              e.currentTarget.style.backgroundColor = "#1C335C";
                            }
                          }}
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
                            Collect Fees
                          </span>
                        </div>
                        <div
                          onClick={() =>
                            item.status !== "isCompleted" &&
                            handleActionModal(item.admission_enquiry_id)
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 12px",
                            backgroundColor: "#FFE7E1",
                            borderRadius: "5px",
                            cursor:
                              item.status === "isCompleted"
                                ? "not-allowed"
                                : "pointer", // Disable pointer when 'isCompleted'
                            transition: "background-color 0.3s",
                            opacity: item.status === "isCompleted" ? 0.5 : 1, // Lower opacity when the status is 'isCompleted'
                          }}
                        >
                          Reject
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <CreateAdmissionEnquiryReject
            show={showActionModal}
            handleClose={handleActionModalClose}
            setRefresh={setRefresh}
            enqId={""}
          />
          <AdmissionFeesHistory
            show={showHistoryModal}
            handleClose={handleViewTransactionClose}
            setRefresh={setRefresh}
            admissionEnqId={admissionEnqId}
          />
        </table>
      </div>
    </div>
  );
};

export { TablesWidget59 };
