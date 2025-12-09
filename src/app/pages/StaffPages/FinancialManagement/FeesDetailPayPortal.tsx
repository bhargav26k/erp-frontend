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

const SECRET_KEY = import.meta.env.VITE_SYSTEM_KEY; // Secure Key from .env

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

const FeesDetailPayPortal = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();
  // Removed the stray "log" that was causing a syntax error.
  const location = useLocation();
  const domain = window.location.origin + "/";

  // Extract the `status` query parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const encryptedData = queryParams.get("id");
  const studentsId = queryParams.get("studentId");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string>("");
  // Even if you're not using schoolDetails in your render, it's common to destructure both values.
  const [schoolDetails, setSchoolDetails] = useState<string>("");

  const [studentDetails, setStudentDetails] = useState<string>("");

  const [studentFeesDetails, setStudentFeesDetails] = useState([]);
  const [studentTrasncations, setStudentTrasncations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceiptNumber, setSelectedReceiptNumber] = useState<
    string | null
  >(null);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(studentTrasncations.length / itemsPerPage);

  // Determine which items to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = studentTrasncations.slice(startIndex, endIndex);

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
  const [studentId, setStudentId] = useState<string>("");
  const encData = encryptedData || "";
  // 🔹 Secure Session Handling
  useEffect(() => {
    let sessionTimeout: ReturnType<typeof setTimeout>;

    // Outer timer to delay the session check
    const timer = setTimeout(() => {
      const sessionToken = Cookies.get("sessionToken");

      if (!sessionToken) {
        console.warn("Session expired or tampered!");
        navigate(`/parent-portal/userlogin?id=${encodeURIComponent(encData)}`, {
          replace: true,
        });
        return;
      }

      // Inner timer for session expiration (15 minutes)
      sessionTimeout = setTimeout(() => {
        Cookies.remove("sessionToken");
        alert("Session expired! Redirecting...");
        navigate(`/parent-portal/userlogin?id=${encodeURIComponent(encData)}`, {
          replace: true,
        });
      }, 15 * 60 * 1000);
    }, 500); // Small delay to allow cookies to be updated

    // Cleanup both timers on unmount or dependency change
    return () => {
      clearTimeout(timer);
      clearTimeout(sessionTimeout);
    };
  }, [navigate, encryptedData]);

  // 🔹 Decrypt school ID & Validate URL Params
  useEffect(() => {
    if (!encryptedData || !studentsId) {
      setError("Invalid or missing data in URL.");
      setLoading(false);
      return;
    }

    const decryptedSchoolId = decryptData(encryptedData);

    if (!decryptedSchoolId) {
      setError("Invalid School ID.");
      setLoading(true);
      return;
    }

    Cookies.set("sessionToken", encryptedData, {
      expires: 1 / 96, // Approximately 15 minutes
      secure: true,
      sameSite: "Strict",
    });

    setTimeout(() => {
      setSchoolId(decryptedSchoolId);
      setLoading(false);
    }, 500); // Delay setting state to allow cookie update
  }, [encryptedData, schoolId, studentsId, navigate]);

  // 🔹 Fetch School Details
  useEffect(() => {
    const fetchSchool = async () => {
      try {
        if (!schoolId) return;
        setLoading(true);
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
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              school_logo: response.data.school_logo,
            }),
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
        setLoading(false);
      }
    };

    fetchSchool();
  }, [schoolId]);

  // 🔹 Check if Student ID Exists for the Given School
  useEffect(() => {
    if (!schoolId || !studentsId || !schoolDetails) return;
    const type = schoolDetails?.web_type;

    const fetchStudentDetails = async () => {
      setLoading(true);
      try {
        // Make the API request.
        const response = await axios.get(
          `${DOMAIN}/get-checkStudentdetails/${schoolId}/${studentsId}/${type}`
        );

        // Check for unexpected status codes.
        if (response.status !== 200) {
          throw new Error(
            `Unexpected response status: ${response.status} ${response.statusText}`
          );
        }

        // Check if the student details were returned.
        if (!response.data || Object.keys(response.data).length === 0) {
          throw new Error("Student not found.");
        }
        console.log(response.data);

        // Student exists: update state.
        setStudentDetails(response.data);
        setStudentId(response.data.admission_no);
      } catch (error: any) {
        console.error("Error fetching student details:", error);

        // Set an error message.
        setError(
          "Student ID is wrong or the student does not belong to this school."
        );

        // After 5 seconds, redirect to the fallback route.
        setTimeout(() => {
          navigate(
            `/parent-portal/userlogin?id=${encodeURIComponent(encData)}`,
            {
              replace: true,
            }
          );
        }, 5000);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [schoolId, studentsId, encryptedData, navigate, schoolDetails]);

  useEffect(() => {
    const fetchFeesDetailsStudentWise = async () => {
      if (!schoolId || !studentDetails || !studentDetails.session_id) return;

      try {
        // 1. Check basic parameters
        if (!schoolId || !studentId || !sessionId) {
          setError("Missing school or student ID or sessionId.");
          return;
        }

        setLoading(true);

        // 3. Construct API request
        const response = await axios.get(
          `${DOMAIN}/get-feesgroup/${schoolId}/${studentId}/${sessionId}`
        );

        // 4. Validate response
        if (response.status !== 200) {
          throw new Error(
            `Unexpected response status: ${response.status} ${response.statusText}`
          );
        }
        if (!response.data || Object.keys(response.data).length === 0) {
          throw new Error("No fee data found for this student.");
        }
        console.log(response);

        // 5. Set the fee details in state
        setStudentFeesDetails(response.data.data);
      } catch (error: any) {
        console.error("Error fetching student fee details:", error);

        setError(
          "Could not retrieve student fee information. Please try again."
        );

        // Optional: Redirect if something is critically wrong
        setTimeout(() => {
          navigate(
            `/parent-portal/userlogin?id=${encodeURIComponent(encData)}`,
            {
              replace: true,
            }
          );
        }, 5000);
      } finally {
        setLoading(false);
      }
    };

    fetchFeesDetailsStudentWise();
  }, [schoolId, studentId, sessionId, encryptedData]);

  useEffect(() => {
    const fetchTranscationStudentWise = async () => {
      if (!studentDetails || !studentDetails.session_id) return;

      try {
        // 1. Check basic parameters
        if (!schoolId || !studentId || !sessionId) {
          setError("Missing school or student ID or sessionId.");
          return;
        }

        setLoading(true);

        // 3. Construct API request
        const response = await axios.get(
          `${DOMAIN}/get-fee-trasncations-studentwise/${schoolId}/${studentId}/${sessionId}`
        );

        // if (!response.data || Object.keys(response.data).length === 0) {
        //   throw new Error("No fee data found for this student.");
        // }
        // 5. Set the fee details in state

        setStudentTrasncations(response.data);
      } catch (error: any) {
        console.error("Error fetching student fee details:", error);

        setError(
          "Could not retrieve student fee information. Please try again."
        );

        // Optional: Redirect if something is critically wrong
        setTimeout(() => {
          navigate(
            `/parent-portal/userlogin?id=${encodeURIComponent(encData)}`,
            {
              replace: true,
            }
          );
        }, 5000);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscationStudentWise();
    // Make sure dependencies are correct:
    // - 'schoolId', 'studentId', 'studentDetails' are needed to fetch
    // - 'encData' and 'navigate' are needed if you're using them in the catch block
  }, [schoolId, studentId, sessionId]);

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

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "";

    // Treat as local time by appending "Z" if it’s UTC string
    const date = new Date(dateString.replace(" ", "T"));

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
    console.log(encryptedData);
    const receiptUrl = `${domain}fee-reciept?schoolId=${schoolId}&data=${encodeURIComponent(
      encryptedData
    )}`;
    window.open(receiptUrl, "_blank");
  };

  // Secure Navigation & Error Handling
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (error)
    return (
      <div className="error-screen">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );



  const getUserFriendlyRemark = (remark) => {
  if (!remark) return "-";

  const map = {
    "Transaction Success Normally": "Payment successful",
    "Transaction Success through Corn job": "Payment confirmed by bank",
    "Transaction Success through Corn job Bank Api": "Payment verified successfully",
    "Transasction Failed Normally": "Payment failed, please try again",
    "Transaction failed": "Payment failed",
    "Transaction Initiated but not completed": "Payment started but not completed",
    "Auto-cancelled after 4+ hours": "Payment cancelled due to no confirmation",
    "Transaction was cancelled as it did not have pg_transId and Mode more than 20 mins updated by Corn job":
      "Payment cancelled due to incomplete bank response",
    "Transaction initiated, pending verification": "Payment is under verification",
    "Transaction cancelled": "Payment cancelled",
    "success but dupliate": "Duplicate payment attempt ignored",
    "cancelled extra attempt": "Additional payment attempt cancelled",
  };

  // find closest match
  for (const key in map) {
    if (remark.toLowerCase().includes(key.toLowerCase())) {
      return map[key];
    }
  }

  return remark; // fallback (show original if not mapped)
};


  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
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

      {/* Main Content */}
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
        {/* <div
          style={{
            backgroundColor: "#eaf4fc",
            borderLeft: "6px solid #1C335C",
            padding: "16px 20px",
            borderRadius: "8px",
            marginBottom: "20px",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            gap: "10px",
          }}
        >
          <i
            className="fas fa-bullhorn"
            style={{ fontSize: "20px", color: "#1C335C" }}
          ></i>
          <div
            style={{ color: "#1C335C", fontSize: "14px", fontWeight: "500" }}
          >
            You can now pay all the pending installments one after another.
            Avoid late fees by clearing dues before the due date. If paying via
            a third-party app, return to the transaction page in your browser
            after payment to confirm it. For help, contact the school office.
          </div>
        </div> */}
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
                className={`fas fa-${tab === "pending" ? "clock" : "history"}`}
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
                          fee.status === "pending" || fee.status === "partial"
                            ? "#fff3cd"
                            : "#28a745",
                        color:
                          fee.status === "pending" || fee.status === "partial"
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
                      justifyContent: isMobile ? "" : "center",
                      textAlign: isMobile ? "left" : "center",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div>Due Date: {formatDate(fee.due_date)}</div>
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
                            marginTop: "8px",
                            padding: "6px",
                            backgroundColor: "#e8f5e9",
                            borderRadius: "4px",
                          }}
                        >
                          Rebate Amount: ₹{fee.rebate_amount}
                        </div>
                      )}
                    </div>
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
                            fee.status === "pending" || fee.status === "partial"
                              ? "#1C335C"
                              : "#6c757d",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          cursor:
                            fee.status === "pending" || fee.status === "partial"
                              ? "pointer"
                              : "not-allowed",
                          opacity:
                            fee.status === "pending" || fee.status === "partial"
                              ? 1
                              : 0.6,
                          fontSize: "14px",
                          width: isMobile ? "100%" : "auto",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() =>
                          createPaymentLink(fee.fee_group_id, fee.part_payment)
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
                  <p style={{ color: "#6c757d" }}>No transactions done yet.</p>
                </div>
              ) : (
                <div
                  style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                  }}
                >
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
                            {fee.payment_status?.toLowerCase() === "pending" ||
                            fee.payment_status?.toLowerCase() ===
                              "cancelled" ? (
                              <>
                                Invoice No. {fee.invoice_no}
                                <br />
                                Remark: {getUserFriendlyRemark(fee.remark)}
                                <br />
                                Transaction Created.{" "}
                                {formatDateTime(fee.transcation_date)}
                              </>
                            ) : (
                              <>
                                Receipt No. {fee.receipt_number} <br />
                                Paid Date: {formatDate(fee.transcation_date)}
                              </>
                            )}
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
                                fee.payment_status === "pending" ||
                                fee.payment_status === "cancelled"
                                  ? "#fff3cd"
                                  : "#28a745",
                              color:
                                fee.payment_status === "pending" ||
                                fee.payment_status === "cancelled"
                                  ? "#856404"
                                  : "#fff",
                            }}
                          >
                            {fee.payment_status}
                          </div>
                        </div>
                      </div>
                      {fee.payment_status === "pending" ||
                      fee.payment_status === "cancelled" ? (
                        <></>
                      ) : (
                        <>
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
                        </>
                      )}
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
                          backgroundColor: currentPage === 1 ? "#ccc" : "#fff",
                          color: currentPage === 1 ? "#666" : "#1C335C",
                          cursor: currentPage === 1 ? "not-allowed" : "pointer",
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
                </div>
              )}
            </div>
          )}
        </div>
      </div>
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

export default FeesDetailPayPortal;
