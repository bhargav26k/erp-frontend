import React, { useState, useEffect } from "react";
import { useAuth } from "../../../modules/auth";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const UserProfile: React.FC = () => {
  const { currentUser } = useAuth();
  let school_id = (currentUser as any)?.school_id;

  const role_name = (currentUser as any)?.role_name;
  const userId = (currentUser as any)?.id;
  const [encrypted_code, setEncrypted_code] = useState("");
  const [userDetails, setUserdetails] = useState([]);
  const [schoolDetails, setSchooldetails] = useState([]);
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchoolUsers = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/school-user-by-id/${userId}/${school_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch school masters");
        }
        const data = await response.json();
        console.log(data);

        setUserdetails(data.user);
        setSchooldetails(data.school);
        setEncrypted_code(data.masterEncryptedCode);

        const logoResponse = await fetch(
          `${DOMAIN}/api/school/get_school_logo`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              school_logo: data.school.school_logo,
            }),
          }
        );

        if (!logoResponse.ok) {
          throw new Error("Failed to fetch logo");
        }

        const blob = await logoResponse.blob();
        const imageObjectURL = URL.createObjectURL(blob);
        setLogo(imageObjectURL);
      } catch (error) {
        console.error("Error fetching school user:", error);
      }
    };
    fetchSchoolUsers();
  }, [role_name, currentUser]);

  const getBaseDomain = () => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin; // Get the current frontend domain
      const match = origin.match(/^(https?:\/\/[^\/]+\.(com|in))/);
      return match ? match[1] : origin; // Return extracted domain or fallback to origin
    }
    return "";
  };

  const formatDate = (dt?: string) =>
    dt ? new Date(dt).toLocaleDateString() : "";

  return (
    <>
      <Container
        fluid
        className="p-5"
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        <Row className="g-4 p-5">
          {/* School Card */}
          {/* School Card */}
          <Col lg={12}>
            <Card
              className="h-100 border-0 shadow-sm"
              style={{ borderRadius: "20px", overflow: "hidden" }}
            >
              <Card.Header className="bg-primary-gradient text-white py-4 border-0 position-relative">
                <div
                  className="d-flex align-items-center justify-content-between"
                  style={{ width: "100%" }}
                >
                  <div className="d-flex align-items-center gap-4">
                    {logo && (
                      <div
                        className="logo-container bg-white p-2 shadow"
                        style={{
                          borderRadius: "15px",
                          width: "120px",
                          height: "120px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={logo}
                          alt="School Logo"
                          className="w-100 h-100 object-fit-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h2 className="mb-1 text-[#1F4061]">
                        {schoolDetails?.name || "Olympia National School"}
                      </h2>
                      <div className="d-flex gap-3 align-items-center">
                        <span className="badge bg-white text-[#1F4061] fs-6 py-2">
                          <i className="fas fa-id-badge me-2"></i>
                          {schoolDetails?.school_id || "DAS-2412058008"}
                        </span>
                        <span className="badge bg-white text-[#1F4061] fs-6 py-2">
                          <i className="fas fa-clock me-2"></i>
                          {schoolDetails?.timezone || "UTC"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="light"
                      size="sm"
                      className="rounded-pill px-4"
                      // onClick={onEditSchool}
                    >
                      <i className="fas fa-pen me-2"></i>Edit Profile
                    </Button>
                  </div>
                </div>
              </Card.Header>

              <Card.Body className="p-4">
                <Row className="g-4">
                  {/* Contact Information Column */}
                  <Col md={4}>
                    <div className="modern-info-card p-4 h-100 bg-light rounded-3">
                      <h5 className="text-[#1F4061] mb-4">
                        <i className="fas fa-map-marker-alt me-2"></i>Location
                      </h5>
                      <p className="mb-0 text-muted">
                        {schoolDetails?.address || "894 Green Fabien Lane"},
                        <br />
                        {schoolDetails?.city || "Nashik"},<br />
                        {schoolDetails?.state || "Maharashtra"},<br />
                        {schoolDetails?.country || "India"}
                      </p>
                      <hr className="my-3" />
                      <h5 className="text-[#1F4061] mb-4">
                        <i className="fas fa-phone me-2"></i>Contact
                      </h5>
                      <div className="d-flex flex-column gap-2">
                        <div>
                          <small className="text-muted">Email</small>
                          <div className="text-dark">
                            {schoolDetails?.email ||
                              "olympianationalschool@mail.com"}
                          </div>
                        </div>
                        <div>
                          <small className="text-muted">Phone</small>
                          <div className="text-dark">
                            {schoolDetails?.phone || "9141168951"}
                          </div>
                        </div>
                        {schoolDetails?.website && (
                          <div>
                            <small className="text-muted">Website</small>
                            <div className="text-dark">
                              {schoolDetails.website}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>

                  {/* System Settings Column */}
                  <Col md={4}>
                    <div className="modern-info-card p-4 h-100 bg-light rounded-3">
                      <h5 className="text-[#1F4061] mb-4">
                        <i className="fas fa-cog me-2"></i>Settings
                      </h5>
                      <div className="d-flex flex-column gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <i className="fas fa-coins text-[#1F4061] fs-4"></i>
                          <div>
                            <small className="text-muted">Currency</small>
                            <div className="text-dark">
                              {schoolDetails?.currency || "Rs"} (
                              {schoolDetails?.currency_symbol || "₹"})
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <i className="fas fa-calendar-alt text-[#1F4061] fs-4"></i>
                          <div>
                            <small className="text-muted">Date Format</small>
                            <div className="text-dark">
                              {schoolDetails?.date_format || "dd/mm/yyyy"}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <i className="fas fa-clock text-[#1F4061] fs-4"></i>
                          <div>
                            <small className="text-muted">Time Format</small>
                            <div className="text-dark">
                              {schoolDetails?.time_format || "hh:mm"}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <i className="fas fa-university text-[#1F4061] fs-4"></i>
                          <div>
                            <small className="text-muted">
                              Educational Board
                            </small>
                            <div className="text-dark">
                              {schoolDetails?.educational_board || "CBSE"}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <i className="fas fa-receipt text-[#1F4061] fs-4"></i>
                          <div>
                            <small className="text-muted">Voucher Type</small>
                            <div className="text-dark">
                              {schoolDetails?.voucher_type || "receipt"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>

                  {/* Quick Actions Column */}
                  <Col md={4}>
                    <div className="modern-info-card p-4 h-100 bg-light rounded-3 d-flex flex-column">
                      <h5 className="text-[#1F4061] mb-4">
                        <i className="fas fa-bolt me-2"></i>Quick Actions
                      </h5>
                      <div className="d-flex flex-column gap-3 mt-auto">
                        {/* <Button
                          variant="primary"
                          className="d-flex align-items-center justify-content-between py-3"
                          href={`${getBaseDomain()}/pay-portal?encrypted_code=${encodeURIComponent(
                            userDetails?.encrypted_code === null
                              ? encrypted_code
                              : userDetails?.encrypted_code
                          )}`}
                          target="_blank"
                        >
                          <span>Go to Pay Portal</span>
                          <i className="fas fa-arrow-up-right-from-square"></i>
                        </Button> */}

                        <Button
                          variant="outline-primary"
                          className="d-flex align-items-center justify-content-between py-3"
                        >
                          <span>Download Reports</span>
                          <i className="fas fa-file-export"></i>
                        </Button>

                        {schoolDetails?.upload_documents && (
                          <Button
                            variant="outline-success"
                            className="d-flex align-items-center justify-content-between py-3"
                          >
                            <span>Upload Documents</span>
                            <i className="fas fa-file-upload"></i>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* User Card */}
          <Col lg={12}>
            <Card
              className="h-100 border-0 shadow-sm"
              style={{ borderRadius: "20px", overflow: "hidden" }}
            >
              <Card.Header className="bg-primary-gradient text-white py-4 border-0 d-flex align-items-center justify-content-between">
                <h5 className="mb-0">User Details</h5>
                <Button variant="light" size="sm" className="rounded-pill px-4">
                  <i className="fas fa-pen me-2"></i>Edit Profile
                </Button>
              </Card.Header>

              <Card.Body className="p-4">
                <Row className="g-4">
                  {/* Personal Info */}
                  <Col md={4}>
                    <div className="modern-info-card p-4 h-100 bg-light rounded-3">
                      <h5 className="text-[#1F4061] mb-4">
                        <i className="fas fa-user me-2"></i>Personal
                      </h5>
                      <p className="mb-2">
                        <strong>Name:</strong> {userDetails?.name || ""}
                      </p>
                      <p className="mb-2">
                        <strong>Email:</strong> {userDetails?.email || ""}
                      </p>
                      <p className="mb-2">
                        <strong>Contact:</strong>{" "}
                        {userDetails?.contact_no || ""}
                      </p>
                      <p className="mb-2">
                        <strong>DOB:</strong> {formatDate(userDetails?.dob)}
                      </p>
                      <p className="mb-2">
                        <strong>Gender:</strong> {userDetails?.gender || ""}
                      </p>
                      <p className="mb-2">
                        <strong>Marital Status:</strong>{" "}
                        {userDetails?.marital_status || ""}
                      </p>
                    </div>
                  </Col>

                  {/* Job & Employment */}
                  <Col md={4}>
                    <div className="modern-info-card p-4 h-100 bg-light rounded-3">
                      <h5 className="text-[#1F4061] mb-4">
                        <i className="fas fa-briefcase me-2"></i>Employment
                      </h5>
                      <p className="mb-2">
                        <strong>Employee ID:</strong>{" "}
                        {userDetails?.employee_id || ""}
                      </p>
                      <p className="mb-2">
                        <strong>Designation:</strong>{" "}
                        {userDetails?.designation || ""}
                      </p>
                      <p className="mb-2">
                        <strong>Department:</strong>{" "}
                        {userDetails?.department || ""}
                      </p>
                      <p className="mb-2">
                        <strong>Joined:</strong>{" "}
                        {formatDate(userDetails?.date_of_joining)}
                      </p>
                      <p className="mb-2">
                        <strong>Left:</strong>{" "}
                        {formatDate(userDetails?.date_of_leaving)}
                      </p>
                      <p className="mb-2">
                        <strong>Contract:</strong>{" "}
                        {userDetails?.contract_type || ""}
                      </p>
                      <p className="mb-2">
                        <strong>Work Exp:</strong> {userDetails?.work_exp || ""}
                      </p>
                    </div>
                  </Col>

                  {/* Banking & Salary */}
                  <Col md={4}>
                    <div className="modern-info-card p-4 h-100 bg-light rounded-3">
                      <h5 className="text-[#1F4061] mb-4">
                        <i className="fas fa-university me-2"></i>Bank & Salary
                      </h5>
                      <p className="mb-2">
                        <strong>Bank Name:</strong>{" "}
                        {userDetails?.bank_name || ""}
                      </p>
                      <p className="mb-2">
                        <strong>Branch:</strong>{" "}
                        {userDetails?.bank_branch || ""}
                      </p>
                      <p className="mb-2">
                        <strong>Account No:</strong>{" "}
                        {userDetails?.bank_account_no || ""}
                      </p>
                      <p className="mb-2">
                        <strong>IFSC Code:</strong>{" "}
                        {userDetails?.ifsc_code || ""}
                      </p>
                      <p className="mb-2">
                        <strong>EPF No:</strong> {userDetails?.epf_no || ""}
                      </p>
                      <p className="mb-2">
                        <strong>Payscale:</strong> {userDetails?.payscale || ""}
                      </p>
                      <p className="mb-2">
                        <strong>Basic Salary:</strong>{" "}
                        {userDetails?.basic_salary || ""}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserProfile;
