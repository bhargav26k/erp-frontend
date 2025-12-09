  /* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: boolean;
  classId: string;
  sectionId: string;
  subjectId: string;
  lessonId: string;
};
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const UploadAssignmentModal = ({  show,
  handleClose,
  setRefresh,
  classId,
  sectionId,
  subjectId,
  lessonId, }: Props) => {
 const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const session_id = currentUser?.session_id;
  const staff_id = currentUser?.id;
  const query = useQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    document_type: "pdf",
    is_public: "1",
    file: null,
    class_id: classId,
    section_id: sectionId,
    subject_id: subjectId,
    lesson_id: lessonId,
  });

  const handleMaterialChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


 const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page refresh

    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("file_type", formData.document_type); // ✅ Renamed to match backend
    formDataToSend.append("is_public", formData.is_public);
    formDataToSend.append("class_id", formData?.class_id);
    formDataToSend.append("section_id", formData?.section_id);
    formDataToSend.append("subject_id", formData?.subject_id);
    formDataToSend.append("lesson_id", formData?.lesson_id);
    formDataToSend.append("school_id", school_id); // ✅ Added
    formDataToSend.append("session_id", session_id); // ✅ Added
    formDataToSend.append("staff_id", staff_id); // ✅ Needed for backend

    // Handle file or link
    if (formData.file) {
      formDataToSend.append("file", formData.file);
    } else {
      toast.error("Please select a file to upload!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${DOMAIN}/api/school/uploadassignment`, {
        method: "POST",
        body: formDataToSend, // Send FormData directly
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const data = await response.json();
      console.log("Upload Successful:", data);
      toast.success("File uploaded successfully!");

      // Reset form after successful upload
      setFormData({
        title: "",
        description: "",
        document_type: "pdf",
        is_public: "1",
        file: null,
        class_id: classId,
        section_id: sectionId,
        subject_id: subjectId,
        lesson_id: lessonId,
      });

      handleClose(); // Close modal if needed
      setRefresh(true); // Refresh data if needed
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

   return createPortal(
      <Modal
        id="kt_modal_create_app"
        tabIndex={-1}
        aria-hidden="true"
        dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
        show={show}
        onHide={handleClose}
        backdrop="static"
      >
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-box">
              <div className="loader"></div>
              <p className="loading-text">
                Uploading Content for you, please wait!
              </p>
            </div>
          </div>
        )}
  
        <div
          className="modal-header"
          style={{
            borderBottom: "1px solid lightgray",
            backgroundColor: "rgb(242, 246, 255)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{ fontFamily: "Manrope", fontSize: "18px", fontWeight: "600" }}
          >
            Upload Assignment :
          </h2>
          <div
            className="btn btn-sm btn-icon btn-active-color-primary"
            onClick={handleClose}
          >
            <i className="fas fa-times"></i>
          </div>
        </div>
  
        <div
          className="modal-body py-lg-10 px-lg-10"
          style={{
            backgroundColor: "#F2F6FF",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div style={{ marginBottom: "23px" }}>
              <label
                htmlFor="materialtitle"
                className="form-label"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Title
              </label>
              <input
                id="materialtitle"
                type="text"
                placeholder="Enter Title"
                className="form-control"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
                onChange={(e) => handleMaterialChange("title", e.target.value)}
              />
            </div>
  
            {/* Description */}
            <div style={{ marginBottom: "23px" }}>
              <label
                htmlFor="materialdescription"
                className="form-label"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Description
              </label>
              <input
                id="materialdescription"
                type="text"
                placeholder="Enter Description"
                className="form-control"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
                onChange={(e) =>
                  handleMaterialChange("description", e.target.value)
                }
              />
            </div>
  
            {/* Document Type Selection */}
            <div style={{ marginBottom: "23px" }}>
              <label
                className="form-label"
                style={{ fontSize: "12px", color: "#434343", fontWeight: "500" }}
              >
                Document Type
              </label>
              <div
                style={{
                  display: "flex",
                  padding: "13px 12px",
                  gap: "12px",
                  border: "1px solid #ECEDF1",
                  borderRadius: "8px",
                }}
              >
                {["pdf", "image"].map((type) => (
                  <div
                    key={type}
                    className="form-check"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="document_type"
                      id={type}
                      value={type}
                      checked={formData.document_type === type}
                      onChange={(e) =>
                        handleMaterialChange("document_type", e.target.value)
                      }
                    />
                    <label className="form-check-label" htmlFor={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Conditional File Upload or Link Input */}
            <div style={{ marginBottom: "23px" }}>
              <label
                className="form-label"
                style={{ fontSize: "12px", color: "#434343", fontWeight: "500" }}
              >
                {formData.document_type === "link"
                  ? "Enter Link"
                  : "Select File to Upload"}
              </label>
             
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) =>
                    handleMaterialChange("file", e.target.files[0])
                  }
                  style={{
                    border: "1px solid #ECEDF1",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                />
            </div>
  
            {/* Is Public Selection */}
            <div style={{ marginBottom: "23px" }}>
              <label
                className="form-label"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Is Public
              </label>
              <div
                style={{
                  display: "flex",
                  padding: "13px 12px",
                  gap: "12px",
                  border: "1px solid #ECEDF1",
                  borderRadius: "8px",
                }}
              >
                {[
                  { value: "1", label: "Yes" },
                  { value: "0", label: "No" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="form-check"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="is_public"
                      id={option.label}
                      value={option.value}
                      checked={formData.is_public === option.value}
                      onChange={(e) =>
                        handleMaterialChange("is_public", e.target.value)
                      }
                    />
                    <label className="form-check-label" htmlFor={option.label}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
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
                disabled={isLoading}
              >
                <span
                  style={{
                    color: "#FF5B5B",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Close
                </span>
              </button>
            </div>
          </form>
        </div>
      </Modal>,
      modalsRoot
    );
};

export { UploadAssignmentModal };
