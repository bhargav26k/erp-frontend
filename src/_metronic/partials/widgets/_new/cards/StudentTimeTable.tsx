import React, { useEffect, useState } from "react";
import axios from "axios";
import { DOMAIN } from "../../../../../app/routing/ApiEndpoints";

// 1) Days of the week, in fixed order:
const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// 2) Utility to format "HH:MM:SS" → "H:MM AM/PM"
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hourStr, minuteStr] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minuteStr} ${ampm}`;
};

const StudentTimeTable = ({ school_id, class_id, section_id, session_id }) => {
  const [entries, setEntries] = useState([]); // raw API rows
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3) Fetch data from the server
  useEffect(() => {
    if (!school_id || !class_id || !section_id || !session_id) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const resp = await axios.get(
          `${DOMAIN}/api/student/get-student-timetable/${school_id}/${class_id}/${section_id}/${session_id}`
        );
        // resp.data is expected to be an array like:
        // { subject_name, staff_name, staff_surname, room_no, start_time, end_time, day }
        setEntries(resp.data || []);
      } catch (err) {
        console.error("Error fetching timetable:", err);
        setError("Could not load timetable.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [school_id, class_id, section_id, session_id]);

  if (loading) return <div>Loading timetable…</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  // ─────────────────────────────────────────────────────────────────
  // 4) Collect all distinct time boundaries and sort them
  const allBoundaries = new Set();
  entries.forEach((e) => {
    if (e.start_time) allBoundaries.add(e.start_time);
    if (e.end_time) allBoundaries.add(e.end_time);
  });
  const sortedBoundaries = Array.from(allBoundaries).sort((a, b) =>
    a.localeCompare(b)
  );

  // 5) Build “sub-slots” between consecutive boundaries:
  const slots = [];
  for (let i = 0; i < sortedBoundaries.length - 1; i++) {
    const start = sortedBoundaries[i];
    const end = sortedBoundaries[i + 1];
    slots.push({
      key: `${start}-${end}`,
      start,
      end,
      label: `${formatTime(start)} – ${formatTime(end)}`, // not rendered in left column now
    });
  }

  const scheduleByDayAndSlot = {};
  const spanMap = {};
  const covered = {};

  DAYS_OF_WEEK.forEach((d) => {
    scheduleByDayAndSlot[d] = {};
    spanMap[d] = {};
    covered[d] = new Array(slots.length).fill(false);
  });

  entries.forEach((e) => {
    const dayName = e.day; // e.day: “Monday”, etc.
    if (!DAYS_OF_WEEK.includes(dayName)) return;

    const fullStaffName = `${e.staff_name} ${e.staff_surname}`.trim();

    // Find which sub-slot index matches this entry’s start_time and end_time
    let startIndex = -1;
    let endIndex = -1;
    for (let i = 0; i < slots.length; i++) {
      if (slots[i].start === e.start_time) startIndex = i;
      if (slots[i].end === e.end_time) endIndex = i;
    }
    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
      // If we can’t find exact boundary matches, skip
      return;
    }

    // Cover all sub-slots from startIndex..endIndex
    for (let slotIdx = startIndex; slotIdx <= endIndex; slotIdx++) {
      const slotKey = slots[slotIdx].key;
      scheduleByDayAndSlot[dayName][slotKey] = {
        subject: e.subject_name,
        teacher: fullStaffName,
        room: e.room_no,
      };
    }

    // Calculate how many rows this class cell must span
    const rowSpanCount = endIndex - startIndex + 1;
    spanMap[dayName][startIndex] = {
      rowSpan: rowSpanCount,
      entry: e,
    };

    // Mark those indices covered so we skip them in lower rows
    for (let k = startIndex; k < startIndex + rowSpanCount; k++) {
      covered[dayName][k] = true;
    }
  });

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={styles.table}>
        <thead>
          <tr>
            {DAYS_OF_WEEK.map((day) => (
              <th key={day} style={styles.th}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, slotIdx) => (
            <tr key={slot.key}>
              {DAYS_OF_WEEK.map((dayName) => {
                // If this sub-slot on this day was already covered by a rowSpan above, skip
                if (covered[dayName][slotIdx] && !spanMap[dayName][slotIdx]) {
                  return null;
                }

                // Do we have a class starting exactly at this sub-slot?
                const spanInfo = spanMap[dayName][slotIdx];
                if (spanInfo) {
                  const { rowSpan, entry } = spanInfo;
                  const fullStaffName = `${entry.staff_name} ${entry.staff_surname}`.trim();
                  return (
                    <td
                      key={`${dayName}-${slot.key}`}
                      rowSpan={rowSpan}
                      style={styles.cardTd} // each “card” has its own border
                    >
                      <div style={styles.card}>
                        <div style={styles.subjectText}>
                          {entry.subject_name}
                        </div>

                        {/* Time label inside the card */}
                        <div style={styles.timeLabel}>
                          {formatTime(entry.start_time)} –{" "}
                          {formatTime(entry.end_time)}
                        </div>

                        <div style={styles.metaText}>
                          {fullStaffName} | {entry.room_no}
                        </div>
                      </div>
                    </td>
                  );
                }

                // If no class covers this sub-slot, render an empty cell (no border)
                return <td key={`${dayName}-${slot.key}`} style={styles.emptyTd} />;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Updated styles: no grid lines, and each card has a light gray border.
const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    // Remove all table borders:
    border: "none",
  },
  th: {
    border: "none",
    padding: "8px 12px",
    backgroundColor: "#f5f5f5",
    fontWeight: "600",
    textTransform: "uppercase",
    fontSize: "13px",
    color: "#333",
  },
  emptyTd: {
    border: "none",
    padding: "12px 8px",
    verticalAlign: "middle",
    backgroundColor: "transparent",
  },
  // Each <td> that contains a card now has no cell border of its own...
  cardTd: {
    border: "none",
    padding: "12px 8px",
    verticalAlign: "middle",
    backgroundColor: "transparent",
  },
  // ... but the inner “card” <div> has a very light gray border + rounding:
  card: {
    border: "1px solid #e0e0e0",  // lightest gray border
    borderRadius: "6px",
    padding: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },
  subjectText: {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "4px",
    color: "#1a1a1a",
  },
  timeLabel: {
    fontSize: "12px",
    color: "#444",
    marginBottom: "6px",
  },
  metaText: {
    fontSize: "12px",
    color: "#555",
  },
};

export default StudentTimeTable;
