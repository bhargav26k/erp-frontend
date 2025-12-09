import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
};

interface Roles {
  designation_id: number;
  name: string;
}

const modalsRoot = document.getElementById("root-modals") || document.body;

const AddEvent = ({ show, handleClose, setRefresh }: Props) => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const session_id = currentUser?.session_id;
  const created_by = currentUser?.id;
  const today = new Date().toISOString().slice(0, 10);
  const [formData, setFormData] = useState({
    eventTitle: "",
    eventDescription: "",
    startDate: today,
    endDate: today,
    role: "",
    visibility: "",
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { eventTitle, eventDescription, startDate, endDate, role } = formData;

    if (!eventTitle || !eventDescription || !startDate || !endDate || !role) {
      alert("Please fill in all required fields.");
      return;
    }

    // Format the dates using formatDate
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    try {
      const response = await fetch(
        `${DOMAIN}/api/student/add-event/${school_id}/${session_id}/${created_by}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            startDate: formattedStartDate, // Use formatted start date
            endDate: formattedEndDate, // Use formatted end date
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Form submitted successfully!", result);

      // Reset form fields
      setFormData({
        eventTitle: "",
        eventDescription: "",
        startDate: "",
        endDate: "",
        role: "",
        visibility: "",
      });

      setRefresh(true);
      handleClose();
      toast.success("Event Saved Successfully...");
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
      {/* Header */}
      <div
        className="modal-header"
        style={{
          backgroundColor: "rgb(242, 246, 255)",
          borderBottom: "none",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          color: "#fff",
        }}
      >
        <h2 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600 , color:'#1C335C'}}>
          Add Event
        </h2>
        <button
          className="btn btn-icon btn-sm"
          onClick={handleClose}
          style={{ color: "#fff", opacity: 0.8 }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Body */}
      <div
        className="modal-body"
        style={{
          backgroundColor: "#fff",
          padding: "24px",
          fontFamily: "Manrope, sans-serif",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      >
        <Form onSubmit={handleSubmit}>
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="event_title">
                <Form.Label style={{ fontWeight: 500, fontSize:"14px" }}>Event Title</Form.Label>
                <InputGroup>
                  <InputGroup.Text
                    style={{
                      backgroundColor: "#f0f2f5",
                      border: "1px solid #dde2ed",
                      borderRight: "none",
                       fontSize:"14px",
                       
                    }}
                  >
                    <i className="fas fa-user" style={{ color: "#1C335C" }} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="eventTitle"
                    placeholder="Enter Event Title"
                    value={formData.eventTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, eventTitle: e.target.value })
                    }
                    style={{
                      border: "1px solid #dde2ed",
                      borderLeft: "none",
                      borderRadius: "0 4px 4px 0",
                      padding: "8px 12px",
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          {/* Description */}
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="event_description">
                <Form.Label style={{ fontWeight: 500 }}>
                  Event Description
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text
                    style={{
                      backgroundColor: "#f0f2f5",
                      border: "1px solid #dde2ed",
                      borderRight: "none",
                    }}
                  >
                    <i
                      className="fas fa-file-alt"
                      style={{ color: "#1C335C" }}
                    />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="eventDescription"
                    placeholder="Enter Event Description"
                    value={formData.eventDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eventDescription: e.target.value,
                      })
                    }
                    style={{
                      border: "1px solid #dde2ed",
                      borderLeft: "none",
                      borderRadius: "0 4px 4px 0",
                      padding: "8px 12px",
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          {/* Dates */}
          <Row className="mb-4">
            {["startDate", "endDate"].map((field, i) => (
              <Col md={6} key={field}>
                <Form.Group controlId={field}>
                  <Form.Label style={{ fontWeight: 500 }}>
                    {field === "startDate" ? "Start Date" : "End Date"}
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text
                      style={{
                        backgroundColor: "#f0f2f5",
                        border: "1px solid #dde2ed",
                        borderRight: "none",
                      }}
                    >
                      <i
                        className="fas fa-calendar-alt"
                        style={{ color: "#1C335C" }}
                      />
                    </InputGroup.Text>
                    <Form.Control
                      type="date"
                      name={field}
                      value={formData[field]}
                      onChange={(e) =>
                        setFormData({ ...formData, [field]: e.target.value })
                      }
                      style={{
                        border: "1px solid #dde2ed",
                        borderLeft: "none",
                        borderRadius: "0 4px 4px 0",
                        padding: "8px 12px",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            ))}
          </Row>

          {/* Role & Visibility */}
          <Row className="mb-4">
            {[
              {
                label: "Designation",
                name: "role",
                icon: "fas fa-user-tag",
                options: [
                  { val: "", label: "Select Designation" },
                  { val: "all", label: "All" },
                  { val: "staff", label: "Staff" },
                  { val: "students", label: "Students" },
                ],
              },
              {
                label: "Visibility",
                name: "visibility",
                icon: "fas fa-eye",
                options: [
                  { val: "", label: "Select Visibility" },
                  { val: "public", label: "Public" },
                  { val: "private", label: "Private" },
                ],
              },
            ].map(({ label, name, icon, options }) => (
              <Col md={12} key={name} className="mb-5">
                <Form.Group controlId={name}>
                  <Form.Label style={{ fontWeight: 500 }}>{label}</Form.Label>
                  <InputGroup>
                    <InputGroup.Text
                      style={{
                        backgroundColor: "#f0f2f5",
                        border: "1px solid #dde2ed",
                        borderRight: "none",
                      }}
                    >
                      <i className={icon} style={{ color: "#1C335C" }} />
                    </InputGroup.Text>
                    <Form.Select
                      name={name}
                      value={formData[name]}
                      onChange={(e) =>
                        setFormData({ ...formData, [name]: e.target.value })
                      }
                      style={{
                        border: "1px solid #dde2ed",
                        borderLeft: "none",
                        borderRadius: "0 4px 4px 0",
                        padding: "8px 12px",
                      }}
                    >
                      {options.map((o) => (
                        <option key={o.val} value={o.val}>
                          {o.label}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>
            ))}
          </Row>

          {/* Submit */}
          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              style={{
                backgroundColor: "#1C335C",
                border: "none",
                padding: "10px 24px",
                fontFamily: "Manrope, sans-serif",
                fontWeight: 600,
              }}
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { AddEvent };
