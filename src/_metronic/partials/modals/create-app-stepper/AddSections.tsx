import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const AddSections = ({ show, handleClose, setRefresh }: Props) => {
  const [sectionName, setSectionName] = useState(""); // State for class name
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevents multiple clicks
    setIsSubmitting(true);

    // Trim and normalize section name
    const normalizedSectionName = sectionName;

    if (!normalizedSectionName) {
      toast.error("Please enter a valid Section name.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/add-section/${school_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sectionName: normalizedSectionName }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast.warning("Section already exists for this school.");
        } else {
          toast.error(result.message || "Failed to add section.");
        }
        return;
      }

      toast.success("Section added successfully!");
      closeModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setRefresh(true);
    setSectionName("");
    handleClose(); 
  }

  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      size="lg"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-500px"
      show={show}
      onHide={closeModal}
      backdrop={true}
    >
      <div
        className="modal-header"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
        }}
      >
        <h2
          style={{ fontFamily: "Manrope", fontSize: "18px", fontWeight: "600" }}
        >
          Add Section
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
            <Col md={12}>
              <Form.Group controlId="section_name">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Section Name
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter Section Name"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
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

          <div className="d-flex justify-content-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { AddSections };
