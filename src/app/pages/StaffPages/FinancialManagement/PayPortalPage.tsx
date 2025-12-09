import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import axios from "axios";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import { useLocation } from "react-router-dom";

const SECRET_KEY = import.meta.env.VITE_SYSTEM_KEY; // Ensure this is set in .env

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
  const encryptedData = queryParams.get("encrypted_code");  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [CompanyDetails, setCompanyDetails] = useState<any>({});
  const [companyEmail, setCompanyEmail] = useState<string>("");
  // const [logo, setLogo] = useState<string | null>(null);
  const [isSecure, setIsSecure] = useState<boolean>(true);
  const [schools, setSchools] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    schoolId: "",
    studentId: "",
    captcha: "",
  });

  // Captcha State
  const [captchaText, setCaptchaText] = useState<string>(generateCaptcha());

  // Clear form data on initial mount to ensure no garbage values are stored
  useEffect(() => {
    setFormData({ schoolId: "", studentId: "", captcha: "" });
    setCaptchaText(generateCaptcha());
  }, []);

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

    setCompanyEmail(decryptedSchoolId);
  }, [encryptedData]);

  // 🔹 Fetch School Details AFTER Decryption
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        if (!companyEmail) return;
        setLoading(true);
        const response = await axios.get(
          `${DOMAIN}/get-companydetails/${companyEmail}`
        );
        if (response.status !== 200) {
          throw new Error(
            `Unexpected response status: ${response.status} ${response.statusText}`
          );
        }

        if (!response.data || Object.keys(response.data).length === 0) {
          throw new Error("❌ API returned an empty object.");
        }

        setCompanyDetails(response.data);

        // Fetch School Logo if exists
        // if (response.data.image) {
        //   const logoResponse = await fetch(
        //     `${DOMAIN}/api/school/image`,
        //     {
        //       method: "POST",
        //       headers: {
        //         "Content-Type": "application/json",
        //       },
        //       body: JSON.stringify({ school_logo: response.data.school_logo }),
        //     }
        //   );

        //   if (!logoResponse.ok) {
        //     throw new Error("Failed to fetch logo");
        //   }

        //   const blob = await logoResponse.blob();
        //   setLogo(URL.createObjectURL(blob));
        // }
      } catch (error: any) {
        setError(error.message || "Error fetching school details");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [companyEmail]);


  // 📌 Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields (schoolId & studentId)
    if (!formData.schoolId || !formData.studentId) {
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
      navigate(`/pay-portal?encrypted_code=${encodeURIComponent(encryptedData)}`, {
          replace: true,
        }); // Redirect back to secure portal
      return;
    }
    // Construct redirect URL
    const redirectURL = `/pay-portal/fees?encrypted_code=${encodeURIComponent(encryptedData)}&schoolId=${formData.schoolId}&studentId=${formData.studentId}`;
    
    
    // Reset form state to clear any stored data before navigation
    setFormData({ schoolId: "", studentId: "", captcha: "" });
    setCaptchaText(generateCaptcha());
    // Navigate to the fees payment page
    navigate(redirectURL);
  };

  // 📌 Loading Statesd
  if (loading) {
    return <div className="loading-screen">Loading School Data...</div>;
  }

  // 📌 Error State
  if (error) {
    return (
      <div className="error-screen">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
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
              Secure Payment Portal
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
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            padding: "32px",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
              <i
                className="fas fa-school"
                style={{ fontSize: "48px", color: "#1C335C" }}
              ></i>
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#1C335C",
              marginBottom: "16px",
            }}
          >
            {CompanyDetails.name}
          </h1>
          <p
            style={{
              color: "#6c757d",
              marginBottom: "12px",
            }}
          >
            <i className="fas fa-phone" style={{ marginRight: "8px" }}></i>
            {CompanyDetails.contact_no}
          </p>
          <p style={{ color: "#6c757d" }}>
            <i className="fas fa-envelope" style={{ marginRight: "8px" }}></i>
            <a
              href="mailto:olympianationalschool@mail.com"
              style={{
                color: "#1C335C",
                textDecoration: "none",
              }}
            >
              {CompanyDetails.email}
            </a>
          </p>
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
          <span style={{ color: "#856404" }}>
            Please ensure you're on the official payment portal. Check the URL
            and security certificate.
          </span>
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
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1C335C",
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            <i className="fas fa-user-check" style={{ marginRight: "8px" }}></i>
            Student Verification
          </h2>

          <form onSubmit={handleSubmit}>
            {/* schoolId Selection */}
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
                  className="fas fa-building"
                  style={{ marginRight: "8px" }}
                ></i>
                Select School *
              </label>
              <select
                value={formData.schoolId}
                onChange={handleChange}
                name="schoolId"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  color: "#495057",
                  backgroundColor: "#fff",
                }}
              >
                <option value="">-- Select School --</option>
                {schools.map((school) => (
                  <option key={school.school_id} value={school.school_id}>
                    {school.school_name}
                  </option>
                ))}
              </select>
            </div>

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
                Student ID *
              </label>
              <input
                type="text"
                name="studentId"
                placeholder="Enter your student ID"
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
    <i className="fas fa-robot" style={{ marginRight: "8px" }}></i>
    Security Verification *
  </label>
  
  {/* Captcha Code Display */}
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
      textAlign: "center"
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

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#1C335C",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <i className="fas fa-lock"></i>
              Proceed Securely
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
  );
};

export default PayPortalPage;
