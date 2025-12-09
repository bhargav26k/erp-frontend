import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, Modal, Row } from "react-bootstrap";
import Select from "react-select";

interface Class {
  class_id: number;
  class: string;
}

interface Section {
  id: number;
  section: string;
}

interface Subject {
  id: number;
  name: string;
}

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const AddSubjectGroup = ({   show,
  handleClose,
  setRefresh,
  initialClassId,
  initialSections,
  initialSubjects,
  subjectGroupId, }: Props) => {
  const [getClass, setClass] = useState<Class[]>([]);
  const [getSection, setSection] = useState<Section[]>([]);
  const [getSubject, setSubject] = useState<Subject[]>([]);

  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const session_id = currentUser?.session_id;

  const [selectedClass, setSelectedClass] = useState(initialClassId || 0);
  const [selectedSections, setSelectedSections] = useState<number[]>(initialSections || []);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>(initialSubjects || []);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    // Reset state when new props are received
    setSelectedClass(initialClassId || 0);
    setSelectedSections(initialSections || []);
    setSelectedSubjects(initialSubjects || []);
    setIsModified(false);
  }, [initialClassId, initialSections, initialSubjects]);

  useEffect(() => {
    const hasChanges = () => {
      return (
        selectedClass !== initialClassId ||
        JSON.stringify(selectedSections) !== JSON.stringify(initialSections) ||
        JSON.stringify(selectedSubjects) !== JSON.stringify(initialSubjects)
      );
    };
    setIsModified(hasChanges());
  }, [selectedClass, selectedSections, selectedSubjects, initialClassId, initialSections, initialSubjects]);

  console.log('Selected Class:', selectedClass);
  console.log('Selected Sections:', selectedSections);
  console.log('Selected Subjects:', selectedSubjects);
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-onlyclasses/${school_id}/${session_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setClass(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, [school_id]);

  useEffect(() => {
    const fetchSections = async () => {
      if (selectedClass.id === 0) return;
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-classwise-section/${selectedClass.id}/${school_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch sections");
        const data = await response.json();
        setSection(data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };
    fetchSections();
  }, [selectedClass.id]);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (selectedClass.id === 0 || selectedSections.length === 0) return;
      try {
        const class_id = selectedClass.id;
        const section_id = selectedSections.join(",");

        const response = await fetch(
          `${DOMAIN}/api/school/get-onlysubjects-classbased/${school_id}/${class_id}/${section_id}/${session_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch subjects");
        const data = await response.json(); 
        
        setSubject(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, [school_id, selectedClass.id, selectedSections]);

  const handleClassSelected = (id: number, className: string) => {
    setSelectedClass({ id, className });
    setSelectedSections([]);
    setSubject([]); // Reset subjects when class changes
  };

  const handleSectionSelected = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((option: any) => option.value);
    setSelectedSections(selectedIds);
  };

  const handleSubjectSelected = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((option: any) => option.value);
    setSelectedSubjects(selectedIds);
  };

  const sectionOptions = getSection.map((section) => ({
    value: section.id,
    label: section.section,
  }));

  const subjectOptions = getSubject.map((subject) => ({
    value: subject.id,
    label: subject.name,
    isDisabled: subject.is_assigned, // Disable if assigned
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      selectedClass.id === 0 ||
      selectedSections.length === 0 ||
      selectedSubjects.length === 0
    ) {
      alert("Please select a class, section(s), and subject(s).");
      return;
    }

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/add-subject-group/${school_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classId: selectedClass.id,
            sections: selectedSections,
            subjects: selectedSubjects,
            sessionId: session_id,
          }),
        }
      );

      const result = await response.json();

      if (result.error) {
        alert(result.message || "Some subjects are already assigned!");
        return;
      }

      console.log("Form submitted successfully!", result);
      handleClose();
      setRefresh(true);
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
          fontFamily: "Manrope",
          fontWeight: "500",
          fontSize: "14px",
        }}
      >
        <h2>Add Subjects Group</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>
      <div className="modal-body" style={{ backgroundColor: "#F2F6FF" }}>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="class">
                <Form.Label>Select Class</Form.Label>
                <Form.Select
                  onChange={(e) =>
                    handleClassSelected(
                      parseInt(e.target.value),
                      e.target.options[e.target.selectedIndex].text
                    )
                  }
                >
                  <option value="">Select Class</option>
                  {getClass.map((cls) => (
                    <option key={cls.class_id} value={cls.class_id}>
                      {cls.class}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Select Sections</Form.Label>
                <Select
                  options={sectionOptions}
                  isMulti
                  onChange={handleSectionSelected}
                  placeholder="Select Sections..."
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Select Subjects</Form.Label>
                <Select
                  options={subjectOptions}
                  isMulti
                  onChange={handleSubjectSelected}
                  placeholder="Select Subjects..."
                  isOptionDisabled={(option) => option.isDisabled} // Disable assigned subjects
                  styles={{
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isDisabled
                        ? "#f8f9fa"
                        : provided.backgroundColor, // Light gray for disabled
                      color: state.isDisabled ? "#a0a0a0" : provided.color, // Dim text for disabled
                      cursor: state.isDisabled ? "not-allowed" : "pointer", // Prevent clicking
                    }),
                    singleValue: (provided, state) => ({
                      ...provided,
                      color: state.data.isDisabled ? "#a0a0a0" : provided.color, // Dim selected disabled option
                    }),
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              Add
            </button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { AddSubjectGroup };
