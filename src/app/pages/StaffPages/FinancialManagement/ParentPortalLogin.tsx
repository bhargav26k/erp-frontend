import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import axios from "axios";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import Loader from "../../../routing/Loader";

const SECRET_KEY = import.meta.env.VITE_SYSTEM_KEY; // Ensure this is set in .env

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

// Function to Decrypt Encrypted School ID
const decryptData = (encryptedData: string) => {
  try {
    if (!encryptedData) throw new Error("Encrypted data is missing");

    const formattedKey = CryptoJS.enc.Utf8.parse(SECRET_KEY); // Ensure correct key format
    const decodedData = decodeURIComponent(encryptedData); // Decode URL-encoded data

    // Decrypt using AES with ECB mode
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

// FOR DASTUR ONLY
const generateCaptcha = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // Uppercase, Lowercase, Numbers
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

const PayPortalPage = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  const location = useLocation();

  // Extract the `status` query parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const encryptedData = queryParams.get("id");
  console.log(encryptedData);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [schoolDetails, setSchoolDetails] = useState<any>({});
  const [schoolId, setSchoolId] = useState<string>("");
  const [logo, setLogo] = useState<string | null>(null);
  const [isSecure, setIsSecure] = useState<boolean>(true);
  const [pendingStudents, setPendingStudents] = useState<Student[] | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Form State
  const [formData, setFormData] = useState<{
    username?: string;
    password?: string;
    studentId?: string;
    captcha?: string;
  }>(() => {
    // initial state — we don’t yet know web_type, so default to empty
    return { username: "", password: "" };
  });

  // when schoolDetails.web_type arrives, re-initialize formData
  useEffect(() => {
    if (!schoolDetails.web_type) return;

    if (schoolDetails.web_type === "normal") {
      setFormData({ username: "", password: "" });
    } else {
      setFormData({ studentId: "", captcha: "" });
    }
  }, [schoolDetails.web_type]);

  // Captcha State
  const [captchaText, setCaptchaText] = useState<string>(generateCaptcha());

  // // Clear form data on initial mount to ensure no garbage values are stored
  useEffect(() => {
    if (schoolDetails?.web_type === "open") {
      setFormData({ studentId: "", captcha: "" });
      setCaptchaText(generateCaptcha());
    }
  }, [schoolDetails?.web_type]);

  // Check if connection is secure
  useEffect(() => {
    setIsSecure(window.isSecureContext);
    if (!window.isSecureContext) {
      console.warn("⚠️ Insecure connection detected!");
    }
  }, []);

  // Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Generate New Captcha
  const refreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
  };

  // 🔹 Decrypt School ID
  useEffect(() => {
    if (!encryptedData) {
      setError("Invalid or missing school ID.");
      setLoading(false);
      return;
    }

    const decryptedSchoolId = decryptData(encryptedData);
    if (!decryptedSchoolId) {
      setError("Invalid School ID.");
      setLoading(false);
      return;
    }

    setSchoolId(decryptedSchoolId);
  }, [encryptedData]);

  // 🔹 Fetch School Details AFTER Decryption
  useEffect(() => {
    const fetchSchoolData = async () => {
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
        setLogo(imageObjectURL);
      } catch (error: any) {
        setError(error.message || "Error fetching school details");
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  }, [schoolId]);

  // 📌 Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Start loading
    setIsSubmitting(true);

    try {
      if (schoolDetails.web_type === "normal") {
        if (!formData.username || !formData.password) {
          alert("Please fill all required fields.");
          return;
        }

        if (!encryptedData) {
          alert("Something went wrong! Encrypted school ID is missing.");
          navigate(
            `/parent-portal/userlogin?id=${encodeURIComponent(encryptedData)}`,
            {
              replace: true,
            }
          );
          return;
        }

        try {
          // 2. Call your check-student API
          const { data } = await axios.post<{
            exists: boolean;
            message?: string;
          }>(`${DOMAIN}/parent-login`, {
            schoolId,
            formData,
          });

          if (!data.exists) {
            // 3a. If user not found / invalid credentials
            toast.error(data.message || "Username or password is incorrect.");
            return;
          }

          if (!data.students || data.students.length === 0) {
            toast.error("No students found for this parent.");
            return;
          }

          // If only one student, go straight there:
          if (data.students.length === 1) {
            const sid = data?.students[0].student_id;
            navigateToStudent(sid);
            return;
          }

          const cleanedStudents = (data.students || []).map((s) => {
            const raw = s.student_name || "";
            // remove any standalone "NULL" (case-insensitive), collapse multiple spaces, trim ends
            const name = raw
              .replace(/\bNULL\b/gi, "")
              .replace(/\s+/g, " ")
              .trim();
            return { ...s, student_name: name };
          });

          if (cleanedStudents.length === 0) {
            toast.error("No students found for this parent.");
            return;
          }

          // If only one, navigate
          if (cleanedStudents.length === 1) {
            navigateToStudent(cleanedStudents[0].student_id);
            return;
          }

          // Multiple → show popup
          setPendingStudents(cleanedStudents);
        } catch (err) {
          console.log(err);
          if (
            err?.response?.data?.error
              ?.toLowerCase()
              .includes("no active students")
          ) {
            toast.error("Student is no longer active.");
          } else {
            toast.error("No students found something is wrong.");
          }
          console.error("Check-student API error:", err);
          toast.error(err);
        }
      } else {
        // Validate required fields (schoolId & studentId)
        if (!formData.studentId) {
          alert("Please fill all required fields.");
          return;
        }

        // Validate captcha separately
        if (formData.captcha.trim() !== captchaText.trim()) {
          alert("Wrong captcha entered. Please try again.");
          // Clear captcha field and regenerate captcha
          setFormData({ ...formData, captcha: "" });
          refreshCaptcha();
          return;
        }

        if (!encryptedData) {
          alert("Something went wrong! Encrypted school ID is missing.");
          navigate(
            `/parent-portal/userlogin?id=${encodeURIComponent(encryptedData)}`,
            {
              replace: true,
            }
          );
          return;
        }

        // Construct redirect URL
        const redirectURL = `/parent-portal/fees?id=${encodeURIComponent(
          encryptedData
        )}&studentId=${encodeURIComponent(formData.studentId)}`;

        // Reset form state to clear any stored data before navigation
        setFormData({ studentId: "", captcha: "" });
        setCaptchaText(generateCaptcha());
        // Navigate to the fees payment page
        navigate(redirectURL);
      }
    } finally {
      // Stop loading in finally block to ensure it always runs
      setIsSubmitting(false);
    }
  };

  const navigateToStudent = (studentId: string) => {
    const redirectURL = `/parent-portal/home?id=${encodeURIComponent(
      encryptedData
    )}&studentId=${encodeURIComponent(studentId)}`;
    navigate(redirectURL, { replace: true });
  };

  // Called when the user clicks “Select” in the popup
  const handleStudentSelect = (studentId: string) => {
    setPendingStudents(null);
    navigateToStudent(studentId);
  };
  // 📌 Loading Statesd
  if (loading) {
    return <Loader message="Loading Your Portal..." overlay={true} />;
  }

  if (isSubmitting) {
    return <Loader message="Authenticating... Please wait" overlay={true} />;
  }

  // 📌 Error State
  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            width: "100%",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            borderRadius: "8px",
            padding: "30px 20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>
          <h2
            style={{ fontSize: "20px", fontWeight: 600, marginBottom: "10px" }}
          >
            Something went wrong
          </h2>
          <p style={{ fontSize: "16px", lineHeight: "1.5" }}>{error}</p>

          <button
            style={{
              marginTop: "20px",
              padding: "10px 16px",
              backgroundColor: "#721c24",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
        className={pendingStudents ? "filter blur-sm transition" : ""}
      >
        {/* Secure Header */}
        <nav
          style={{
            backgroundColor: "#1C335C",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <i
                className="fas fa-shield-alt"
                style={{ color: "#fff", fontSize: "20px" }}
              ></i>
              <span
                style={{
                  color: "#fff",
                  fontSize: "20px",
                  fontWeight: "700",
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                Secure Parent Portal
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: isSecure ? "#28a745" : "#dc3545",
                  borderRadius: "50%",
                }}
              ></span>
              <i
                className="fas fa-lock"
                style={{ color: "#fff", fontSize: "14px" }}
              ></i>
              <span style={{ color: "#fff", fontSize: "14px" }}>
                {isSecure ? "Secure Connection" : "Insecure Connection"}
              </span>
            </div>
          </div>
        </nav>

        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >
          {/* School Info Card */}
          {/* School Info and Support Card */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              padding: "32px",
              marginBottom: "30px",
              display: isMobile ? "block" : "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* School Info */}
            <div style={{ textAlign: "center" }}>
              <div style={{ marginBottom: "20px" }}>
                {logo ? (
                  <img
                    src={logo}
                    alt="School Logo"
                    style={{
                      width: "100px",
                      height: "auto",
                      marginBottom: "10px",
                    }}
                  />
                ) : (
                  <p>No logo available</p>
                )}
              </div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#1C335C",
                  marginBottom: "16px",
                }}
              >
                {schoolDetails.name}
              </h1>
              <p style={{ color: "#6c757d", marginBottom: "12px" }}>
                <i className="fas fa-phone" style={{ marginRight: "8px" }}></i>
                {schoolDetails.phone}
              </p>
              <p style={{ color: "#6c757d", marginBottom: "12px" }}>
                <i
                  className="fas fa-envelope"
                  style={{ marginRight: "8px" }}
                ></i>
                <a
                  href={`mailto:${schoolDetails.email}`}
                  style={{ color: "#1C335C", textDecoration: "none" }}
                >
                  {schoolDetails.email}
                </a>
              </p>
              <p style={{ color: "#6c757d", marginBottom: "12px" }}>
                <i className="fas fa-map" style={{ marginRight: "8px" }}></i>
                {schoolDetails.address}
              </p>
            </div>

            {/* OnePitara Support Info */}
            <div
              style={{
                textAlign: "center",
                borderLeft: isMobile ? "" : "1px solid #e0e0e0",
                borderTop: isMobile ? "1px solid #e0e0e0" : "",
                paddingLeft: isMobile ? "" : "30px",
                paddingTop: isMobile ? "20px" : "",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1C335C",
                  marginBottom: "16px",
                }}
              >
                OnePitara Support
              </h2>
              <p style={{ color: "#6c757d", marginBottom: "12px" }}>
                <i
                  className="fas fa-question-circle"
                  style={{ marginRight: "8px" }}
                ></i>
                For any queries related to this portal Message or Email:
              </p>
              <p style={{ color: "#6c757d", marginBottom: "12px" }}>
                <i className="fas fa-phone" style={{ marginRight: "8px" }}></i>
                +91-8793226118
              </p>
              <p style={{ color: "#6c757d", marginBottom: "12px" }}>
                <i
                  className="fas fa-envelope"
                  style={{ marginRight: "8px" }}
                ></i>
                <a
                  href="mailto:it-support@dexpertsystems.com "
                  style={{ color: "#1C335C", textDecoration: "none" }}
                >
                  it-support@dexpertsystems.com
                </a>
              </p>
              <p
                style={{
                  fontStyle: "italic",
                  fontSize: "13px",
                  color: "#6c757d",
                }}
              >
                Support available Mon–Sat, 10 AM to 6 PM
              </p>
            </div>
          </div>

          {/* Security Alert */}
          <div
            style={{
              backgroundColor: "#fff3cd",
              border: "1px solid #ffeeba",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "30px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <i
              className="fas fa-exclamation-triangle"
              style={{ color: "#856404" }}
            ></i>
            {schoolDetails.web_type === "normal" && (
              <span style={{ color: "#856404" }}>
                Please ensure you're entering student's registered primary
                (father's) mobile number for username and password.
              </span>
            )}
            {schoolDetails.web_type === "open" && (
              <span style={{ color: "#856404" }}>
                Please ensure you're entering student's Gr.no below.
              </span>
            )}
          </div>

          {/* Payment Form */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              padding: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <i className="fas fa-user-check" style={{ fontSize: "20px" }}></i>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#1C335C",
                  textAlign: "center",
                  paddingTop: "6px",
                }}
              >
                Parent Login
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              {schoolDetails.web_type === "normal" ? (
                <>
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#1C335C",
                        fontWeight: "500",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                      }}
                    >
                      <i
                        className="fas fa-user"
                        style={{ marginRight: "10px" }}
                      ></i>
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter Mobile Number"
                      style={{
                        backgroundColor: "#fff",
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        color: "#495057",
                        fontFamily: "Manrope",
                      }}
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#1C335C",
                        fontWeight: "500",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                      }}
                    >
                      <i
                        className="fas fa-lock"
                        style={{ marginRight: "10px" }}
                      ></i>
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      style={{
                        backgroundColor: "#fff",
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        color: "#495057",
                        fontFamily: "Manrope",
                      }}
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Student ID */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#1C335C",
                        fontWeight: "500",
                      }}
                    >
                      <i
                        className="fas fa-id-card"
                        style={{ marginRight: "8px" }}
                      ></i>
                      Student GR No. *
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      placeholder="Enter Student GR No."
                      style={{
                        backgroundColor: "#fff",
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        color: "#495057",
                      }}
                      value={formData.studentId}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Captcha */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#1C335C",
                        fontWeight: "500",
                      }}
                    >
                      <i
                        className="fas fa-robot"
                        style={{ marginRight: "8px" }}
                      ></i>
                      Security Verification *
                    </label>

                    <div
                      style={{
                        backgroundColor: "#f8f9fa",
                        padding: "12px 16px",
                        borderRadius: "4px",
                        fontFamily: "monospace",
                        fontSize: "18px",
                        userSelect: "none",
                        color: "#000",
                        marginBottom: "12px",
                        textAlign: "center",
                      }}
                    >
                      {captchaText}
                    </div>

                    {/* Input and Refresh Row */}
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        name="captcha"
                        placeholder="Enter the code"
                        style={{
                          flex: "1",
                          backgroundColor: "#fff",
                          padding: "12px",
                          border: "1px solid #ced4da",
                          borderRadius: "4px",
                          color: "#495057",
                        }}
                        value={formData.captcha}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        style={{
                          padding: "12px",
                          border: "1px solid #ced4da",
                          borderRadius: "4px",
                          backgroundColor: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        <i className="fas fa-sync-alt"></i>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: isSubmitting ? "#ccc" : "#1C335C",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock"></i>
                    Proceed Securely
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security Footer */}
          <div
            style={{
              textAlign: "center",
              marginTop: "24px",
              color: "#6c757d",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <i className="fas fa-shield-alt"></i>
            Your information is encrypted and secure
          </div>
        </div>
      </div>
      <Modal
        show={!!pendingStudents}
        onHide={() => setPendingStudents(null)}
        centered
        dialogClassName="parent-select-modal" // for custom styling
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#1C335C",
            borderBottom: "none",
            fontFamily: "Manrope, sans-serif",
          }}
        >
          <Modal.Title
            style={{
              color: "#FFFFFF",
              fontSize: "1.25rem",
              fontWeight: 600,
            }}
          >
            Select Your Student
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            padding: "1.5rem",
            backgroundColor: "#F9FAFB",
            fontFamily: "Manrope, sans-serif",
          }}
        >
          {pendingStudents?.map((stu) => (
            <div key={stu.student_id} className="mb-3">
              <Button
                variant="light"
                className="w-100 text-start border-0 shadow-sm"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "#1C335C",
                  fontWeight: 500,
                }}
                onClick={() => handleStudentSelect(stu.student_id)}
              >
                {stu.student_name}{" "}
                <span className="text-gray-500">({stu.student_id})</span>
              </Button>
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer
          style={{
            borderTop: "none",
            backgroundColor: "#F9FAFB",
            padding: "1rem 1.5rem",
          }}
        >
          <Button
            variant="outline-secondary"
            onClick={() => setPendingStudents(null)}
            style={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PayPortalPage;
