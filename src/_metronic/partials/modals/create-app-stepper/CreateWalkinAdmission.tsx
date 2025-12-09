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

interface ClassDetails {
  id: string;
  class: string;
}

interface Sessions {
  academic_year: string | number | readonly string[] | undefined;
  id: string;
  session_id: string;
}

interface FormData {
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
  session_id: string;
  father_name: string;
  father_phone: string;
  mother_name: string;
  mother_phone: string;
  class_id: string;
  status: string;
  note: string;
  reference_id: string;
  source_id: string;
  follow_up_date: string;
  enquiry_type: string;
  school_id: string;
}

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateWalkinAdmission = ({ show, handleClose, setRefresh }: Props) => {
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const sessionId = currentUser?.session_id;
  /* @ts-ignore */
  const userId = currentUser?.id;

  const [classes, setClasses] = useState<ClassDetails[]>([]);
  const [source, setSource] = useState<Source[]>([]);
  const [reference, setReference] = useState<Reference[]>([]);
  const [formData, setFormData] = useState<FormData>({
    student_name: "",
    student_phone: "",
    student_address: "",
    student_email: "",
    gender: "",
    date_of_birth: "",
    blood_group: "",
    height_cm: "",
    weight_kg: "",
    aadhar_number: "",
    wrestling_level: "",
    previous_training_center: "",
    training_duration: "",
    tournaments_participated: "",
    current_school: "",
    session_id: sessionId,
    father_name: "",
    father_phone: "",
    mother_name: "",
    mother_phone: "",
    class_id: "",
    status: "isPending",
    note: "",
    reference_id: "",
    source_id: "",
    follow_up_date: "",
    enquiry_type: "Admission",
    school_id: schoolId || "",
  });

  /* @ts-ignore */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["reference", "source", "class"].includes(name)) {
      const [id, text] = value.split(":");
      setFormData((prevState) => ({
        ...prevState,
        [`${name}_id`]: id, // session_id or class_id
        [name]: text, // display value like session or class name
      }));
    } else if (name === "academic_year") {
      // Handle academic_year and session_id
      const [session_id, academic_year] = value.split(":");
      setFormData((prevState) => ({
        ...prevState,
        session_id,
        academic_year, // academic year from the dropdown
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const fetchClasses = async () => {
      const schoolId = currentUser?.school_id;
      if (!schoolId) return;

      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-classes?schoolId=${schoolId}&sessionId=${sessionId}`
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

    const fetchReference = async () => {
      const schoolId = currentUser?.school_id;
      if (!schoolId) return;

      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-reference?schoolId=${schoolId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReference(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchReference();

    const fetchSource = async () => {
      const schoolId = currentUser?.school_id;
      if (!schoolId) return;

      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-source?schoolId=${schoolId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSource(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchSource();
  }, [currentUser, show]);

  /* @ts-ignore */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/admissionEnquiry/${schoolId}/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json(); // Parse the JSON response

      if (!response.ok) {
        // Use the error message from the backend, if available
        const errorMessage =
          data.error || "An error occurred while creating the enquiry.";
        toast.error(errorMessage);
        return; // Exit the function to prevent further execution
      }

      toast.success("Enquiry created successfully!");
      handleClose();
      setRefresh(true);
    } catch (error) {
      console.error("Error creating Enquiry:", error);
      toast.error("Error creating Enquiry. Please try again.");
    }
  };

  return createPortal(
    <Modal
      id="kt_modal_create_school"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <div
        className="modal-header"
        style={{
          backgroundColor: "rgb(242, 246, 255)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderBottom: "1px solid lightgray",
        }}
      >
        <h2
          style={{ fontFamily: "Manrope", fontSize: "18px", fontWeight: "600" }}
        >
          Admission Enquiry Form
        </h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
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
            <Col md={4}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formStudentName"
              >
                <Form.Label>Student Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formStudentPhone"
              >
                <Form.Label>Student Phone *</Form.Label>
                <Form.Control
                  type="text"
                  name="student_phone"
                  value={formData.student_phone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formStudentEmail"
              >
                <Form.Label>Student Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="student_email"
                  value={formData.student_email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formGender">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formDOB">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formBloodGroup"
              >
                <Form.Label>Blood Group</Form.Label>
                <Form.Control
                  type="text"
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {schoolId === "AMO-2509097151" && (
            <>
              <Row>
                <Col md={4}>
                  <Form.Group
                    className="mb-3 custom-input"
                    controlId="formWrestlingLevel"
                  >
                    <Form.Label>Wrestling Level</Form.Label>
                    <Form.Control
                      type="text"
                      name="wrestling_level"
                      value={formData.wrestling_level}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group
                    className="mb-3 custom-input"
                    controlId="formPrevTraining"
                  >
                    <Form.Label>Previous Training Center</Form.Label>
                    <Form.Control
                      type="text"
                      name="previous_training_center"
                      value={formData.previous_training_center}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group
                    className="mb-3 custom-input"
                    controlId="formTrainingDuration"
                  >
                    <Form.Label>Training Duration</Form.Label>
                    <Form.Control
                      type="text"
                      name="training_duration"
                      value={formData.training_duration}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group
                    className="mb-3 custom-input"
                    controlId="formTournaments"
                  >
                    <Form.Label>Tournaments Participated</Form.Label>
                    <Form.Control
                      type="text"
                      name="tournaments_participated"
                      value={formData.tournaments_participated}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group
                    className="mb-3 custom-input"
                    controlId="formCurrentSchool"
                  >
                    <Form.Label>Current School</Form.Label>
                    <Form.Control
                      type="text"
                      name="current_school"
                      value={formData.current_school}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group
                    className="mb-3 custom-input"
                    controlId="formHeight"
                  >
                    <Form.Label>Height (cm)</Form.Label>
                    <Form.Control
                      type="text"
                      name="height_cm"
                      value={formData.height_cm}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group
                    className="mb-3 custom-input"
                    controlId="formWeight"
                  >
                    <Form.Label>Weight (kg)</Form.Label>
                    <Form.Control
                      type="text"
                      name="weight_kg"
                      value={formData.weight_kg}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
          <Row>
            <Col md={4}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formFatherName"
              >
                <Form.Label>Father Name</Form.Label>
                <Form.Control
                  type="text"
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formFatherPhone"
              >
                <Form.Label>Father Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="father_phone"
                  value={formData.father_phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formMotherName"
              >
                <Form.Label>Mother Name</Form.Label>
                <Form.Control
                  type="text"
                  name="mother_name"
                  value={formData.mother_name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formMotherPhone"
              >
                <Form.Label>Mother Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="mother_phone"
                  value={formData.mother_phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formClass">
                <Form.Label>Class</Form.Label>
                <Form.Select
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleChange}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.class}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formReference"
              >
                <Form.Label>Reference</Form.Label>
                <Form.Select
                  name="reference_id"
                  value={formData.reference_id}
                  onChange={handleChange}
                >
                  <option value="">Select Reference</option>
                  {reference.map((ref) => (
                    <option key={ref.id} value={ref.id}>
                      {ref.reference}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formSource">
                <Form.Label>Source</Form.Label>
                <Form.Select
                  name="source_id"
                  value={formData.source_id}
                  onChange={handleChange}
                >
                  <option value="">Select Source</option>
                  {source.map((src) => (
                    <option key={src.id} value={src.id}>
                      {src.source}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formFollowUpDate"
              >
                <Form.Label>Follow-up Date</Form.Label>
                <Form.Control
                  type="date"
                  name="follow_up_date"
                  value={formData.follow_up_date}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formAadhar">
                <Form.Label>Aadhar Number</Form.Label>
                <Form.Control
                  type="text"
                  name="aadhar_number"
                  value={formData.aadhar_number}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formReference"
              >
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="student_address"
                  value={formData.student_address}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3 custom-input" controlId="formNote">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <div style={{ display: "flex", justifyContent: "end" }}>
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

export { CreateWalkinAdmission };
