/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { createPortal } from "react-dom";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import axios from "axios";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
  studentId: number;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateEditStudentUpload = ({
  show,
  handleClose,
  setRefresh,
  studentId,
}: Props) => {
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;

  const [picData, setPicData] = useState({
    student_pic: null,
    father_pic: null,
    mother_pic: null,
    guardian_pic: null, // Corrected from "gardian_pic" to "guardian_pic"
  });

  // Handle file input changes
  const handleChange = (
    key: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    setPicData((prevPicData) => ({
      ...prevPicData,
      [key]: file,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    if (picData.student_pic)
      formData.append("student_pic", picData.student_pic as Blob);
    if (picData.father_pic)
      formData.append("father_pic", picData.father_pic as Blob);
    if (picData.mother_pic)
      formData.append("mother_pic", picData.mother_pic as Blob);
    if (picData.guardian_pic)
      formData.append("guardian_pic", picData.guardian_pic as Blob);

    try {
      const response = await axios.post(
        `${DOMAIN}/api/school/edit-student-pics/${schoolId}/${studentId}`,
        formData,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setRefresh(true); // Trigger refresh
      handleClose(); // Close modal
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      size="lg"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
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
        <h2>Upload Documents</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>
      <div className="modal-body" style={{ backgroundColor: "#F2F6FF" }}>
        <Form onSubmit={handleSubmit}>
          <h1>Student Information</h1>
          <hr />
          <Row>
            <Col md={4}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formStudentImage"
              >
                <Form.Label>Upload Student Image *</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-camera"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="file"
                    name="student_pic"
                    onChange={(e) => handleChange("student_pic", e)}
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <br />
          <h1>Parents Information</h1>
          <hr />
          <Row>
            <Col md={4}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formFatherImage"
              >
                <Form.Label>Upload Father's Image *</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-camera"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="file"
                    name="father_pic"
                    onChange={(e) => handleChange("father_pic", e)}
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formMotherImage"
              >
                <Form.Label>Upload Mother's Image *</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-camera"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="file"
                    name="mother_pic"
                    onChange={(e) => handleChange("mother_pic", e)}
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <br />
          <h1>Guardian Information</h1>
          <hr />
          <Row>
            <Col md={4}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formGuardianImage"
              >
                <Form.Label>Upload Guardian's Image *</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-camera"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="file"
                    name="guardian_pic"
                    onChange={(e) => handleChange("guardian_pic", e)}
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <br />
          <Button type="submit" className="btn btn-primary">
            Submit
          </Button>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateEditStudentUpload };
