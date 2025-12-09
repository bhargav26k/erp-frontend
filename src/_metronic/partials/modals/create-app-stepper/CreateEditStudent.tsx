import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import Select from "react-select";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
  studentDetail: any; // student details passed as prop
  studentId: number;
};

interface Class {
  class_id: number;
  class: string;
}
interface Section {
  id: number;
  section: string;
}
interface Sessions {
  id: number;
  session: string;
}

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateEditStudent = ({
  show,
  handleClose,
  setRefresh,
  studentDetail,
  studentId,
}: Props) => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;

  const [selectedClass, setSelectedClass] = useState<number>(0);
  const [selectedSection, setSelectedSection] = useState<number>(0);
  const [selectedSession, setSelectedSession] = useState<number>(0);

  const formattedDob = studentDetail.dob
    ? new Date(studentDetail.dob).toISOString().split("T")[0] // Convert to YYYY-MM-DD
    : ""; // Default to empty string if undefined

  const [formData, setFormData] = useState({
    student_name: "",
    session_id: "",
    class_id: "",
    section_id: "",
    roll_no: "",
    dob: "",
    gender: "",
    blood_group: "",
    religion: "",
    caste: "",
    adhar_no: "",
    father_name: "",
    mother_name: "",
    father_phone: "",
    mother_phone: "",
    father_occupation: "",
    mother_occupation: "",
    current_address: "",
    permanent_address: "",
    state: "",
    city: "",
    pincode: "",
    mobileno: "",
    email: "",
    guardian_name: "",
    guardian_relation: "",
    guardian_phone: "",
    guardian_email: "",
    guardian_occupation: "",
    bank_account_no: "",
    bank_name: "",
    ifsc_code: "",
  });

  useEffect(() => {
    if (studentDetail) {
      setFormData((prevData) => ({
        ...prevData,
        student_name: studentDetail.student_name || "",
        session_id: studentDetail.session_id || "",
        class_id: studentDetail.class_id || "",
        section_id: studentDetail.section_id || "",
        roll_no: studentDetail.roll_no || "",
        dob: formattedDob || studentDetail.dob || "",
        gender: studentDetail.gender || "",
        blood_group: studentDetail.blood_group || "",
        religion: studentDetail.religion || "",
        caste: studentDetail.caste || "",
        adhar_no: studentDetail.adhar_no || "",
        father_name: studentDetail.father_name || "",
        mother_name: studentDetail.mother_name || "",
        father_phone: studentDetail.father_phone || "",
        mother_phone: studentDetail.mother_phone || "",
        father_occupation: studentDetail.father_occupation || "",
        mother_occupation: studentDetail.mother_occupation || "",
        current_address: studentDetail.current_address || "",
        permanent_address: studentDetail.permanent_address || "",
        state: studentDetail.state || "",
        city: studentDetail.city || "",
        pincode: studentDetail.pincode || "",
        mobileno: studentDetail.mobileno || "",
        email: studentDetail.email || "",
        guardian_name: studentDetail.guardian_name || "",
        guardian_relation: studentDetail.guardian_relation || "",
        guardian_phone: studentDetail.guardian_phone || "",
        guardian_email: studentDetail.guardian_email || "",
        guardian_occupation: studentDetail.guardian_occupation || "",
        bank_account_no: studentDetail.bank_account_no || "",
        bank_name: studentDetail.bank_name || "",
        ifsc_code: studentDetail.ifsc_code || "",
      }));
    }
  }, [studentDetail]);

  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [Session, setSession] = useState<Sessions[]>([]);

  // Fetch the classes when the component mounts
 
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-onlyclasses/${school_id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        setClasses(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchClasses();
  }, [school_id]);

  // Fetch sections when a class is selected
  useEffect(() => {
    if (selectedClass !== 0) {
      const fetchSections = async () => {
        try {
          const response = await fetch(
            `${DOMAIN}/api/school/get-classwise-section/${selectedClass}/${school_id}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setSections(data);
        } catch (error) {
          console.error("Error fetching sections:", error);
        }
      };

      fetchSections();
    }
  }, [selectedClass, school_id]);

  // Fetch session data
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-session-subjectgroup/${school_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };
    fetchSessions();
  }, [school_id]);

  const handleClassChange = (e: any) => {
    const classId = Number(e.target.value);
    setSelectedClass(classId);
    setFormData({ ...formData, class_id: classId });
    setSelectedSection(0); // Reset section on class change
  };

  // Handle section change
  const handleSectionChange = (e: any) => {
    const sectionId = Number(e.target.value);
    setSelectedSection(sectionId);
    setFormData({ ...formData, section_id: sectionId });
  };

  // Handle session change
  const handleSessionChange = (e: any) => {
    const sessionId = Number(e.target.value);
    setSelectedSession(sessionId);
    setFormData({ ...formData, session_id: sessionId });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.student_name || !formData.roll_no) {
      alert(
        "Please fill in all required fields: Student Name, Admission No, Roll No, First Name, and Last Name."
      );
      return;
    }

    // Prepare the data to match the student table schema
    const studentData = {
      roll_no: formData.roll_no,
      mobileno: formData.mobileno,
      email: formData.email,
      state: formData.state,
      city: formData.city,
      pincode: formData.pincode,
      religion: formData.religion,
      caste: formData.caste,
      dob: formData.dob,
      gender: formData.gender,
      current_address: formData.current_address,
      permanent_address: formData.permanent_address,
      blood_group: formData.blood_group,
      adhar_no: formData.adhar_no,
      bank_account_no: formData.bank_account_no,
      bank_name: formData.bank_name,
      ifsc_code: formData.ifsc_code,
      father_name: formData.father_name,
      father_phone: formData.father_phone,
      father_occupation: formData.father_occupation,
      mother_name: formData.mother_name,
      mother_phone: formData.mother_phone,
      mother_occupation: formData.mother_occupation,
      guardian_name: formData.guardian_name,
      guardian_relation: formData.guardian_relation,
      guardian_phone: formData.guardian_phone,
      guardian_occupation: formData.guardian_occupation,
      guardian_email: formData.guardian_email,
      session_id: formData.session_id,
      class_id: formData.class_id,
      section_id: formData.section_id,
      // Add any other fields as necessary
    };

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/student-edit/${school_id}/${studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData), // Send the student data
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Form submitted successfully!", result);
      handleClose(); // Close the modal after submission
      setRefresh(true); // Trigger a refresh of the data
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      size="lg"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-500px"
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
        <h2>Edit Student</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>
      <div className="modal-body " style={{ backgroundColor: "#F2F6FF" }}>
        <Form onSubmit={handleSubmit} style={{ width: "100%", height: "100%" }}>
          {/* Student Name */}
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="student_name">
                <Form.Label>Student Name</Form.Label>
                <Form.Control
                  type="text"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="roll_no">
                <Form.Label>Roll Number</Form.Label>
                <Form.Control
                  type="text"
                  name="roll_no"
                  value={formData.roll_no}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Select Session */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="session">
                <Form.Label>Select Session</Form.Label>
                <Form.Select
                  onChange={handleSessionChange} // Use the new handler
                  value={formData.session_id} // Bind selected session
                  required
                >
                  <option value="">Select Session</option>
                  {Session.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.session}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="class_name">
                <Form.Label>Class</Form.Label>
                <Form.Control
                  as="select"
                  name="class" // Updated name
                  value={formData.class_id} // Bind selected class
                  onChange={handleClassChange}
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.class_id} value={cls.class_id}>
                      {cls.class}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="section_name">
                <Form.Label>Section</Form.Label>
                <Form.Control
                  as="select"
                  name="section" // Updated name
                  value={formData.section_id}
                  onChange={handleSectionChange}
                  disabled={!selectedClass}
                  required
                >
                  <option value="">
                    {formData.class_id
                      ? "Select class first"
                      : "Select Section"}
                  </option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.section}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          {/* Additional Fields */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="dob">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          {/* Blood Group, Religion, and Caste */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="blood_group">
                <Form.Label>Blood Group</Form.Label>
                <Form.Control
                  type="text"
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="religion">
                <Form.Label>Religion</Form.Label>
                <Form.Control
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Caste and Aadhaar No */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="caste">
                <Form.Label>Caste</Form.Label>
                <Form.Control
                  type="text"
                  name="caste"
                  value={formData.caste}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="adhar_no">
                <Form.Label>Aadhaar No</Form.Label>
                <Form.Control
                  type="text"
                  name="adhar_no"
                  value={formData.adhar_no}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Parent and Guardian Details */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="father_name">
                <Form.Label>Father's Name</Form.Label>
                <Form.Control
                  type="text"
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="mother_name">
                <Form.Label>Mother's Name</Form.Label>
                <Form.Control
                  type="text"
                  name="mother_name"
                  value={formData.mother_name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="father_phone">
                <Form.Label>Father's Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="father_phone"
                  value={formData.father_phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="mother_phone">
                <Form.Label>Mother's Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="mother_phone"
                  value={formData.mother_phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="father_occupation">
                <Form.Label>Father's Occupation</Form.Label>
                <Form.Control
                  type="text"
                  name="father_occupation"
                  value={formData.father_occupation}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="mother_occupation">
                <Form.Label>Mother's Occupation</Form.Label>
                <Form.Control
                  type="text"
                  name="mother_occupation"
                  value={formData.mother_occupation}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Address and Contact Information */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="current_address">
                <Form.Label>Current Address</Form.Label>
                <Form.Control
                  type="text"
                  name="current_address"
                  value={formData.current_address}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="permanent_address">
                <Form.Label>Permanent Address</Form.Label>
                <Form.Control
                  type="text"
                  name="permanent_address"
                  value={formData.permanent_address}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="state">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="pincode">
                <Form.Label>Pincode</Form.Label>
                <Form.Control
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="mobileno">
                <Form.Label>Mobile No</Form.Label>
                <Form.Control
                  type="text"
                  name="mobileno"
                  value={formData.mobileno}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Guardian Details */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="guardian_name">
                <Form.Label>Guardian's Name</Form.Label>
                <Form.Control
                  type="text"
                  name="guardian_name"
                  value={formData.guardian_name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="guardian_occupation">
                <Form.Label>Guardian's Occupation</Form.Label>
                <Form.Control
                  type="text"
                  name="guardian_occupation"
                  value={formData.guardian_occupation}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="guardian_relation">
                <Form.Label>Guardian's Relation</Form.Label>
                <Form.Control
                  type="text"
                  name="guardian_relation"
                  value={formData.guardian_relation}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="guardian_phone">
                <Form.Label>Guardian's Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="guardian_phone"
                  value={formData.guardian_phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="guardian_email">
                <Form.Label>Guardian's Email</Form.Label>
                <Form.Control
                  type="email"
                  name="guardian_email"
                  value={formData.guardian_email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Miscellaneous Details */}

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="bank_account_no">
                <Form.Label>Bank Account No</Form.Label>
                <Form.Control
                  type="text"
                  name="bank_account_no"
                  value={formData.bank_account_no}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="bank_name">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control
                  type="text"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="ifsc_code">
                <Form.Label>IFSC Code</Form.Label>
                <Form.Control
                  type="text"
                  name="ifsc_code"
                  value={formData.ifsc_code}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateEditStudent };
