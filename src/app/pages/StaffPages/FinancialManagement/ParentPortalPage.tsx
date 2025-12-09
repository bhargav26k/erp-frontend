import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import axios from "axios";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import { useLocation } from "react-router-dom";
import { ShowTransactions } from "../../../../_metronic/partials/modals/create-app-stepper/ShowTransactions";
import { ShowDetailedTranscation } from "../../../../_metronic/partials/modals/create-app-stepper/ShowDetailedTranscation";
import { GenerateReciept } from "./GenerateReciept";
import ParentPortalCalender from "../../../../_metronic/partials/widgets/_new/cards/ParentPortalCalender";
import { Modal, Button, Table } from "react-bootstrap";
import StudentTimeTable from "../../../../_metronic/partials/widgets/_new/cards/StudentTimeTable";
import Loader from "../../../routing/Loader";

const SECRET_KEY = import.meta.env.VITE_SYSTEM_KEY; // Secure Key from .env

interface EditBucket {
  class_id: number;
  section_id: number;
  log_date: string; // "YYYY-MM-DD"
  class_name: string;
  section_name: string;
  is_approved: number;
  entries: Array<{
    id: number; // daily_log primary key
    subject_id: number;
    subject_name: string;
    class_work: string;
    home_work: string;
    document: string | null;
    staff_id: number;
    is_approved: number;
    created_at: string;
    updated_at: string;
  }>;
}

// Function to decrypt school ID
const decryptData = (encryptedData: string) => {
  try {
    if (!encryptedData) throw new Error("Encrypted data is missing");

    const formattedKey = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const decodedData = decodeURIComponent(encryptedData);

    const bytes = CryptoJS.AES.decrypt(decodedData, formattedKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      throw new Error("Decryption failed: Empty result");
    }

    return decryptedText;
  } catch (error) {
    console.error("⛔ Decryption Error:", error);
    return null;
  }
};

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const ParentPortalPage = () => {
  const navigate = useNavigate();
  // Removed the stray "log" that was causing a syntax error.
  const location = useLocation();
  const domain = window.location.origin + "/";
  const isMobile = useMobile();

  // Extract the `status` query parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const encryptedData = queryParams.get("id");
  const studentsId = queryParams.get("studentId");
  const [pageReady, setPageReady] = useState(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [schoolId, setschoolId] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  // Even if you're not using schoolDetails in your render, it's common to destructure both values.
  const [schoolDetails, setSchoolDetails] = useState<string>("");

  const [studentDetails, setStudentDetails] = useState<string>("");

  const [studentFeesDetails, setStudentFeesDetails] = useState([]);
  const [studentTrasncations, setStudentTrasncations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceiptNumber, setSelectedReceiptNumber] = useState<
    string | null
  >(null);
  const [activeSection, setActiveSection] = useState<
    "dashboard" | "fees" | "timetable"
  >("dashboard");

  const [currentPage, setCurrentPage] = useState(1);
  const [circulars, setCirculars] = useState<any[]>([]);
  const [dailyLog, setDailyLog] = useState<any[]>([]);

  const [selectedCircular, setSelected] = useState<any>(null);
  const [selectedDailyLog, setSelectedDailyLog] = useState<any>(null);
  console.log(selectedDailyLog);

  const [showNoticeModal, setShowNotice] = useState(false);
  const [showDailylog, setShowDailylog] = useState(false);

  const itemsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(studentTrasncations.length / itemsPerPage);

  // Determine which items to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = studentTrasncations.slice(startIndex, endIndex);

  const [loadingStates, setLoadingStates] = useState({
    initializing: true,
    schoolDetails: false,
    studentDetails: false,
    feesDetails: false,
    transactions: false,
    circulars: false,
    dailyLogs: false
  });

  // Helper function to update specific loading state
  const updateLoadingState = (key: keyof typeof loadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  };

  // Check if any loading is in progress
  const isLoading = Object.values(loadingStates).some(state => state);

  // Get current loading message
  const getLoadingMessage = () => {
    if (loadingStates.initializing) return "Initializing Your Portal...";
    if (loadingStates.schoolDetails) return "Loading School Details...";
    if (loadingStates.studentDetails) return "Verifying Student Information...";
    if (loadingStates.feesDetails) return "Loading Fee Details...";
    if (loadingStates.transactions) return "Loading Transaction History...";
    if (loadingStates.circulars) return "Loading Notices & Circulars...";
    if (loadingStates.dailyLogs) return "Loading Daily Reports...";
    return "Loading...";
  };
  
  // Helper functions to change pages
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const [activeTab, setActiveTab] = useState("pending");
  const [logo, setLogo] = useState<string | null>(null);
  const sessionId = studentDetails?.session_id;
  const sectionId = studentDetails?.section_id;
  const classId = studentDetails?.class_id;
  const encData = encryptedData || "";
  // 🔹 Secure Session Handling
  useEffect(() => {
    let sessionTimeout: ReturnType<typeof setTimeout>;

    const timer = setTimeout(() => {
      const sessionToken = Cookies.get("sessionToken");

      if (!sessionToken) {
        console.warn("Session expired or tampered!");
        navigate(
          `/parent-portal/userlogin?id=${encodeURIComponent(encryptedData)}`,
          { replace: true }
        );
        return;
      }

      sessionTimeout = setTimeout(() => {
        Cookies.remove("sessionToken");
        alert("Session expired! Redirecting...");
        navigate(
          `/parent-portal/userlogin?id=${encodeURIComponent(encryptedData)}`,
          { replace: true }
        );
      }, 15 * 60 * 1000);
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(sessionTimeout);
    };
  }, [navigate, encryptedData]);

  // 🔹 Decrypt school ID & Validate URL Params
  useEffect(() => {
    if (!encryptedData || !studentsId) {
      setError("Invalid or missing data in URL.");
      updateLoadingState("initializing", false);
      return;
    }

    const decryptedSchoolId = decryptData(encryptedData);

    if (!decryptedSchoolId) {
      setError("Invalid School ID.");
      updateLoadingState("initializing", false);
      return;
    }

    Cookies.set("sessionToken", encryptedData, {
      expires: 1 / 96,
      secure: true,
      sameSite: "Strict",
    });

    setTimeout(() => {
      setschoolId(decryptedSchoolId);
      updateLoadingState("initializing", false);
    }, 500);
  }, [encryptedData, studentsId, navigate]);

  // 🔹 Fetch School Details
  useEffect(() => {
    const fetchSchool = async () => {
      try {
        if (!schoolId) return;

        updateLoadingState("schoolDetails", true);
        const response = await axios.get(
          `${DOMAIN}/get-schooldetails/${schoolId}`
        );

        if (response.status !== 200) {
          throw new Error(
            `Unexpected response status: ${response.status} ${response.statusText}`
          );
        }

        if (!response.data || Object.keys(response.data).length === 0) {
          throw new Error("❌ API returned an empty object.");
        }

        setSchoolDetails(response.data);

        const logoResponse = await fetch(
          `${DOMAIN}/api/school/get_school_logo`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ school_logo: response.data.school_logo }),
          }
        );

        if (!logoResponse.ok) {
          throw new Error("Failed to fetch logo");
        }

        const blob = await logoResponse.blob();
        const imageObjectURL = URL.createObjectURL(blob);
        setLogo(imageObjectURL || "");
      } catch (error: any) {
        setError(error.message || "Error fetching school details");
      } finally {
        updateLoadingState("schoolDetails", false);
      }
    };

    fetchSchool();
  }, [schoolId]);

  // 🔹 Check if Student ID Exists for the Given School
  useEffect(() => {
    if (!schoolId || !studentsId) return;

    const fetchStudentDetails = async () => {
      updateLoadingState("studentDetails", true);
      try {
        const type = schoolDetails?.web_type;
        const response = await axios.get(
          `${DOMAIN}/get-checkStudentdetails/${schoolId}/${studentsId}/${type}`
        );

        if (response.status !== 200) {
          throw new Error(
            `Unexpected response status: ${response.status} ${response.statusText}`
          );
        }

        if (!response.data || Object.keys(response.data).length === 0) {
          throw new Error("Student not found.");
        }

        setStudentDetails(response.data);
        setStudentId(response.data.admission_no);
      } catch (error: any) {
        console.error("Error fetching student details:", error);
        setError(
          "Student ID is wrong or the student does not belong to this school."
        );

        setTimeout(() => {
          navigate(
            `/parent-portal/userlogin?id=${encodeURIComponent(encData)}`,
            { replace: true }
          );
        }, 5000);
      } finally {
        updateLoadingState("studentDetails", false);
      }
    };

    fetchStudentDetails();
  }, [schoolId, studentsId, schoolDetails?.web_type, navigate]);

  // 🔹 Fetch Fees Details
  useEffect(() => {
    const fetchFeesDetailsStudentWise = async () => {
      if (!schoolId || !studentDetails || !studentDetails.session_id) return;

      try {
        if (!schoolId || !studentId || !sessionId) {
          setError("Missing school or student ID or sessionId.");
          return;
        }

        updateLoadingState("feesDetails", true);

        const response = await axios.get(
          `${DOMAIN}/get-feesgroup/${schoolId}/${studentId}/${sessionId}`
        );

        if (response.status !== 200) {
          throw new Error(
            `Unexpected response status: ${response.status} ${response.statusText}`
          );
        }

        if (!response.data || Object.keys(response.data).length === 0) {
          throw new Error("No fee data found for this student.");
        }

        setStudentFeesDetails(response.data.data);
      } catch (error: any) {
        console.error("Error fetching student fee details:", error);
        setError(
          "Could not retrieve student fee information. Please try again."
        );

        setTimeout(() => {
          navigate(
            `/parent-portal/userlogin?id=${encodeURIComponent(encData)}`,
            { replace: true }
          );
        }, 5000);
      } finally {
        updateLoadingState("feesDetails", false);
      }
    };

    fetchFeesDetailsStudentWise();
  }, [schoolId, studentId, sessionId, studentDetails]);

  // 🔹 Fetch Transactions
  useEffect(() => {
    const fetchTranscationStudentWise = async () => {
      if (!studentDetails || !studentDetails.session_id) return;

      try {
        if (!schoolId || !studentId || !sessionId) {
          setError("Missing school or student ID or sessionId.");
          return;
        }

        updateLoadingState("transactions", true);

        const response = await axios.get(
          `${DOMAIN}/get-fee-trasncations-studentwise/${schoolId}/${studentId}/${sessionId}`
        );

        setStudentTrasncations(response.data);
      } catch (error: any) {
        console.error("Error fetching student transaction details:", error);
        setError(
          "Could not retrieve student transaction information. Please try again."
        );

        setTimeout(() => {
          navigate(
            `/parent-portal/userlogin?id=${encodeURIComponent(encData)}`,
            { replace: true }
          );
        }, 5000);
      } finally {
        updateLoadingState("transactions", false);
      }
    };

    fetchTranscationStudentWise();
  }, [schoolId, studentId, sessionId, studentDetails]);

  // 🔹 Fetch Circulars
  useEffect(() => {
    if (!schoolId || !sessionId || !classId) return;

    const fetchCirculars = async () => {
      updateLoadingState("circulars", true);
      try {
        const response = await fetch(
          `${DOMAIN}/get-circulars-classwise/${classId}/${schoolId}/${sessionId}`
        );

        if (!response.ok) throw new Error(response.statusText);

        const data = await response.json();
        setCirculars(data.filter((c: any) => c.visibility === "public"));
      } catch (error) {
        console.error("Error fetching circulars:", error);
      } finally {
        updateLoadingState("circulars", false);
      }
    };

    fetchCirculars();
  }, [schoolId, sessionId, classId]);

  // 🔹 Fetch Daily Logs
  useEffect(() => {
    if (!schoolId || !sessionId || !classId || !sectionId) return;

    const fetchDailyLogs = async () => {
      updateLoadingState("dailyLogs", true);
      try {
        const response = await fetch(
          `${DOMAIN}/api/student/get-daily-logs-classwise/${schoolId}/${sessionId}/${classId}/${sectionId}`
        );

        if (!response.ok) throw new Error(response.statusText);

        const data = await response.json();
        const groupedMap: Record<string, EditBucket> = {};

        data.logs.forEach((row: any) => {
          const dateKey = new Date(row.log_date).toISOString().slice(0, 10);
          const groupingKey = `${row.class_id}|${row.section_id}|${dateKey}`;

          if (!groupedMap[groupingKey]) {
            groupedMap[groupingKey] = {
              class_id: row.class_id,
              section_id: row.section_id,
              log_date: dateKey,
              class_name: row.class_name,
              section_name: row.section_name,
              is_approved: row.is_approved ? 1 : 0,
              entries: [],
            };
          } else {
            if (row.is_approved) {
              groupedMap[groupingKey].is_approved = 1;
            }
          }

          groupedMap[groupingKey].entries.push({
            id: row.id,
            subject_id: row.subject_id,
            subject_name: row.subject_name,
            class_work: row.class_work,
            home_work: row.home_work,
            document: row.document,
            staff_id: row.staff_id,
            is_approved: row.is_approved,
            created_at: row.created_at,
            updated_at: row.updated_at,
          });
        });

        setDailyLog(Object.values(groupedMap));
      } catch (error) {
        console.error("Error fetching daily logs:", error);
      } finally {
        updateLoadingState("dailyLogs", false);
      }
    };

    fetchDailyLogs();
  }, [schoolId, sessionId, classId, sectionId]);

  const openNotice = (c: any) => {
    setSelected(c);
    setShowNotice(true);
  };
  const closeNotice = () => {
    setShowNotice(false);
    setSelected(null);
  };
  const openDailyLog = (c: any) => {
    setSelectedDailyLog(c);
    setShowDailylog(true);
  };
  const closeDailyLog = () => {
    setShowDailylog(false);
    setSelected(null);
  };

  const formatDateCircular = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // 📌 Handle Payment (stubbed)
  const handlePayment = (fee: any) => {
    alert(`Redirecting to payment for ${fee.term}`);
    // Implement payment API call here
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 📌 Logout Function (Clears session)
  const handleLogout = () => {
    Cookies.remove("sessionToken");
    sessionStorage.clear();
    localStorage.clear();
    navigate(`/parent-portal/userlogin?id=${encodeURIComponent(encData)}`, {
      replace: true,
    });
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const FrontDomain = schoolDetails?.front_domain;
  const secretKey = import.meta.env.VITE_SYSTEM_KEY;
  const createPaymentLink = (groupId: number, part_payment: any) => {
    const dataToEncrypt = {
      student_id: studentId,
      school_id: schoolId,
      group_id: groupId,
      session_id: sessionId,
      process_type: "existing",
      payment_type: part_payment === 0 ? "full" : "partial",
    };

    const className = studentDetails?.class_name;

    const encryptData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      secretKey
    ).toString();

    const paymentUrl = `${FrontDomain}fee-payment?school_id=${schoolId}&session_id=${sessionId}&class_name=${className}&&data=${encodeURIComponent(
      encryptData
    )}`;

    window.open(paymentUrl, "_blank");
  };

  const openModal = (receiptNumber: number) => {
    setSelectedReceiptNumber(receiptNumber);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReceiptNumber(null);
  };

  const fetchTransactionDetails = async (transactionId) => {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(transactionId),
      secretKey
    ).toString();
    const receiptUrl = `${domain}fee-reciept?schoolId=${schoolId}&data=${encodeURIComponent(
      encryptedData
    )}`;
    window.open(receiptUrl, "_blank");
  };

  // Secure Navigation & Error Handling
  if (isLoading) {
    return <Loader message={getLoadingMessage()} overlay={true} />;
  }

  // Render error screen
  if (error) {
    return (
      <div className="error-screen">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "fit-content" }}>
      {/* Header */}
      <nav
        style={{
          backgroundColor: "#1C335C",
          padding: "1rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1rem",
          }}
        >
          {/* Logo Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <i
              className="fas fa-university"
              style={{
                color: "#fff",
                fontSize: isMobile ? "1.5rem" : "1.8rem",
              }}
            ></i>
            <span
              style={{
                color: "#fff",
                fontSize: isMobile ? "1.2rem" : "1.8rem",
                fontWeight: "700",
                fontFamily: "Manrope, sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              Parent's Portal
            </span>
          </div>

          {/* Student Info & Logout */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {/* Student ID with Hover Tooltip */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <i
                  className="fas fa-user-graduate"
                  style={{
                    color: "#fff",
                    fontSize: "1.2rem",
                    padding: "0.3rem",
                  }}
                ></i>
                {!isMobile && (
                  <span
                    style={{
                      color: "#fff",
                      fontSize: "1.1rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "200px",
                    }}
                  >
                    Student ID: {studentId}
                  </span>
                )}
              </div>
              {/* Hover Tooltip */}
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "rgba(0,0,0,0.8)",
                  color: "#fff",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                  visibility: "hidden",
                  opacity: 0,
                  transition: "all 0.2s ease",
                  pointerEvents: "none",
                }}
              >
                Student ID: {studentId}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                padding: isMobile ? "0.5rem" : "0.5rem 1rem",
                backgroundColor: "transparent",
                border: "1px solid #fff",
                borderRadius: "0.25rem",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s ease",
              }}
            >
              <i
                className="fas fa-sign-out-alt"
                style={{ fontSize: isMobile ? "1rem" : "1.8rem" }}
              ></i>
              {!isMobile && <span style={{ fontSize: "1.1rem" }}>Logout</span>}
            </button>
          </div>
        </div>
      </nav>
      <header className="text-center mb-4">
        {logo ? (
          <img
            src={logo}
            alt="School Logo"
            style={{ width: "100px", height: "auto", marginBottom: "10px" }}
          />
        ) : (
          <i
            className="fas fa-school"
            style={{ fontSize: "48px", color: "#1C335C" }}
          ></i>
        )}
        <h2 className="mt-3">{schoolDetails ? schoolDetails.name : ""}</h2>
        <p className="text-muted">
          {schoolDetails ? schoolDetails.tagline : ""}
        </p>

        {schoolDetails && schoolDetails.address && (
          <p className="mt-2">
            <strong>Address:</strong> {schoolDetails.address}
          </p>
        )}
        {schoolDetails && schoolDetails.email && (
          <p className="mt-1">
            <strong>Email:</strong>{" "}
            <a href={`mailto:${schoolDetails.email}`}>{schoolDetails.email}</a>
          </p>
        )}
      </header>

      {/* Student Information Section */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "20px 10px" : "40px 20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            padding: isMobile ? "16px" : "24px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : "repeat(4, 1fr)",
              gap: isMobile ? "12px" : "20px",
            }}
          >
            {[
              {
                icon: "fa-address-card",
                label: "Admission No.",
                value: studentDetails.admission_no,
              },
              {
                icon: "fa-user-graduate",
                label: "Student Name",
                value: studentDetails.student_name,
              },
              {
                icon: "fa-envelope",
                label: "Student Email",
                value: studentDetails.email,
              },
              {
                icon: "fa-phone",
                label: "Student Phone",
                value: studentDetails.mobileno,
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  textAlign: "center",
                  padding: isMobile ? "10px" : "15px",
                  borderRight:
                    !isMobile && index < 4 ? "1px solid #eee" : "none",
                }}
              >
                <div
                  style={{
                    color: "#1C335C",
                    marginBottom: isMobile ? "4px" : "8px",
                  }}
                >
                  <i
                    className={`fas ${item.icon}`}
                    style={{
                      fontSize: isMobile ? "20px" : "24px",
                    }}
                  ></i>
                </div>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: isMobile ? "12px" : "14px",
                    marginBottom: "4px",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    color: "#1C335C",
                    fontSize: isMobile ? "14px" : "16px",
                    fontWeight: "600",
                    wordBreak: "break-word",
                  }}
                >
                  {item.value || "-"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          margin: "0 auto 30px",
          maxWidth: "1200px",
        }}
      >
        {[
          { key: "dashboard", label: "Dashboard" },
          { key: "fees", label: "Fees" },
          { key: "timetable", label: "Time Table & Daily Logs" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key as any)}
            style={{
              padding: "10px 20px",
              border: "none",
              borderBottom:
                activeSection === key
                  ? "3px solid #1C335C"
                  : "3px solid transparent",
              background: "transparent",
              color: activeSection === key ? "#1C335C" : "#6c757d",
              fontWeight: activeSection === key ? 700 : 600,
              fontSize: "14px",
              cursor: "pointer",
              transition: "color .2s, border-bottom .2s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {activeSection === "dashboard" && (
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "20px",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >
          {/* ──── Calendar (70%) ──── */}
          <div
            style={{
              flex: isMobile ? "none" : "7",
              width: isMobile ? "100%" : undefined,
              backgroundColor: "transparent",

              minHeight: "fit-content",
            }}
          >
            {schoolId && sessionId && (
              <ParentPortalCalender schoolId={schoolId} sessionId={sessionId} />
            )}
          </div>

          {/* ──── Notice Board (30%) ──── */}
          <div
            style={{
              flex: isMobile ? "none" : "3",
              width: isMobile ? "100%" : undefined,
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              padding: "20px",
              height: "530px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h4 style={{ marginBottom: "16px" }}>Notice Board</h4>
            <div
              style={{
                overflowY: "auto",
                flex: 1,
                overflowX: "hidden",
                paddingRight: "8px",
              }}
            >
              {circulars.length === 0 ? (
                <p style={{ color: "#6c757d", textAlign: "center" }}>
                  No public notices.
                </p>
              ) : (
                circulars.map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => openNotice(c)}
                    style={{
                      marginBottom: "12px",
                      padding: "12px",
                      borderLeft: "4px solid #1C335C",
                      backgroundColor: idx % 2 === 0 ? "#f8f9fa" : "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 600, color: "#1C335C" }}>
                      {c.title}
                    </div>
                    <div style={{ fontSize: "13px", color: "#4a4f55" }}>
                      Published on :{formatDateCircular(c.publish_date)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <Modal
            show={showNoticeModal}
            onHide={closeNotice}
            centered
            size="md"
            scrollable={false} // disable the built‐in react‐bootstrap scrolling, since we will handle it manually
          >
            <Modal.Header
              closeButton
              closeVariant="white"
              style={{ backgroundColor: "#1C335C" }}
            >
              <Modal.Title style={{ color: "#fff" }}>
                {selectedCircular?.title}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body
              style={{
                fontFamily: "Manrope, sans-serif",
                padding: "20px",
                // Make the entire body take up a fixed height relative to modal size.
                // Feel free to tweak 400px as needed.
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {/* Description heading */}
              <div style={{ marginBottom: "1rem" }}>
                <strong>Description:</strong>
              </div>

              {/* 
      1) Wrap the actual HTML in a <div> that uses `dangerouslySetInnerHTML`  
      2) That div will scroll if it becomes too tall 
    */}
              <div
                style={
                  {
                    // if you want the description itself to scroll separately from the "Classes" & "Publish Date" below,
                    // you could give this nested <div> its own maxHeight + overflow.
                    // But in this example, I let the Modal.Body scroll as a whole.
                  }
                }
                dangerouslySetInnerHTML={{
                  __html:
                    selectedCircular?.description ||
                    "<p><em>No description</em></p>",
                }}
              ></div>

              {selectedCircular?.document_path && (
                <div style={{ marginTop: "1.5rem" }}>
                  <strong>Attachment:</strong>{" "}
                  {selectedCircular.document_path
                    .toLowerCase()
                    .endsWith(".pdf") ? (
                    <a
                      href={`${DOMAIN}${encodeURI(
                        selectedCircular.document_path
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginLeft: "0.5rem",
                        textDecoration: "none",
                        color: "#1C335C",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <i
                        className="bi bi-file-earmark-pdf-fill"
                        style={{ fontSize: "20px", color: "#e74c3c" }}
                      ></i>
                      {selectedCircular.document_path.split("/").pop()}
                    </a>
                  ) : (
                    <a
                      href={`${DOMAIN}${encodeURI(
                        selectedCircular.document_path
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginLeft: "0.5rem",
                        textDecoration: "none",
                        color: "#1C335C",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <i
                        className="bi bi-image-fill"
                        style={{ fontSize: "20px", color: "#3498db" }}
                      ></i>
                      {selectedCircular.document_path.split("/").pop()}
                    </a>
                  )}
                </div>
              )}
              {/* Classes */}
              <div style={{ marginTop: "1.5rem" }}>
                <strong>Classes:</strong> {selectedCircular?.class_names}
              </div>

              {/* Publish Date */}
              <div style={{ marginTop: "1rem" }}>
                <strong>Publish Date:</strong>
                <br />
                <span style={{ color: "#4a4f55" }}>
                  {formatDateCircular(selectedCircular?.publish_date)}
                </span>
              </div>
            </Modal.Body>

            <Modal.Footer
              style={{ backgroundColor: "#f8f9fa", borderTop: "none" }}
            >
              <Button
                variant="secondary"
                onClick={closeNotice}
                style={{
                  backgroundColor: "#dde2ed",
                  color: "#1C335C",
                  border: "none",
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

      {activeSection === "fees" && (
        <>
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "40px 20px",
            }}
          >
            {/* Fee Summary Card */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                padding: isMobile ? "16px" : "24px",
                marginBottom: "30px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "repeat(2, 1fr)"
                    : "repeat(4, 1fr)",
                  gap: isMobile ? "12px" : "20px",
                }}
              >
                {[
                  {
                    icon: "fa-calendar-alt",
                    color: "#1C335C",
                    label: "Current Term",
                    value: studentDetails.session,
                  },
                  {
                    icon: "fa-check-circle",
                    color: "#28a745",
                    label: "Paid Amount",
                    value: `₹${studentDetails.paid_amount}`,
                  },
                  {
                    icon: "fa-exclamation-circle",
                    color: "#dc3545",
                    label: "Pending Amount",
                    value: `₹${studentDetails.pending_amount}`,
                  },
                  {
                    icon: "fa-file-invoice-dollar",
                    color: "#1C335C",
                    label: "Total Fees",
                    value: `₹${studentDetails.total_amount}`,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      textAlign: "center",
                      padding: isMobile ? "10px" : "15px",
                      borderRight:
                        !isMobile && index < 3 ? "1px solid #eee" : "none",
                    }}
                  >
                    <div
                      style={{
                        color: item.color,
                        marginBottom: isMobile ? "4px" : "8px",
                      }}
                    >
                      <i
                        className={`fas ${item.icon}`}
                        style={{
                          fontSize: isMobile ? "20px" : "24px",
                        }}
                      ></i>
                    </div>
                    <div
                      style={{
                        color: "#6c757d",
                        fontSize: isMobile ? "12px" : "14px",
                        marginBottom: "4px",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        color: item.color,
                        fontSize: isMobile ? "14px" : "18px",
                        fontWeight: "600",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: "2px",
                marginBottom: "20px",
              }}
            >
              {["pending", "history"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: activeTab === tab ? "#1C335C" : "#fff",
                    color: activeTab === tab ? "#fff" : "#1C335C",
                    border: "none",
                    borderRadius: "8px 8px 0 0",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <i
                    className={`fas fa-${
                      tab === "pending" ? "clock" : "history"
                    }`}
                  ></i>
                  {tab === "pending" ? "Pending Payments" : "Payment History"}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                padding: "24px",
              }}
            >
              {activeTab === "pending" ? (
                <div>
                  {studentFeesDetails.map((fee) => (
                    <div
                      key={fee.id}
                      style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        padding: "16px",
                        borderBottom: "1px solid #e9ecef",
                        gap: isMobile ? "12px" : "0",
                        height: "fit-content",
                      }}
                    >
                      {/* Top Row - Group Name and Status */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "10px",
                          width: isMobile ? "100%" : "120%",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            fontSize: isMobile ? "14px" : "16px",
                            fontWeight: "600",
                            color: "#1C335C",
                          }}
                        >
                          {fee.group_name}
                        </div>
                        <div
                          style={{
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: isMobile ? "12px" : "14px",
                            backgroundColor:
                              fee.status === "pending" ||
                              fee.status === "partial"
                                ? "#fff3cd"
                                : "#28a745",
                            color:
                              fee.status === "pending" ||
                              fee.status === "partial"
                                ? "#856404"
                                : "#fff",
                          }}
                        >
                          {fee.status}
                        </div>
                      </div>

                      {/* Middle Section - Details */}
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: isMobile ? "" : "center",
                          textAlign: isMobile ? "left" : "center",
                        }}
                      >
                        {fee.fine_amount > 0 && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#6c757d",
                              lineHeight: "1.5",
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                            }}
                          >
                            <div>Due Date: {formatDate(fee.due_date)}</div>
                            {fee.days_late > 0 && fee.status === "pending" && (
                              <>
                                <div style={{ color: "#DD4345" }}>
                                  Days Late: {fee.days_late}
                                </div>
                                <div style={{ color: "#1C335C" }}>
                                  Fine Amount: ₹{fee.fine_amount}
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {fee.rebate_amount > 0 && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#28a745",
                              borderRadius: "4px",
                            }}
                          >
                            Rebate Amount: ₹{fee.rebate_amount}
                          </div>
                        )}
                      </div>

                      {/* Bottom Section - Amount and Payment */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: isMobile ? "column" : "row",
                          justifyContent: "space-between",
                          alignItems: isMobile ? "flex-start" : "center",
                          width: "100%",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#62645C",
                            }}
                          >
                            Fee Amount: ₹{Number(fee.total_amount) || 0}
                          </div>
                          <div
                            style={{
                              fontSize: isMobile ? "14px" : "16px",
                              color: "#07BC0C",
                              fontWeight: "600",
                            }}
                          >
                            Total: ₹{Number(fee.pending_amount) || 0}
                          </div>
                        </div>

                        <div style={{ width: isMobile ? "100%" : "auto" }}>
                          <button
                            style={{
                              padding: "10px 16px",
                              backgroundColor:
                                fee.status === "pending" ||
                                fee.status === "partial"
                                  ? "#1C335C"
                                  : "#6c757d",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              cursor:
                                fee.status === "pending" ||
                                fee.status === "partial"
                                  ? "pointer"
                                  : "not-allowed",
                              opacity:
                                fee.status === "pending" ||
                                fee.status === "partial"
                                  ? 1
                                  : 0.6,
                              fontSize: "14px",
                              width: isMobile ? "100%" : "auto",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={() =>
                              createPaymentLink(
                                fee.fee_group_id,
                                fee.part_payment
                              )
                            }
                          >
                            <i
                              className="fas fa-credit-card"
                              style={{ marginRight: "8px" }}
                            ></i>
                            Pay Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {studentTrasncations.length === 0 ? (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <p style={{ color: "#6c757d" }}>
                        No transactions done yet.
                      </p>
                    </div>
                  ) : (
                    <>
                      {currentItems.map((fee) => (
                        <div
                          key={fee.id}
                          style={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            padding: "16px",
                            borderBottom: "1px solid #e9ecef",
                            gap: isMobile ? "12px" : "0",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "10px",
                              width: isMobile ? "100%" : "120%",
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: isMobile
                                  ? "space-around"
                                  : "space-between",
                                gap: "10px",
                                width: isMobile ? "100%" : "70%",
                                alignItems: "flex-start",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: isMobile ? "14px" : "16px",
                                  fontWeight: "600",
                                  color: "#1C335C",
                                }}
                              >
                                {fee.fee_group_name}
                              </div>
                              <div
                                style={{
                                  fontSize: isMobile ? "14px" : "16px",
                                  fontWeight: "500",
                                  color: "#1C335C",
                                }}
                              >
                                Receipt No. {fee.receipt_number} <br />
                                Paid Date: {formatDate(fee.transcation_date)}
                              </div>
                            </div>
                            <div
                              style={{
                                width: isMobile ? "10%" : "30%",
                              }}
                            >
                              <div
                                style={{
                                  padding: "4px 12px",
                                  borderRadius: "12px",
                                  width: "fit-content",
                                  fontSize: isMobile ? "12px" : "14px",
                                  backgroundColor:
                                    fee.status === "pending" ||
                                    fee.status === "partial"
                                      ? "#fff3cd"
                                      : "#28a745",
                                  color:
                                    fee.status === "pending" ||
                                    fee.status === "partial"
                                      ? "#856404"
                                      : "#fff",
                                }}
                              >
                                Paid
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#62645C",
                            }}
                          >
                            Paid Amount: ₹{fee.paid_amount}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              // marginLeft: "20px",
                              alignItems: "center",
                            }}
                          >
                            <button
                              style={{
                                padding: "10px 16px",
                                backgroundColor: "#1C335C",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "14px",
                                width: isMobile ? "100%" : "auto",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "5px",
                              }}
                              onClick={() => openModal(fee.receipt_number)}
                            >
                              <i className="fas fa-eye"></i>
                              View
                            </button>
                            <button
                              style={{
                                padding: "10px 16px",
                                backgroundColor: "#1C335C",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "14px",
                                width: isMobile ? "100%" : "auto",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "5px",
                              }}
                              onClick={() =>
                                fetchTransactionDetails(fee.transaction_id)
                              }
                            >
                              <i className="fas fa-download"></i>
                              Receipt
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Pagination */}
                      {studentTrasncations.length > 5 && (
                        <div style={{ marginTop: "20px", textAlign: "center" }}>
                          <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            style={{
                              marginRight: "10px",
                              padding: "8px 12px",
                              borderRadius: "4px",
                              border: "1px solid #1C335C",
                              backgroundColor:
                                currentPage === 1 ? "#ccc" : "#fff",
                              color: currentPage === 1 ? "#666" : "#1C335C",
                              cursor:
                                currentPage === 1 ? "not-allowed" : "pointer",
                            }}
                          >
                            Previous
                          </button>

                          <span style={{ margin: "0 10px" }}>
                            Page {currentPage} of {totalPages}
                          </span>

                          <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            style={{
                              marginLeft: "10px",
                              padding: "8px 12px",
                              borderRadius: "4px",
                              border: "1px solid #1C335C",
                              backgroundColor:
                                currentPage === totalPages ? "#ccc" : "#fff",
                              color:
                                currentPage === totalPages ? "#666" : "#1C335C",
                              cursor:
                                currentPage === totalPages
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeSection === "timetable" && (
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "20px",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >
          <div
            style={{
              flex: isMobile ? "none" : "3",
              width: isMobile ? "100%" : undefined,
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              padding: "20px",
              height: "530px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h4 style={{ marginBottom: "16px" }}>Daily Logs</h4>
            <div
              style={{
                overflowY: "auto",
                flex: 1,
                overflowX: "hidden",
                paddingRight: "8px",
              }}
            >
              {dailyLog.length === 0 ? (
                <p style={{ color: "#6c757d", textAlign: "center" }}>
                  No public Daily Logs.
                </p>
              ) : (
                dailyLog.map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => openDailyLog(c)}
                    style={{
                      marginBottom: "12px",
                      padding: "12px",
                      borderLeft: "4px solid #1C335C",
                      backgroundColor: idx % 2 === 0 ? "#f8f9fa" : "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 600, color: "#1C335C" }}>
                      Daily log - {formatDate(c.log_date)} ({c.class_name})
                    </div>
                    <div style={{ fontSize: "13px", color: "#4a4f55" }}>
                      Published on :{formatDateCircular(c.log_date)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div
            style={{
              flex: isMobile ? "none" : "7",
              margin: "0 auto",
              padding: isMobile ? "20px 10px" : "20px 20px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              height: "520px",
              width: isMobile ? "100%" : undefined,
              overflowY: "auto",
            }}
          >
            {/* Instead of “<h3>Time Table coming here…</h3>”, we render TimeTable */}
            <StudentTimeTable
              school_id={schoolId}
              class_id={classId}
              section_id={sectionId}
              session_id={sessionId}
            />
          </div>
          <Modal show={showDailylog} onHide={closeDailyLog} centered size="lg">
            <Modal.Header closeButton style={{ backgroundColor: "#1C335C" }}>
              <Modal.Title style={{ color: "white" }}>
                {selectedDailyLog
                  ? `Daily log – ${formatDate(selectedDailyLog.log_date)} (${
                      selectedDailyLog.class_name
                    })`
                  : "Loading…"}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
              {selectedDailyLog ? (
                <>
                  <p>
                    <strong>Class:</strong> {selectedDailyLog.class_name} |
                    <strong>Section:</strong> {selectedDailyLog.section_name}
                  </p>

                  <Table bordered hover size="sm">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "5%", textAlign: "center" }}>
                          Sr. No
                        </th>
                        <th style={{ width: "25%" }}>Subject</th>
                        <th style={{ width: "35%" }}>Classwork</th>
                        <th style={{ width: "35%" }}>
                          Homework / Requirements
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDailyLog.entries.map((entry, idx) => (
                        <tr key={entry.id}>
                          <td className="text-center">{idx + 1}</td>
                          <td>{entry.subject_name}</td>
                          <td>
                            {entry.class_work ? (
                              entry.class_work
                            ) : (
                              <em>(no classwork)</em>
                            )}
                          </td>
                          <td>
                            {entry.home_work ? (
                              entry.home_work
                            ) : (
                              <em>(no homework)</em>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <p style={{ fontSize: "12px", color: "#888" }}>
                    Created at:{" "}
                    {new Date(
                      selectedDailyLog.entries[0].created_at
                    ).toLocaleString()}
                    <br />
                    Last updated:{" "}
                    {new Date(
                      selectedDailyLog.entries[0].updated_at
                    ).toLocaleString()}
                  </p>
                </>
              ) : (
                <p>Loading entries…</p>
              )}
            </Modal.Body>

            <Modal.Footer style={{ backgroundColor: "#f8f9fa" }}>
              <Button variant="secondary" onClick={closeDailyLog}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

      <ShowDetailedTranscation
        // studentFeesMasterId={studentFeesMasterId}
        show={isModalOpen}
        onHide={closeModal}
        selectedReceiptNumber={selectedReceiptNumber}
        schoolId={schoolId}
      />
    </div>
  );
};

export default ParentPortalPage;
