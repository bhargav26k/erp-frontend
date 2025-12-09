import { useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "react-bootstrap";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: (refresh: boolean) => void;
  enqId: string;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateAdmissionEnquiryReject = ({ show, handleClose, setRefresh,enqId}: Props) => {
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const [formData, setFormData] = useState({ reject_reason: "" });
  const [isConfirmed, setIsConfirmed] = useState(false); // State to track confirmation

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    setIsConfirmed(true); // Set confirmation state to true
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enquiry_id = enqId
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/application-reject/${schoolId}/${enquiry_id}`,
        {
          method: "POST", // Assuming you want to use POST instead of PUT for sending the reject reason
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Reject reason sent successfully:", data);
      setRefresh(true);
      handleClose();
    } catch (error) {
      console.error("Error sending reject reason:", error);
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
        className="modal-content"
        style={{ padding: "20px 5px", borderRadius: "17px" }}
      >
        <div
          className="modal-header border-0"
          style={{ width: "100%", height: "27px" }}
        >
          <span
            className=""
            id="staticBackdropLabel"
            style={{
              justifyContent: "center",
              textAlign: "center",
              alignItems: "center",
              fontSize: "24px",
              fontWeight: "600",
              fontFamily: "Manrope",
            }}
          >
            Enquiry Reject
          </span>
          <span
            data-bs-dismiss="modal"
            onClick={handleClose}
            aria-label="Close"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="16" fill="#ECECEC" />
              <path
                d="M22.8572 9.14294L9.14288 22.8572M9.14288 9.14294L22.8572 22.8572"
                stroke="#464646"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <hr />
        <div className="modal-body" style={{ justifyContent: "center" }}>
          {!isConfirmed ? (
            <div style={{ textAlign: "center" }}>
              <p>Are you sure you want to reject this enquiry?</p>
              <button className="btn btn-danger" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "23px" }}>
                <div className="fv-row mb-10" style={{ display: "flex", gap: "10px" }}>
                  <div
                    className="form-floating mb-3"
                    style={{ display: "flex", flexDirection: "column", width: "100%" }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      id="reject_reason"
                      name="reject_reason"
                      placeholder="Reject Reason"
                      value={formData.reject_reason}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="reject_reason">Reject Reason</label>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <button className="btn btn-danger" type="submit">
                    Reject
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateAdmissionEnquiryReject };
