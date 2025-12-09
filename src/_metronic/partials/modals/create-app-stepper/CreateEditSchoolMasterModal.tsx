import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { toast } from "react-toastify";

type Props = {
  show: boolean;
  onHide: () => void;
  setRefresh: (refreshState: boolean) => void;
  userType: string;
  group: any;
};

const CreateEditSchoolMasterModal = ({
  show,
  setRefresh,
  onHide,
  group,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: group.name || "",
    contact_no: group.contact_no || "",
    email: group.email || "",
    user_id: group.id || "",
  });

  const [modifiedFields, setModifiedFields] = useState<
    Partial<typeof formData>
  >({});

  // 🔹 Handle Input Change (Only Track Changes)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // ✅ Email Validation
    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setEmailError(emailRegex.test(value) ? null : "Invalid email format");
    }

    // ✅ Phone Number Validation
    if (name === "contact_no") {
      if (!/^\d*$/.test(value)) return; // Allow only numbers
      if (value.length > 10) return; // Limit to 10 digits
      setPhoneError(
        value.length === 10 ? null : "Phone number must be exactly 10 digits"
      );
    }

    // ✅ Track changes
    if (value !== group[name]) {
      setModifiedFields((prev) => ({ ...prev, [name]: value }));
    } else {
      setModifiedFields((prev) => {
        const updatedFields = { ...prev };
        delete updatedFields[name as keyof typeof updatedFields];
        return updatedFields;
      });
    }
  };

  // 🔹 Handle File Upload (Only Track New Image)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      // Validate file type (e.g., image file)
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Please upload a valid image file.");
        return;
      }

      setImage(selectedFile); // ✅ Store the image if it's valid
    }
  };

  // 🔹 Fetch Data If Editing
  useEffect(() => {
    if (!group.id) return;
    const fetchSchoolMasterDetails = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/superadmin/get-school-masters-for-edit/${group.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch details");

        const result = await response.json();
        const data = result.data[0];

        setFormData({
          name: data.name || "",
          contact_no: data.contact_no || "",
          email: data.email || "",
          user_id: group.id || "",
        });

        setModifiedFields({}); // ✅ Reset modified fields after fetching
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    fetchSchoolMasterDetails();
  }, [group.id]);

  // 🔹 Submit Form (Only Send Changed Fields)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if there are no changes and no image to upload
    if (Object.keys(modifiedFields).length === 0 && !image) {
      toast.info("No changes detected");
      return;
    }

    // ✅ Final Email and Phone Validation Before Submission
    if (!formData.email || emailError) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!formData.contact_no || formData.contact_no.length !== 10) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    // Ensure a file is uploaded before submission (if image is selected)
    if (image && !image.name) {
      toast.error("Please upload a valid file.");
      return;
    }

    setIsSubmitting(true);
    setUploadStatus("Processing...");

    try {
      // Update modified fields if present
      if (Object.keys(modifiedFields).length > 0) {
        const response = await fetch(
          `${DOMAIN}/api/superadmin/edit-school-masters`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...modifiedFields,
              user_id: formData.user_id,
            }),
          }
        );

        if (!response.ok) throw new Error("Failed to update details");
      }

      // ✅ Upload image if provided
      if (image) {
        await uploadFile(image, formData.user_id, "image");
      }

      setUploadStatus("Completed");
      handleClose();

      // ✅ Show success toast after completing
      toast.success("Company details updated successfully!");
    } catch (error) {
      console.error("Error during submission:", error);
      setError("An error occurred. Please try again.");
      setUploadStatus("An error occurred");
      toast.error("Failed to update company details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔹 Upload File Helper Function
  const uploadFile = async (file: File, userId: string, fileType: string) => {
    try {
      const fileData = new FormData();
      fileData.append("file", file);
      fileData.append("master_id", userId);
      fileData.append("file_type", fileType);

      const response = await fetch(
        `${DOMAIN}/api/superadmin/uploadMasterFile`,
        {
          method: "POST",
          body: fileData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to upload ${fileType}: ${errorData.error}`);
      }
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      throw error;
    }
  };

  const handleClose = () => {
    setRefresh(true);
    setUploadStatus("");
    onHide();
  };

  return (
    <Modal
      id="kt_modal_create_school"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-800px"
      show={show}
      onHide={onHide}
      backdrop={true}
    >
      <div
        className="modal-header"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontFamily: "Manrope",
            fontWeight: "700",
            color: "#1F4061",
          }}
        >
          Edit Company
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
          backgroundColor: "#F2F6FF",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formName">
                <Form.Label>Company Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formContactNo">
                <Form.Label>Contact Number:</Form.Label>
                <Form.Control
                  type="text"
                  name="contact_no"
                  value={formData.contact_no}
                  onChange={handleChange}
                  required
                  isInvalid={!!phoneError} // Highlights the input if invalid
                />
                <Form.Control.Feedback type="invalid">
                  {phoneError}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  isInvalid={!!emailError} // Highlights the input if invalid
                />
                <Form.Control.Feedback type="invalid">
                  {emailError}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formImage">
                <Form.Label>Image:</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Form.Group>
            </Col>
          </Row>
          <div
            style={{ display: "flex", width: "100%", justifyContent: "end" }}
          >
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className="mt-5"
            >
              {uploadStatus || "Update"}
            </Button>
          </div>
        </Form>
        {error && <div className="text-danger mt-2">{error}</div>}
      </div>
    </Modal>
  );
};

export { CreateEditSchoolMasterModal };
