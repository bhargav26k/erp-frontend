import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
  initialSubjectName: string;
  initialSubjectCode: string;
  initialSubjectType: string;
  subjectId: string; 
};
const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateEditSubject = ({ 
  show, 
  handleClose, 
  setRefresh, 
  initialSubjectName, 
  initialSubjectCode, 
  initialSubjectType, 
  subjectId
}: Props) => {

 
  

  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;

  const [subjectName, setSubjectName] = useState(initialSubjectName);
  const [subjectCode, setSubjectCode] = useState(initialSubjectCode);
  const [subjectType, setSubjectType] = useState(initialSubjectType);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    // Reset the form with initial values whenever the modal is opened
    setSubjectName(initialSubjectName);
    setSubjectCode(initialSubjectCode);
    setSubjectType(initialSubjectType);
    setIsModified(false);
  }, [show, initialSubjectName, initialSubjectCode, initialSubjectType]);

  useEffect(() => {
    // Check if any value has been changed
    if (
      subjectName !== initialSubjectName ||
      subjectCode !== initialSubjectCode ||
      subjectType !== initialSubjectType
    ) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [subjectName, subjectCode, subjectType, initialSubjectName, initialSubjectCode, initialSubjectType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName || !subjectCode || !subjectType) {
      alert("Please fill all the fields.");
      return;
    }

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/edit-subject/${school_id}/${subjectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subjectName,
            subjectCode,
            subjectType,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the subject.");
      }

      const result = await response.json();
      console.log("Subject updated successfully!", result);
      handleClose(); // Close the modal after submission
      setRefresh(true);
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  const handleSubjectTypeSelect = (value: string) => {
    setSubjectType(value);
  };

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
        <h2 style={{fontFamily:'Manrope', fontSize:'20px', fontWeight:'600'}}>Edit Subject</h2>
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
              <Form.Group controlId="subject_name">
                <Form.Label style={{fontFamily:'Manrope', fontSize:'14px', fontWeight:'600'}}>Subject Name</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    style={{fontFamily:'Manrope', fontSize:'14px', fontWeight:'500'}}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="subject_code">
                <Form.Label style={{fontFamily:'Manrope', fontSize:'14px', fontWeight:'600'}}>Subject Code</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    style={{fontFamily:'Manrope', fontSize:'14px', fontWeight:'500'}}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group controlId="formSubjectType">
                <Form.Label style={{fontFamily:'Manrope', fontSize:'14px', fontWeight:'600'}}>Select Subject Type</Form.Label>
                <InputGroup>
                  <Form.Select
                    value={subjectType}
                    onChange={(e) => handleSubjectTypeSelect(e.target.value)}
                    style={{fontFamily:'Manrope', fontSize:'14px', fontWeight:'500'}}
                  >
                    <option value="">Select Subject Type</option>
                    <option value="theory">Theory</option>
                    <option value="practical">Practical</option>
                  </Form.Select>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
<br />
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isModified}
              style={{fontFamily:'Manrope', fontSize:'14px', fontWeight:'600'}}
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

export { CreateEditSubject };
