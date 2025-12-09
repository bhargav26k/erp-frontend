import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: (refresh: boolean) => void;
};

interface Reference {
  id: string;
  reference: string;
}

interface Source {
  id: string;
  source: string;
}

interface FormData {
  enquiry_id: string;
  enquiry_type: string;
  full_name: string;
  reference_id: number;
  follow_up_date: string;
  note: string;
  source_id: number;
  email: string;
  status: string;
  dob: string;
  gender: string;
  guardian_name: string;
  guardian_phone: string;
  session_id: number;
  school_id: string;
  phone_number: string;
}

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateGeneralEnquiry = ({ show, handleClose, setRefresh }: Props) => {
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const userId = currentUser?.id;
  const sessionId = currentUser?.session_id;

  const [source, setSource] = useState<Source[]>([]);
  const [reference, setReference] = useState<Reference[]>([]);
  const initialFormData: FormData = {
    enquiry_type: "General",
    full_name: "",
    reference_id: 0,
    follow_up_date: "",
    note: "",
    source_id: 0,
    email: "",
    status: "New",
    dob: "",
    gender: "",
    guardian_name: "",
    guardian_phone: "",
    session_id: sessionId,
    school_id: schoolId,
    phone_number: "",
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);

  /* @ts-ignore */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "reference") {
      setFormData((prevState) => ({
        ...prevState,
        reference_id: Number(value),
      }));
    } else if (name === "source") {
      setFormData((prevState) => ({
        ...prevState,
        source_id: Number(value),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const fetchReference = async () => {
      if (!schoolId) return;
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-reference?schoolId=${schoolId}`
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setReference(data);
      } catch (error) {
        console.error("Error fetching references:", error);
      }
    };

    const fetchSource = async () => {
      if (!schoolId) return;
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-source?schoolId=${schoolId}`
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setSource(data);
      } catch (error) {
        console.error("Error fetching sources:", error);
      }
    };

    fetchReference();
    fetchSource();
  }, [schoolId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/generalEnquiry/${schoolId}/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create general enquiry");
      }

      await response.json();
      toast.success("Enquiry created successfully!");
      setFormData(initialFormData);
      setRefresh(true);
      handleCloseModal();
      setRefresh(true);
    } catch (error) {
      console.error("Error creating Enquiry:", error);
      toast.error("Error creating Enquiry. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setFormData(initialFormData);
    handleClose();
  };

  return createPortal(
    <Modal
      id="kt_modal_create_enquiry"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      show={show}
      onHide={handleCloseModal}
      backdrop="static"
      keyboard={false}
    >
      <div
        className="modal-header"
        style={{
          backgroundColor: "rgb(242, 246, 255)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderBottom: "1px solid lightgray",
          color: "#1F4061",
        }}
      >
        <h2
          style={{
            fontFamily: "Manrope",
            fontSize: "18px",
            fontWeight: "600",
            color: "#1F4061",
          }}
        >
          General Enquiry
        </h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleCloseModal}
        >
          <i className="fas fa-times" style={{ color: "#1C335C" }}></i>
        </div>
      </div>

      <div
        className="modal-body py-lg-10 px-lg-10"
        style={{
          backgroundColor: "rgb(242, 246, 255)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Full Name */}
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formFullName">
                <Form.Label>Full Name *</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter Full Name"
                    value={formData.full_name}
                    onChange={handleChange}
                    name="full_name"
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            {/* Email */}
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formEmail">
                <Form.Label>Email *</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-envelope"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            {/* Phone Number */}
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formPhoneNumber">
                <Form.Label>Phone Number *</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-phone"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    name="phone_number"
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            {/* DOB */}
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formDOB">
                <Form.Label>Date of Birth</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-calendar"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    name="dob"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            {/* Gender */}
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formGender">
                <Form.Label>Gender</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-venus-mars"></i>
                  </InputGroup.Text>
                  <Form.Select
                    value={formData.gender}
                    onChange={handleChange}
                    name="gender"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </InputGroup>
              </Form.Group>
            </Col>
            {/* Guardian Name */}
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formGuardianName">
                <Form.Label>Guardian Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user-friends"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter guardian name"
                    value={formData.guardian_name}
                    onChange={handleChange}
                    name="guardian_name"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            {/* Guardian Phone */}
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formGuardianPhone">
                <Form.Label>Guardian Phone</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-phone-alt"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="tel"
                    placeholder="Enter guardian phone"
                    value={formData.guardian_phone}
                    onChange={handleChange}
                    name="guardian_phone"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            {/* Reference */}
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formReference">
                <Form.Label>Select Reference</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-link"></i>
                  </InputGroup.Text>
                  <Form.Select
                    value={formData.reference_id}
                    onChange={handleChange}
                    name="reference"
                  >
                    <option value="">Select Reference</option>
                    {reference.map((ref) => (
                      <option key={ref.id} value={ref.id}>
                        {ref.reference}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Form.Group>
            </Col>
            {/* Source */}
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formSource">
                <Form.Label>Select Source</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-globe"></i>
                  </InputGroup.Text>
                  <Form.Select
                    value={formData.source_id}
                    onChange={handleChange}
                    name="source"
                  >
                    <option value="">Select Source</option>
                    {source.map((src) => (
                      <option key={src.id} value={src.id}>
                        {src.source}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            {/* Follow-up Date */}
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formFollowUpDate">
                <Form.Label>Follow-up Date</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-calendar-day"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    value={formData.follow_up_date}
                    onChange={handleChange}
                    name="follow_up_date"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            {/* Note */}
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formNote">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Enter note"
                  value={formData.note}
                  onChange={handleChange}
                  name="note"
                />
              </Form.Group>
            </Col>
            {/* Status */}
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-flag"></i>
                  </InputGroup.Text>
                  <Form.Select
                    value={formData.status}
                    onChange={handleChange}
                    name="status"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                    <option value="Deferred">Deferred</option>
                  </Form.Select>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <div style={{ display: "flex", justifyContent: "end", marginTop: "5px" }}>
            <button
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 12px",
                backgroundColor: "#1F4061",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.3s",
                border: "none",
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
                Save It!
              </span>
            </button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateGeneralEnquiry };
