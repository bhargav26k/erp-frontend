import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Col, Form, FormFloating, InputGroup, Modal, Row } from "react-bootstrap";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  show: boolean;
  handleClose: () => void;
  enqId: string | undefined;
  setRefresh: (refresh: boolean) => void;
};

type Reference = {
  id: string;
  reference: string;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

interface Source {
  id: string;
  source: string;
}

interface Class {
  id: string;
  class: string;
}

interface Session {
  id: string;
  session: string;
}

interface FormData {
  student_name: string;
  contact_number: number;
  address: string;
  reference_id: number;
  reference: string;
  description: string;
  follow_up_date: Date;
  note: string;
  source_id: number;
  source: string;
  student_email: string;
  status: string;
  class_id: number;
  class: string;
  gender: string;
  date_of_birth: Date;
  current_school: string;
  session_id: number;
  father_name: string;
  father_phone: string;
  mother_name: string;
  mother_phone: string;
  academic_year:string;
}

const CreateEditAdmission = ({ show, handleClose, enqId, setRefresh }: Props) => {
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const sessionId = currentUser?.session_id;

  const [source, setSource] = useState<Source[]>([]);
  const [reference, setReference] = useState<Reference[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  
  const [changedFields, setChangedFields] = useState({});
  
  const initialFormData: FormData = {
    student_name: "",
    contact_number: 0,
    address: "",
    reference_id: 0,
    reference: "",
    description: "",
    follow_up_date: new Date(),
    note: "",
    source_id: 0,
    source: "",
    student_email: "",
    status: "",
    class_id: 0,
    class: "",
    gender: "",
    date_of_birth: new Date(),
    current_school: "",
    session_id: 0,
    academic_year: "",
    father_name: "",
    father_phone: "",
    mother_name: "",
    mother_phone: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!schoolId) return;
      try {
        const response = await fetch(`${DOMAIN}/api/school/get-classes?schoolId=${schoolId}&sessionId=${sessionId}`);
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    const fetchSource = async () => {
      if (!schoolId) return;
      try {
        const response = await fetch(`${DOMAIN}/api/school/get-source?schoolId=${schoolId}`);
        const data = await response.json();
        setSource(data);
      } catch (error) {
        console.error("Error fetching sources:", error);
      }
    };

    const fetchReference = async () => {
      if (!schoolId) return;
      try {
        const response = await fetch(`${DOMAIN}/api/school/get-reference?schoolId=${schoolId}`);
        const data = await response.json();
        setReference(data);
      } catch (error) {
        console.error("Error fetching references:", error);
      }
    };

    const fetchSessions = async () => {
      if (!schoolId) return;
      try {
        const response = await fetch(`${DOMAIN}/api/school/get-school-sessions/${schoolId}`);
        const data = await response.json();
        
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchClasses();
    fetchSource();
    fetchReference();
    fetchSessions();
  }, [currentUser, schoolId, enqId]);

  useEffect(() => {
    const fetchById = async () => {
      try {
        const response = await fetch(`${DOMAIN}/api/school/getEnquiryById/${schoolId}/${enqId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        
        const followUpDate = data?.[0]?.follow_up_date ? formatDateToYYYYMMDD(data[0].follow_up_date) : "";
        const dateOfBirth = data?.[0]?.date_of_birth ? formatDateToYYYYMMDD(data[0].date_of_birth) : "";

        
        setFormData({
          student_name: data[0]?.student_name || "",
          contact_number: data[0]?.contact_number || 0,
          address: data[0]?.address || "",
          reference_id: data[0]?.reference_id || 0,
          reference: data[0]?.reference || "",
          description: data[0]?.description || "",
          follow_up_date: followUpDate ? new Date(followUpDate) : new Date(),
          note: data[0]?.note || "",
          source_id: data[0]?.source_id || 0,
          source: data[0]?.source || "",
          student_email: data[0]?.student_email || "",
          status: data[0]?.status || "",
          class_id: data[0]?.class_id || 0,
          class: data[0]?.class || "",
          gender: data[0]?.gender || "",
          date_of_birth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
          current_school: data[0]?.current_school || "",
          session_id: data[0]?.session_id || 0,
          father_name: data[0]?.father_name || "",
          father_phone: data[0]?.father_phone || "",
          mother_name: data[0]?.mother_name || "",
          mother_phone: data[0]?.mother_phone || "",
          academic_year:data[0]?.academic_year || ""
        });
      } catch (error) {
        console.error("Error fetching enquiry details:", error);
      }
    };

    fetchById();
  }, [schoolId, enqId]);

  const formatDateToYYYYMMDD = (dateString: string | number | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "session_id") {
      const [sessionId, academicYear] = value.split(":");
  
      // Update formData with both session_id and academic_year
      setFormData((prevState) => ({
        ...prevState,
        session_id: sessionId,
        academic_year: academicYear,
      }));
  
      // Update changedFields with both session_id and academic_year
      setChangedFields((prevChangedFields) => ({
        ...prevChangedFields,
        session_id: sessionId, // session_id as a separate field
        academic_year: academicYear, // academic_year as a separate field
      }));
    } else {
      // For all other fields, update both formData and changedFields normally
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
  
      setChangedFields((prevChangedFields) => ({
        ...prevChangedFields,
        [name]: value,
      }));
    }
  };
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${DOMAIN}/api/school/updateEnquiryById/${schoolId}/${enqId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changedFields),
      });

      if (!response.ok) {
        throw new Error("Failed to update admission enquiry");
      }

      toast.success("Enquiry updated successfully!");
      setRefresh(true);
      handleClose();
    } catch (error) {
      console.error("Error updating admission enquiry:", error);
      toast.error("Error updating Enquiry. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setFormData(initialFormData);
    setChangedFields({});
    handleClose();
  };

  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      size="lg"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      show={show}
      onHide={handleCloseModal}
    >
      <div className="modal-header" style={{ backgroundColor: "#F2F6FF", borderBottom: "1px solid lightgray" }}>
        <h2>Edit Admission Enquiry</h2>
        <div className="btn btn-sm btn-icon btn-active-color-primary" onClick={handleCloseModal}>
          <i className="fas fa-times"></i>
        </div>
      </div>
      <div className="modal-body" style={{ backgroundColor: "#F2F6FF" }}>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="student_name">
                <Form.Label>Student Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="student_name"
                    value={formData.student_name}
                    onChange={handleChange}
                    disabled={formData.status === 'Confirmed'}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="contact_number">
                <Form.Label>Contact Number</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-phone"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="tel"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    disabled={formData.status === 'Confirmed'}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-map-marker-alt"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={formData.status === 'Confirmed'}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="student_email">
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-envelope"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="student_email"
                    value={formData.student_email}
                    onChange={handleChange}
                    disabled={formData.status === 'Confirmed'}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="reference">
                <Form.Label>Select Reference</Form.Label>
                <Form.Select name="reference_id" value={formData.reference_id} onChange={handleChange} disabled={formData.status === 'Confirmed'}>
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
              <Form.Group controlId="source">
                <Form.Label>Select Source</Form.Label>
                <Form.Select name="source_id" value={formData.source_id} onChange={handleChange} disabled={formData.status === 'Confirmed'}>
                  <option value="">Select Source</option>
                  {source.map((src) => (
                    <option key={src.id} value={src.id}>
                      {src.source}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="class_id">
                <Form.Label>Select Class</Form.Label>
                <Form.Select name="class_id" value={formData.class_id} onChange={handleChange} disabled={formData.status === 'Confirmed'}>
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.class}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="date_of_birth">
                <Form.Label>Date of Birth</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-birthday-cake"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth ? formatDateToYYYYMMDD(formData.date_of_birth) : ""}
                    onChange={handleChange}
                    disabled={formData.status === 'Confirmed'}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="gender">
                <Form.Label>Select Gender</Form.Label>
                <Form.Select name="gender" value={formData.gender} onChange={handleChange} disabled={formData.status === 'Confirmed'}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="session_id">
                <Form.Label>Academic Year</Form.Label>
                <Form.Select name="session_id" value={`${formData.session_id}:${formData.academic_year}`} onChange={handleChange} disabled={formData.status === 'Confirmed'}>
                  <option value="">Select Academic Year</option>
                  {sessions.map((sess) => (
                    <option key={sess.id} value={`${sess.id}:${sess.session}`}>
                      {sess.session}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="father_name">
                <Form.Label>Father's Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user-tie"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="father_name"
                    value={formData.father_name}
                    onChange={handleChange}
                    disabled={formData.status === 'Confirmed'}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="father_phone">
                <Form.Label>Father's Contact Number</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-phone"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="tel"
                    name="father_phone"
                    value={formData.father_phone}
                    onChange={handleChange}
                    disabled={formData.status === 'Confirmed'}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="mother_name">
                <Form.Label>Mother's Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user-tie"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="mother_name"
                    value={formData.mother_name}
                    onChange={handleChange}
                    disabled={formData.status === 'Confirmed'}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="mother_phone">
                <Form.Label>Mother's Contact Number</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-phone"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="tel"
                    name="mother_phone"
                    value={formData.mother_phone}
                    onChange={handleChange}
                    disabled={formData.status === 'Confirmed'}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="current_school">
                <Form.Label>Current School</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-school"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="current_school"
                    value={formData.current_school}
                    onChange={handleChange}
                    disabled={formData.status === 'Confirmed'}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-info-circle"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={formData.status === 'Confirmed'}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="note">
                <Form.Label>Note</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-sticky-note"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    disabled={formData.status === 'Confirmed'}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary" disabled={formData.status === 'Confirmed'}>
              Submit
            </button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateEditAdmission };
