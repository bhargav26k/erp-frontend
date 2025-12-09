/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import axios from "axios";
// import "./Style.css";

type Props = {
  show: boolean;
  handleClose: () => void;
  enqId: string | undefined;
  // refresh: (refresh: boolean) => void;
};

type Reference = {
  id: string;
  reference: string;
};

const modalsRoot = document.getElementById("root-modals") || document.body;
interface Source {
  id: string; // Adjust the type as per your data structure
  source: string;
  // Add other properties if needed
}
interface Class {
  class: string;
  id: string; // Adjust the type as per your data structure
  // Add other properties if needed
}
interface Session {
  session: string;
  id: string; // Adjust the type as per your data structure
  // Add other properties if needed
}

interface Data {
  name: string; // Name of the Wrestler (Student)
  parent_name: string; // Parent's Name
  address: string; // Full Address
  contact: string; // Mobile No. (WhatsApp No.)
  date_of_birth: string;
  blood_group: string;
  current_school: string; // School / Academic Institution / College Name
  height_cm: string; // Height (cm)
  aadhaar_no: string; // Aadhar Card Number
  weight_kg: string; // Weight (kg)
  wrestling_level: string; // Wrestling Information / Level
  previous_training_center: string; // Previous Training Center
  training_duration: string; // Duration (Months/Years)
  tournaments_participated: string; // Tournaments Participated
  class_id: string;
  academic_year: string;
  status: string;
  reference: string;
  source: string;
}

const CreateAdmissionForm = ({ show, handleClose }: Props) => {
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const sessionId = currentUser?.session_id;
  const [source, setSource] = useState<Source[]>([]);
  const [reference, setReference] = useState<Reference[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [reviewStatus, setReviewStatus] = useState(1);
  const [status, setStatus] = useState("");
  const [pic_data, set_pic_data] = useState({
    student_pic: null,
    father_pic: null,
    mother_pic: null,
    gardian_pic: null,
  });
  const [data, setData] = useState<Data>({
    name: "",
    parent_name: "",
    address: "",
    contact: "",
    date_of_birth: "",
    blood_group: "",
    current_school: "",
    height_cm: "",
    aadhaar_no: "",
    weight_kg: "",
    wrestling_level: "",
    previous_training_center: "",
    training_duration: "",
    tournaments_participated: "",
    class_id: "",
    academic_year: "",
    status: "",
    reference: "",
    source: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [submissionStatus, setSubmissionStatus] = useState("");

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

    const fetchSource = async () => {
      const schoolId = currentUser?.school_id;
      if (!schoolId) return;
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-source?schoolId=${schoolId}`
        );
        if (!response.ok) {
          throw new Error(`Error in Fetching source ${response.status}`);
        }
        const data = await response.json();
        setSource(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchSource();

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

    const fetchSessions = async () => {
      const schoolId = currentUser?.school_id;
      if (!schoolId) return;

      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-school-sessions/${schoolId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchSessions();
  }, [currentUser]);

  const formatDateToYYYYMMDD = (dateString: string | number | Date) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    /* @ts-ignore */
    if (isNaN(date)) return ""; // Return empty string if date is invalid

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  };

  // Ensure data is an array and check for valid first element

  useEffect(() => {
    const fetchById = async () => {
      const enquiry_id = enqId;

      try {
        const response = await fetch(
          `${DOMAIN}/api/school/getadmissionenquirybyid/${schoolId}/${enquiry_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Data not received ${response.status}`);
        }

        const data = await response.json();

        // Format dates if they exist
        const followUpDate = data?.[0]?.follow_up_date
          ? formatDateToYYYYMMDD(data[0].follow_up_date)
          : "";
        const dateOfBirth = data?.[0]?.date_of_birth
          ? formatDateToYYYYMMDD(data[0].date_of_birth)
          : "";

        setData({
          name: data[0]?.student_name || "",
          parent_name: data[0]?.parent_name || "",
          address: data[0]?.address || "",
          contact: data[0]?.student_phone || "",
          date_of_birth: dateOfBirth,
          blood_group: data[0]?.blood_group || "",
          current_school: data[0]?.current_school || "",
          height_cm: data[0]?.height_cm || "",
          aadhaar_no: data[0]?.aadhaar_no || "",
          weight_kg: data[0]?.weight_kg || "",
          wrestling_level: data[0]?.wrestling_level || "",
          previous_training_center: data[0]?.previous_training_center || "",
          training_duration: data[0]?.training_duration || "",
          tournaments_participated: data[0]?.tournaments_participated || "",
          class_id: data[0]?.class_id || "",
          academic_year: data[0]?.academic_year || "",
          status: data[0]?.status || "",
          reference: data[0]?.reference || "",
          source: data[0]?.source || "",
        });
      } catch (error) {
        console.error("Error fetching enquiry details:", error);
      }
    };

    fetchById();
  }, [schoolId]);

//   useEffect(() => {
//     const fetchStatus = async () => {
//       try {
//         const response = await fetch(
//           `${DOMAIN}/api/school/getaddmissionstatusById/${schoolId}/${enquiry_id}`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch status");
//         }
//         const data = await response.json();
//         setStatus(data[0].status);
//       } catch (error) {
//         console.error("Error fetching status:", error);
//         return null;
//       }
//     };
//     fetchStatus();
//   }, [schoolId, enqId, formSubmitted]);

  /* @ts-ignore */
  const handleChange = (key, value, type) => {
    if (type === "file") {
      set_pic_data((prevPicData) => ({
        ...prevPicData,
        [key]: value.target.files[0],
      }));
    } else {
      setData((prevFormData) => ({
        ...prevFormData,
        [key]: value,
      }));
    }
  };

  /* @ts-ignore */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    /* @ts-ignore */
    formData.append("enquiry_id", enquiry_id);
    formData.append("name", data.name);
    formData.append("parent_name", data.parent_name);
    formData.append("address", data.address);
    formData.append("contact", data.contact);
    formData.append("date_of_birth", data.date_of_birth);
    formData.append("blood_group", data.blood_group);
    formData.append("current_school", data.current_school);
    formData.append("height_cm", data.height_cm);
    formData.append("aadhaar_no", data.aadhaar_no);
    formData.append("weight_kg", data.weight_kg);
    formData.append("wrestling_level", data.wrestling_level);
    formData.append("previous_training_center", data.previous_training_center);
    formData.append("training_duration", data.training_duration);
    formData.append("tournaments_participated", data.tournaments_participated);
    formData.append("class_id", data.class_id);
    formData.append("academic_year", data.academic_year);
    formData.append("status", data.status);
    formData.append("reference", data.reference);
    formData.append("source", data.source);
    if (pic_data.student_pic)
      formData.append("student_pic", pic_data.student_pic);
    if (pic_data.father_pic) formData.append("father_pic", pic_data.father_pic);
    if (pic_data.mother_pic) formData.append("mother_pic", pic_data.mother_pic);
    if (pic_data.gardian_pic)
      formData.append("gardian_pic", pic_data.gardian_pic);
    /* @ts-ignore */
    formData.append("school_id", schoolId);

    try {
      const response = await axios.post(
        `${DOMAIN}/api/school/upload-application`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        setFormSubmitted(true);
        setSubmissionStatus("Form submitted successfully and under review.");
      } else {
        setFormSubmitted(false);
        setSubmissionStatus(
          `Submission failed: ${response.data.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormSubmitted(false);
      setSubmissionStatus(
        /* @ts-ignore */
        `Submission failed: ${error.message || "Unknown error"}`
      );
    }
  };

  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      size="lg"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      show={show}
      onHide={handleClose}
    >
      <div
        className="modal-header"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
        }}
      >
        <h2
          style={{
            fontFamily: "Manrope",
            fontWeight: 600,
            fontSize: "22px",
            color: "#1F4061",
          }}
        >
          {" "}
          {status === "isPending"
            ? "Application Form"
            : status === "isSubmited"
            ? "Application Review"
            : status === "isReviewed"
            ? "Review Completed"
            : status === "isRejected"
            ? "Application Rejected"
            : status === "isCompleted"
            ? "Application Completed"
            : "Unknown Status"}
        </h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>
      <div
        className="modal-body"
        style={{ justifyContent: "center", backgroundColor: "#F2F6FF" }}
      >
        {status === "isPending" && (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3 custom-input" controlId="formName">
                  <Form.Label>Name of the Wrestler (Student) *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={(e) =>
                      handleChange("name", e.target.value, "text")
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formParentName"
                >
                  <Form.Label>Parent's Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="parent_name"
                    value={data.parent_name}
                    onChange={(e) =>
                      handleChange("parent_name", e.target.value, "text")
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formAddress"
                >
                  <Form.Label>Full Address *</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={data.address}
                    onChange={(e) =>
                      handleChange("address", e.target.value, "text")
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formContact"
                >
                  <Form.Label>Mobile No. (WhatsApp No.) *</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact"
                    value={data.contact}
                    onChange={(e) =>
                      handleChange("contact", e.target.value, "text")
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3 custom-input" controlId="formDOB">
                  <Form.Label>Date of Birth *</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_of_birth"
                    value={data.date_of_birth}
                    onChange={(e) =>
                      handleChange("date_of_birth", e.target.value, "text")
                    }
                    required
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
                    value={data.blood_group}
                    onChange={(e) =>
                      handleChange("blood_group", e.target.value, "text")
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formCurrentSchool"
                >
                  <Form.Label>
                    School / Academic Institution / College Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="current_school"
                    value={data.current_school}
                    onChange={(e) =>
                      handleChange("current_school", e.target.value, "text")
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formHeight"
                >
                  <Form.Label>Height (cm)</Form.Label>
                  <Form.Control
                    type="text"
                    name="height_cm"
                    value={data.height_cm}
                    onChange={(e) =>
                      handleChange("height_cm", e.target.value, "text")
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formAadhaar"
                >
                  <Form.Label>Aadhar Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="aadhaar_no"
                    value={data.aadhaar_no}
                    onChange={(e) =>
                      handleChange("aadhaar_no", e.target.value, "text")
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formWeight"
                >
                  <Form.Label>Weight (kg)</Form.Label>
                  <Form.Control
                    type="text"
                    name="weight_kg"
                    value={data.weight_kg}
                    onChange={(e) =>
                      handleChange("weight_kg", e.target.value, "text")
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formWrestlingLevel"
                >
                  <Form.Label>Wrestling Information / Level</Form.Label>
                  <Form.Control
                    type="text"
                    name="wrestling_level"
                    value={data.wrestling_level}
                    onChange={(e) =>
                      handleChange("wrestling_level", e.target.value, "text")
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formPreviousTrainingCenter"
                >
                  <Form.Label>Previous Training Center</Form.Label>
                  <Form.Control
                    type="text"
                    name="previous_training_center"
                    value={data.previous_training_center}
                    onChange={(e) =>
                      handleChange(
                        "previous_training_center",
                        e.target.value,
                        "text"
                      )
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formTrainingDuration"
                >
                  <Form.Label>Training Duration (Months/Years)</Form.Label>
                  <Form.Control
                    type="text"
                    name="training_duration"
                    value={data.training_duration}
                    onChange={(e) =>
                      handleChange("training_duration", e.target.value, "text")
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formTournamentsParticipated"
                >
                  <Form.Label>Tournaments Participated in So Far</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="tournaments_participated"
                    value={data.tournaments_participated}
                    onChange={(e) =>
                      handleChange(
                        "tournaments_participated",
                        e.target.value,
                        "text"
                      )
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {/* Required dropdowns */}
              <Col md={3}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formClass"
                >
                  <Form.Label>Select Class *</Form.Label>
                  <Form.Select
                    name="class_id"
                    value={data.class_id}
                    onChange={(e) =>
                      handleChange("class_id", e.target.value, "text")
                    }
                    required
                  >
                    {classes.map((value) => (
                      <option
                        key={value.id}
                        value={value.id}
                        style={{
                          fontFamily: "Manrope",
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "#1F4061",
                        }}
                      >
                        {value.class}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formAcademicYear"
                >
                  <Form.Label>Academic Year *</Form.Label>
                  <Form.Select
                    name="academic_year"
                    value={data.academic_year}
                    onChange={(e) =>
                      handleChange("academic_year", e.target.value, "text")
                    }
                    required
                  >
                    {sessions.map((value) => (
                      <option
                        key={value.id}
                        value={value.id}
                        style={{
                          fontFamily: "Manrope",
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "#1F4061",
                        }}
                      >
                        {value.session}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formStatus"
                >
                  <Form.Label>Status *</Form.Label>
                  <Form.Select
                    name="status"
                    value={data.status}
                    onChange={(e) =>
                      handleChange("status", e.target.value, "text")
                    }
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formReference"
                >
                  <Form.Label>Reference</Form.Label>
                  <Form.Select
                    name="reference"
                    value={data.reference}
                    onChange={(e) =>
                      handleChange("reference", e.target.value, "text")
                    }
                  >
                    {reference.map((value) => (
                      <option
                        key={value.id}
                        value={value.id}
                        style={{
                          fontFamily: "Manrope",
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "#1F4061",
                        }}
                      >
                        {value.reference}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formSource"
                >
                  <Form.Label>Source</Form.Label>
                  <Form.Select
                    name="source"
                    value={data.source}
                    onChange={(e) =>
                      handleChange("source", e.target.value, "text")
                    }
                  >
                    {source.map((value) => (
                      <option
                        key={value.id}
                        value={value.id}
                        style={{
                          fontFamily: "Manrope",
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "#1F4061",
                        }}
                      >
                        {value.source}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div
              style={{ display: "flex", justifyContent: "end", width: "100%" }}
            >
              <Button
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#FFF",
                  backgroundColor: "#1F4061",
                }}
                type="submit"
                className="btn btn-primary"
              >
                Save It !
              </Button>
            </div>
          </Form>
        )}

        {status === "isSubmited" && (
          <div
            style={{
              marginBottom: "23px",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
              className="review-status"
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <span className="exclamation-mark" style={{ fontSize: "200px" }}>
                ⏳
              </span>
              <h3 style={{ fontSize: "40px" }}>Review Pending</h3>
            </div>
          </div>
        )}

        {status === "isReviewed" && (
          <div className="fee">
            <div
              style={{
                marginBottom: "23px",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {reviewStatus === 1 ? (
                <div
                  className="review-status"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <span
                    className="exclamation-mark"
                    style={{ fontSize: "200px" }}
                  >
                    💵
                  </span>
                  <h3 style={{ fontSize: "40px" }}>Fees Pending</h3>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}

        {status === "isCompleted" && (
          <div className="fee">
            <div
              style={{
                marginBottom: "23px",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div
                className="review-status"
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <span
                  className="exclamation-mark"
                  style={{ fontSize: "200px" }}
                >
                  ✅
                </span>
                <h3 style={{ fontSize: "40px" }}>Admission Completed</h3>
              </div>
            </div>
          </div>
        )}

        {status === "isRejected" && (
          <div className="fee">
            <div
              style={{
                marginBottom: "23px",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div
                className="review-status"
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <span
                  className="exclamation-mark"
                  style={{ fontSize: "200px" }}
                >
                  😞
                </span>
                <h3 style={{ fontSize: "40px" }}>Admission Rejected</h3>9
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateAdmissionForm };
