import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import axios from "axios";
import { toast } from "react-toastify";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: boolean;
  selectedItem: any;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const initialFormData = {
  title: "",
  description: "",
  document_type: "pdf",
  is_public: "1",
  file: null,
  class_id: "",
  section_id: "",
  subject_id: "",
  lesson_id: "",
  id: "",
};


const EditUploadedAssignment = ({
  show,
  handleClose,
  setRefresh,
  selectedItem,
}: Props) => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const session_id = currentUser?.session_id;
  const staff_id = currentUser?.id;

  const [formData, setFormData] = useState(initialFormData);
  
  const [changedFields, setChangedFields] = useState(new Set());

  
  useEffect(() => {
    if (selectedItem) {
      setFormData({
        title: selectedItem?.title || "",
        description: selectedItem?.description || "",
        document_type: selectedItem?.file_type || "pdf",
        is_public: selectedItem?.is_public ? "1" : "0",
        file: null, // No file prefilled, only showing preview
        class_id: selectedItem?.class_id || "",
        section_id: selectedItem?.section_id || "",
        subject_id: selectedItem?.subject_id || "",
        lesson_id: selectedItem?.lesson_id || "",
        id:selectedItem?.id || ""
      });
    }
  }, [selectedItem]);

  const handleMaterialChange = (field, value) => {
    setFormData((prev) => {
      if (prev[field] !== value) {
        setChangedFields((prevFields) => new Set(prevFields).add(field));
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (changedFields.size === 0) {
        toast.error("No changes to submit.");
        return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append("id", formData.id);

    if (changedFields.has("title")) formDataToSend.append("title", formData.title);
    if (changedFields.has("description")) formDataToSend.append("description", formData.description);
    if (changedFields.has("document_type")) formDataToSend.append("file_type", formData.document_type);
    if (changedFields.has("is_public")) formDataToSend.append("is_public", formData.is_public);
    if (changedFields.has("class_id")) formDataToSend.append("class_id", formData.class_id);
    if (changedFields.has("section_id")) formDataToSend.append("section_id", formData.section_id);
    if (changedFields.has("subject_id")) formDataToSend.append("subject_id", formData.subject_id);
    if (changedFields.has("lesson_id")) formDataToSend.append("lesson_id", formData.lesson_id);
    
    formDataToSend.append("school_id", school_id);
    formDataToSend.append("session_id", session_id);
    formDataToSend.append("staff_id", staff_id);

    // ✅ Only send the file if it was changed
    if (changedFields.has("file") && formData.file) {
      formDataToSend.append("file", formData.file);
    } 
    try {
      const response = await axios.post(
        `${DOMAIN}/api/school/update-assignmentcontent`,
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (response.data.updatedFields) {
        toast.success(`File updated successfully! Updated fields: ${Object.keys(response.data.updatedFields).join(", ")}`);
      } else {
        toast.success("File updated successfully!");
      }

      setChangedFields(new Set());
      handleClose();
      if (typeof setRefresh === 'function') setRefresh(true);
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Upload failed. Please try again.");
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
          Edit Uploaded Assignment :
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
          <div style={{ display: "flex", gap: "5%" }}>
            <div
              style={{
                width: "40%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {selectedItem?.file_url ? (
                <div
                  className="mb-3"
                  style={{ width: "100%", maxWidth: "600px" }}
                >
                  <label
                    className="form-label"
                    style={{
                      fontSize: "14px",
                      color: "#434343",
                      fontWeight: "600",
                      fontFamily: "Manrope",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    Uploaded File:
                  </label>

                  {/* ✅ Image Preview */}
                  {selectedItem.file_type === "image" ? (
                    <img
                      src={selectedItem.file_url}
                      alt="Uploaded file"
                      style={{
                        width: "100%",
                        maxHeight: "400px",
                        objectFit: "contain",
                        borderRadius: "8px",
                      }}
                    />
                  ) : selectedItem.file_type === "pdf" ||
                    selectedItem.file_url.endsWith(".pdf") ? (
                    /* ✅ PDF Preview */
                    <iframe
                      src={selectedItem.file_url}
                      style={{
                        width: "100%",
                        height: "300px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                      title="PDF Preview"
                    ></iframe>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div style={{ width: "60%" }}>
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
                  className="form-control"
                  value={formData.title}
                  style={{
                    fontFamily: "Manrope",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                  onChange={(e) =>
                    handleMaterialChange("title", e.target.value)
                  }
                />
              </div>

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
                <textarea
                  id="materialdescription"
                  className="form-control"
                  value={formData.description}
                  onChange={(e) =>
                    handleMaterialChange("description", e.target.value)
                  }
                  style={{
                    fontFamily: "Manrope",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                ></textarea>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "23px" }}>
            <label
              className="form-label"
              style={{
                fontSize: "14px",
                color: "#434343",
                fontWeight: "500",
                fontFamily: "Manrope",
              }}
            >
              Document Type
            </label>
            <select
              className="form-control"
              value={formData.document_type}
              onChange={(e) =>
                handleMaterialChange("document_type", e.target.value)
              }
            >
              <option value="pdf">PDF</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="link">Link</option>
            </select>
          </div>

          {/* Preview of Existing File or Link */}

          {/* File Upload or Link Input */}
          <div className="mb-3">
            <label
              className="form-label"
              style={{
                fontFamily: "Manrope",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              {formData.document_type === "link"
                ? "Enter Link"
                : "Upload New File"}
            </label>
              <input
                type="file"
                className="form-control"
                onChange={(e) =>
                  handleMaterialChange("file", e.target.files[0])
                }
              />
          </div>

          {/* Public Access */}
          <div className="mb-3">
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
            <select
              className="form-control"
              value={formData.is_public}
              onChange={(e) =>
                handleMaterialChange("is_public", e.target.value)
              }
              style={{
                fontFamily: "Manrope",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                fontFamily: "Manrope",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Update
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              style={{
                fontFamily: "Manrope",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { EditUploadedAssignment };
