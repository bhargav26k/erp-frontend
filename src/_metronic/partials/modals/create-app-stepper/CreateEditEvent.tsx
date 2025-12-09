import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";

interface EventData {
  id: number;
  event_title: string;
  event_description: string;
  start_date: string;
  end_date: string;
  role: string;
  visibility: string;
}

interface Props {
  show: boolean;
  handleClose: () => void;
  setRefresh: (refresh: boolean) => void;
  eventData: EventData; // Type for eventData
}

interface Roles {
  designation_id: number;
  name: string;
}

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateEditEvent = ({
  show,
  handleClose,
  setRefresh,
  eventData,
}: Props) => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const session_id = currentUser?.session_id;
  const edited_by = currentUser?.id;

  const [formData, setFormData] = useState({
    eventTitle: "",
    eventDescription: "",
    startDate: "",
    endDate: "",
    role: "",
    visibility: "",
  });

  const [eventId, setEventId] = useState(0);

  useEffect(() => {
    if (eventData && eventData.id) {
      setFormData({
        eventTitle: eventData.event_title || "",
        eventDescription: eventData.event_description || "",
        startDate: eventData.start_date
          ? eventData.start_date.slice(0, 10)
          : "", // Extract date portion
        endDate: eventData.end_date ? eventData.end_date.slice(0, 10) : "", // Extract date portion
        role: eventData.role || "",
        visibility: eventData.visibility || "",
      });
      setEventId(eventData.id);
    }
  }, [eventData]);

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
        `${DOMAIN}/api/student/update-event/${school_id}/${session_id}/${eventId}/${edited_by}`,
        {
          method: "PUT", // Use PUT for updating the event
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            startDate: formattedStartDate, // Use formatted start date
            endDate: formattedEndDate, // Use formatted end date
            id: eventData.id, // Include the event ID to identify which event to update
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

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
      toast.success("Event Updated Successfully...");
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
        <h2>Edit Event</h2>
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
              <Form.Group controlId="event_title">
                <Form.Label>Event Title</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="eventTitle"
                    placeholder="Enter Event Title"
                    value={formData.eventTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, eventTitle: e.target.value })
                    }
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={8}>
              <Form.Group controlId="event_description">
                <Form.Label>Event Description</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-file-alt"></i>
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
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="start_date">
                <Form.Label>Start Date</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-calendar-alt"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="end_date">
                <Form.Label>End Date</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-calendar-alt"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="role">
                <Form.Label>Designation</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user-tag"></i>
                  </InputGroup.Text>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value="">Select Designation</option>
                    <option value="all">All</option>
                    <option value="staff">Staff</option>
                    <option value="students">Students</option>
                  </Form.Select>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="visibiity">
                <Form.Label>Visibility</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user-tag"></i>
                  </InputGroup.Text>
                  <Form.Select
                    name="visibility"
                    value={formData.visibility}
                    onChange={(e) =>
                      setFormData({ ...formData, visibility: e.target.value })
                    }
                  >
                    <option value="">Select Visibility</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </Form.Select>
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

export { CreateEditEvent };
