import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const AddReference = ({ show, handleClose, setRefresh }: Props) => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const [referenceName, setReferenceName] = useState("");
  const [referenceDescription, setReferenceDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceName || !referenceDescription ) {
      alert(
        "Please enter Source name and Source Description..."
      );
      return;
    }
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/add-reference/${school_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            referenceName,
            referenceDescription
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Form submitted successfully!", result);
      setReferenceName('');
      setReferenceDescription("");
      setRefresh(true);
      handleClose();
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
        }}
      >
        <h2>Add Reference</h2>
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
            <Col md={8}>
              <Form.Group controlId="reference_name">
                <Form.Label>Reference Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter Reference Name"
                    value={referenceName}
                    onChange={(e) => setReferenceName(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={8}>
              <Form.Group controlId="reference_description">
                <Form.Label>Reference Description</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter Reference Description"
                    value={referenceDescription}
                    onChange={(e) => setReferenceDescription(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { AddReference };
