/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// import { Tooltip as ReactTooltip } from "react-tooltip";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
import { CreateGeneralEnquiry } from "../../modals/create-app-stepper/CreateGeneralEnquiry";
import { CreateEnquiryAction } from "../../modals/create-app-stepper/CreateEnquiryAction";
import { CreateEditGeneral } from "../../modals/create-app-stepper/CreateEditGeneral";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { CreateWalkinAdmission } from "../../modals/create-app-stepper/CreateWalkinAdmission";
import { CreateEditAdmission } from "../../modals/create-app-stepper/CreateEditAdmission";

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
  // Add other properties as needed
}

const TablesWidget34: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);

  const [filteredData, setFilteredData] = useState<FilterData[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;

  const [showAddEnquiry, setShowAddEnquiry] = useState(false);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);

  const [referesh, setRefresh] = useState(false);

  const handleAddEnquiry = () => {
    setShowAddEnquiry(true);
  };
  const handleAddEnquiryClose = () => {
    setShowAddEnquiry(false);
  };

  const handleModalGeneralEdit = (value: string) => {
    setEnqId(value);
    setShowGeneralEditModal(true);
  };

  const handleModalGeneralEditClose = () => {
    setEnqId("");
    setShowGeneralEditModal(false);
  };

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/getEnquiryList/${schoolId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();

        // Custom sort function based on status order
        const statusOrder = [
          "In Progress",
          "New",
          "Deferred",
          "Converted",
          "Closed",
        ];
        const sortedData = responseData.sort((a, b) => {
          return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        });

        setData(sortedData);
        setFilteredData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEnquiries();
    setRefresh(false);
  }, [schoolId, referesh]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter data based on search query with fallback for null or undefined
    const filtered = data.filter(
      (item) =>
        item.enquiry_type?.toLowerCase().includes(query) ||
        item.contact_number?.includes(query) ||
        item.email?.toLowerCase().includes(query)
    );

    setFilteredData(filtered);
  };

  const formatDate = (dateString: string | number | Date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    /* @ts-ignore */
    return date.toLocaleDateString("en-GB", options);
  };

  useEffect(() => {
    const handleF2KeyPress = (event: KeyboardEvent) => {
      if (event.key === "F2") {
        setShowGeneralModal(true);
      }
    };

    window.addEventListener("keydown", handleF2KeyPress);

    return () => {
      window.removeEventListener("keydown", handleF2KeyPress);
    };
  }, []);
  useEffect(() => {
    const handleF2KeyPress = (event: KeyboardEvent) => {
      if (event.key === "F3") {
        setShowAdmissionModal(true);
      }
    };

    window.addEventListener("keydown", handleF2KeyPress);

    return () => {
      window.removeEventListener("keydown", handleF2KeyPress);
    };
  }, []);

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
        fontFamily: "Manrope",
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
          width: "100%",
        }}
      >
        <div style={{ width: "40%" }}>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1F4061",
              fontFamily: "Manrope",
            }}
          >
            Enquiry List
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            width: "60%",
            justifyContent: "end",
          }}
        >
          <div
            className="input-group flex-nowrap"
            style={{
              width: "380px",
              height: "36px",
              borderRadius: "8px",
              border: "1px solid #1F4061",
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
                    stroke="#1F4061"
                    stroke-width="1.5"
                  />
                  <path
                    d="M14.1667 13.3333L15.5 14.6666"
                    stroke="#1F4061"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_582_4295">
                    <rect
                      width="16"
                      height="16"
                      fill="#1F4061"
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
              placeholder="Search by Phone no. | Email | Type ...."
              aria-label="Search"
              aria-describedby="addon-wrapping"
              onChange={handleSearch}
              value={searchQuery}
            />
          </div>
          <div
            onClick={handleAddEnquiry}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              backgroundColor: "#1F4061",
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
                color: "white",
                fontSize: "14px",
                fontWeight: "700",
                fontFamily: "Manrope",
              }}
            >
              General Enquiry 
            </span>
          </div>
          {/* <div
            onClick={handleAdmissionModal}
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
                color: "white",
                fontSize: "14px",
                fontWeight: "700",
                fontFamily: "Manrope",
              }}
            >
              Admission Enquiry (F3)
            </span>
          </div> */}
        </div>
      </div>
      <div className="modal-body" style={{ backgroundColor: "#F2F6FF" }}>
        <div style={{ overflowX: "auto" }}>
          <table
            className="table table-striped table-hover"
            style={{ minWidth: "1800px" }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "rgb(242, 246, 255)",
                  borderBottom: "1px solid #E0E4F0",
                  fontWeight: "600",
                  color: "#1C335C",
                }}
              >
                {[
                  "Enquiry ID",
                  "Enquiry Type",
                  "Full Name",
                  "Email",
                  "Phone Number",
                  "DOB",
                  "Gender",
                  "Guardian Name",
                  "Guardian Phone",
                  "Reference",
                  "Source",
                  "Follow Up Date",
                  "Note",
                  "Status",
                  "Created At",
                  "Action",
                ].map((header, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "12px 20px",
                      textAlign: "center",
                      position: header === "Enquiry ID" ? "sticky" : "static",
                      left: header === "Enquiry ID" ? 0 : "auto",
                      zIndex: header === "Enquiry ID" ? 99 : "auto",
                    }}
                  >
                    {header}
                  </th>
                ))}
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
                      borderBottom: "2px solid #E0E4F0",
                      color: "#1F4061",
                    }}
                  >
                    {/* Enquiry ID (sticky) */}
                    <td
                      style={{
                        textAlign: "center",
                        position: "sticky",
                        left: 0,
                        zIndex: 2,
                        backgroundColor:
                          index % 2 === 0 ? "rgb(242, 246, 255)" : "#FFFFFF",
                        fontWeight: "600",
                      }}
                    >
                      {item.enquiry_id}
                    </td>

                    {/* Type */}
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          backgroundColor:
                            item.enquiry_type === "Admission"
                              ? "#B1E3FF"
                              : "#FFE7E1",
                          color:
                            item.enquiry_type === "Admission"
                              ? "#1C335C"
                              : "#ED5578",
                          fontWeight: "600",
                        }}
                      >
                        {item.enquiry_type}
                      </span>
                    </td>

                    <td style={{ textAlign: "center" }}>{item.full_name}</td>
                    <td style={{ textAlign: "center" }}>{item.email}</td>
                    <td style={{ textAlign: "center" }}>{item.phone_number}</td>
                    <td style={{ textAlign: "center" }}>
                      {formatDate(item.dob)}
                    </td>
                    <td style={{ textAlign: "center" }}>{item.gender}</td>
                    <td style={{ textAlign: "center" }}>
                      {item.guardian_name || "-"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {item.guardian_phone || "-"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {item.reference_name || "-"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {item.source_name || "-"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {formatDate(item.follow_up_date)}
                    </td>
                    <td style={{ textAlign: "center" }}>{item.note || "-"}</td>

                    {/* Status badge */}
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          backgroundColor:
                            item.status === "New"
                              ? "#E3F2FD"
                              : item.status === "In Progress"
                              ? "#B1E3FF"
                              : item.status === "Deferred"
                              ? "#FFF3CD"
                              : item.status === "Confirmed"
                              ? "#C0EBA6"
                              : item.status === "Closed"
                              ? "#FFE7E1"
                              : "#F1F1F1",
                          color:
                            item.status === "New"
                              ? "#0066FF"
                              : item.status === "In Progress"
                              ? "#1976D2"
                              : item.status === "Deferred"
                              ? "#B26A00"
                              : item.status === "Confirmed"
                              ? "#347928"
                              : item.status === "Closed"
                              ? "#D32F2F"
                              : "#444",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Created At */}
                    <td style={{ textAlign: "center" }}>
                      {formatDate(item.created_at) || "-"}
                    </td>

                    {/* Actions */}
                    <td
                      style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "none",
                      }}
                    >
                      {/* Edit (only for General) */}
                      {item.enquiry_type === "General" && (
                        <button
                          onClick={() =>
                            handleModalGeneralEdit(item.enquiry_id)
                          }
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#1F4061",
                            borderRadius: "5px",
                            cursor: "pointer",
                            border: "none",
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          Edit
                        </button>
                      )}

                      {/* Action */}
                      <button
                        onClick={() => handleActionModal(item.enquiry_id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#FFE7E1",
                          borderRadius: "5px",
                          cursor: "pointer",
                          border: "none",
                          color: "#ED5578",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        Action
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="16"
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

            <CreateGeneralEnquiry
              show={showAddEnquiry}
              handleClose={handleAddEnquiryClose}
              setRefresh={setRefresh}
            />
            {/* <CreateWalkinAdmission
              show={showAdmissionModal}
              handleClose={handleAdmissionModalClose}
              setRefresh={setRefresh}
            />
            <CreateEnquiryAction
              show={showActionModal}
              handleClose={handleActionModalClose}
              enqId={enqId}
              setRefresh={setRefresh}
            /> */}
            {/* <CreateEditGeneral
              show={showGeneralEditModal}
              handleClose={handleModalGeneralEditClose}
              enqId={enqId}
              setRefresh={setRefresh}
            /> */}
            {/* <CreateEditAdmission
              show={showAdmissionEditModal}
              handleClose={handleModalAdmissionEditClose}
              enqId={enqId}
              setRefresh={setRefresh}
            /> */}

            {/* end::Table body */}
          </table>
        </div>
      </div>
      {/* end::Table */}
    </div>
  );
};

export { TablesWidget34 };
