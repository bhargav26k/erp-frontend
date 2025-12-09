import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
  sectionId: number;
  sectionname: string;
};


const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateEditSection = ({
  show,
  handleClose,
  setRefresh,
  sectionId,
  sectionname,
}: Props) => {
  const [sectionName, setSectionName] = useState(sectionname); // Initialize with classname
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;

  useEffect(() => {
    if (sectionname) setSectionName(sectionname);
  
  }, [sectionname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionName) {
      alert("Please enter section name and select at least one section.");
      return;
    }

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/edit-section/${school_id}/${sectionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body:  JSON.stringify({
            sectionName
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      handleClose(); // Close the modal after submission
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
        }}
      >
        <h2>Edit Section</h2>
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
              <Form.Group controlId="section_name">
                <Form.Label>Section Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="section_name"
                    placeholder="Enter Section Name"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
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

export { CreateEditSection };
