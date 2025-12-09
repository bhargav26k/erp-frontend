import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for toast notifications
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";

type Props = {
  show: boolean;
  handleClose: () => void;
  fee_group_id: number | null;
  setReferesh: any;
  fee_group_session_id: number | null;
  fee_group_name: string | number | undefined;
  session: number;
  class_id: number;
};

interface CurrentUser {
  school_id: string;
}

interface DataItem {
  id: number;
  fee_group_name: string;
}

interface Class {
  class_id: number;
  class: string;
}

interface Section {
  id: number;
  section: string;
}

interface ClassData {
  id: number;
  className: string;
}

interface SessionData {
  id: number;
  session: number;
}

interface Session {
  id: number;
  session: number;
}

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateEditFeeGroup = ({
  show,
  handleClose,
  fee_group_id,
  fee_group_session_id,
  fee_group_name,
  session,
  class_id,
  section_id,
  setReferesh,
}: Props) => {
  const [formData, setFormData] = useState({
    name: fee_group_name || "",
    class_id: class_id,
    session_id: session || 0,
    fee_group_session_id: fee_group_session_id || 0,
  });

  const [getClass, setClass] = useState<Class[]>([]);
  const [getSection, setSection] = useState<Section[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassData>({
    id: class_id || 0,
    className: "",
  });


  const [changedFields, setChangedFields] = useState<Record<string, any>>({});

const [isSubmitting, setIsSubmitting] = useState(false);


  const { currentUser } = useAuth();
  const schoolId = (currentUser as CurrentUser)?.school_id;
  const sessionId = (currentUser as CurrentUser)?.session_id;

  useEffect(() => {
    setFormData({
      name: fee_group_name || "",
      class_id: class_id || 0,
      session_id: session || 0,
      fee_group_session_id: fee_group_session_id || 0,
    });
    setSelectedClass({ id: class_id || 0, className: "" });
  }, [fee_group_name, session, class_id, section_id, fee_group_session_id]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-onlyclasses/${schoolId}/${sessionId}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const responseData = await response.json();
        setClass(responseData);
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Error fetching classes!");
      }
    };

    fetchClasses();
  }, [schoolId]);



  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Update changedFields state only if the field value is different from the initial value
    if (formData[name] !== value) {
      setChangedFields((prevChangedFields) => ({
        ...prevChangedFields,
        [name]: value,
      }));
    } else {
      // If value is reset to the original, remove it from changedFields
      const { [name]: removed, ...rest } = changedFields;
      setChangedFields(rest);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (Object.keys(changedFields).length === 0) {
      toast.info("No changes detected.");
      return;
    }
  
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);
  
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/edit-feegroup/${fee_group_id}/${schoolId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changedFields),
        }
      );
  
      const result = await response.json();
  
      if (!response.ok) {
        toast.dismiss();
        toast.error(result.error || "Failed to update fee group!");
        return;
      }
  
      toast.dismiss();
      toast.success("Fee group updated successfully!");
      setReferesh(true);
      handleClose(); // Close modal after successful update
    } catch (error) {
      toast.dismiss();
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    handleClose();
  };

  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-800px"
      show={show}
      onHide={handleModalClose}
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
        <h2 style={{
            fontFamily: "Manrope",
            fontSize: "18px",
            fontWeight: "600",
            color: "#1F4061",
          }}>Edit Fee Group</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleModalClose}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>

      <div className="modal-body"  style={{
          backgroundColor: "rgb(242, 246, 255)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}>
        <Form
          onSubmit={handleSubmit}
          className="d-flex flex-column align-items-center"
          style={{ padding: "20px", marginTop: "10px" }}
        >
          <Row style={{ width: "100%" }}>
            <Col md={6} style={{ marginBottom: "23px" }}>
              <Form.Group controlId="formName">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Name
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      height: "46px",
                      paddingLeft: "10px",
                      border: "1px solid #ECEDF1",
                      borderRadius: "8px",
                      fontFamily: "Manrope",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            {/* Select Class Dropdown */}
            <Col md={6}>
              <Form.Group controlId="class">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Select Class
                </Form.Label>
                <Form.Select
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleChange}
                  style={{
                    fontFamily: "Manrope",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  <option value="">Select Class</option>
                  {getClass.map((item) => (
                    <option
                      key={item.class_id}
                      value={item.class_id}
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      {item.class}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-end mt-8">
            <Button
              type="submit"
              className="btn btn-primary"
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
              disabled={isSubmitting}
            >
              <span
                style={{
                  color: "#FFF",
                  fontFamily: "Manrope",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
               {isSubmitting ? "Updating..." : "Update"}
              </span>
            </Button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateEditFeeGroup };
