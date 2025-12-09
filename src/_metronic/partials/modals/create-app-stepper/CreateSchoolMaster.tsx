import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { toast } from "react-toastify";

type Props = {
  show: boolean;
  onHide: () => void;
  setRefresh: (refreshState: boolean) => void;
  userType: string;
};

const CreateSchoolMasterModal = ({
  show,
  setRefresh,
  onHide,
  userType,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const { currentUser } = useAuth();
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isOtpScreen, setIsOtpScreen] = useState(false);
  const [timer, setTimer] = useState(120);

  const [formData, setFormData] = useState({
    name: "",
    contact_no: "",
    email: "",
    user_id: currentUser?.id,
    is_active: 1,
    userType,
  });

  // 🔹 Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // ✅ Validate phone number input
    if (name === "contact_no") {
      if (!/^\d*$/.test(value)) return; // Allow only numbers
      if (value.length > 11) return; // Max 10 digits
      setPhoneError(
        value.length === 11 ? null : "Phone number must be exactly 10 digits"
      );
    }

    // ✅ Validate email input
    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        setEmailError("Invalid email format");
      } else {
        setEmailError(null);
      }
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) return toast.error("Please enter a valid email");

    try {
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      sessionStorage.setItem("otp", generatedOtp);

      await fetch(`${DOMAIN}/api/superadmin/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: generatedOtp }),
      });

      setIsOtpScreen(true);
      setTimer(120);
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error("Failed to send OTP. Try again.");
    }
  };

  // Handle OTP Input Change
  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  // Verify OTP
  const verifyOtp = () => {
    const enteredOtp = otp.join("");
    const storedOtp = sessionStorage.getItem("otp");

    if (enteredOtp === storedOtp) {
      sessionStorage.removeItem("otp");
      createCompany();
    } else {
      toast.error("Incorrect OTP. Try again.");
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    sessionStorage.removeItem("otp");
    handleSubmit(new Event("submit"));
  };

  // Create Company
  const createCompany = async () => {
    try {
      const response = await fetch(
        `${DOMAIN}/api/superadmin/create-school-masters`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error("Failed to create company");

      toast.success("Company created successfully!");
      setIsOtpScreen(false);
      setOtp(["", "", "", ""]);
      setTimer(120);
      setFormData({
        name: "",
        contact_no: "",
        email: "",
        user_id: currentUser?.id,
        is_active: 1,
        userType,
      });
      setRefresh(true);
      onHide();
    } catch (error) {
      toast.error("An error occurred. Try again.");
    }
  };

  // Timer Countdown
  useEffect(() => {
    if (isOtpScreen && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      toast.error("OTP expired. Request a new one.");
      sessionStorage.removeItem("otp");
    }
  }, [isOtpScreen, timer]);

  return (
    <Modal
      id="kt_modal_create_school"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      show={show}
      onHide={onHide}
      backdrop={true}
    >
      <div
        className="modal-header"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
        }}
      >
        <h2>Create a Company</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={onHide}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>
      {!isOtpScreen ? (
        <div
          className="modal-body"
          style={{
            backgroundColor: "#F2F6FF",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formName">
                  <Form.Label>Company Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formContactNo">
                  <Form.Label>Contact No:</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_no"
                    value={formData.contact_no}
                    onChange={handleChange}
                    placeholder="Enter 10-digit phone number"
                    maxLength={11}
                    required
                  />
                  {phoneError && (
                    <small className="text-danger">{phoneError}</small>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter company email"
                    required
                    isInvalid={!!emailError} // Shows error styling if email is invalid
                  />
                  <Form.Control.Feedback type="invalid">
                    {emailError}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <br />
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {uploadStatus || "Submit"}
          </Button>
        </div>
      ) : (
        <div className="modal-body text-center">
          <h4 className="mb-3">Enter OTP</h4>
          <p className="text-muted mb-4">
            We’ve sent a verification code to your email
          </p>

          <div className="d-flex justify-content-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                // onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-input text-center fw-bold"
                style={{
                  width: "50px",
                  height: "50px",
                  fontSize: "24px",
                  borderRadius: "8px",
                  border: "2px solid #007bff",
                  outline: "none",
                }}
                // ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>

          <p className="text-danger mt-3">Time left: {timer}s</p>

          <div className="d-flex flex-column align-items-center gap-3 mt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={verifyOtp}
              className="w-50"
            >
              Verify OTP
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              onClick={resendOtp}
              disabled={timer > 0}
              className="w-50"
            >
              Resend OTP
            </Button>
            <Button
              variant="danger"
              size="lg"
              className="w-50"
              onClick={() => {
                setIsOtpScreen(false);
                setFormData({ ...formData, email: "" });
              }}
            >
              Change Email
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export { CreateSchoolMasterModal };
