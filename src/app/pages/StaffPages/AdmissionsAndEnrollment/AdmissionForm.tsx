import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import axios from "axios";
import { Form, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  student_name: string;
  student_phone: string;
  student_address: string;
  student_email: string;
  class_id: string;
  gender: string;
  date_of_birth: string;
  current_school: string;
  session_id: string;
  father_name: string;
  father_phone: string;
  mother_name: string;
  mother_phone: string;
  blood_group: string;
  height_cm: string;
  weight_kg: string;
  aadhar_number: string;
  wrestling_level: string;
  previous_training_center: string;
  training_duration: string;
  tournaments_participated: string;
  student_photo: string;
  father_photo: string;
}

const AdmissionForm = () => {
  const [formData, setFormData] = useState<FormData>({
    student_name: "",
    student_phone: "",
    student_address: "",
    student_email: "",
    class_id: "",
    gender: "",
    date_of_birth: "",
    current_school: "",
    session_id: "",
    father_name: "",
    father_phone: "",
    mother_name: "",
    mother_phone: "",
    blood_group: "",
    height_cm: "",
    weight_kg: "",
    aadhar_number: "",
    wrestling_level: "",
    previous_training_center: "",
    training_duration: "",
    tournaments_participated: "",
    student_photo: "",
    father_photo: "",
  });

  interface ClassOption {
    class_id: any;
    id: number;
    class: string;
  }

  const userId = 0; // Static user ID for parent role

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [schoolId, setSchoolId] = useState("");
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [studentPicture, setStudentPicture] = useState<File | null>(null);
  const [fatherPicture, setFatherPicture] = useState<File | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true); // New state for initialization
  const [error, setError] = useState<Error | null>(null);
  const [declaration_accepted, setDeclarationAccepted] = useState(false);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [sessions, setSessions] = useState([]);
  console.log(sessions);  
  

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encryptedQuery = params.get("query");

    if (encryptedQuery) {
      try {
        const secretKey = import.meta.env.VITE_SYSTEM_KEY;
        const bytes = CryptoJS.AES.decrypt(encryptedQuery, secretKey);
        const decryptedSchoolId = bytes.toString(CryptoJS.enc.Utf8);

        if (decryptedSchoolId) {
          setSchoolId(decryptedSchoolId);
        } else {
          setError(new Error("Invalid school ID in query"));
        }
      } catch (err) {
        console.error("Failed to decrypt school_id:", err);
        setError(new Error("Failed to decrypt school ID"));
      }
    } else {
      setError(new Error("No school ID found in URL"));
    }
    setInitializing(false);
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!schoolId) return;
      const school_id = schoolId;
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-schoolwise-classes/${school_id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, [schoolId]);

  useEffect(() => {
    if (schoolId) {
      const fetchSchoolsDetails = async () => {
        const school_id = schoolId;
        try {
          setLoading(true);
          const response = await axios.get(
            `${DOMAIN}/get-schooldetails/${school_id}`
          );

          if (response.status === 200 && response.statusText === "OK") {
            setSchoolDetails(response.data);
            console.log(response.data.school_logo);

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
          } else {
            throw new Error(
              `Unexpected response status: ${response.status} ${response.statusText}`
            );
          }
        } catch (error) {
          setError(error as Error);
          console.error("Error fetching school details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchSchoolsDetails();
    }
  }, [schoolId]);

  useEffect(() => {
    const fetchSchools = async () => {
      if (!schoolId) return;
      try {
        const school_id = schoolId;
        const response = await fetch(
          `${DOMAIN}/api/school/get-session/${school_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch school names");
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error("Error fetching school names:", error);
      }
    };
    fetchSchools();
  }, [schoolId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleStudentPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStudentPicture(file);
    }
  };

  const handleFatherPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFatherPicture(file);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeclarationAccepted(e.target.checked);
  };
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Required fields validation
    if (!formData.student_name.trim())
      newErrors.student_name = "Student name is required";
    if (!formData.student_phone.trim())
      newErrors.student_phone = "Phone number is required";
    if (!formData.student_email.trim())
      newErrors.student_email = "Email is required";
    if (!formData.class_id) newErrors.class_id = "Class selection is required";
    if (!formData.gender) newErrors.gender = "Gender selection is required";
    if (!formData.date_of_birth)
      newErrors.date_of_birth = "Date of birth is required";
    if (!formData.father_name.trim())
      newErrors.father_name = "Father's name is required";
    if (!formData.father_phone.trim())
      newErrors.father_phone = "Father's phone is required";
    if (!formData.mother_name.trim())
      newErrors.mother_name = "Mother's name is required";
    if (!formData.aadhar_number.trim())
      newErrors.aadhar_number = "Aadhar number is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.student_email && !emailRegex.test(formData.student_email)) {
      newErrors.student_email = "Please enter a valid email";
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.student_phone && !phoneRegex.test(formData.student_phone)) {
      newErrors.student_phone = "Please enter a valid 10-digit phone number";
    }
    if (formData.father_phone && !phoneRegex.test(formData.father_phone)) {
      newErrors.father_phone = "Please enter a valid 10-digit phone number";
    }

    // Aadhar validation (12 digits)
    const aadharRegex = /^[0-9]{12}$/;
    if (formData.aadhar_number && !aadharRegex.test(formData.aadhar_number)) {
      newErrors.aadhar_number = "Please enter a valid 12-digit Aadhar number";
    }
    console.log(newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("hit");
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const updatedFormData: any = { ...formData };

      // Handle student photo upload
      if (studentPicture) {
        const studentResponse = await uploadFile(
          studentPicture,
          schoolId,
          "student_photo"
        );
        if (studentResponse?.filename) {
          updatedFormData.student_photo = studentResponse.filename;
        } else {
          throw new Error("Student photo upload failed");
        }
      }

      // Handle father/guardian photo upload
      if (fatherPicture) {
        const fatherResponse = await uploadFile(
          fatherPicture,
          schoolId,
          "father_photo"
        );
        if (fatherResponse?.filename) {
          updatedFormData.father_photo = fatherResponse.filename;
        } else {
          throw new Error("Father photo upload failed");
        }
      }

      const school_id = schoolId;
      const user_id = userId;
      // Send admission enquiry
      const response = await fetch(
        `${DOMAIN}/api/school/admissionEnquiry/${school_id}/${user_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFormData),
        }
      );
      console.log(response);

      if (!response.ok) throw new Error("Failed to submit application");

      const result = await response.json();
      console.log("Application submitted:", result);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting application:", err);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (
    file: File,
    schoolId: string,
    fieldName: string
  ) => {
    const formData = new FormData();
    formData.append(fieldName, file);
    formData.append("school_id", schoolId);

    try {
      const response = await fetch(
        `${DOMAIN}/api/superadmin/school_admission_upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("File upload failed");
      }
      return await response.json(); // now returns { filename: "...", fieldName: "..." }
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error; // Re-throw to handle in calling function
    }
  };

  // Loading state while initializing or fetching school details
  if (initializing || (schoolId && loading)) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center px-4"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          className="card shadow-lg border-0"
          style={{ borderRadius: "20px", maxWidth: "400px", width: "100%" }}
        >
          <div className="card-body text-center p-5">
            <div className="mb-4">
              <div
                className="spinner-border text-primary"
                role="status"
                style={{ width: "3rem", height: "3rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            <h3 className="card-title fw-bold text-dark mb-3">
              {initializing ? "Initializing..." : "Loading School Details..."}
            </h3>
            <p className="text-muted">
              {initializing
                ? "Please wait while we verify your access..."
                : "Fetching school information and preparing the admission form..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state - show when there's no school ID or other errors
  if (error || !schoolId) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center px-4"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          className="card shadow-lg border-0"
          style={{ borderRadius: "20px", maxWidth: "500px", width: "100%" }}
        >
          <div className="card-body text-center p-5">
            <div
              className="d-inline-flex align-items-center justify-content-center mb-4"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#f8d7da",
                borderRadius: "50%",
              }}
            >
              <i
                className="fas fa-exclamation-triangle"
                style={{ fontSize: "2rem", color: "#721c24" }}
              ></i>
            </div>
            <h2 className="card-title fw-bold text-dark mb-4">Access Error</h2>
            <p className="text-muted mb-4">
              {error?.message ||
                "Unable to access the admission form. Please check your link and try again."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary btn-lg px-4 py-3"
              style={{ borderRadius: "12px", fontWeight: "600" }}
            >
              <i className="fas fa-refresh me-2"></i>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center px-4"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          className="card shadow-lg border-0"
          style={{ borderRadius: "20px", maxWidth: "500px", width: "100%" }}
        >
          <div className="card-body text-center p-5">
            <div
              className="d-inline-flex align-items-center justify-content-center mb-4"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#d4edda",
                borderRadius: "50%",
              }}
            >
              <i
                className="fas fa-check"
                style={{ fontSize: "2rem", color: "#155724" }}
              ></i>
            </div>
            <h2 className="card-title fw-bold text-dark mb-4">
              Application Submitted!
            </h2>
            <p className="text-muted mb-4">
              Thank you for your admission application. We will review your
              application and contact you soon.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  student_name: "",
                  student_phone: "",
                  student_address: "",
                  student_email: "",
                  class_id: "",
                  gender: "",
                  date_of_birth: "",
                  current_school: "",
                  session_id: "",
                  father_name: "",
                  father_phone: "",
                  mother_name: "",
                  mother_phone: "",
                  blood_group: "",
                  height_cm: "",
                  weight_kg: "",
                  aadhar_number: "",
                  wrestling_level: "",
                  previous_training_center: "",
                  training_duration: "",
                  tournaments_participated: "",
                  student_photo: "",
                  father_photo: "",
                });
              }}
              className="btn btn-primary btn-lg px-4 py-3"
              style={{ borderRadius: "12px", fontWeight: "600" }}
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getClassName = (classId: string) => {
    const foundClass = classes.find(
      (cls) => cls.class_id.toString() === classId
    );
    return foundClass ? foundClass.class : "";
  };

  return (
    <div
      className="py-5 px-3"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            {/* Header */}
            <div className="text-center mb-5">
              <div
                className="d-inline-flex align-items-center justify-content-center mb-4"
                style={{
                  width: "80px",
                  height: "80px",
                  background: logo
                    ? "transparent"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "50%",
                  border: "4px solid rgba(255,255,255,0.2)",
                  overflow: "hidden",
                }}
              >
                {logo ? (
                  <img
                    src={logo}
                    alt={`${schoolDetails?.name} Logo`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "block";
                    }}
                  />
                ) : null}
                <i
                  className="fas fa-graduation-cap text-white"
                  style={{
                    fontSize: "2rem",
                    display: logo ? "none" : "block",
                  }}
                ></i>
              </div>

              <h1 className="display-4 fw-bold text-white mb-3">
                Admission Application Form
              </h1>

              <h2 className="h2 text-white mb-2">{schoolDetails?.name}</h2>

              {schoolDetails?.tagline && (
                <p className="text-white mb-2 fst-italic">
                  {schoolDetails?.tagline}
                </p>
              )}

              <div className="text-white mb-3">
                <div className="mb-1">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  {schoolDetails?.address}
                </div>
                <div className="mb-1">
                  <i className="fas fa-phone me-2"></i>
                  <a
                    href={`tel:${schoolDetails?.phone}`}
                    className="text-white text-decoration-none"
                  >
                    {schoolDetails?.phone}
                  </a>
                </div>
                <div>
                  <i className="fas fa-envelope me-2"></i>
                  <a
                    href={`mailto:${schoolDetails?.email}`}
                    className="text-white text-decoration-none"
                  >
                    {schoolDetails?.email}
                  </a>
                </div>
              </div>

              <p className="lead text-white-50">
                Please fill out all required fields to complete your application
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div
                className="card shadow-lg border-0 mb-4"
                style={{ borderRadius: "20px", overflow: "hidden" }}
              >
                {/* Student Information Section */}
                <div
                  className="card-header py-4 px-5"
                  style={{
                    background:
                      "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                    border: "none",
                  }}
                >
                  <h3 className="card-title text-white mb-0 d-flex align-items-center">
                    <i className="fas fa-user-graduate me-3"></i>
                    Student Information
                  </h3>
                </div>
                <div className="card-body p-5">
                  <div className="row g-4">
                    {/* Student Name */}
                    <Form.Group
                      className="mb-3 custom-input col-md-6"
                      controlId="formStudentName"
                    >
                      <Form.Label>Student Name *</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="student_name"
                          placeholder="Student Name"
                          value={formData.student_name || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </InputGroup>
                    </Form.Group>

                    {/* Gender */}
                    <Form.Group
                      className="mb-3 custom-input col-md-6"
                      controlId="formGender"
                    >
                      <Form.Label>Gender *</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender || ""}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>

                    {/* Phone Number */}
                    <Form.Group
                      className="mb-3 custom-input col-md-6"
                      controlId="formPhone"
                    >
                      <Form.Label>Phone Number *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="student_phone"
                        placeholder="10-digit mobile number"
                        value={formData.student_phone || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    {/* Email */}
                    <Form.Group
                      className="mb-3 custom-input col-md-6"
                      controlId="formEmail"
                    >
                      <Form.Label>Email Address *</Form.Label>
                      <Form.Control
                        type="email"
                        name="student_email"
                        placeholder="student@email.com"
                        value={formData.student_email || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    {/* Date of Birth */}
                    <Form.Group
                      className="mb-3 custom-input col-md-4"
                      controlId="formDob"
                    >
                      <Form.Label>Date of Birth *</Form.Label>
                      <Form.Control
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    {/* Class Applying For */}
                    <Form.Group
                      className="mb-3 custom-input col-md-4"
                      controlId="formClass"
                    >
                      <Form.Label>Class Applying For *</Form.Label>
                      <Form.Select
                        name="class_id"
                        value={formData.class_id || ""} // ✅ Correct: store & compare by class_id
                        onChange={handleInputChange}
                        required
                      >
                        {schoolId === "AMO-2509097151" ? <option value="">Select Group</option> : <option value="">Select Class</option>}
                        {classes.map((cls) => (
                          <option key={cls.class_id} value={cls.class_id}>
                            {cls.class}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    {/* Session */}
                    <Form.Group
                      className="mb-3 custom-input col-md-4"
                      controlId="formSession"
                    >
                      <Form.Label>Session *</Form.Label>
                      <Form.Select
                        name="session_id"
                        value={formData.session_id || ""}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Session</option>
                        {sessions.map((session) => (
                          <option
                            key={session.id}
                            value={session.id}
                          >
                            {session.session}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    {/* Blood Group */}
                    <Form.Group
                      className="mb-3 custom-input col-md-6"
                      controlId="formBloodGroup"
                    >
                      <Form.Label>Blood Group</Form.Label>
                      <Form.Select
                        name="blood_group"
                        value={formData.blood_group || ""}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </Form.Select>
                    </Form.Group>

                    {/* Aadhar Number */}
                    <Form.Group
                      className="mb-3 custom-input col-md-6"
                      controlId="formAadhar"
                    >
                      <Form.Label>Aadhar Number *</Form.Label>
                      <Form.Control
                        type="text"
                        name="aadhar_number"
                        placeholder="12-digit Aadhar number"
                        value={formData.aadhar_number || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    {/* Current School */}
                    <Form.Group
                      className="mb-3 custom-input col-12"
                      controlId="formCurrentSchool"
                    >
                      <Form.Label>Current School</Form.Label>
                      <Form.Control
                        type="text"
                        name="current_school"
                        placeholder="Previous school name"
                        value={formData.current_school || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    {/* Residential Address */}
                    <Form.Group
                      className="mb-3 custom-input col-12"
                      controlId="formAddress"
                    >
                      <Form.Label>Residential Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="student_address"
                        placeholder="Complete address with pincode"
                        value={formData.student_address || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </div>
                </div>
              </div>

              {/* Parent Information Section */}
              <div
                className="card shadow-lg border-0 mb-4"
                style={{ borderRadius: "20px", overflow: "hidden" }}
              >
                <div
                  className="card-header py-4 px-5"
                  style={{
                    background:
                      "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                    border: "none",
                  }}
                >
                  <h3 className="card-title text-white mb-0 d-flex align-items-center">
                    <i className="fas fa-users me-3"></i>
                    Parent / Guardian Information
                  </h3>
                </div>
                <div className="card-body p-5">
                  <div className="row g-4">
                    {/* Father's Name */}
                    <Form.Group
                      className="mb-3 custom-input col-md-6"
                      controlId="formFatherName"
                    >
                      <Form.Label>Father's Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="father_name"
                        placeholder="Enter father's full name"
                        value={formData.father_name || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    {/* Father's Phone */}
                    <Form.Group
                      className="mb-3 custom-input col-md-6"
                      controlId="formFatherPhone"
                    >
                      <Form.Label>Father's Phone *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="father_phone"
                        placeholder="10-digit mobile number"
                        value={formData.father_phone || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    {/* Mother's Name */}
                    <Form.Group
                      className="mb-3 custom-input col-md-6"
                      controlId="formMotherName"
                    >
                      <Form.Label>Mother's Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="mother_name"
                        placeholder="Enter mother's full name"
                        value={formData.mother_name || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    {/* Mother's Phone */}
                    <Form.Group
                      className="mb-3 custom-input col-md-6"
                      controlId="formMotherPhone"
                    >
                      <Form.Label>Mother's Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="mother_phone"
                        placeholder="10-digit mobile number"
                        value={formData.mother_phone || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </div>
                </div>
              </div>
              {schoolId === "AMO-2509097151" && (
                <div
                  className="card shadow-lg border-0 mb-4"
                  style={{ borderRadius: "20px", overflow: "hidden" }}
                >
                  <div
                    className="card-header py-4 px-5"
                    style={{
                      background:
                        "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
                      border: "none",
                    }}
                  >
                    <h3 className="card-title text-dark mb-0 d-flex align-items-center">
                      <i className="fas fa-dumbbell me-3"></i>
                      Physical & Wrestling Information
                    </h3>
                    <small className="text-dark-50">
                      Optional fields for wrestling program applicants
                    </small>
                  </div>
                  <div className="card-body p-5">
                    <div className="row g-4">
                      {/* Height */}
                      <Form.Group
                        className="mb-3 custom-input col-md-4"
                        controlId="formHeight"
                      >
                        <Form.Label>Height (cm)</Form.Label>
                        <Form.Control
                          type="number"
                          name="height_cm"
                          placeholder="Height in centimeters"
                          value={formData.height_cm || ""}
                          onChange={handleInputChange}
                        />
                      </Form.Group>

                      {/* Weight */}
                      <Form.Group
                        className="mb-3 custom-input col-md-4"
                        controlId="formWeight"
                      >
                        <Form.Label>Weight (kg)</Form.Label>
                        <Form.Control
                          type="number"
                          name="weight_kg"
                          placeholder="Weight in kilograms"
                          value={formData.weight_kg || ""}
                          onChange={handleInputChange}
                        />
                      </Form.Group>

                      {/* Wrestling Level */}
                      <Form.Group
                        className="mb-3 custom-input col-md-4"
                        controlId="formWrestlingLevel"
                      >
                        <Form.Label>Wrestling Level</Form.Label>
                        <Form.Select
                          name="wrestling_level"
                          value={formData.wrestling_level || ""}
                          onChange={handleInputChange}
                        >
                          <option value="">Select level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Professional">Professional</option>
                        </Form.Select>
                      </Form.Group>

                      {/* Previous Training Center */}
                      <Form.Group
                        className="mb-3 custom-input col-md-8"
                        controlId="formTrainingCenter"
                      >
                        <Form.Label>Previous Training Center</Form.Label>
                        <Form.Control
                          type="text"
                          name="previous_training_center"
                          placeholder="Name of previous training center"
                          value={formData.previous_training_center || ""}
                          onChange={handleInputChange}
                        />
                      </Form.Group>

                      {/* Training Duration */}
                      <Form.Group
                        className="mb-3 custom-input col-md-4"
                        controlId="formTrainingDuration"
                      >
                        <Form.Label>Training Duration</Form.Label>
                        <Form.Control
                          type="text"
                          name="training_duration"
                          placeholder="e.g., 2 years, 6 months"
                          value={formData.training_duration || ""}
                          onChange={handleInputChange}
                        />
                      </Form.Group>

                      {/* Tournaments Participated */}
                      <Form.Group
                        className="mb-3 custom-input col-12"
                        controlId="formTournaments"
                      >
                        <Form.Label>Tournaments Participated</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="tournaments_participated"
                          placeholder="List any tournaments or competitions participated in"
                          value={formData.tournaments_participated || ""}
                          onChange={handleInputChange}
                          rows={3}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </div>
              )}

              {/* Photo Upload & Declaration Section */}
              <div
                className="card shadow-lg border-0 mb-4"
                style={{ borderRadius: "20px", overflow: "hidden" }}
              >
                <div
                  className="card-header py-4 px-5"
                  style={{
                    background:
                      "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)",
                    border: "none",
                  }}
                >
                  <h3 className="card-title text-dark mb-0 d-flex align-items-center">
                    <i className="fas fa-camera me-3"></i>
                    Photo Upload & Declaration
                  </h3>
                </div>
                <div className="card-body p-5">
                  <div className="row g-4">
                    {/* Student Photo Upload */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark">
                          Student Photo <span className="text-danger">*</span>
                        </label>
                        <input
                          type="file"
                          name="student_picture"
                          accept="image/*"
                          onChange={(e) => handleStudentPicture(e)}
                          className="form-control form-control-lg"
                          required
                          style={{
                            borderRadius: "12px",
                            border: "2px solid #e9ecef",
                            padding: "12px 16px",
                          }}
                        />
                        <small className="text-muted">
                          Upload passport size photo (JPG, PNG)
                        </small>
                      </div>
                    </div>

                    {/* Guardian Photo Upload */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark">
                          Parent/Guardian Photo{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="file"
                          name="father_picture"
                          accept="image/*"
                          onChange={(e) => handleFatherPicture(e)}
                          className="form-control form-control-lg"
                          required
                          style={{
                            borderRadius: "12px",
                            border: "2px solid #e9ecef",
                            padding: "12px 16px",
                          }}
                        />
                        <small className="text-muted">
                          Upload passport size photo (JPG, PNG)
                        </small>
                      </div>
                    </div>

                    {/* Declaration */}
                    <div className="col-12">
                      <div
                        className="card"
                        style={{
                          backgroundColor: "#f8f9fa",
                          border: "2px dashed #dee2e6",
                        }}
                      >
                        <div className="card-body p-4">
                          <h5 className="fw-bold mb-3">Declaration:</h5>
                          {schoolId === "AMO-2509097151" ? (
                            <>
                              <p className="mb-3" style={{ lineHeight: "1.6" }}>
                                I hereby admit my child to your wrestling
                                academy and agree to allow my child to undergo
                                training. If my child is injured or has any
                                accident during training/practice, I accept full
                                responsibility. I also agree to follow all the
                                rules of the academy. If my child misbehaves or
                                breaks any rule, I accept that the academy has
                                full authority to cancel admission without any
                                prior notice. I accept all these conditions and
                                promise to cooperate with the academy's rules
                                and discipline.
                              </p>
                              <p className="fw-semibold text-primary mb-3">
                                <strong>Note:</strong> Admission will not be
                                confirmed without attaching photos.
                              </p>
                            </>
                          ) : (
                            <p>
                              I hereby declare that the information provided in
                              this admission form is true and correct to the
                              best of my knowledge. I agree to abide by all the
                              rules and regulations of the school. I also
                              understand that if any information given is found
                              to be incorrect, the admission may be cancelled by
                              the school authorities.
                            </p>
                          )}

                          <div className="form-check">
                            <input
                              type="checkbox"
                              name="declaration_accepted"
                              checked={declaration_accepted}
                              onChange={handleCheckboxChange}
                              className="form-check-input"
                              id="declaration"
                              required
                              style={{ transform: "scale(1.2)" }}
                            />
                            <label
                              className="form-check-label fw-semibold"
                              htmlFor="declaration"
                            >
                              I accept all the terms and conditions mentioned in
                              the declaration above
                              <span className="text-danger"> *</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="text-center mt-5">
                <button
                  type="submit"
                  disabled={loading || !declaration_accepted}
                  className={`btn btn-lg px-5 py-3 fw-bold ${
                    loading ? "btn-secondary" : "btn-success"
                  }`}
                  style={{
                    borderRadius: "15px",
                    fontSize: "1.1rem",
                    minWidth: "250px",
                    background: loading
                      ? "#6c757d"
                      : "linear-gradient(135deg, #667eea 10%, #764ba2 100%)",
                    border: "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-3"></i>
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-3"></i>
                      Submit Application
                    </>
                  )}
                </button>
                <p className="text-white-50 mt-3 small">
                  By submitting this form, you agree to our terms and conditions
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionForm;
