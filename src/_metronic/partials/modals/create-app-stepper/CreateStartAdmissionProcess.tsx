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
  name: string;
  contact: string;
  state: string;
  city: string;
  pincode: string;
  // religion: string;
  aadhaar_no: string;
  email: string;
  class_id: string;
  gender: string;
  date_of_birth: string;
  current_school: string;
  academic_year: string;
  father_name: string;
  father_contact_number: string;
  father_occupation: string;
  father_type_of_work: string;
  father_organization: string;
  mother_name: string;
  mother_contact_number: string;
  mother_occupation: string;
  mother_organization: string;
  bank_name: string;
  back_account_no: string;
  ifsc_code: string;
  gardian_name: string;
  gardian_contact_number: string;
  gardian_occupation: string;
  gardian_relation: string;
  gardian_address: string;
}

const CreateStartAdmissionProcess = ({ show, handleClose, enqId }: Props) => {
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
    contact: "",
    state: "",
    city: "",
    pincode: "",
    // religion: "",
    aadhaar_no: "",
    email: "",
    class_id: "",
    gender: "",
    date_of_birth: "",
    current_school: "",
    academic_year: "",
    father_name: "",
    father_contact_number: "",
    father_occupation: "",
    father_type_of_work: "",
    father_organization: "",
    mother_name: "",
    mother_contact_number: "",
    mother_occupation: "",
    mother_organization: "",
    bank_name: "",
    back_account_no: "",
    ifsc_code: "",
    gardian_name: "",
    gardian_contact_number: "",
    gardian_occupation: "",
    gardian_relation: "",
    gardian_address: "",
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
          contact: data[0]?.student_phone || "",
          mother_name: data[0]?.mother_name || "",
          mother_contact_number: data[0]?.mother_phone || "",
          mother_organization: data[0]?.mother_organization || "",
          mother_occupation: data[0]?.mother_occupation || "",
          state: data[0]?.state || "",
          city: data[0]?.city || "",
          pincode: data[0]?.pincode || "",
          // religion: data[0]?.religion || "",
          aadhaar_no: data[0]?.aadhaar_no || "",
          date_of_birth: dateOfBirth,
          father_contact_number: data[0]?.father_phone || "",
          current_school: data[0]?.current_school || "",
          gender: data[0]?.gender || "",
          academic_year: data[0]?.academic_year || "",
          father_name: data[0]?.father_name || "",
          father_occupation: data[0]?.father_occupation || "",
          father_type_of_work: data[0]?.father_type_of_work || "",
          father_organization: data[0]?.father_organization || "",
          email: data[0]?.student_email || "",
          class_id: data[0]?.class_id || "",
          bank_name: data[0]?.bank_name || "",
          back_account_no: data[0]?.back_account_no || "",
          ifsc_code: data[0]?.ifsc_code || "",
          gardian_name: data[0]?.gardian_name || "",
          gardian_contact_number: data[0]?.gardian_phone || "",
          gardian_occupation: data[0]?.gardian_occupation || "",
          gardian_relation: data[0]?.gardian_relation || "",
          gardian_address: data[0]?.gardian_address || "",
        });
      } catch (error) {
        console.error("Error fetching enquiry details:", error);
      }
    };

    fetchById();
  }, [schoolId, enqId]);

  useEffect(() => {
    const fetchStatus = async () => {
      const enquiry_id = enqId;
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/getaddmissionstatusById/${schoolId}/${enquiry_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch status");
        }
        const data = await response.json();
        setStatus(data[0].status);
      } catch (error) {
        console.error("Error fetching status:", error);
        return null;
      }
    };
    fetchStatus();
  }, [schoolId, enqId, formSubmitted]);

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
    const enquiry_id = enqId;
    const formData = new FormData();

    /* @ts-ignore */
    formData.append("enquiry_id", enquiry_id);
    formData.append("name", data.name);
    formData.append("contact", data.contact);
    formData.append("state", data.state);
    formData.append("city", data.city);
    formData.append("pincode", data.pincode);
    // formData.append("religion", data.religion);
    formData.append("aadhaar_no", data.aadhaar_no);
    formData.append("email", data.email);
    formData.append("class_id", data.class_id);
    formData.append("gender", data.gender);
    formData.append("date_of_birth", data.date_of_birth);
    formData.append("current_school", data.current_school);
    formData.append("academic_year", data.academic_year);
    formData.append("father_name", data.father_name);
    formData.append("father_contact_number", data.father_contact_number);
    formData.append("father_occupation", data.father_occupation);
    formData.append("father_type_of_work", data.father_type_of_work);
    formData.append("father_organization", data.father_organization);
    formData.append("mother_name", data.mother_name);
    formData.append("mother_contact_number", data.mother_contact_number);
    formData.append("mother_occupation", data.mother_occupation);
    formData.append("mother_organization", data.mother_organization);
    formData.append("bank_name", data.bank_name);
    formData.append("back_account_no", data.back_account_no);
    formData.append("ifsc_code", data.ifsc_code);
    formData.append("gardian_name", data.gardian_name);
    formData.append("gardian_contact_number", data.gardian_contact_number);
    formData.append("gardian_occupation", data.gardian_occupation);
    formData.append("gardian_relation", data.gardian_relation);
    formData.append("gardian_address", data.gardian_address);
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
            <h1
              style={{
                fontFamily: "Manrope",
                fontWeight: 500,
                fontSize: "18px",
                color: "#1F4061",
              }}
            >
              Student Information
            </h1>
            <br />
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3 custom-input" controlId="formName">
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Name *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-user"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter name"
                      value={data.name || ""}
                      onChange={(e) =>
                        handleChange("name", e.target.value, "text")
                      }
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formContact"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Contact no *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-phone"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      maxLength={11}
                      minLength={11}
                      placeholder="Enter contact no"
                      value={data.contact || ""}
                      onChange={(e) =>
                        handleChange("contact", e.target.value, "text")
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 custom-input" controlId="formEmail">
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    E-Mail *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-envelope"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={data.email || ""}
                      onChange={(e) =>
                        handleChange("email", e.target.value, "text")
                      }
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3 custom-input" controlId="formState">
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    State *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-map"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="state"
                      placeholder="Enter state"
                      value={data.state || ""}
                      onChange={(e) =>
                        handleChange("state", e.target.value, "text")
                      }
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 custom-input" controlId="formCity">
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    City *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-city"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="city"
                      placeholder="Enter city"
                      value={data.city || ""}
                      onChange={(e) =>
                        handleChange("city", e.target.value, "text")
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formPincode"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Pincode *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-mail-bulk"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="pincode"
                      placeholder="Enter pincode"
                      value={data.pincode || ""}
                      onChange={(e) =>
                        handleChange("pincode", e.target.value, "text")
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              {/* <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formReligion"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Religion *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-praying-hands"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="religion"
                      placeholder="Enter religion"
                      value={data.religion || ""}
                      onChange={(e) =>
                        handleChange("religion", e.target.value, "text")
                      }
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col> */}

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formGender"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Gender *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-venus-mars"></i>
                    </InputGroup.Text>
                    <Form.Select
                      name="gender"
                      value={data.gender || ""}
                      onChange={(e) =>
                        handleChange("gender", e.target.value, "text")
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    >
                      <option
                        style={{
                          fontFamily: "Manrope",
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "#1F4061",
                        }}
                        value=""
                      >
                        Select Gender
                      </option>
                      <option
                        style={{
                          fontFamily: "Manrope",
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "#1F4061",
                        }}
                        value="male"
                      >
                        Male
                      </option>
                      <option
                        style={{
                          fontFamily: "Manrope",
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "#1F4061",
                        }}
                        value="female"
                      >
                        Female
                      </option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formCurrentSchool"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Current School *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-school"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="current_school"
                      placeholder="Enter current school"
                      value={data.current_school || ""}
                      onChange={(e) =>
                        handleChange("current_school", e.target.value, "text")
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3 custom-input" controlId="formDOB">
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Date of Birth *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-calendar"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="date"
                      name="date_of_birth"
                      value={data.date_of_birth || ""}
                      onChange={(e) =>
                        handleChange("date_of_birth", e.target.value, "text")
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formAadhaar"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Aadhaar No *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-id-card"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      maxLength={16}
                      name="aadhaar_no"
                      placeholder="Enter Aadhaar no"
                      value={data.aadhaar_no || ""}
                      onChange={(e) =>
                        handleChange("aadhaar_no", e.target.value, "text")
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formStudentImage"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Upload Student Image *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-camera"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="file"
                      name="student_pic"
                      onChange={(e) => handleChange("student_pic", e, "file")}
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formAcademicYear"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Academic Year *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-calendar-alt"></i>
                    </InputGroup.Text>
                    <Form.Select
                      name="academic_year"
                      value={data.academic_year || ""}
                      onChange={(e) =>
                        handleChange("academic_year", e.target.value, "text")
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    >
                      {sessions.map((value) => (
                        <option
                          style={{
                            fontFamily: "Manrope",
                            fontWeight: 500,
                            fontSize: "14px",
                            color: "#1F4061",
                          }}
                          key={value.id}
                          value={value.id}
                        >
                          {value.session}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 custom-input" controlId="formClass">
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Select Class *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-chalkboard"></i>
                    </InputGroup.Text>
                    <Form.Select
                      name="class_id"
                      value={data.class_id || ""}
                      onChange={(e) =>
                        handleChange("class_id", e.target.value, "text")
                      }
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                      required
                    >
                      {classes.map((value) => (
                        <option
                          style={{
                            fontFamily: "Manrope",
                            fontWeight: 500,
                            fontSize: "14px",
                            color: "#1F4061",
                          }}
                          key={value.id}
                          value={value.id}
                        >
                          {value.class}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <hr />
            <br />
            <h1
              style={{
                fontFamily: "Manrope",
                fontWeight: 500,
                fontSize: "18px",
                color: "#1F4061",
              }}
            >
              Parents Information
            </h1>
            <br />

            <Row>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formFatherName"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Father's Name *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-user"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="father_name"
                      placeholder="Enter father's name"
                      value={data.father_name || ""}
                      onChange={(e) =>
                        handleChange("father_name", e.target.value, "text")
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formFatherContact"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Father's Contact Number *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-phone"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      maxLength={11}
                      minLength={11}
                      name="father_contact_number"
                      placeholder="Enter father's contact number"
                      value={data.father_contact_number || ""}
                      onChange={(e) =>
                        handleChange(
                          "father_contact_number",
                          e.target.value,
                          "text"
                        )
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formFatherOccupation"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Father's Occupation *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-briefcase"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="father_occupation"
                      placeholder="Enter father's occupation"
                      value={data.father_occupation || ""}
                      onChange={(e) =>
                        handleChange(
                          "father_occupation",
                          e.target.value,
                          "text"
                        )
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formFatherTypeOfWork"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Father's Type Of Work *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-briefcase"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="father_type_of_work"
                      placeholder="Enter father's occupation"
                      value={data.father_type_of_work || ""}
                      onChange={(e) =>
                        handleChange(
                          "father_type_of_work",
                          e.target.value,
                          "text"
                        )
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formFatherOrganization"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Father's Organization*
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-briefcase"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="father_organization"
                      placeholder="Enter father's organization"
                      value={data.father_organization || ""}
                      onChange={(e) =>
                        handleChange(
                          "father_organization",
                          e.target.value,
                          "text"
                        )
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formFatherImage"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Upload Father's Image *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-camera"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="file"
                      name="father_pic"
                      onChange={(e) => handleChange("father_pic", e, "file")}
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formMotherName"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Mother's Name *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-user"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="mother_name"
                      placeholder="Enter mother's name"
                      value={data.mother_name || ""}
                      onChange={(e) =>
                        handleChange("mother_name", e.target.value, "text")
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formMotherContact"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Mother's Contact Number *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-phone"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      maxLength={11}
                      minLength={11}
                      name="mother_contact_number"
                      placeholder="Enter mother's contact number"
                      value={data.mother_contact_number || ""}
                      onChange={(e) =>
                        handleChange(
                          "mother_contact_number",
                          e.target.value,
                          "text"
                        )
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formMotherOccupation"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Mother's Occupation *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-briefcase"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="mother_occupation"
                      placeholder="Enter mother's occupation"
                      value={data.mother_occupation || ""}
                      onChange={(e) =>
                        handleChange(
                          "mother_occupation",
                          e.target.value,
                          "text"
                        )
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formMotherOccupation"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Mother's Organization *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-briefcase"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="mother_organization"
                      placeholder="Enter mother's organization"
                      value={data.mother_organization || ""}
                      onChange={(e) =>
                        handleChange(
                          "mother_organization",
                          e.target.value,
                          "text"
                        )
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formMotherImage"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Upload Mother's Image *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-camera"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="file"
                      name="mother_pic"
                      onChange={(e) => handleChange("mother_pic", e, "file")}
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            {/* Bank Information */}
            <hr />
            <br />
            <h4
              style={{
                fontFamily: "Manrope",
                fontWeight: 500,
                fontSize: "18px",
                color: "#1F4061",
              }}
            >
              Bank Information
            </h4>
            <br />
            <Row>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formBankAccountNo"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Bank Account No *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-university"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      min="0"
                      // max="11"
                      name="back_account_no"
                      placeholder="Enter bank account number"
                      value={data.back_account_no || ""}
                      onChange={(e) =>
                        handleChange("back_account_no", e.target.value, "text")
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                  <style>
                    {`
  input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
    `}
                  </style>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formBankName"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Bank Name *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-building"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="bank_name"
                      placeholder="Enter bank name"
                      value={data.bank_name || ""}
                      onChange={(e) =>
                        handleChange("bank_name", e.target.value, "text")
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formIFSCCode"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    IFSC Code *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-code"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="ifsc_code"
                      placeholder="Enter IFSC code"
                      value={data.ifsc_code || ""}
                      onChange={(e) =>
                        handleChange("ifsc_code", e.target.value, "text")
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <br />
            {/* Guardian Information */}
            <hr />
            <br />
            <h1
              style={{
                fontFamily: "Manrope",
                fontWeight: 500,
                fontSize: "18px",
                color: "#1F4061",
              }}
            >
              Guardian Information
            </h1>
            <br />
            <Row>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formGuardianName"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Guardian's Name *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-user"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="guardian_name"
                      placeholder="Enter guardian's name"
                      value={data.gardian_name || ""}
                      onChange={(e) =>
                        handleChange("gardian_name", e.target.value, "text")
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formGuardianContact"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Guardian's Contact Number *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-phone"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      maxLength={11}
                      minLength={11}
                      name="guardian_contact_number"
                      placeholder="Enter guardian's contact number"
                      value={data.gardian_contact_number || ""}
                      onChange={(e) =>
                        handleChange(
                          "gardian_contact_number",
                          e.target.value,
                          "text"
                        )
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formGuardianOccupation"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Guardian's Occupation *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-briefcase"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="guardian_occupation"
                      placeholder="Enter guardian's occupation"
                      value={data.gardian_occupation || ""}
                      onChange={(e) =>
                        handleChange(
                          "gardian_occupation",
                          e.target.value,
                          "text"
                        )
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formGuardianRelation"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Guardian's Relation *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-user-friends"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="guardian_relation"
                      placeholder="Enter relation to the guardian"
                      value={data.gardian_relation || ""}
                      onChange={(e) =>
                        handleChange("gardian_relation", e.target.value, "text")
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formGuardianAddress"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Guardian's Address *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-home"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="guardian_address"
                      placeholder="Enter guardian's address"
                      value={data.gardian_address || ""}
                      onChange={(e) =>
                        handleChange("gardian_address", e.target.value, "text")
                      }
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formGuardianImage"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1F4061",
                    }}
                  >
                    Upload Guardian's Image *
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-camera"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="file"
                      name="guardian_pic"
                      onChange={(e) => handleChange("gardian_pic", e, "file")}
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#1F4061",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <br />
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

export { CreateStartAdmissionProcess };
