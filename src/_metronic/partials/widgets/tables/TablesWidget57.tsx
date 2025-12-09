/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
import { CreateAdmissionEnquiryReject } from "../../modals/create-app-stepper/CreateAdmissionEnquiryReject";
import { CreateStartAdmissionProcess } from "../../modals/create-app-stepper/CreateStartAdmissionProcess";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { ReviewApplication } from "../../modals/create-app-stepper/ReviewApplication";
import { CreateWalkinAdmission } from "../../modals/create-app-stepper/CreateWalkinAdmission";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

interface AdmissionData {
  id: number;
  admission_enquiry_id: string;
  enquiry_id: string;
  student_name: string;
  student_phone: string;
  student_address: string;
  student_email: string;
  gender: string;
  date_of_birth: string;
  blood_group: string;
  height_cm: string;
  weight_kg: string;
  aadhar_number: string;
  wrestling_level: string;
  previous_training_center: string;
  training_duration: string;
  tournaments_participated: string;
  current_school: string;
  academic_year: string;
  session_id: string;
  father_name: string;
  father_phone: string;
  mother_name: string;
  mother_phone: string;
  class_id: string;
  status: string;
  rejection_reason: string;
  interview_date: string;
  created_at: string;
  updated_at: string;
  updated_by: string;
  school_id: string;
  // ...add any other fields as needed
}

const TablesWidget57: React.FC = () => {
  const [data, setData] = useState<AdmissionData[]>([]);

  const [filteredData, setFilteredData] = useState<AdmissionData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const sessionId = currentUser?.session_id;
  const [classes, setClasses] = useState({});

  const [showActionModal, setShowActionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAddAdmission, setShowAddAdmission] = useState(false);
  const [enqId, setEnqId] = useState("");
  const [referesh, setRefresh] = useState(false);
  const [isReviwed, setIsReviwed] = useState("");

  // Fetch admissions
  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/getadmissionenquiries/${schoolId}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const responseData = await response.json();
        setData(responseData);
        setFilteredData(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAdmissions();
    setRefresh(false);
  }, [schoolId, referesh]);

  // Search handler
  const handleSearch = (e: any) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = data.filter(
      (item) =>
        (item.student_name &&
          item.student_name.toLowerCase().includes(query)) ||
        (item.status && item.status.toLowerCase().includes(query)) ||
        (item.student_email && item.student_email.toLowerCase().includes(query))
    );
    setFilteredData(filtered);
  };

  // Copy global admission form link handler
  const handleCopyGlobalLink = () => {
    // Take secret key from env
    const secretKey = import.meta.env.VITE_SYSTEM_KEY;

    // Encrypt the school id
    const encryptedId = CryptoJS.AES.encrypt(schoolId, secretKey).toString();

    // Encode for URL safety
    const encodedId = encodeURIComponent(encryptedId);

    // Build the link with query param
    const link = `${window.location.origin}/admission-form?query=${encodedId}`;

    navigator.clipboard.writeText(link);
    toast.success("Global admission form link copied!");
  };

  // Modal handlers
  const handleActionModal = (value: string) => {
    setEnqId(value);
    setShowActionModal(true);
  };
  const handleActionModalClose = () => setShowActionModal(false);

  const handleModalEdit = (value: string) => {
    setEnqId(value);
    setShowEditModal(true);
  };
  const handleModalReview = (value: string) => {
    setEnqId(value);
    setShowReviewModal(true);
  };
  const handleModalEditClose = () => {
    setShowEditModal(false);
    setRefresh(true);
  };
  const handleModalReviewClose = () => {
    setShowReviewModal(false);
    setRefresh(true);
    setEnqId("");
  };

  // Add Admission Modal
  const handleAddAdmission = () => {
    const secretKey = import.meta.env.VITE_SYSTEM_KEY;

    // Encrypt the school id
    const encryptedId = CryptoJS.AES.encrypt(schoolId, secretKey).toString();

    // Encode for URL safety
    const encodedId = encodeURIComponent(encryptedId);
    window.open(`/admission-form?query=${encodedId}`, "_blank");
  };
  // const handleAddAdmissionClose = () => {
  //   setShowAddAdmission(false);
  // };

  // Date formatter
  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    // @ts-ignore
    return date.toLocaleDateString("en-GB", options);
  };

  useEffect(() => {
    const fetchClasses = async () => {
      if (!schoolId || data.length === 0) return;
      try {
        const res = await fetch(
          `${DOMAIN}/api/school/get-classes-for-session/${schoolId}/${sessionId}`
        );
        if (!res.ok) throw new Error("Failed to fetch classes");

        const responseData = await res.json();

        // Convert array → object { class_id: class_name }
        const classMap = responseData.reduce((acc, cls) => {
          acc[cls.class_id] = cls.class;
          return acc;
        }, {} as Record<string, string>);

        setClasses(classMap);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };

    fetchClasses();
  }, [schoolId, data, sessionId]);
  
  return (
    <>
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
            Admission Management List
          </span>
          <div style={{ display: "flex", gap: "12px" }}>
            <div
              className="input-group flex-nowrap"
              style={{
                width: "400px",
                height: "44px",
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
                  <g clipPath="url(#clip0_582_4295)">
                    <circle
                      cx="8.5"
                      cy="7.67"
                      r="6.33"
                      stroke="#1C335C"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M14.1667 13.3333L15.5 14.6666"
                      stroke="#1C335C"
                      strokeWidth="1.5"
                      strokeLinecap="round"
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
                placeholder="Search by Student Name, Email, Status..."
                aria-label="Search"
                aria-describedby="addon-wrapping"
                onChange={handleSearch}
                value={searchQuery}
              />
            </div>
            <Button
              style={{
                backgroundColor: "#1C335C",
                border: "none",
                borderRadius: "8px",
                fontFamily: "Manrope",
                fontWeight: 700,
                fontSize: "14px",
              }}
              onClick={handleAddAdmission}
            >
              + Add Admission
            </Button>
            <Button
              style={{
                backgroundColor: "#1C335C",
                border: "none",
                borderRadius: "8px",
                fontFamily: "Manrope",
                fontWeight: 700,
                fontSize: "14px",
              }}
              onClick={handleCopyGlobalLink}
            >
              Copy Form Link
            </Button>
          </div>
        </div>
        <div
          style={{
            height: "660px",
            overflowY: "auto",
            overflowX: "auto",
            padding: "16px 0",
          }}
        >
          <table
            className="table"
            style={{
              minWidth: "1800px",
              borderCollapse: "collapse",
              marginTop: "10px",
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "rgb(242, 246, 255)",
                  borderBottom: "1px solid #E0E4F0",
                  fontFamily: "Manrope",
                  fontWeight: "600",
                  color: "#1C335C",
                  fontSize: "14px",
                }}
              >
                <th style={{ padding: "12px 20px" }}>Confirmed Date</th>
                <th style={{ padding: "12px 20px" }}>Student Name</th>
                <th style={{ padding: "12px 20px" }}>
                  {schoolId === "AMO-2509097151" ? "Group" : "Class"}
                </th>
                <th style={{ padding: "12px 20px" }}>Gender</th>
                <th style={{ padding: "12px 20px" }}>Date Of Birth</th>
                <th style={{ padding: "12px 20px" }}>Email</th>
                <th style={{ padding: "12px 20px" }}>Student Phone</th>
                <th style={{ padding: "12px 20px" }}>Father Name</th>
                <th style={{ padding: "12px 20px" }}>Mother Name</th>
                <th style={{ padding: "12px 20px" }}>Status</th>
                <th style={{ padding: "12px 20px", textAlign: "center" }}>
                  Action
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
                      height: "auto",
                    }}
                  >
                    <td style={{ padding: "20px 20px" }}>
                      {formatDate(item.created_at)}
                    </td>
                    <td style={{ padding: "20px 20px" }}>
                      {item.student_name}
                    </td>
                    <td style={{ padding: "20px 20px" }}>
                      {classes[item.class_id]}
                    </td>

                    <td style={{ padding: "20px 20px" }}>{item.gender}</td>
                    <td style={{ padding: "20px 20px" }}>
                      {formatDate(item.date_of_birth)}
                    </td>
                    <td style={{ padding: "20px 20px" }}>
                      {item.student_email}
                    </td>
                    <td style={{ padding: "20px 20px" }}>
                      {item.student_phone}
                    </td>
                    <td style={{ padding: "20px 20px" }}>{item.father_name}</td>
                    <td style={{ padding: "20px 20px" }}>{item.mother_name}</td>
                    <td style={{ padding: "20px 20px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          backgroundColor:
                            item.status === "isReviewed"
                              ? "#ffeb9c"
                              : item.status === "isCompleted"
                              ? "#d8ff9c"
                              : item.status === "isRejected"
                              ? "#fc7865"
                              : item.status === "isSubmited"
                              ? "#65e8fc"
                              : item.status === "isPending"
                              ? "yellow"
                              : "#d1fc65",
                          color: "#1C335C",
                          fontWeight: 600,
                          fontSize: "12px",
                        }}
                      >
                        {{
                          isRejected: "Rejected",
                          isSubmited: "Submitted",
                          isPending: "Pending",
                        }[item.status] || item.status}
                      </span>
                    </td>
                    <td
                      style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "12px 20px",
                        border: "none",
                      }}
                    >
                      <Button
                        variant="primary"
                        style={{
                          backgroundColor: "#1C335C",
                          border: "none",
                          borderRadius: "8px",
                          fontFamily: "Manrope",
                          fontWeight: 700,
                          fontSize: "14px",
                        }}
                        onClick={() =>
                          handleModalReview(item.admission_enquiry_id)
                        }
                      >
                        {item.status === "isPending"
                          ? "Review Application"
                          : "View Application"}
                      </Button>
                      <Button
                        variant="outline-danger"
                        style={{
                          borderRadius: "8px",
                          fontFamily: "Manrope",
                          fontWeight: 700,
                          fontSize: "14px",
                        }}
                        onClick={() =>
                          handleActionModal(item.admission_enquiry_id)
                        }
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={12}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      fontFamily: "Manrope",
                      fontSize: "16px",
                      color: "#1F4061",
                    }}
                  >
                    No Admission enquiries were confirmed yet. Please add an
                    admission first.
                  </td>
                </tr>
              )}
            </tbody>
            <CreateAdmissionEnquiryReject
              show={showActionModal}
              handleClose={handleActionModalClose}
              enqId={enqId}
              setRefresh={setRefresh}
            />
            <ReviewApplication
              show={showReviewModal}
              handleClose={handleModalReviewClose}
              enqId={enqId}
              isReviwed={isReviwed}
              setRefresh={setRefresh}
              noaccept={true}
            />
            {/* <CreateWalkinAdmission
              show={showAddAdmission}
              handleClose={handleAddAdmissionClose}
              setRefresh={setRefresh}
            /> */}
          </table>
        </div>
      </div>
    </>
  );
};

export { TablesWidget57 };
