import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import Select from "react-select";
import { AddSections } from "./AddSections"; // Import AddSections component
import { toast } from "react-toastify";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
};

interface SectionData {
  section_id: string;
  section: string;
}

interface FormData {
  class_name: string;
  section_ids: string[];
}

const modalsRoot = document.getElementById("root-modals") || document.body;

const AddClasses = ({ show, handleClose, setRefresh }: Props) => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const session_id = currentUser?.session_id;

  const initialFormData: FormData = {
    class_name: "",
    section_ids: [],
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  const [isAddSectionModalVisible, setAddSectionModalVisible] = useState(false);
  const [refreshSections, setSectionRefresh] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch sections from API
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-onlysections/${school_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSections(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (school_id) {
      fetchSections();
    }
  }, [school_id, refreshSections]);

  // Handle F2 key press to open AddSections modal
  useEffect(() => {
    const handleF2KeyPress = (event: KeyboardEvent) => {
      if (event.key === "F2") {
        setAddSectionModalVisible(true);
      }
    };

    window.addEventListener("keydown", handleF2KeyPress);

    return () => {
      window.removeEventListener("keydown", handleF2KeyPress);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trim and normalize class name
    const className = formData.class_name;

    if (!className || selectedSections.length === 0) {
      toast.warning(
        "Please enter a valid class name and select at least one section."
      );
      return;
    }

    // Prevent multiple submissions
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/add-class/${school_id}/${session_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            class_name: className,
            section_ids: selectedSections,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast.warning("Class already exists for this school and session.");
        } else {
          toast.error(result.message || "Failed to add class.");
        }
        return;
      }

      toast.success("Class and sections added successfully!");
      setRefresh(true);
      setFormData(initialFormData);
      handleClose(); // Close modal after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setFormData(initialFormData);
    setSelectedSections([]);
    handleClose();
  };

  const handleSectionChange = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((option: any) => option.value);

    setSelectedSections(selectedIds);
  };

  const sectionOptions = sections.map((section) => ({
    value: section.section_id,
    label: section.section,
  }));

  return (
    <>
      {/* AddSections modal */}
      {isAddSectionModalVisible && (
        <AddSections
          show={isAddSectionModalVisible}
          handleClose={() => setAddSectionModalVisible(false)}
          setRefresh={setSectionRefresh}
        />
      )}

      {/* AddClasses modal */}
      <Modal
        id="kt_modal_create_app"
        tabIndex={-1}
        size="lg"
        aria-hidden="true"
        dialogClassName="modal-dialog modal-dialog-centered mw-500px"
        show={show}
        onHide={handleCloseModal}
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
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Add Class
          </h2>
          <div
            className="btn btn-sm btn-icon btn-active-color-primary"
            onClick={handleCloseModal}
          >
            <i className="fas fa-times"></i>
          </div>
        </div>

        <div className="modal-body" style={{ backgroundColor: "#F2F6FF" }}>
          <div className="alert alert-info">
            Press <strong>F2</strong> to add a new section here it self.
          </div>

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="class_name">
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Class Name
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-user"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter Class Name"
                      name="class_name"
                      value={formData.class_name}
                      onChange={handleChange}
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3" controlId="formSource">
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Select Sections
                  </Form.Label>
                  <Select
                    options={sectionOptions}
                    isMulti
                    onChange={handleSectionChange}
                    placeholder="Select Sections..."
                    className="basic-multi-select"
                    classNamePrefix="select"
                    closeMenuOnSelect={false}
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{
                  fontFamily: "Manrope",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export { AddClasses };
