import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import {
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
  Table,
  Button,
  Card,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { BookOpen, Calendar, Save, Send, Users } from "lucide-react";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: (val: boolean) => void;
};

interface ClassItem {
  class_id: number;
  class: string;
}

interface Section {
  section_id: number;
  section: string;
}

interface TimetableSubject {
  id: any;
  subject_id: number;
  subjectName: string;
}

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const defaultDate = `${yyyy}-${mm}-${dd}`;

const AddDailyLog = ({ show, handleClose, setRefresh }: Props) => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id!;
  const session_id = currentUser?.session_id!;
  const created_by = currentUser?.id!;

  // ── State for classes and sections ──
  const [getClass, setClass] = useState<ClassItem[]>([]);
  const [getSection, setSection] = useState<Section[]>([]);

  // ── Selected class and section (strings) ──
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [formattedLogDate, setFormattedLogDate] = useState("");
  const [weekdayName, setWeekdayName] = useState("");

  // ── formData holds only the fields needed for Daily Log ──
  const [formData, setFormData] = useState<{
    logDate: string;
    document: File | null;
    rows: Array<{
      srNo: number;
      subject: string;
      classwork: string;
      homework: string;
    }>;
  }>({
    logDate: defaultDate,
    document: null,
    rows: [],
  });

  // right below your defaultDate definition
  useEffect(() => {
    if (show) {
      // Modal just opened
      setFormData({ logDate: defaultDate, document: null, rows: [] });
      setClass([]); // clear any old classes
      setSection([]); // clear sections too
    }
  }, [show]);

  // 1) Fetch class list on mount
  useEffect(() => {
    if (!show || !school_id || !session_id || !formData.logDate) {
      return;
    }

    async function fetchClasses() {
      ``;
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-logwise-classes` +
            `?school_id=${school_id}` +
            `&session_id=${session_id}` +
            `&date=${encodeURIComponent(formData.logDate)}`
        );
        if (!response.ok) throw new Error("Failed to fetch classes");
        const data: ClassItem[] = await response.json();
        console.log(data);

        setClass(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    }
    fetchClasses();
  }, [show, school_id, session_id, formData.logDate]);

  // 2) Fetch sections when selectedClass changes
  useEffect(() => {
    async function fetchSections() {
      if (!selectedClass) {
        setSection([]);
        return;
      }
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-classwise-section/${selectedClass}/${school_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch sections");
        const data: Section[] = await response.json();
        setSection(data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    }
    fetchSections();
  }, [selectedClass, school_id]);

  // 3) Fetch subjects for the timetable table when both class & section are selected
  useEffect(() => {
    async function fetchTimeTableSubjects() {
      if (!selectedClass || !selectedSection) {
        setFormData((prev) => ({ ...prev, rows: [] }));
        return;
      }

      try {
        const classIdNum = Number(selectedClass);
        const sectionIdNum = Number(selectedSection);
        const logDate = formData.logDate;

        const resp = await fetch(
          `${DOMAIN}/api/school/time-table-subject?class_id=${classIdNum}` +
            `&section_id=${sectionIdNum}` +
            `&school_id=${school_id}&session_id=${session_id}` +
            `&date=${encodeURIComponent(logDate)}`
        );
        if (!resp.ok) throw new Error("Failed to fetch timetable subjects");
        const data: TimetableSubject[] = await resp.json();
        console.log(data);

        // Build rows: Sr.No increments, subject from data, blank classwork/homework
        const newRows = data.map((item, idx) => ({
          srNo: idx + 1,
          id: item.id,
          subjectId: item.subject_id, // keep the numeric ID in case you need it later
          subject: item.subjectName, // display name
          classwork: "",
          homework: "",
        }));
        setFormData((prev) => ({ ...prev, rows: newRows }));

        setFormData((prev) => ({ ...prev, rows: newRows }));
      } catch (error) {
        console.error("Error fetching timetable subjects:", error);
        setFormData((prev) => ({ ...prev, rows: [] }));
      }
    }

    fetchTimeTableSubjects();
  }, [selectedClass, selectedSection, school_id, session_id]);

  // ── Handler: when class dropdown changes ──
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classIdStr = e.target.value; // a string
    setSelectedClass(classIdStr);
    setSelectedSection(""); // clear section when class changes
    setFormData((prev) => ({ ...prev, rows: [] })); // clear rows
  };

  // ── Handler: when section single-select changes ──
  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const raw = e.target.value;
    setSelectedSection(raw === "" ? null : Number(raw));
  };

  // ── Handler: log date change ──
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, logDate: e.target.value }));
  };

  // ── Handler: file upload ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, document: file }));
  };

  // ── Handler: when a user edits classwork or homework in the table ──
  const handleCellChange = (
    rowIndex: number,
    field: "classwork" | "homework",
    value: string
  ) => {
    const updatedRows = [...formData.rows];
    updatedRows[rowIndex][field] = value;
    setFormData((prev) => ({ ...prev, rows: updatedRows }));
  };

  // ── Format date as yyyy-mm-dd ──
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // ── Submit handler ──
  const doSubmit = async (isApproved: 0 | 1) => {
    // Validation
    if (!formData.logDate) {
      toast.error("Please select a Log Date.");
      return;
    }
    if (!selectedClass) {
      toast.error("Please select a Class.");
      return;
    }
    if (!selectedSection) {
      toast.error("Please select a Section.");
      return;
    }
    if (formData.rows.length === 0) {
      toast.error(
        "No timetable subjects found for the selected Class & Section."
      );
      return;
    }

    // Build payload
    const payload = {
      school_id: school_id,
      session_id: session_id,
      created_by: created_by,
      logDate: formData.logDate,
      classId: Number(selectedClass),
      sectionId: Number(selectedSection), // handle file separately if needed
      isApproved,
      entries: formData.rows.map((r) => ({
        subject: r.subject,
        classwork: r.classwork,
        homework: r.homework,
      })),
    };

    const hasFile = !!formData.document;
    let response;
    try {
      if (hasFile) {
        const formPayload = new FormData();
        formPayload.append("school_id", payload.school_id.toString());
        formPayload.append("session_id", payload.session_id.toString());
        formPayload.append("created_by", payload.created_by.toString());
        formPayload.append("logDate", payload.logDate);
        formPayload.append("classId", payload.classId.toString());
        formPayload.append("sectionId", payload.sectionId.toString());
        formPayload.append("document", formData.document as Blob);

        payload.entries.forEach((entry, idx) => {
          formPayload.append(`entries[${idx}][subject]`, entry.subject);
          formPayload.append(`entries[${idx}][classwork]`, entry.classwork);
          formPayload.append(`entries[${idx}][homework]`, entry.homework);
        });

        response = await fetch(
          `${DOMAIN}/api/student/add-dailylog-with-file/${payload.school_id}/${payload.session_id}/${payload.created_by}`,
          {
            method: "POST",
            body: formPayload,
          }
        );
      } else {
        response = await fetch(
          `${DOMAIN}/api/student/add-dailylog/${payload.school_id}/${payload.session_id}/${payload.created_by}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      }

      if (!response.ok) throw new Error("Network response was not ok");
      await response.json();
      toast.success("Daily Log saved successfully!");

      // Reset everything
      setFormData({ logDate: "", document: null, rows: [] });
      setSelectedClass("");
      setSelectedSection("");
      setSection([]);
      setRefresh(true);
      handleClose();
    } catch (error) {
      console.error("Error saving daily log:", error);
      toast.error("Failed to save. Please try again.");
    }
  };

  // ── Close modal & reset ──
  const handleCloseModal = () => {
    setFormData({ logDate: "", document: null, rows: [] });
    setSelectedClass("");
    setSelectedSection("");
    setSection([]);
    setClass([]);
    setSection([]);
    handleClose();
  };

  // Build the <option>s for the section dropdown
  const sectionOptions = getSection.map((sec) => (
    <option key={sec.id} value={sec.id.toString()}>
      {sec.section}
    </option>
  ));

  useEffect(() => {
    if (!formData.logDate) {
      setFormattedLogDate("");
      setWeekdayName("");
      return;
    }
    const dt = new Date(formData.logDate);
    // Format “1 Jun 2025”
    const opts = { year: "numeric", month: "short", day: "numeric" };
    setFormattedLogDate(dt.toLocaleDateString(undefined, opts));
    // Get full weekday name
    setWeekdayName(dt.toLocaleDateString(undefined, { weekday: "long" }));
  }, [formData.logDate]);

  const today = new Date();
  const options = { year: "numeric", month: "short", day: "numeric" };
  const dateStr = today.toLocaleDateString(undefined, options);
  const weekday = today.toLocaleDateString(undefined, { weekday: "long" });

  return (
    <Modal show={show} onHide={handleCloseModal} size="xl" centered>
      <Modal.Header closeButton className="bg-light border-0">
        <Modal.Title className="d-flex align-items-center">
          <div className="bg-primary rounded-3 p-2 me-3">
            <BookOpen className="text-white" size={20} />
          </div>
          <span className="fw-bold">Add Daily Log</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* Form Controls */}
        <Row className="mb-4">
          {/* Log Date */}
          <Col md={4} className="mb-3">
            <Form.Group>
              <Form.Label className="fw-semibold text-dark">
                Log Date
              </Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <Calendar size={16} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="date"
                  value={formData.logDate}
                  onChange={handleDateChange}
                  className="border-start-0"
                  required
                />
              </InputGroup>
            </Form.Group>
          </Col>

          {/* Select Class */}
          <Col md={4} className="mb-3">
            <Form.Group>
              <Form.Label className="fw-semibold text-dark">
                Select Class
              </Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <Users size={16} className="text-muted" />
                </InputGroup.Text>
                <Form.Select
                  value={selectedClass}
                  onChange={handleClassChange}
                  className="border-start-0"
                  required
                >
                  <option value="">-- Select Class --</option>
                  {getClass.map((cls) => (
                    <option
                      key={cls.id}
                      value={cls.id}
                      disabled={cls.already_logged === 1}
                    >
                      {cls.class}
                      {cls.already_logged === 1 ? " (Already logged)" : ""}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Form.Group>
          </Col>

          {/* Select Section */}
          <Col md={4} className="mb-3">
            <Form.Group>
              <Form.Label className="fw-semibold text-dark">
                Select Section
              </Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <BookOpen size={16} className="text-muted" />
                </InputGroup.Text>
                <Form.Select
                  value={selectedSection}
                  onChange={handleSectionChange}
                  disabled={!selectedClass}
                  className="border-start-0"
                  required
                >
                  <option value="">-- Select Section --</option>
                  {getSection.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.section}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        {/* Date Display */}
        {formattedLogDate && (
          <div className="text-center mb-4">
            <Card className="d-inline-block bg-primary text-white border-0 shadow-sm">
              <Card.Body className="py-2 px-4">
                <div className="d-flex align-items-center">
                  <Calendar size={18} className="me-2" />
                  <span className="fw-bold">
                    Daily Log – {formattedLogDate} ({weekdayName})
                  </span>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        {/* Table */}
        <Card className="border shadow-sm">
          <Card.Body className="p-0">
            <div
              style={{
                maxHeight: formData.rows.length === 0 ? "auto" : "350px",
                overflowY: formData.rows.length === 0 ? "visible" : "auto",
                overflowX: formData.rows.length === 0 ? "auto" : "auto",
                width: "100%", // Ensure container takes full width
              }}
            >
              <Table
                hover
                className="mb-0"
                style={{
                  border: "1px solid #dee2e6",
                  minWidth: formData.rows.length === 0 ? "auto" : "100%", // Use 100% instead of fixed width
                  width: "100%",
                }}
              >
                <thead className="bg-light sticky-top">
                  <tr>
                    <th
                      className="fw-semibold text-dark border-end"
                      style={{
                        width: "15%",
                        minWidth: "80px",
                        padding: "12px 16px",
                      }}
                    >
                      Sr. No
                    </th>
                    <th
                      className="fw-semibold text-dark border-end"
                      style={{
                        width: "20%",
                        minWidth: "100px",
                        padding: "12px 16px",
                      }}
                    >
                      Subject
                    </th>
                    <th
                      className="fw-semibold text-dark border-end"
                      style={{
                        width: "32.5%",
                        minWidth: "200px",
                        padding: "12px 16px",
                      }}
                    >
                      Classwork
                    </th>
                    <th
                      className="fw-semibold text-dark"
                      style={{
                        width: "32.5%",
                        minWidth: "200px",
                        padding: "12px 16px",
                      }}
                    >
                        Assignment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.rows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-5 border-0">
                        <div className="d-flex flex-column align-items-center">
                          <BookOpen size={48} className="text-muted mb-3" />
                          <h5 className="text-muted mb-2">
                            No subjects available
                          </h5>
                          <p className="text-muted small mb-0">
                            Select class & section above to load today's
                            subjects
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    formData.rows.map((row, idx) => (
                      <tr key={idx}>
                        <td
                          className="text-center fw-semibold align-middle border-end"
                          style={{
                            padding: "12px 16px",
                            verticalAlign: "top",
                          }}
                        >
                          {row.srNo}
                        </td>
                        <td
                          className="fw-semibold border-end"
                          style={{
                            padding: "12px 16px",
                            verticalAlign: "top",
                          }}
                        >
                          {row.subject}
                        </td>
                        <td
                          className="border-end"
                          style={{
                            padding: "12px 16px",
                            verticalAlign: "top",
                          }}
                        >
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter classwork…"
                            value={row.classwork}
                            onChange={(e) =>
                              handleCellChange(idx, "classwork", e.target.value)
                            }
                            style={{
                              minHeight: "80px",
                              maxHeight: "120px",
                              overflowY: "hidden", // Hide scrollbar initially
                              resize: "none",
                              border: "1px solid #dee2e6",
                              borderRadius: "4px",
                              padding: "8px 12px",
                              fontSize: "14px",
                              lineHeight: "1.4",
                              transition:
                                "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                            }}
                            onInput={(e) => {
                              // Auto-resize and show scrollbar only when needed
                              e.target.style.height = "auto";
                              e.target.style.height =
                                Math.min(e.target.scrollHeight, 120) + "px";
                              e.target.style.overflowY =
                                e.target.scrollHeight > 120 ? "auto" : "hidden";
                            }}
                          />
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            verticalAlign: "top",
                          }}
                        >
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter homework…"
                            value={row.homework}
                            onChange={(e) =>
                              handleCellChange(idx, "homework", e.target.value)
                            }
                            style={{
                              minHeight: "80px",
                              maxHeight: "120px",
                              overflowY: "hidden", // Hide scrollbar initially
                              resize: "none",
                              border: "1px solid #dee2e6",
                              borderRadius: "4px",
                              padding: "8px 12px",
                              fontSize: "14px",
                              lineHeight: "1.4",
                              transition:
                                "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                            }}
                            onInput={(e) => {
                              // Auto-resize and show scrollbar only when needed
                              e.target.style.height = "auto";
                              e.target.style.height =
                                Math.min(e.target.scrollHeight, 120) + "px";
                              e.target.style.overflowY =
                                e.target.scrollHeight > 120 ? "auto" : "hidden";
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button
          variant="light"
          onClick={() => doSubmit(0)}
          disabled={!formData.logDate || !selectedClass || !selectedSection}
          className="me-2"
        >
          <Save size={16} className="me-2 border-1 border-black" />
          Save
        </Button>
        <Button
          variant="primary"
          onClick={() => doSubmit(1)}
          disabled={!formData.logDate || !selectedClass || !selectedSection}
        >
          <Send size={16} className="me-2" />
          Save & Publish
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { AddDailyLog };
