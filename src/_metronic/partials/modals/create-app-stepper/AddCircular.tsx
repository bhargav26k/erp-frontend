import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
};

interface ClassOption {
  class_id: any;
  id: number;
  class: string;
}

const modalsRoot = document.getElementById("root-modals") || document.body;

const todayYMD = () => new Date().toISOString().split("T")[0];

const AddCircular = ({ show, handleClose, setRefresh }: Props) => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const session_id = currentUser?.session_id;
  const created_by = currentUser?.id;

  // ── formData state ──
  const [formData, setFormData] = useState<{
    circularTitle: string;
    circularDescription: string;
    startDate: string;
    endDate: string;
    createdFor: string;
    visibility: string;
    classes: string[];
  }>({
    circularTitle: "",
    circularDescription: "",
    startDate: todayYMD(),
    endDate: todayYMD(),
    createdFor: "all",
    visibility: "private",
    classes: [],
  });

  // ── File state ──
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // ── Classes from server ──
  const [classes, setClasses] = useState<ClassOption[]>([]);

  // ── Selected classes (multi) ──
  const [selectedClasses, setSelectedClasses] = useState<
    { value: any; label: string }[]
  >([]);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!school_id || !session_id) return;
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-classes/${school_id}/${session_id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, [school_id, session_id]);

  // ── Build React-Select options ──
  const classOptions = [
    { value: "all", label: "Select All" },
    ...classes.map((cls) => ({
      value: cls.class_id,
      label: cls.class,
    })),
  ];

  // ── Handle multi-select classes ──
  const handleClassChange = (options: Array<{ value: any; label: string }>) => {
    if (!options || options.length === 0) {
      setSelectedClasses([]);
      return;
    }
    const hasAll = options.some((opt) => opt.value === "all");
    const newSelected = hasAll
      ? classOptions.filter((opt) => opt.value !== "all")
      : options;
    setSelectedClasses(newSelected);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    if (name === "createdFor" && value !== "students") {
      // Reset classes if not “students”
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

  // ── Handle file selection ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validTypes = ["application/pdf", "image/png", "image/jpeg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only PDF or PNG/JPEG images are allowed.");
        e.target.value = "";
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("circularTitle", formData.circularTitle);
    payload.append("circularDescription", formData.circularDescription);
    payload.append("startDate", formatDate(formData.startDate));
    payload.append("endDate", formatDate(formData.endDate));
    payload.append("createdFor", formData.createdFor);
    payload.append("visibility", formData.visibility);
    payload.append(
      "publish_date",
      formData.visibility === "public" ? todayYMD() : ""
    );

    if (formData.createdFor === "students") {
      if (selectedClasses.length === 0) {
        alert("Please select at least one class.");
        return;
      }
      selectedClasses.forEach((opt) => {
        payload.append("classes[]", opt.value.toString());
      });
    }

    if (selectedFile) {
      payload.append("attachment", selectedFile);
    }

    const {
      circularTitle,
      circularDescription,
      startDate,
      endDate,
      createdFor,
      visibility,
    } = formData;

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

    try {
      const response = await fetch(
        `${DOMAIN}/api/student/add-circular/${school_id}/${session_id}/${created_by}`,
        {
          method: "POST",
          body: payload,
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log("Form submitted successfully!", result);

      setFormData({
        circularTitle: "",
        circularDescription: "",
        startDate: todayYMD(),
        endDate: todayYMD(),
        createdFor: "",
        visibility: "",
        classes: [],
      });
      setSelectedClasses([]);
      setSelectedFile(null);
      setRefresh(true);
      handleClose();
      toast.success("Circular Saved Successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save circular.");
    }
  };

  const handleCloseModal = () => {
    setFormData({
      circularTitle: "",
      circularDescription: "",
      startDate: todayYMD(),
      endDate: todayYMD(),
      createdFor: "",
      visibility: "",
      classes: [],
    });
    setSelectedClasses([]);
    setSelectedFile(null);
    handleClose();
    setRefresh(true);
  };

  return createPortal(
    <Modal
      id="kt_modal_create_app"
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
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
        }}
      >
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0.5rem",
            fontFamily: "Manrope",
            fontSize: "22px",
            fontWeight: "600",
          }}
        >
          Add Circular
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
          {/* ───── Circular Title ───── */}
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="circular_title">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  <i
                    className="fas fa-user"
                    style={{ marginRight: "0.5rem", color: "#6c757d" }}
                  />
                  <Form.Label className="mb-0">Circular Title</Form.Label>
                </div>
                <Form.Control
                  type="text"
                  name="circularTitle"
                  placeholder="Enter Circular Title"
                  value={formData.circularTitle}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ───── Circular Description (Rich Text) ───── */}
          <Row className="mb-15">
            <Col md={12}>
              <Form.Group controlId="circular_description">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  <i
                    className="fas fa-file-alt"
                    style={{ marginRight: "0.5rem", color: "#6c757d" }}
                  />
                  <Form.Label className="mb-0">Circular Description</Form.Label>
                </div>
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
                    height: "220px",
                    marginBottom: "1rem",
                    backgroundColor: "#fff",
                  }}
                  modules={{
                    toolbar: [
                      ["bold", "italic", "underline", "strike"],
                      [{ header: 1 }, { header: 2 }],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ color: [] }, { background: [] }],
                      [{ align: [] }],
                      ["link"],
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
                    "align",
                    "link",
                  ]}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ───── Start / End Dates ───── */}
          <Row className="mb-4">
            <Col xs={12} md={6}>
              <Form.Group controlId="start_date">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  <i
                    className="fas fa-calendar-alt"
                    style={{ marginRight: "0.5rem", color: "#6c757d" }}
                  />
                  <Form.Label className="mb-0">Start Date</Form.Label>
                </div>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6} className="mt-3 mt-md-0">
              <Form.Group controlId="end_date">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  <i
                    className="fas fa-calendar-alt"
                    style={{ marginRight: "0.5rem", color: "#6c757d" }}
                  />
                  <Form.Label className="mb-0">End Date</Form.Label>
                </div>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ───── Designation & Visibility ───── */}
          <Row className="mb-4">
            <Col xs={12} md={6}>
              <Form.Group controlId="created_for">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  <i
                    className="fas fa-user-tag"
                    style={{ marginRight: "0.5rem", color: "#6c757d" }}
                  />
                  <Form.Label className="mb-0">Designation</Form.Label>
                </div>
                <Form.Select
                  name="createdFor"
                  value={formData.createdFor || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select Designation</option>
                  <option value="all">All</option>
                  <option value="staff">Staff</option>
                  <option value="students">Students</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={12} md={6} className="mt-3 mt-md-0">
              <Form.Group controlId="visibility">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  <i
                    className="fas fa-eye"
                    style={{ marginRight: "0.5rem", color: "#6c757d" }}
                  />
                  <Form.Label className="mb-0">Visibility</Form.Label>
                </div>
                <Form.Select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                >
                  <option value="">Select Visibility</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {formData.createdFor === "students" && (
            <Row className="mb-4">
              <Col md={12}>
                <Form.Group controlId="classes">
                  <Form.Label>Select Classes</Form.Label>
                  <Select
                    isMulti
                    options={classOptions}
                    value={selectedClasses}
                    onChange={(opts) => handleClassChange(opts as any)}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    placeholder="Select Classes"
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="attachment">
                <Form.Label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  <i
                    className="fas fa-file-upload"
                    style={{ marginRight: "0.5rem", color: "#6c757d" }}
                  />
                  Upload Attachment (PDF / Image)
                </Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf, image/png, image/jpeg"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <div style={{ marginTop: "0.5rem", fontSize: "13px" }}>
                    Selected: {selectedFile.name}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* ───── Submit Button ───── */}
          <Row>
            <Col className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary px-4 py-2">
                Submit
              </button>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { AddCircular };
