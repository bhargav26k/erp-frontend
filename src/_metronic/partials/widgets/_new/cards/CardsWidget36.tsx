import { FC, useState, useEffect, useCallback } from "react";
import {
  Tabs,
  Tab,
  Table,
  Button,
  Modal,
  Spinner,
  ToastContainer,
} from "react-bootstrap";
import { DOMAIN } from "../../../../../app/routing/ApiEndpoints";
import { useAuth } from "../../../../../app/modules/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SchoolEventsCalendar.css";

interface TimetableEntry {
  subject_group_subject_id: number;
  daysOfWeek: number[];
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  room: string;
  staffId: number;
  subjectName: string; // used only for display if needed
  id: number;
  isNew?: boolean; // Flag to track new rows
  day?: string;
  class_id?: number | null;
  section_id?: number | null;
  session_id?: number | null;
}

interface Schedule {
  [key: string]: TimetableEntry[];
}

const CardsWidget36: FC<{
  classId: number | null;
  sectionId: number | null;
}> = ({ classId, sectionId }) => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const session_id = currentUser?.session_id;

  const [selectedDay, setSelectedDay] = useState("Monday");
  const [schedule, setSchedule] = useState<Schedule>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  // Tracks edited / new rows
  const [updatedEntries, setUpdatedEntries] = useState<TimetableEntry[]>([]);

  // Delete confirmation modal state
  const [deletedIndex, setDeletedIndex] = useState<number | null>(null);
  const [deletedEntry, setDeletedEntry] = useState<TimetableEntry | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Loading flags
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lists fetched from server
  type Teacher = { id: number; name: string };
  type SubjectGroup = { id: number; name: string };
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<SubjectGroup[]>([]);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const getDayName = (dayNumber: number) => days[dayNumber - 1];

  // Whether there are unsaved changes:
  const hasUnsavedChanges = updatedEntries.length > 0;

  // ─── 1) Warn on page reload/close if there are unsaved changes ───
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Standard text is ignored by most browsers, but setting returnValue is required
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    if (hasUnsavedChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [hasUnsavedChanges]);

  // ─── 2) Fetch teachers & subjects whenever classId / sectionId changes ───
  useEffect(() => {
    const fetchTeachersAndSubjects = async () => {
      try {
        // 2A) Fetch teachers
        const teacherResponse = await fetch(
          `${DOMAIN}/api/school/get-onlyteacher/${school_id}`
        );
        if (!teacherResponse.ok)
          throw new Error(`HTTP ${teacherResponse.status}`);
        const teacherData: Teacher[] = await teacherResponse.json();
        setTeachers(teacherData);

        // 2B) Fetch subject-groups for this class/section
        const subjectResponse = await fetch(
          `${DOMAIN}/api/school/get-subjects?class_id=${classId}&section_id=${sectionId}&school_id=${school_id}&session_id=${session_id}`
        );
        if (!subjectResponse.ok)
          throw new Error(`HTTP ${subjectResponse.status}`);
        const subjectData: SubjectGroup[] = await subjectResponse.json();
        setSubjects(subjectData);
      } catch (error) {
        console.error("Failed to fetch teachers or subjects", error);
        toast.error("Unable to load teachers / subjects.");
      }
    };

    if (
      classId !== null &&
      sectionId !== null &&
      school_id !== undefined &&
      session_id !== undefined
    ) {
      fetchTeachersAndSubjects();
    }
  }, [classId, sectionId, school_id, session_id]);

  // ─── 3) Fetch existing timetable from server ───
  const fetchTimetable = useCallback(async () => {
    if (!classId || !sectionId || !school_id || !session_id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/time-table?class_id=${classId}&section_id=${sectionId}&school_id=${school_id}&sessionId=${session_id}`
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: TimetableEntry[] = await response.json();

      const newSchedule: Schedule = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      };

      data.forEach((entry) => {
        entry.daysOfWeek.forEach((dayNumber) => {
          const dayName = getDayName(dayNumber);
          newSchedule[dayName].push({ ...entry });
        });
      });

      Object.keys(newSchedule).forEach((day) => {
        newSchedule[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
      });

      setSchedule(newSchedule);
    } catch (error) {
      console.error("Failed to fetch timetable", error);
      toast.error("Unable to load timetable.");
    } finally {
      setIsLoading(false);
    }
  }, [classId, sectionId, school_id, session_id]);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  // ─── 4) Intercept day‐tab switching if there are unsaved changes ───
  const handleDayChange = (newDay: string) => {
    if (hasUnsavedChanges) {
      const stay = window.confirm(
        "You have unsaved changes. If you leave this day, unsaved changes will be lost.\n\nPress OK to discard changes and switch day, or Cancel to stay."
      );
      if (!stay) {
        // User clicked “Cancel” → stay on current day
        return;
      }
      // If user clicked “OK”, discard pending entries and switch
      setUpdatedEntries([]); // drop unsaved changes
    }
    setSelectedDay(newDay || "Monday");
  };

  // ─── 5) Add a brand-new empty row (client-side only until “Save”) ───
  const addNewRow = () => {
    const newRow: TimetableEntry = {
      subject_group_subject_id: 0,
      daysOfWeek: [days.indexOf(selectedDay) + 1],
      startTime: "",
      endTime: "",
      room: "",
      staffId: 0,
      subjectName: "",
      id: Date.now(),
      isNew: true,
      day: selectedDay,
      class_id: classId,
      section_id: sectionId,
      session_id: session_id,
    };

    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: [...prev[selectedDay], newRow],
    }));
    setUpdatedEntries((prev) => [...prev, newRow]);
  };

  // ─── 6) Handle input changes for existing / new rows ───
  const handleInputChange = (
    index: number,
    field: keyof TimetableEntry,
    value: string | number
  ) => {
    const dayArrCopy = schedule[selectedDay].map((e) => ({ ...e }));
    // @ts-ignore
    dayArrCopy[index][field] = value;

    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: dayArrCopy,
    }));

    const updatedEntry = dayArrCopy[index];
    const exists = updatedEntries.find((e) => e.id === updatedEntry.id);
    if (!exists) {
      setUpdatedEntries((prev) => [...prev, updatedEntry]);
    } else {
      setUpdatedEntries((prev) =>
        prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
      );
    }
  };

  // ─── 7) Delete confirmation ───
  const removeRow = (index: number) => {
    const entry = schedule[selectedDay][index];
    setDeletedIndex(index);
    setDeletedEntry(entry);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    if (deletedIndex === null || !deletedEntry) return;

    // If it's not a new row, call DELETE API
    if (!deletedEntry.isNew) {
      fetch(
        `${DOMAIN}/api/school/delete-timetable-entry/${school_id}/${session_id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: deletedEntry.id }),
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(() => {
          toast.success("Row deleted successfully.");
        })
        .catch((err) => {
          console.error("Delete failed:", err);
          toast.error("Failed to delete row on server.");
        });
    }

    // Remove from UI immediately
    setSchedule((prev) => {
      const dayArr = [...prev[selectedDay]];
      dayArr.splice(deletedIndex, 1);
      return { ...prev, [selectedDay]: dayArr };
    });

    setUpdatedEntries((prev) =>
      prev.filter((e) => e.id !== (deletedEntry ? deletedEntry.id : -1))
    );

    setDeletedEntry(null);
    setDeletedIndex(null);
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        // Modern browsers ignore the custom message, but returnValue must be set
        e.returnValue = "";
        return "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (!hasUnsavedChanges) return;
      // Note: location.pathname is already changed by the time popstate fires.
      // Grab the “old” URL from history.state or store it elsewhere.
      const keepOnThisPage = !window.confirm(
        "You have unsaved changes. Navigating away will discard them.\n\nPress OK to leave anyway, or Cancel to stay."
      );
      if (keepOnThisPage) {
        // Force the browser to go forward again (undo the back/forward)
        // History API: push the current URL back onto the stack
        window.history.go(1);
      }
    };
  
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges]);

  
  useEffect(() => {
    if (!hasUnsavedChanges) return;
  
    // Keep references to the original methods
    const origPush = window.history.pushState;
    const origReplace = window.history.replaceState;
  
    // Override pushState
    window.history.pushState = function (...args) {
      const shouldLeave = window.confirm(
        "You have unsaved changes. Navigating away will discard them.\n\nPress OK to leave anyway, or Cancel to stay."
      );
      if (shouldLeave) {
        // User confirmed → call the real pushState
        return origPush.apply(window.history, args);
      } else {
        // Cancel → do nothing (stay on same URL)
        return;
      }
    };
  
    // Override replaceState similarly
    window.history.replaceState = function (...args) {
      const shouldLeave = window.confirm(
        "You have unsaved changes. Navigating away will discard them.\n\nPress OK to leave anyway, or Cancel to stay."
      );
      if (shouldLeave) {
        return origReplace.apply(window.history, args);
      } else {
        return;
      }
    };
  
    return () => {
      // On cleanup (or when hasUnsavedChanges → false), restore the originals
      window.history.pushState = origPush;
      window.history.replaceState = origReplace;
    };
  }, [hasUnsavedChanges]);

  
  
  const handleSubmit = () => {
    if (!school_id || !session_id) {
      toast.error("Missing school_id or session_id.");
      return;
    }
    if (updatedEntries.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    // ─── VALIDATION: ensure every changed row has subject, teacher, startTime, endTime ───
    for (const entry of updatedEntries) {
      if (
        !entry.subject_group_subject_id || // zero or undefined
        !entry.staffId || // zero or undefined
        !entry.startTime || // empty string
        !entry.endTime // empty string
      ) {
        toast.error(
          "All rows must have Subject, Teacher, Time From, and Time To filled out before saving."
        );
        return; // abort saving
      }
    }

    setIsSubmitting(true);
    const newEntries = updatedEntries.filter((e) => e.isNew);
    const existingEntries = updatedEntries.filter((e) => !e.isNew);

    const createPromises: Promise<any>[] = [];
    const updatePromises: Promise<any>[] = [];

    // 8A) CREATE NEW ROWS
    if (newEntries.length > 0) {
      const payloadCreate = newEntries.map((entry) => ({
        subject_group_subject_id: entry.subject_group_subject_id,
        staff_id: entry.staffId,
        start_time: entry.startTime,
        end_time: entry.endTime,
        time_from: entry.startTime,
        time_to: entry.endTime,
        room_no: entry.room,
        daysOfWeek: entry.daysOfWeek,
        day: entry.day,
        class_id: classId,
        section_id: sectionId,
        session_id: session_id,
      }));
      createPromises.push(
        fetch(
          `${DOMAIN}/api/school/create-timetable-entry/${school_id}/${session_id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadCreate),
          }
        )
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then(() => {
            toast.success("New rows created successfully.");
          })
          .catch((err) => {
            console.error("Create failed:", err);
            toast.error("Failed to create new rows.");
            throw err;
          })
      );
    }

    // 8B) UPDATE EXISTING ROWS
    if (existingEntries.length > 0) {
      const payloadUpdate = existingEntries.map((entry) => ({
        id: entry.id,
        subject_group_subject_id: entry.subject_group_subject_id,
        staffId: entry.staffId,
        startTime: entry.startTime,
        endTime: entry.endTime,
        room: entry.room,
        daysOfWeek: entry.daysOfWeek,
      }));
      updatePromises.push(
        fetch(
          `${DOMAIN}/api/school/update-timetable-entry/${school_id}/${session_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadUpdate),
          }
        )
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then(() => {
            toast.success("Existing rows updated successfully.");
          })
          .catch((err) => {
            console.error("Update failed:", err);
            toast.error("Failed to update existing rows.");
            throw err;
          })
      );
    }

    // 8C) Run both in parallel
    Promise.all([...createPromises, ...updatePromises])
      .then(() => {
        setUpdatedEntries([]); // reset the saved‐state
        fetchTimetable();
      })
      .catch(() => {
        // Individual error toasts already shown above
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div
      className="h-md-100 mb-md-5 mb-lg-5"
      style={{
        gap: "10px",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderTop: "1px solid gray",
        marginTop: "20px",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Day Tabs + “+ Add Row” */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Tabs
          activeKey={selectedDay}
          onSelect={(day) => handleDayChange(day || "Monday")}
          className="mb-3"
          style={{
            display: "flex",
            justifyContent: "left",
            width: "80%",
            gap: "10px",
            fontFamily: "Manrope",
            fontWeight: "600",
            fontSize: "14px",
            color: "#1C335C",
          }}
          variant="tabs"
        >
          {days.map((day) => (
            <Tab
              key={day}
              eventKey={day}
              title={day}
              style={{ color: "#1C335C" }}
              disabled={isSubmitting}
            />
          ))}
        </Tabs>

        <div
          onClick={addNewRow}
          style={{
            padding: "10px",
            backgroundColor: isSubmitting ? "#888" : "#1C335C",
            fontSize: "14px",
            borderRadius: "5px",
            color: "#fff",
            fontFamily: "Manrope",
            fontWeight: "600",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          + Add Row
        </div>
      </div>

      {/* Show Spinner if loading */}
      {isLoading ? (
        <div style={{ width: "100%", textAlign: "center", padding: "40px 0" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table
          className="table"
          bordered
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "rgb(242, 246, 255)",
                borderBottom: "1px solid #E0E4F0",
                fontFamily: "Manrope",
                fontWeight: "600",
                color: "#1C335C",
                fontSize: "14px",
              }}
            >
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Subject
              </th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Teacher
              </th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Time From
              </th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Time To
              </th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Room No
              </th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {schedule[selectedDay].map((row, index) => (
              <tr
                key={row.id}
                style={{
                  backgroundColor:
                    index % 2 === 0 ? "rgb(242, 246, 255)" : "#FFFFFF",
                  borderBottom: "1px solid #E0E4F0",
                  fontFamily: "Manrope",
                  fontSize: "14px",
                  color: "#1C335C",
                }}
              >
                {/* Subject dropdown */}
                <td style={{ padding: "12px 20px" }}>
                  <select
                    value={row.subject_group_subject_id}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "subject_group_subject_id",
                        Number(e.target.value)
                      )
                    }
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      width: "100%",
                      backgroundColor: "#fff",
                    }}
                    disabled={isSubmitting}
                  >
                    <option value={0}>Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Teacher dropdown */}
                <td style={{ padding: "12px 20px" }}>
                  <select
                    value={row.staffId}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "staffId",
                        Number(e.target.value)
                      )
                    }
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      width: "100%",
                      backgroundColor: "#fff",
                    }}
                    disabled={isSubmitting}
                  >
                    <option value={0}>Select Teacher</option>
                    {teachers.map((tea) => (
                      <option key={tea.id} value={tea.id}>
                        {tea.name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Time From */}
                <td style={{ padding: "12px 20px" }}>
                  <input
                    type="time"
                    value={row.startTime}
                    onChange={(e) =>
                      handleInputChange(index, "startTime", e.target.value)
                    }
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                    disabled={isSubmitting}
                  />
                </td>

                {/* Time To */}
                <td style={{ padding: "12px 20px" }}>
                  <input
                    type="time"
                    value={row.endTime}
                    onChange={(e) =>
                      handleInputChange(index, "endTime", e.target.value)
                    }
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                    disabled={isSubmitting}
                  />
                </td>

                {/* Room No */}
                <td style={{ padding: "12px 20px" }}>
                  <input
                    type="text"
                    value={row.room}
                    onChange={(e) =>
                      handleInputChange(index, "room", e.target.value)
                    }
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      minWidth: "100px",
                    }}
                    disabled={isSubmitting}
                  />
                </td>

                {/* Delete button */}
                <td style={{ padding: "12px 20px" }}>
                  <Button
                    onClick={() => removeRow(index)}
                    variant="danger"
                    style={{
                      borderRadius: "5px",
                      backgroundColor: "#DD4345",
                      padding: "10px",
                      color: "#FFFFFF",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                    disabled={isSubmitting}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Save + Spinner */}
      <div style={{ display: "flex", justifyContent: "right", width: "100%" }}>
        {isSubmitting && (
          <div style={{ marginRight: "10px" }}>
            <Spinner animation="border" size="sm" variant="success" />
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || updatedEntries.length === 0}
          style={{
            padding: "10px",
            backgroundColor:
              isSubmitting || updatedEntries.length === 0 ? "#888" : "#5B913B",
            borderRadius: "5px",
            color: "#fff",
            cursor:
              isSubmitting || updatedEntries.length === 0
                ? "not-allowed"
                : "pointer",
            opacity: isSubmitting || updatedEntries.length === 0 ? 0.6 : 1,
          }}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* Confirm Delete Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this row?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={isSubmitting}
          >
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export { CardsWidget36 };
