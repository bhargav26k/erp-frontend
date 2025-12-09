import React from "react";
import { Modal, Button } from "react-bootstrap";

interface DeleteConfirmationModalProps {
  show: boolean; // Whether the modal is visible or not
  handleClose: () => void; // Function to close the modal
  handleDelete: () => void; // Function to handle deletion
  title?: string; // Title of the modal
  description?: string; // Description in the modal body
  confirmButtonText?: string; // Text for the confirm button
  cancelButtonText?: string; // Text for the cancel button
  confirmButtonVariant?: string; // Bootstrap variant for the confirm button
  cancelButtonVariant?: string; // Bootstrap variant for the cancel button
  icon?: React.ReactNode; // Optional icon to display in the modal
  setRefresh?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  show,
  handleClose,
  handleDelete,
  title = "Confirm Deletion",
  description = "Are you sure you want to perform this action? This action cannot be undone.",
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  confirmButtonVariant = "danger",
  cancelButtonVariant = "secondary",
  icon,
  setRefresh,
}) => {
  const handleClick = () => {
    handleDelete();
    setRefresh(true);
    handleClose();
  };
  return (
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-550px"
      show={show}
      onHide={handleClose}
    >
      <Modal.Header
        closeButton
        style={{
          borderBottom: "1px solid lightgray",
          backgroundColor: "rgb(242, 246, 255)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Modal.Title
          style={{ fontFamily: "Manrope", fontWeight: "500", fontSize: "16px" }}
        >
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: "rgb(242, 246, 255)",
        }}
      >
        <div className="d-flex align-items-center">
          {icon && <div className="me-3">{icon}</div>}{" "}
          {/* Display icon if provided */}
          <p
            style={{
              fontFamily: "Manrope",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            {description}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer
        style={{
          backgroundColor: "rgb(242, 246, 255)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Button
          variant={confirmButtonVariant}
          onClick={handleClick}
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
            {confirmButtonText}
          </span>
        </Button>
        <Button
          variant={cancelButtonVariant}
          onClick={handleClose}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            backgroundColor: "#FFE7E1",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            width: "max-content",
          }}
        >
          <span
            style={{
              color: "#FF5B5B",
              fontFamily: "Manrope",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {cancelButtonText}
          </span>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { DeleteConfirmationModal };
