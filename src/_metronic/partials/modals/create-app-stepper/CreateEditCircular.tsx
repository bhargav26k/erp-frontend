import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface CircularData {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  created_for: string;
  is_event: number;
  classes: string[]; // or comma-separated if the API returns a string
  visibility: string;
  document_path?: string; // e.g. "/uploads/circulars/.../foo.pdf"
}

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: (val: boolean) => void;
  circularData: CircularData; // the data to populate for editing
};

interface ClassOption {
  class_id: any;
  id: number;
  class: string;
}

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateEditCircular = ({
  show,
  handleClose,
  setRefresh,
  circularData,
}: Props) => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const session_id = currentUser?.session_id;
  const updated_by = currentUser?.id;

  // All classes fetched from the server
  const [classes, setClasses] = useState<ClassOption[]>([]);
  // Pre-selected classes in the multi-select
  const [selectedClasses, setSelectedClasses] = useState<
    { value: number; label: string }[]
  >([]);

  // Form state
  const [formData, setFormData] = useState<{
    circularTitle: string;
    circularDescription: string;
    startDate: string;
    endDate: string;
    createdFor: string;
    visibility: string;
    classes: string[]; // array of class IDs as strings
  }>({
    circularTitle: "",
    circularDescription: "",
    startDate: "",
    endDate: "",
    createdFor: "",
    visibility: "",
    classes: [],
  });

  // Track the circular's ID
  const [circularId, setCircularId] = useState<number>(0);

  // If the circular already has an attachment:
  const [existingDocumentUrl, setExistingDocumentUrl] = useState<string | null>(
    null
  );
  // Flag “true” if the user clicked “Remove” on the existing attachment
  const [removeExisting, setRemoveExisting] = useState<boolean>(false);

  // If the user picks a brand-new file from their local machine:
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Show a spinner and disable inputs while submitting
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Whenever `circularData` (props) changes, populate all fields:
  useEffect(() => {
    if (circularData) {
      // 1) Populate text & dropdown inputs
      const sd = circularData.start_date
        ? circularData.start_date.slice(0, 10)
        : "";
      const ed = circularData.end_date
        ? circularData.end_date.slice(0, 10)
        : "";

      setFormData({
        circularTitle: circularData.title || "",
        circularDescription: circularData.description || "",
        startDate: sd,
        endDate: ed,
        createdFor: circularData.created_for || "",
        visibility: circularData.visibility || "",
        classes: Array.isArray(circularData.classes)
          ? circularData.classes
          : (circularData.classes as unknown as string)?.split(",") ?? [],
      });
      setCircularId(circularData.id);

      // 2) Populate the existing attachment (if any):
      if (circularData.document_path) {
        setExistingDocumentUrl(circularData.document_path);
        setRemoveExisting(false);
      } else {
        setExistingDocumentUrl(null);
      }

      // 3) Map classes into the react-select format
      if (circularData.classes) {
        const clsIds = Array.isArray(circularData.classes)
          ? circularData.classes
          : (circularData.classes as unknown as string).split(",");
        const defaults = clsIds.map((cid) => {
          const found = classes.find((c) => String(c.class_id) === String(cid));
          return { value: Number(cid), label: found ? found.class : "" };
        });
        setSelectedClasses(defaults);
      } else {
        setSelectedClasses([]);
      }

      // 4) No new file picked yet:
      setSelectedFile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circularData, classes]);

  // Fetch the list of classes from our API so the dropdown can render
  useEffect(() => {
    const fetchClasses = async () => {
      if (!school_id || !session_id) return;
      try {
        const resp = await fetch(
          `${DOMAIN}/api/school/get-classes/${school_id}/${session_id}`
        );
        if (!resp.ok) throw new Error(`Status ${resp.status}`);
        const data = await resp.json();
        setClasses(data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, [school_id, session_id]);

  // Build classOptions for React-Select (“Select All” + each class)
  const classOptions = [
    { value: "all", label: "Select All" },
    ...classes.map((c) => ({ value: c.class_id, label: c.class })),
  ];

  const handleClassChange = (opts: any) => {
    if (Array.isArray(opts) && opts.some((o) => o.value === "all")) {
      const allOpts = classes.map((c) => ({ value: c.class_id, label: c.class }));
      setSelectedClasses(allOpts);
    } else {
      setSelectedClasses(opts || []);
    }
  };

  // Utility to re-format a JS date string into YYYY-MM-DD
  const formatDate = (s: string) => {
    const d = new Date(s);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "createdFor" && value !== "students") {
      // If they switch away from “students,” clear out any selected classes
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        classes: [],
      }));
      setSelectedClasses([]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // User picks a new file from their local machine:
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const allowed = ["application/pdf", "image/png", "image/jpeg"];
      if (!allowed.includes(file.type)) {
        toast.error("Only PDF or PNG/JPEG images are allowed.");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
      // Once they pick a brand-new file, we no longer show the old one
      setExistingDocumentUrl(null);
      setRemoveExisting(false);
    } else {
      setSelectedFile(null);
    }
  };

  // If the user clicks “Remove” on an existing attachment:
  const handleRemoveExisting = () => {
    setRemoveExisting(true);
    setExistingDocumentUrl(null);
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build a plain‐JS object of all fields + pick class IDs out of selectedClasses:
    const updated = {
      ...formData,
      classes: selectedClasses.map((o) => o.value),
    };

    const {
      circularTitle,
      circularDescription,
      startDate,
      endDate,
      createdFor,
      visibility,
    } = updated;

    // Basic required-field validation:
    if (
      !circularTitle ||
      !circularDescription ||
      !startDate ||
      !endDate ||
      !createdFor ||
      !visibility
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    if (createdFor === "students" && selectedClasses.length === 0) {
      alert("Please select at least one class.");
      return;
    }

    setIsSubmitting(true);

    // Reformat the dates for storage:
    const sDate = formatDate(startDate);
    const eDate = formatDate(endDate);

    try {
      if (selectedFile || removeExisting) {
        // ───── If either a brand-new file was picked, OR they clicked “Remove existing” ─────
        const formPayload = new FormData();
        formPayload.append("school_id", String(school_id));
        formPayload.append("session_id", String(session_id));
        formPayload.append("updated_by", String(updated_by));
        formPayload.append("circularTitle", circularTitle);
        formPayload.append("circularDescription", circularDescription);
        formPayload.append("startDate", sDate);
        formPayload.append("endDate", eDate);
        formPayload.append("createdFor", createdFor);
        formPayload.append("visibility", visibility);

        // If they clicked “Remove existing,” let the backend know
        if (removeExisting) {
          formPayload.append("removeDocument", "1");
        }

        // Only append “classes” if it’s for students
        if (updated.classes.length > 0) {
          formPayload.append("classes", JSON.stringify(updated.classes));
        }

        // If they did pick a brand-new file, append it now:
        if (selectedFile) {
          formPayload.append("attachment", selectedFile);
        }

        const resp = await fetch(
          `${DOMAIN}/api/student/update-circular/${school_id}/${session_id}/${circularId}/${updated_by}`,
          {
            method: "POST", // using POST for multipart/form-data
            body: formPayload,
          }
        );
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        console.log("Update (multipart) succeeded:", data);
        toast.success("Circular updated (including attachment).");
      } else {
        // ───── No file changes at all → send a simple PUT + JSON ─────
        const jsonPayload = {
          ...updated,
          startDate: sDate,
          endDate: eDate,
        };

        const resp = await fetch(
          `${DOMAIN}/api/student/update-circular/${school_id}/${session_id}/${circularId}/${updated_by}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonPayload),
          }
        );
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        console.log("Update (JSON) succeeded:", data);
        toast.success("Circular updated successfully.");
      }

      setRefresh(true);
      handleClose();
    } catch (err) {
      console.error("Error updating circular:", err);
      toast.error("Failed to update circular.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    // Reset form state
    setFormData({
      circularTitle: "",
      circularDescription: "",
      startDate: "",
      endDate: "",
      createdFor: "",
   
      visibility: "",
      classes: [],
    });
    setSelectedClasses([]);
    setExistingDocumentUrl(null);
    setRemoveExisting(false);
    setSelectedFile(null);
    setIsSubmitting(false);
    handleClose();
    setRefresh(true);
  };

  return createPortal(
    <Modal
      id="kt_modal_edit_circular"
      tabIndex={-1}
      size="lg"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-800px"
      show={show}
      onHide={handleCloseModal}
    >
      <div
        className="modal-header"
        style={{
          backgroundColor: "rgb(242, 246, 255)",
          borderBottom: "none",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <h2
          style={{
            color: "#1C335C",
            fontFamily: "Manrope, sans-serif",
            fontWeight: 600,
            margin: 0,
          }}
        >
          Edit Circular
        </h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleCloseModal}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>

      <div className="modal-body" style={{ backgroundColor: "#fff" }}>
        <Form onSubmit={handleSubmit} style={{ padding: "1rem 2rem" }}>
          {/* ─── Circular Title ─── */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="circular_title">
                <Form.Label>Circular Title</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="circularTitle"
                    placeholder="Enter Circular Title"
                    value={formData.circularTitle}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          {/* ─── Circular Description ─── */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="circular_description">
                <Form.Label>Circular Description</Form.Label>
                <ReactQuill
                  theme="snow"
                  value={formData.circularDescription}
                  onChange={(html) =>
                    setFormData((prev) => ({
                      ...prev,
                      circularDescription: html,
                    }))
                  }
                  style={{
                    height: "180px",
                    marginBottom: "1rem",
                  }}
                  modules={{
                    toolbar: [
                      ["bold", "italic", "underline", "strike"],
                      [{ header: 1 }, { header: 2 }],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ color: [] }, { background: [] }],
                      [{ align: [] }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "list",
                    "bullet",
                    "color",
                    "background",
                    "align",
                    "link",
                    "image",
                  ]}
                  readOnly={isSubmitting}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ─── Start / End Dates ─── */}
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
                    onChange={handleInputChange}
                    disabled={isSubmitting}
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
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          {/* ─── Designation & Visibility ─── */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="created_for">
                <Form.Label>Designation</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user-tag"></i>
                  </InputGroup.Text>
                  <Form.Select
                    name="createdFor"
                    value={formData.createdFor || ""}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Designation</option>
                    <option value="all">All</option>
                    <option value="staff">Staff</option>
                    <option value="students">Students</option>
                  </Form.Select>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={12} className="mt-3">
              <Form.Group controlId="visibility">
                <Form.Label>Visibility</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-eye"></i>
                  </InputGroup.Text>
                  <Form.Select
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Visibility</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </Form.Select>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          {/* ─── Select Classes (for students only) ─── */}
          {formData.createdFor === "students" && (
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="classes">
                  <Form.Label>Select Classes</Form.Label>
                  <Select
                    isMulti
                    options={classOptions}
                    value={selectedClasses}
                    onChange={handleClassChange}
                    placeholder="Select Classes"
                    isDisabled={isSubmitting}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          {/* ─── Is Event? ─── */}

          {/* ─── File Upload & Preview ─── */}
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="attachment">
                <Form.Label className="fw-bold">Attachment</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf, image/png, image/jpeg"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="mb-3"
                />
              </Form.Group>

              {/* ─── Preview Container ─── */}
              <div
                className="border rounded p-3"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <h6 className="mb-3 text-muted">Attachment Preview</h6>

                {/* Existing Attachment (if any, and not “removed” yet) */}
                {existingDocumentUrl && !removeExisting && (
                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 bg-white rounded">
                    <div className="d-flex align-items-center">
                      {/* If it’s a PDF, show the red “PDF” icon; otherwise show a generic file icon: */}
                      {existingDocumentUrl.toLowerCase().endsWith(".pdf") ? (
                        <div className="position-relative me-3">
                          <div
                            className="bg-danger text-white rounded-start p-2"
                            style={{ width: 50, height: 60 }}
                          >
                            <i className="bi bi-file-earmark-pdf fs-4"></i>
                          </div>
                          <div
                            className="position-absolute top-0 end-0 bg-white border rounded-circle p-1"
                            style={{ transform: "translate(50%, -50%)" }}
                          >
                            <i className="bi bi-filetype-pdf text-danger"></i>
                          </div>
                        </div>
                      ) : (
                        /* For non‐PDF files, you could show a generic “document” icon instead of <img> */
                        <div className="position-relative me-3">
                          <div
                            className="bg-secondary text-white rounded p-2"
                            style={{ width: 50, height: 60 }}
                          >
                            <i className="bi bi-file-earmark-text fs-4"></i>
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="fw-bold">
                          <a
                            href={`${DOMAIN}${encodeURI(existingDocumentUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            {existingDocumentUrl.split("/").pop()}
                          </a>
                        </div>
                        <div className="text-muted small">
                          Existing attachment
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={handleRemoveExisting}
                    >
                      <i className="bi bi-trash me-1"></i> Remove
                    </button>
                  </div>
                )}

                {/* Newly Selected File Preview */}
                {selectedFile && (
                  <div className="d-flex align-items-center justify-content-between p-2 bg-white rounded">
                    <div className="d-flex align-items-center">
                      {selectedFile.type === "application/pdf" ? (
                        <div className="position-relative me-3">
                          <div
                            className="bg-danger text-white rounded-start p-2"
                            style={{ width: 50, height: 60 }}
                          >
                            <i className="bi bi-file-earmark-pdf fs-4"></i>
                          </div>
                          <div
                            className="position-absolute top-0 end-0 bg-white border rounded-circle p-1"
                            style={{ transform: "translate(50%, -50%)" }}
                          >
                            <i className="bi bi-filetype-pdf text-danger"></i>
                          </div>
                        </div>
                      ) : (
                        <div className="position-relative me-3">
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="New attachment preview"
                            className="img-thumbnail"
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                            }}
                          />
                          <div
                            className="position-absolute top-0 end-0 bg-white border rounded-circle p-1"
                            style={{ transform: "translate(50%, -50%)" }}
                          >
                            <i className="bi bi-image text-primary"></i>
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="fw-bold">{selectedFile.name}</div>
                        <div className="text-success small">
                          New file to be uploaded
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setSelectedFile(null)}
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-x-lg me-1"></i> Cancel
                    </button>
                  </div>
                )}

                {/* Empty State */}
                {!existingDocumentUrl && !selectedFile && !removeExisting && (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-file-earmark-plus fs-1 mb-2"></i>
                    <p className="mb-0">No attachment selected</p>
                    <small>Upload a PDF or image file</small>
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* ─── Submit Button with Spinner ─── */}
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary d-flex align-items-center"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
              )}
              {isSubmitting ? "Saving..." : "Submit"}
            </button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateEditCircular };
