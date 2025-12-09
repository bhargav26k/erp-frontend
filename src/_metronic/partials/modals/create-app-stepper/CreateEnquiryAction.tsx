import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Modal, Form, Row, Col, InputGroup } from "react-bootstrap";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip as ReactTooltip } from "react-tooltip";

type Props = {
  show: boolean;
  handleClose: () => void;
  enqId: string | undefined;
  setRefresh: (refresh: boolean) => void;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateEnquiryAction = ({
  show,
  handleClose,
  enqId,
  setRefresh,
}: Props) => {
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const [showTooltip, setShowTooltip] = useState(false);
  const [enqdata, setEnqdata] = useState({
    student_name: "",
    father_phone: "",
    father_name: "",
    contact_number: "",
    email: "",
    enquiry_id: "",
    enquiry_type: "",
    status: "",
    is_move_to_adm: 0,
    full_name: "",
    id: "",
  });

  const [latestHistory, setLatestHistory] = useState<any>(null); // To store the most recent history entry

  useEffect(() => {
    if (!schoolId || !enqId) {
      console.log("schoolId or enqId missing");
      return;
    }

    // Function to fetch enquiry details
    const fetchEnquiryDetails = async () => {
      try {
        console.log("Fetching Enquiry Details...");
        const response = await fetch(
          `${DOMAIN}/api/school/get-actionEnquiryById/${schoolId}/${enqId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Enquiry Details Fetched:", data); // Added for debugging
        setEnqdata({
          student_name: data[0]?.student_name || "",
          id: data[0]?.id || "",
          full_name: data[0]?.full_name || "",
          father_phone: data[0]?.father_phone || "",
          father_name: data[0]?.father_name || "",
          contact_number: data[0]?.contact_number || "",
          email: data[0]?.email || "",
          enquiry_id: data[0]?.enquiry_id || "",
          enquiry_type: data[0]?.enquiry_type || "",
          status: data[0]?.status || "Pending",
          is_move_to_adm: data[0]?.is_move_to_adm,
        });
      } catch (error) {
        console.error("Error fetching Enquiry Details:", error);
      }
    };

    // Function to fetch the latest enquiry history
    const fetchLatestHistory = async () => {
      try {
        console.log("Fetching Latest History...");
        const historyResponse = await fetch(
          `${DOMAIN}/api/school/get-enquiry-history/${schoolId}/${enqId}`
        );
        if (!historyResponse.ok) {
          throw new Error(`HTTP error! status: ${historyResponse.status}`);
        }
        const historyData = await historyResponse.json();

        setLatestHistory(historyData); // Only take the latest entry
      } catch (error) {
        console.error("Error fetching Enquiry History:", error);
      }
    };

    // Call both functions
    fetchEnquiryDetails();
    fetchLatestHistory();
  }, [enqId, schoolId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Automatically set is_move_to_adm based on status
    if (name === "status" && value === "Confirmed") {
      setEnqdata((prevState) => ({
        ...prevState,
        [name]: value,
        is_move_to_adm: 1, // Automatically set to 1
      }));
    } else if (name === "status" && value !== "Confirmed") {
      setEnqdata((prevState) => ({
        ...prevState,
        [name]: value,
        is_move_to_adm: 0, // Reset to 0 if status changes to non-Confirmed
      }));
    } else {
      setEnqdata((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const getFormattedCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new follow-up entry in the database
      const addEnquiryResponse = await fetch(
        `${DOMAIN}/api/school/addEnquiryAction/${schoolId}/${enqId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            follow_up_date: enqdata.follow_up_date || getFormattedCurrentDate(),
            status: enqdata.status,
            notes: enqdata.notes,
            is_move_to_adm: enqdata.is_move_to_adm,
          }),
        }
      );

      if (!addEnquiryResponse.ok) {
        throw new Error(
          `Error adding enquiry action: ${addEnquiryResponse.status}`
        );
      }

      toast.success("New enquiry action added successfully!");
      setRefresh(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error adding new enquiry action:", error);
      toast.error("Error adding new enquiry action. Please try again.");
    }
  };


  const handleCloseModal = () => {
    setEnqdata({
      student_name: "",
      father_phone: "",
      father_name: "",
      contact_number: "",
      email: "",
      enquiry_id: "",
      enquiry_type: "",
      status: "",
      is_move_to_adm: 0,
      full_name: "",
      id: "",
    });

    setLatestHistory(null);
    handleClose();
  };

  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      size="lg"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      show={show}
      onHide={handleCloseModal}
    >
      <div
        className="modal-header"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
          fontFamily: "Manrope",
        }}
      >
        <h2>Walk-In Enquiry Action</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleCloseModal}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>
      <div
        className="modal-body py-lg-10 px-lg-10"
        style={{ backgroundColor: "#F2F6FF", fontFamily: "Manrope" }}
      >
        <Form onSubmit={handleSubmit}>
          {/* Enquiry Info */}
          <Row className="mb-10">
            <Col>
              {enqdata.full_name ? (
                <>
                  <strong>Name: </strong>
                  {enqdata.full_name}
                </>
              ) : (
                <>
                  <strong>Student Name: </strong>
                  {enqdata.student_name}
                </>
              )}
            </Col>

            <Col>
              {enqdata.father_name ? (
                <>
                  <strong>Father’s Name: </strong>
                  {enqdata.father_name}
                </>
              ) : (
                <>
                  <strong>Email: </strong>
                  {enqdata.email}
                </>
              )}
            </Col>

            <Col>
              {enqdata.father_phone ? (
                <>
                  <strong>Father’s Contact: </strong>
                  {enqdata.father_phone}
                </>
              ) : (
                <>
                  <strong>Contact Number: </strong>
                  {enqdata.contact_number}
                </>
              )}
            </Col>
          </Row>
          <Row className="mb-10">
            <Col>
              <h5>Latest Enquiry History</h5>
              {latestHistory ? (
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Last Follow Up Date</th>
                      <th scope="col">Previous Status</th>
                      <th scope="col">Previous Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {new Date(
                          latestHistory.follow_up_date
                        ).toLocaleString()}
                      </td>
                      <td>{latestHistory.status}</td>
                      <td>{latestHistory.notes}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p>No history available for this enquiry.</p>
              )}
            </Col>
          </Row>
          {/* Follow Up Date and Status */}
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="formFollowUpDate">
                <Form.Label>Next Follow Up Date</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="date"
                    name="follow_up_date"
                    value={enqdata.follow_up_date}
                    onChange={handleChange}
                    disabled={latestHistory?.status === "Confirmed"}
                  />
                  <InputGroup.Text>
                    <i className="fas fa-calendar"></i>
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formStatus">
                <Form.Label>New Follow-Up Status</Form.Label>
                <Form.Select
                  name="status"
                  value={enqdata.status}
                  onChange={handleChange}
                  required
                  disabled={latestHistory?.status === "Confirmed"}
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                  <option value="Deferred">Deferred</option>
                  {enqdata.enquiry_type === "Admission" && (
                    <option value="Confirmed">Confirmed</option>
                  )}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Move to Admission Toggle */}
          {enqdata.enquiry_type === "Admission" && (
            <Form.Group
              controlId="formMoveToAdm"
              className="d-flex align-items-center mb-4"
            >
              <Form.Label className="me-2">Move to Admission?</Form.Label>
              <Form.Check
                type="switch"
                id="is_move_to_adm"
                checked={enqdata.is_move_to_adm === 1}
                disabled={enqdata.status !== "Confirmed"}
              />

              <div
                className="menu-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "6px 0px 6px 0px",
                  position: "relative",
                }}
              >
                &nbsp; &nbsp; &nbsp;
                <i
                  className="fas fa-question-circle"
                  style={{
                    marginRight: "8px",
                    color: "blue",
                    cursor: "pointer",
                  }}
                  data-tooltip-id="my-tooltip-2"
                ></i>
                <ReactTooltip
                  id="my-tooltip-2"
                  place="right"
                  content='Select "Convert" in the folloup status to enable this move to admission toggle ! '
                  style={{
                    zIndex: 999,
                    borderRadius: "10px",
                    color: "#212121",
                    fontWeight: "600",
                    fontFamily: "Manrope",
                    fontSize: "12px",
                    boxShadow: "0px 2px 16.6px 0px rgba(0, 0, 0, 0.15)",
                  }}
                  className="no-arrow bg-white text-black custom-tooltip-style"
                  border={0} // Set border width to 0 to remove the arrow
                  arrowColor={"transparent"}
                  opacity={"no"}
                />
              </div>
            </Form.Group>
          )}

          {/* Notes */}
          <Row className="mb-4">
            <Col>
              <Form.Group controlId="formNotes">
                <Form.Label>Latest Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  name="notes"
                  rows={3}
                  value={enqdata.notes}
                  onChange={handleChange}
                  disabled={latestHistory?.status === "Confirmed"}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Latest History Section */}

          {/* Submit Button */}
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

export { CreateEnquiryAction };
