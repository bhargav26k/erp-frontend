import { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const modalsRoot = document.getElementById("root-modals") || document.body;

type Props = {
  show: boolean;
  handleClose: () => void;
  fee_type_id: number | null;
  fee_type_code: string;
  fee_type_name: string;
  setReferesh: any;
};

const CreateEditFeeType = ({
  show,
  handleClose,
  fee_type_id,
  fee_type_name,
  fee_type_code,
  setReferesh,
}: Props) => {
  const [formData, setFormData] = useState({
    name: fee_type_name || "",
    feeCode: fee_type_code || "",
  });

  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;

  // Store original values for comparison
  const [initialFormData, setInitialFormData] = useState({
    name: fee_type_name || "",
    feeCode: fee_type_code || "",
  });

  // Initialize form values when modal opens
  useEffect(() => {
    if (show) {
      setFormData({
        name: fee_type_name || "",
        feeCode: fee_type_code || "",
      });
      setInitialFormData({
        name: fee_type_name || "",
        feeCode: fee_type_code || "",
      });
    }
  }, [show, fee_type_name, fee_type_code]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Compare the current form data with the initial data and only include changed fields
    const updatedFields = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== initialFormData[key]) {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    // If no fields were changed, don't submit
    if (Object.keys(updatedFields).length === 0) {
      console.log("No changes detected.");
      toast.info("No changes detected."); // Inform user that no changes were made
      return;
    }

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/edit-feetype/${fee_type_id}/${schoolId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFields), // Send only changed values
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReferesh(true); // Update the parent component
      handleClose(); // Close the modal after successful update

      // Show success notification
      toast.success("Fee type updated successfully!");
    } catch (error) {
      console.error("Error:", error);

      // Show error notification
      toast.error("Failed to update fee type. Please try again.");
    }
  };

  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-600px"
      show={show}
      onHide={handleClose}
      backdrop={true}
    >
      <div
        className="modal-header"
        style={{
          borderBottom: "1px solid lightgray",
          backgroundColor: "rgb(242, 246, 255)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            fontFamily: "Manrope",
            fontSize: "18px",
            fontWeight: "600",
            color: "#1F4061",
          }}
        >
          Edit Fee Type
        </h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>

      <div
        className="modal-body"
        style={{
          backgroundColor: "white",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3 custom-input" controlId="formName">
                <Form.Label  style={{fontFamily:'Manrope', fontWeight:'500', fontSize:'14px'}}>Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    required
                    style={{fontFamily:'Manrope', fontWeight:'500', fontSize:'14px'}}
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formFeesCode"
              >
                <Form.Label  style={{fontFamily:'Manrope', fontWeight:'500', fontSize:'14px'}}>Fees Code</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-code"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="feeCode"
                    placeholder="Enter Fee Code"
                    value={formData.feeCode || ""}
                    onChange={handleInputChange}
                    required
                    style={{fontFamily:'Manrope', fontWeight:'500', fontSize:'14px'}}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <div style={{ justifyContent: "right", display: "flex" }}>
            <Button
              type="submit"
              variant="secondary"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                backgroundColor: "#1C335C",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.3s",
                width: "max-content",
              }}
            >
              <span
                style={{
                  color: "#FFF",
                  fontFamily: "Manrope",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Update
              </span>
            </Button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateEditFeeType };
