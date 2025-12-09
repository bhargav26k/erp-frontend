import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, Modal, Row } from "react-bootstrap";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
  selectedSession: number; // Session ID for editing (required)
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const EditSessionSchool = ({ show, handleClose, setRefresh, selectedSession }: Props) => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;

  // State variables to manage input data
  const [sessionName, setSessionName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Previous session details for comparison
  const [previousData, setPreviousData] = useState({
    sessionName: "",
    startDate: "",
    endDate: "",
  });

  // Fetch session details for editing
  useEffect(() => {
    if (selectedSession) {
      const fetchSessionDetails = async () => {
        try {
          const response = await fetch(
            `${DOMAIN}/api/school/get-session-details/${school_id}/${selectedSession}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch session details");
          }
          const data = await response.json();

          setSessionName(data[0].session);
          setStartDate(data[0].start_date);
          setEndDate(data[0].end_date);

          // Store original data for comparison
          setPreviousData({
            sessionName: data[0].session,
            startDate: data[0].start_date,
            endDate: data[0].end_date,
          });
        } catch (error) {
          console.error("Error fetching session details:", error);
        }
      };

      fetchSessionDetails();
    }
  }, [selectedSession, school_id]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Collect only changed fields
    const changes: any = {};
    if (sessionName !== previousData.sessionName) changes.session_name = sessionName;
    if (startDate !== previousData.startDate) changes.start_date = startDate;
    if (endDate !== previousData.endDate) changes.end_date = endDate;

    if (Object.keys(changes).length === 0) {
      alert("No changes detected.");
      return;
    }

    try {
      const url = `${DOMAIN}/api/school/update-session/${school_id}/${selectedSession}`;

      const response = await fetch(url, {
        method: "PUT", // Always use PUT for updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Session updated successfully!", result);
      handleClose(); // Close the modal after submission
      setRefresh(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return createPortal(
    <Modal
      id="kt_modal_edit_session"
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
        <h2>Edit Session</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>
      <div className="modal-body" style={{ backgroundColor: "#F2F6FF" }}>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3" controlId="formSessionName">
                <Form.Label>Session Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter session name"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formStartDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formatDate(startDate)}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formEndDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formatDate(endDate)}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              Update Session
            </button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { EditSessionSchool };