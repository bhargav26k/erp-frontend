import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
  classId: number;
  classname: string;
  editsections: { section_id: number; section_name: string }[]; // Array of section objects
};

interface SectionData {
  section_id: number;
  section: string;
}

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateEditClass = ({
  show,
  handleClose,
  setRefresh,
  classId,
  classname,
  editsections,
}: Props) => {
  const [selectedSections, setSelectedSections] = useState<number[]>([]); // Section IDs
  const [sections, setSections] = useState<SectionData[]>([]);
  const [className, setClassName] = useState(classname || "");
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const session_id = currentUser?.session_id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (classname) setClassName(classname);
    if (editsections) {
      setSelectedSections(editsections.map((section) => section.section_id));
    }
  }, [classname, editsections]);

  // Fetch available sections for the school
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-onlysections/${school_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: SectionData[] = await response.json();
        setSections(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (school_id) {
      fetchSections();
    }
  }, [school_id, classId]);

  // Handle selection of sections
  const handleSectionSelected = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((option: any) => option.value);
    setSelectedSections(selectedIds);
  };

  const sectionOptions = sections.map((section) => ({
    value: section.section_id,
    label: section.section,
  }));

  // Generate selected options for Select component
  const selectedOptions = sectionOptions.filter((option) =>
    selectedSections.includes(option.value)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!className || selectedSections.length === 0) {
      toast.error("Please enter a class name and select at least one section.");
      return;
    }
  
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);
  
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/edit-class/${session_id}/${school_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            className,
            selectedSections,
            classId,
          }),
        }
      );
  
      const result = await response.json();
  
      if (!response.ok) {
        toast.dismiss();
        if (response.status === 409) {
          toast.warning("Class name already exists for this school.");
        } else {
          toast.error(result.message || "Failed to update class.");
        }
        return;
      }
  
      toast.dismiss();
      toast.success("Class updated successfully!");
      setRefresh(true);
      handleClose(); // Close modal after successful update
    } catch (error) {
      toast.dismiss();
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
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
        <h2>Edit Class</h2>
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
            <Col md={6}>
              <Form.Group controlId="class_name">
                <Form.Label>Class Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="class_name"
                    placeholder="Enter Class Name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3" controlId="formSource">
                <Form.Label>Select Sections</Form.Label>
                <Select
                  options={sectionOptions}
                  isMulti
                  onChange={handleSectionSelected}
                  value={selectedOptions} // Dynamically controlled value
                  placeholder="Select Sections..."
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateEditClass };
