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
  is_assigned?: boolean;
}

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
  initialClassId: number;
  initialSections: number[];
  initialSubjects: number;
  subjectGroupId: number; // The ID of the subject group being edited
  classSectionId: number;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateEditSubjectGroup = ({
  show,
  handleClose,
  setRefresh,
  initialClassId,
  initialSections,
  initialSubjects,
  subjectGroupId,
  classSectionId,
}: Props) => {
  const [getClass, setClass] = useState<Class[]>([]);
  const [getSection, setSection] = useState<Section[]>([]);

  const [getSubject, setSubject] = useState<Subject[]>([]);

  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const session_id = currentUser?.session_id;

  const [selectedClass, setSelectedClass] = useState(initialClassId);

  const [selectedSections, setSelectedSections] = useState<number[]>(initialSections || []);
  const [selectedSubjects, setSelectedSubjects] = useState<number | null>(initialSubjects || null);

  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    setSelectedClass(initialClassId);
    setSelectedSections(initialSections);
    setSelectedSubjects(initialSubjects);
    setIsModified(false);
  }, [initialClassId, initialSections, initialSubjects]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-onlyclasses/${school_id}/${session_id}`
        );
        const data = await response.json();
        setClass(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, [school_id, session_id]);

  useEffect(() => {
    const fetchSections = async () => {
      if (!selectedClass) return;
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-classwise-section/${selectedClass}/${school_id}`
        );
        const data = await response.json();
        setSection(data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };
    fetchSections();
  }, [selectedClass, school_id]);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedClass || selectedSections.length === 0) return;
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-onlyselected-subjects-classbased`, // Adjusted URL to be more RESTful
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              school_id,
              class_id: selectedClass,
              section_ids: selectedSections,
            }),
          }
        );
        const data = await response.json();
        setSubject(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, [selectedClass, selectedSections, school_id]);
  

  useEffect(() => {
    const hasChanges = () => {
      return (
        selectedClass !== initialClassId ||
        JSON.stringify(selectedSections) !== JSON.stringify(initialSections) ||
        JSON.stringify(selectedSubjects) !== JSON.stringify(initialSubjects)
      );
    };
    setIsModified(hasChanges());
  }, [
    selectedClass,
    selectedSections,
    selectedSubjects,
    initialClassId,
    initialSections,
    initialSubjects,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/edit-subject-group/${school_id}/${subjectGroupId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classId: selectedClass,
            sections: selectedSections,
            subjects: selectedSubjects,
            sessionId: session_id,
          }),
        }
      );

      const result = await response.json();
      if (result.error) {
        alert(result.message || "Error editing subject group");
        return;
      }

      handleClose();
      setRefresh(true);
    } catch (error) {
      console.error("Error editing subject group:", error);
    }
  };

  const sectionOptions = getSection.map((section) => ({
    value: section.id,
    label: section.section,
  }));  

  const subjectOptions = getSubject.map((subject) => ({
    value: subject.id,
    label: subject.name,
    isDisabled: subject.is_assigned,
  }));

  const initialSectionIds = initialSections.map(
    (section) => section.section_id
  );

  return createPortal(
    <Modal
      id="kt_modal_edit_subject"
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
        <h2
          style={{ fontFamily: "Manrope", fontSize: "20px", fontWeight: "600" }}
        >
          Edit Subject Group
        </h2>
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
            <Col>
              <Form.Group controlId="class">
                <Form.Label>Select Class</Form.Label>
                <Form.Select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(Number(e.target.value))}
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
            <Col>
              <Form.Label>Select Sections</Form.Label>
              <Select
                options={sectionOptions}
                isMulti
                value={sectionOptions.filter((option) =>
                  initialSectionIds.includes(option.value)
                )}
                onChange={(options) =>
                  setSelectedSections(
                    options ? options.map((option) => option.value) : []
                  )
                }
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Label>Select Subjects</Form.Label>
              <Select
                options={subjectOptions}
                value={
                  subjectOptions.find(
                    (option) => option.value === selectedSubjects
                  ) || null
                }
                onChange={(option) =>
                  setSelectedSubjects(option ? option.value : null)
                }
                styles={{
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isDisabled
                      ? "#f8f9fa"
                      : provided.backgroundColor,
                    color: state.isDisabled ? "#a0a0a0" : provided.color,
                    cursor: state.isDisabled ? "not-allowed" : "pointer",
                  }),
                  singleValue: (provided, state) => ({
                    ...provided,
                    color: state.data.isDisabled ? "#a0a0a0" : provided.color,
                  }),
                }}
              />
            </Col>
          </Row>
          <br />
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isModified}
              style={{
                fontFamily: "Manrope",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Save Changes
            </button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateEditSubjectGroup };
