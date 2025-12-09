import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import Select from "react-select";

type Props = {
    showAssignClassModal: boolean;
    handleAssignClassTeacherModalClose: () => void;
  setRefresh: any;
};
interface Class {
  class_id: number;
  class: string;
}
interface Section {
  id: number;
  section: string;
}
interface Teacher {
  id: number;
  name: string;
}
interface Sessions {
  id: number;
  session: string;
}


const modalsRoot = document.getElementById("root-modals") || document.body;

const AssignClassTeacher = ({ showAssignClassModal, handleAssignClassTeacherModalClose, setRefresh }: Props) => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;

  const [getClass, setClass] = useState<Class[]>([]);
  const [getTeachers, setTeachers] = useState<Teacher[]>([]);
  const [getSection, setSection] = useState<Section[]>([]);
  const [getSession, setSession] = useState<Sessions[]>([]);



  const [selectedClass, setSelectedClass] = useState(0);
  const [selectedSection, setSelectedSection] = useState(0);
  const [selectedTeacher, setSelectedTeacher] = useState(0);
  const [selectedSession, setSelectedSession] = useState("");

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-onlyteacher/${school_id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        setTeachers(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTeacher();
  }, [school_id]);

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
        setClass(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchClasses();
  }, [school_id]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const class_id = selectedClass;
        const response = await fetch(
          `${DOMAIN}/api/school/get-classwise-section/${class_id}/${school_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSection(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSections();

  }, [selectedClass]);

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
        console.error("Error fetching classes:", error);
      }
    };
    fetchSessions();
  }, [school_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !selectedSection || !selectedTeacher) {
      alert(
        "Please enter All values"
      );
      return;
    }
   
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/add-class-teacher/${school_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedSession,
            selectedClass,
            selectedSection,
            selectedTeacher,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Form submitted successfully!", result);
      handleAssignClassTeacherModalClose(); // Close the modal after submission
      setRefresh(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSessionSelected = (id: string) => {
    setSelectedSession(id);
  };


  return createPortal(
    <Modal
      id="assign_teacher_modal"
      tabIndex={-1}
      size="lg"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-500px"
      show={showAssignClassModal}
      onHide={handleAssignClassTeacherModalClose}
    >
      <div
        className="modal-header"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
        }}
      >
        <h2>Assign Class Teacher</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleAssignClassTeacherModalClose}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>
      <div className="modal-body" style={{ backgroundColor: "#F2F6FF" }}>
        <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="session">
                <Form.Label>Select Session</Form.Label>
                <Form.Select
                  onChange={(e) =>
                    handleSessionSelected(
                      e.target.value
                    )
                  }
                >
                  <option value="">Select Session</option>
                  {getSession.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.session}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="class">
                <Form.Label>Select Class</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-school"></i>
                  </InputGroup.Text>
                  <Form.Select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  > 
                    <option value="">Select Class</option>
                    {getClass.map((item) => (
                      <option key={item.class_id} value={item.class_id}>
                        {item.class}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="class">
                <Form.Label>Select Section</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-school"></i>
                  </InputGroup.Text>
                  <Form.Select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                  > 
                    <option value="">Select Section</option>
                    {getSection.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.section}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="teacher">
                <Form.Label>Select Teacher</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-chalkboard-teacher"></i>
                  </InputGroup.Text>
                  <Form.Select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                  >
                    <option value="">Select Teacher</option>
                    {getTeachers.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              Assign
            </button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { AssignClassTeacher };
