import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
  sourceId: number;
  sourceName: string;
  sourceDescription: string;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateEditSource = ({
  show,
  handleClose,
  setRefresh,
  sourceId,
  sourceName,
  sourceDescription,
}: Props) => {
  // Set initial state with props and update when props change
  const [sourcename, setsourcename] = useState(sourceName);
  const [sourcedescription, setsourcedescription] = useState(sourceDescription);

  // When the modal is opened and props change, update the state
  useEffect(() => {
    setsourcename(sourceName);
    setsourcedescription(sourceDescription);
  }, [sourceName, sourceDescription]);

  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourcename || !sourcedescription) {
      alert("Please enter source name and source description.");
      return;
    }
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/edit-source/${school_id}/${sourceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourcename,
            sourcedescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Form submitted successfully!", result);
      setRefresh(true);
      handleClose(); // Close the modal after submission
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
        <h2>Edit Source</h2>
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
              <Form.Group controlId="source_name">
                <Form.Label>Source Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="source_name"
                    placeholder="Enter Source Name"
                    value={sourcename}
                    onChange={(e) => setsourcename(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={8}>
              <Form.Group controlId="source_description">
                <Form.Label>Source Description</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="source_description"
                    placeholder="Enter Source Description"
                    value={sourcedescription}
                    onChange={(e) => setsourcedescription(e.target.value)}
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

export { CreateEditSource };
