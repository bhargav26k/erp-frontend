import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: (val: boolean) => void;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const AddSubject = ({ show, handleClose, setRefresh }: Props) => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;

  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectType, setSubjectType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form fields whenever the modal is opened/closed
  useEffect(() => {
    if (!show) {
      setSubjectName("");
      setSubjectCode("");
      setSubjectType("");
      setIsSubmitting(false);
    }
  }, [show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple client‐side validation
    if (!subjectName.trim() || !subjectCode.trim() || !subjectType) {
      toast.error(
        "Please enter Subject name, Subject Code, and select a Subject type."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/add-subject/${school_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subjectName, subjectCode, subjectType }),
        }
      );

      if (!response.ok) {
        // Attempt to parse JSON error message
        let errMsg = "Network response was not ok";
        try {
          const errData = await response.json();
          if (errData?.message) errMsg = errData.message;
        } catch { /* ignore JSON parse failure */ }
        throw new Error(errMsg);
      }

      const result = await response.json();
      console.log("Form submitted successfully!", result);
      toast.success("Subject added successfully!");

      // Clear & close:
      setSubjectName("");
      setSubjectCode("");
      setSubjectType("");
      handleClose();
      setRefresh(true);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(
        error?.message || "There was an error adding the subject. Please try again."
      );
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
      onHide={() => {
        if (!isSubmitting) handleClose();
      }}
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
        <h2>Add Subject</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={() => {
            if (!isSubmitting) handleClose();
          }}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>
      <div className="modal-body" style={{ backgroundColor: "#F2F6FF" }}>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="subject_name">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Subject Name
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter Subject Name"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="subject_code">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Subject Code
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter Subject Code"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group className="mb-3 custom-input" controlId="formSubjectType">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Select Subject Type
                </Form.Label>
                <InputGroup>
                  <Form.Select
                    value={subjectType}
                    onChange={(e) => setSubjectType(e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">Select Subject Type</option>
                    <option value="theory">Theory</option>
                    <option value="practical">Practical</option>
                  </Form.Select>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{
                fontFamily: "Manrope",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Submitting…
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { AddSubject };
