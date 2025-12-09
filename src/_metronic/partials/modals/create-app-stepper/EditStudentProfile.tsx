// Replace this content with updated code for editing student profile as per your request.
// We will include only: first name, middle name, last name, mobile no, email, father/mother name & phone, is_active, student_name, class_id, section_id
// Fetch pre-filled values by student_id and allow editing.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { toast } from "react-toastify";
import { useAuth } from "../../../../app/modules/auth/core/Auth";

const modalsRoot = document.getElementById("root-modals") || document.body;

const initialForm = {
  firstname: "",
  middlename: "",
  lastname: "",
  mobileno: "",
  email: "",
  father_name: "",
  father_phone: "",
  mother_name: "",
  mother_phone: "",
  is_active: true,
  class_id: "",
  section_id: "",
};

const EditStudentProfile = ({ show, handleClose, student_id, setRefresh }) => {
  const [formData, setFormData] = useState(initialForm);
  const [classId, setClassId] = useState(null);
  const [studentId, setStudentId] = useState(0);
  const [sectionId, setSectionId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [changedFields, setChangedFields] = useState({});
  const { currentUser } = useAuth();
  const [fetchRecords, setFetchRecords] = useState(false);
console.log(changedFields);

  const school_id = (currentUser as any)?.school_id;
  const session_id = (currentUser as any)?.session_id;
  const sessionId = (currentUser as any)?.session_id;

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(
          `${DOMAIN}/api/school/get-studentdetails/${student_id}`
        );
        const data = await res.json();
        console.log(data);

        setFormData(data);
        setClassId(data.class_id);
        setSectionId(data.section_id);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };
    const fetchClasses = async () => {
      try {
        const res = await fetch(`${DOMAIN}/api/school/get-classes`);
        const data = await res.json();
        setClasses(data);
      } catch (e) {
        console.error("Error fetching classes:", e);
      }
    };
    const fetchSections = async () => {
      try {
        const res = await fetch(`${DOMAIN}/api/school/get-sections`);
        const data = await res.json();
        setSections(data);
      } catch (e) {
        console.error("Error fetching sections:", e);
      }
    };
    if (student_id) {
      fetchStudent();
      fetchClasses();
      fetchSections();
      setFetchRecords(false);
    }
  }, [student_id,fetchRecords]);

  //   const handleChange = (e) => {
  //     const { name, value, type, checked } = e.target;
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: type === "checkbox" ? checked : value,
  //     }));
  //   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Build payload
    const payload: any = {
      student_id,
      school_id: (currentUser as any).school_id,
      session_id: currentUser?.session_id,
      ...changedFields,
    };
  
    try {
      const res = await fetch(`${DOMAIN}/api/school/update-studentdetails`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        // Try to parse error response
        const errorResponse = await res.json();
        throw new Error(errorResponse.error || "Update failed");
      }
      toast.success("Student profile updated successfully!");
      handleModalClose();
      
    } catch (error: any) {
      console.error("Update error:", error);
      
      // Handle paid installments error specifically
      if (error.message.includes("paid installments") || 
          error.message.includes("Cannot change class")) {
        toast.error("Cannot update class: Student has paid installments. Please handle manually.");
      } else {
        toast.error("Error updating student profile");
      }
    }
  };

  useEffect(() => {
    if (formData.class_id) {
      setClassId(formData.class_id);
      if (formData.class_id !== classId) {
        setFormData(prev => ({ ...prev, section_id: "" }));
      }
    }
  }, [formData.class_id]);
  

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const class_id = e.target.value;
    setClassId(class_id);
    setSectionId(null);
    setFormData((prev) => ({ ...prev, class_id, section_id: "" }));
    setChangedFields((prev) => ({ ...prev, class_id, section_id: "" }));
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const section_id = e.target.value;
    setSectionId(section_id);
  
    // make sure formData and changedFields know about it
    setFormData(prev => ({ ...prev, section_id }));
    setChangedFields(prev => ({ ...prev, section_id }));
  };
``  

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-classes?schoolId=${school_id}&sessionId=${sessionId}`
        );
        const data = await response.json();
        setClasses(data);
        setSectionId(null);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [sessionId]);

  useEffect(() => {
    const fetchSections = async () => {
      if (classId === null) {
        return; // Return early if classId is null, preventing further execution
      }

      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-classwise-sections?schoolId=${school_id}&classId=${classId}`
        );
        const data = await response.json();

        setSections(data); // Set the fetched sections to the state
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    // Only call fetchSections if classId is not null
    if (classId !== null) {
      fetchSections(); // Call the function when classId changes and is valid
    }
  }, [classId, sessionId]); // Re-run effect when classId changes

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    setChangedFields((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleModalClose = () =>{
    setChangedFields({});
    setFetchRecords(true);
    setRefresh(true); 
    handleClose();
  }

  return createPortal(
    <Modal show={show} onHide={handleModalClose} size="lg" centered>
      <div className="modal-header">
        <h5 className="modal-title">Edit Student Profile</h5>
        <button
          type="button"
          className="btn-close"
          onClick={handleModalClose}
        ></button>
      </div>
      <div className="modal-body">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Control
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="First Name"
              />
            </Col>
            <Col md={4}>
              <Form.Control
                name="middlename"
                value={formData.middlename}
                onChange={handleChange}
                placeholder="Middle Name"
              />
            </Col>
            <Col md={4}>
              <Form.Control
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Control
                name="mobileno"
                value={formData.mobileno}
                onChange={handleChange}
                placeholder="Mobile Number"
              />
            </Col>
            <Col md={6}>
              <Form.Control
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Control
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
                placeholder="Father's Name"
              />
            </Col>
            <Col md={6}>
              <Form.Control
                name="father_phone"
                value={formData.father_phone}
                onChange={handleChange}
                placeholder="Father's Phone"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Control
                name="mother_name"
                value={formData.mother_name}
                onChange={handleChange}
                placeholder="Mother's Name"
              />
            </Col>
            <Col md={6}>
              <Form.Control
                name="mother_phone"
                value={formData.mother_phone}
                onChange={handleChange}
                placeholder="Mother's Phone"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Select
                name="class_id"
                value={formData.class_id}
                onChange={handleClassChange}
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Select
                name="section_id"
                value={formData.section_id}
                onChange={handleSectionChange}
              >
                <option value="">Select Section</option>
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.section}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Form.Check
            type="checkbox"
            label="Is Active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
          <div className="d-flex justify-content-end mt-4">
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { EditStudentProfile };
