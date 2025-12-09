import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
import { BookOpen, Calendar, Save, Send } from "lucide-react";

type EditBucket = {
  class_id: number;
  section_id: number;
  log_date: string; // "YYYY-MM-DD"
  class_name: string; // e.g. "5"
  section_name: string; // e.g. "A"
  entries: Array<{
    id: number; // daily_log.id (primary key)
    subject_id: number;
    subject_name: string;
    class_work: string;
    home_work: string;
    // …other fields if needed
  }>;
};

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: (val: boolean) => void;
  bucketData: EditBucket | null;
  readOnly: boolean;
};

interface ClassItem {
  class_id: number;
  class: string;
}

interface Section {
  section_id: number;
  section: string;
}

const CreateEditDailyLog = ({
  show,
  handleClose,
  setRefresh,
  bucketData,
  readOnly = false,
}: Props) => {

  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const session_id = currentUser?.session_id;
  const staff_id = currentUser?.id;
  const isTeacher = currentUser?.designation.toLowerCase() === "teacher";

  // ── State for the “Class” and “Section” dropdowns ──
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [sections, setSections] = useState<Section[]>([]);

  // ── Selected class & section ──
  const [selectedClass, setSelectedClass] = useState<string>(""); // e.g. "5"
  const [selectedSection, setSelectedSection] = useState<string>(""); // e.g. "A"

  // ── Preformatted display of logDate & weekday ──
  const [formattedLogDate, setFormattedLogDate] = useState<string>(""); // "1 Jun 2025"
  const [weekdayName, setWeekdayName] = useState<string>(""); // "Monday"

  // ── formData: date + rows[] (subject/classwork/homework) ──
  const [formData, setFormData] = useState<{
    logDate: string; // "YYYY-MM-DD"
    rows: Array<{
      entryId: number; // daily_log.id, so we know which DB row to update
      subjectId: number; // subject_id
      subjectName: string;
      classwork: string;
      homework: string;
    }>;
  }>({
    logDate: "",
    rows: [],
  });

  // ── 1) Fetch all classes on mount ──
  useEffect(() => {
    if (!school_id || !session_id) return;
    const fetchClasses = async () => {
      try {
        const res = await fetch(
          `${DOMAIN}/api/school/get-onlyclasses/${school_id}/${session_id}`
        );
        if (!res.ok) throw new Error("Failed to fetch classes");
        const data: ClassItem[] = await res.json();
        setClasses(data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, [school_id, session_id]);

  // ── 2) Whenever selectedClass changes, fetch its sections ──
  useEffect(() => {
    if (!selectedClass) {
      setSections([]);
      return;
    }
    const fetchSections = async () => {
      try {
        const res = await fetch(
          `${DOMAIN}/api/school/get-classwise-section/${selectedClass}/${school_id}`
        );
        if (!res.ok) throw new Error("Failed to fetch sections");
        const data: Section[] = await res.json();
        setSections(data);
      } catch (err) {
        console.error("Error fetching sections:", err);
      }
    };
    fetchSections();
  }, [selectedClass, school_id]);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };
  // ── 3) Pre‐fill everything when bucketData changes ──
  useEffect(() => {
    if (!bucketData) {
      // If null (modal was closed or in “create new”), reset
      setSelectedClass("");
      setSelectedSection("");
      setFormData({ logDate: "", rows: [] });
      setFormattedLogDate("");
      setWeekdayName("");
      return;
    }

    // 3a) Preselect class & section
    setSelectedClass(bucketData.class_id.toString());
    setSelectedSection(bucketData.section_id.toString());

    // 3b) Pre‐fill logDate
    setFormData((prev) => ({
      ...prev,
      logDate: formatDate(bucketData.log_date),
    }));

    // 3c) Pre‐populate rows[] from bucketData.entries
    const preRows = bucketData.entries.map((e, idx) => ({
      srNo: idx + 1,
      entryId: e.id,
      subjectId: e.subject_id,
      subjectName: e.subject_name,
      classwork: e.class_work,
      homework: e.home_work,
    }));
    setFormData((prev) => ({ ...prev, rows: preRows }));

    // 3d) Format date for display (“1 Jun 2025” etc.)
    const dt = new Date(bucketData.log_date);
    const opts: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    setFormattedLogDate(dt.toLocaleDateString(undefined, opts));
    setWeekdayName(dt.toLocaleDateString(undefined, { weekday: "long" }));
  }, [bucketData]);

  // ── Handler: user edits a classwork/homework cell ──
  const handleCellChange = (
    rowIndex: number,
    field: "classwork" | "homework",
    value: string
  ) => {
    const updated = [...formData.rows];
    updated[rowIndex][field] = value;
    setFormData((prev) => ({ ...prev, rows: updated }));
  };

  // ── Format date as “YYYY-MM-DD” ──

  // ── Submit handler: send a PUT to update all entries in this bucket ──
  const doUpdate = async (isApproved: 0 | 1) => {
    if (!bucketData) {
      toast.error("No bucket selected to edit");
      return;
    }

    // Basic validation
    if (!formData.logDate) {
      toast.error("Log Date is required");
      return;
    }
    if (!selectedClass) {
      toast.error("Please choose a class");
      return;
    }
    if (!selectedSection) {
      toast.error("Please choose a section");
      return;
    }
    if (!formData.rows.length) {
      toast.error("No subjects to update");
      return;
    }

    // If “Save & Publish”, send all rows; else filter only changed rows
    let payloadEntries: Array<{
      entryId: number;
      classwork: string;
      homework: string;
    }>;

    if (isApproved === 1) {
      // Include every row to flip is_approved = 1 on all
      payloadEntries = formData.rows.map((r) => ({
        entryId: r.entryId,
        classwork: r.classwork,
        homework: r.homework,
      }));
    } else {
      // Only changed rows
      payloadEntries = formData.rows
        .filter((row, idx) => {
          const orig = bucketData.entries[idx];
          return (
            row.classwork !== (orig.class_work || "") ||
            row.homework !== (orig.home_work || "")
          );
        })
        .map((r) => ({
          entryId: r.entryId,
          classwork: r.classwork,
          homework: r.homework,
        }));

      if (payloadEntries.length === 0) {
        toast.info("No changes detected");
        return;
      }
    }

    const payload = {
      school_id,
      session_id,
      staff_id,
      classId: bucketData.class_id,
      sectionId: bucketData.section_id,
      logDate: formatDate(bucketData.log_date), // unchanged
      isApproved,
      entries: payloadEntries,
    };

    try {
      const resp = await fetch(
        `${DOMAIN}/api/student/update-dailylog/${payload.school_id}/${payload.session_id}/${payload.staff_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!resp.ok) throw new Error("Network response was not ok");
      await resp.json();
      toast.success("Daily Log updated successfully");
      setRefresh(true);
      handleClose();
    } catch (err) {
      console.error("Error updating daily log:", err);
      toast.error("Failed to update. Try again.");
    }
  };
  // ── Close modal & reset ──
  const handleCloseModal = () => {
    setFormData({ logDate: "", rows: [] });
    setSelectedClass("");
    setSelectedSection("");
    setSections([]);
    handleClose();
  };

  // ── Build <option> tags for “Section” dropdown ──
  const sectionOptions = sections.map((sec) => (
    <option key={sec.id} value={sec.id.toString()}>
      {sec.section}
    </option>
  ));

  return (
    <Modal show={show} onHide={handleCloseModal} size="xl" centered>
      {/* --- Header --- */}
      <Modal.Header closeButton className="bg-light border-0">
        <Modal.Title className="d-flex align-items-center">
          <div className="bg-primary rounded-3 p-2 me-3">
            <BookOpen className="text-white" size={20} />
          </div>
          {readOnly ? (
            <span className="fw-bold">View Log</span>
          ) : (
            <span className="fw-bold">Edit Log</span>
          )}
        </Modal.Title>
      </Modal.Header>

      {/* --- Body --- */}
      <Modal.Body className="p-4">
        {/* Row 1: Log Date, Class, Section */}
        <Row className="mb-3">
          {/* Log Date */}
          <Col md={4}>
            <Form.Group controlId="logDate">
              <Form.Label
                style={{
                  color: "#1C335C",
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Log Date
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-calendar-alt"></i>
                </InputGroup.Text>
                <Form.Control
                  type="date"
                  name="logDate"
                  value={formData.logDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      logDate: e.target.value,
                    }))
                  }
                  disabled={readOnly}
                  style={{
                    color: "#1C335C",
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                  required
                />
              </InputGroup>
            </Form.Group>
          </Col>

          {/* Class Dropdown */}
          <Col md={4} className="mb-3">
            <Form.Group controlId="classSelect">
              <Form.Label
                style={{
                  color: "#1C335C",
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Select Class
              </Form.Label>
              <Form.Select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedSection("");
                  setFormData((prev) => ({ ...prev, rows: [] }));
                }}
                style={{
                  color: "#1C335C",
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
                disabled={readOnly}
                required
              >
                <option value="">-- Select Class --</option>
                {classes.map((cls) => (
                  <option key={cls.class_id} value={cls.class_id.toString()}>
                    {cls.class}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Section Dropdown */}
          <Col md={4}>
            <Form.Group controlId="sectionSelect">
              <Form.Label
                style={{
                  color: "#1C335C",
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Select Section
              </Form.Label>
              <Form.Select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                disabled={!selectedClass}
                style={{
                  color: "#1C335C",
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
                disabled={readOnly}
                required
              >
                <option value="">-- Select Section --</option>
                {sectionOptions}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Display the formatted date + weekday */}
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

        {/* Row 2: Enhanced Timetable Table */}
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
                      <tr key={idx} className="align-top">
                        <td
                          className="text-center fw-semibold align-middle border-end"
                          style={{
                            padding: "12px 16px",
                            verticalAlign: "top",
                          }}
                        >
                          {idx + 1}
                        </td>
                        <td
                          className="fw-semibold border-end"
                          style={{
                            padding: "12px 16px",
                            verticalAlign: "top",
                          }}
                        >
                          {row.subjectName}
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
                            readOnly={readOnly}
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
                            readOnly={readOnly}
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

        {/* Submit Button */}
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Col className="text-end">
          {bucketData?.is_approved === 0 && (
            <Button
              variant="light"
              className="me-2"
              onClick={() => doUpdate(0)}
              disabled={
                !formData.logDate ||
                !selectedClass ||
                !selectedSection ||
                readOnly
              }
              style={{
                fontFamily: "Manrope, sans-serif",
                fontWeight: 600,
                padding: "8px 24px",
                borderRadius: "6px",
              }}
            >
              <Save size={16} className="me-2 border-1 border-black" /> Save
              Draft
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => doUpdate(1)}
            disabled={
              !formData.logDate ||
              !selectedClass ||
              !selectedSection ||
              isTeacher  ||
              readOnly
            }
            style={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 600,
              padding: "8px 24px",
              borderRadius: "6px",
              backgroundColor: "#4F8EF7",
              borderColor: "#4F8EF7",
            }}
          >
            <Send size={16} className="me-2" /> Save & Publish
          </Button>
        </Col>
      </Modal.Footer>
    </Modal>
  );
};

export { CreateEditDailyLog };
