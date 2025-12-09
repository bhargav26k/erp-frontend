import { FC, Fragment, useEffect, useState } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { Content } from "../../../../_metronic/layout/components/content";
import { Row } from "react-bootstrap";
import { useAuth } from "../../../modules/auth";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid"; // Import required plugins
import interactionPlugin from "@fullcalendar/interaction"; // Import required plugins
import "./teacherStyle.css";

const TeachersTimetablePage: FC = () => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const roleName = currentUser?.roleName;
  const designation = currentUser?.designation;

  const [teachers, setTeachers] = useState([]);
  const [timetableData, setTimetableData] = useState([]);
  console.log(timetableData);

  const [teacherId, setTeacherId] = useState(null);
  const [minMaxTimes, setMinMaxTimes] = useState({
    minStartTime: "08:00",
    maxEndTime: "14:00",
  });
  // Handle teacher selection
  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTeacherId = e.target.value;
    setTeacherId(selectedTeacherId);
  };

  useEffect(() => {
    if (roleName === "School Staff" || designation === "Teacher") {
      // Use the current user's id as teacherId
      setTeacherId(currentUser?.id);
    }
  }, [roleName, designation, currentUser]);

  // Fetch teachers list
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-onlyteacher/${school_id}`
        );
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    if (!teacherId) {
      fetchTeachers();
    }
  }, [school_id, teacherId]);

  // Fetch teacher timetable based on selected teacher
  const fetchTimetableData = async () => {
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/teacher-time-table?teacher_id=${teacherId}&school_id=${school_id}`
      );
      const data = await response.json();

      const formattedData = data.map(
        (subject: {
          subject_id: number;
          startTime: string; // Assuming startTime is a string in "HH:mm" format
          endTime: string; // Assuming endTime is a string in "HH:mm" format
          daysOfWeek: any;
          staffName: string;
          room: string;
          subjectName: string;
          id: number;
          classname: string;
          sectionName: string;
        }) => ({
          classname: subject?.classname,
          subjectId: subject.subject_id,
          startTime: subject.startTime,
          endTime: subject.endTime,
          daysOfWeek: subject.daysOfWeek,
          staffName: subject.staffName,
          roomNumber: subject.room,
          id: subject.id,
          subjectName: subject.subjectName,
          sectionName: subject.sectionName,
        })
      );

      setTimetableData(formattedData);

      // Calculate min start time and max end time
      const minStartTime = formattedData.reduce(
        (min, subject) => (subject.startTime < min ? subject.startTime : min),
        "23:59"
      );
      const maxEndTime = formattedData.reduce(
        (max, subject) => (subject.endTime > max ? subject.endTime : max),
        "00:00"
      );

      // Create Date objects for min and max times
      const minStartTimeDate = new Date(`1970-01-01T${minStartTime}:00`);
      const maxEndTimeDate = new Date(`1970-01-01T${maxEndTime}:00`);

      // Subtract 1 hour from minStartTime and add 1 hour to maxEndTime
      minStartTimeDate.setHours(minStartTimeDate.getHours() - 1);
      maxEndTimeDate.setHours(maxEndTimeDate.getHours() + 1);

      // Convert adjusted times back to "HH:mm" format
      const adjustedMinStartTime = minStartTimeDate.toTimeString().slice(0, 5);
      const adjustedMaxEndTime = maxEndTimeDate.toTimeString().slice(0, 5);

      // Set the adjusted min and max times for the calendar
      setMinMaxTimes({
        minStartTime: adjustedMinStartTime,
        maxEndTime: adjustedMaxEndTime,
      });
    } catch (error) {
      console.error("Error fetching timetable data:", error);
    }
  };

  // Fetch timetable when a teacher is selected
  useEffect(() => {
    if (teacherId) {
      fetchTimetableData();
    }
  }, [teacherId]);

  function getInitials(name: string | null | undefined) {
    if (!name) {
      return "";
    }
    return name
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  }

  const infoRow: React.CSSProperties = {
    marginBottom: 4,
    fontSize: 13,
    color: "#444",
  };
  const labelStyle: React.CSSProperties = {
    color: "gray",
    marginRight: 4,
  };
  const subjectBlock: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontWeight: 700,
    fontSize: 14,
  };

  const dotStyle: React.CSSProperties = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#EB5578",
  };

  return (
    <div>
      <Content>
        <Row>
          <div className="col-xxl-12 mb-xl-10">
            <Fragment>
              <div
                className="calendar-container"
                style={{
                  padding: "25px",
                  backgroundColor: "rgb(242, 246, 255)",
                  borderRadius: "16px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  fontFamily: "Manrope",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBottom: "10px",
                    borderBottom: "1px solid lightgray",
                  }}
                >
                  <div>
                    <h3
                      className="calendar-title"
                      style={{ textAlign: "start" }}
                    >
                      Teacher's Timetable
                    </h3>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "20px",
                    width: "100%",
                    marginTop: "20px",
                    justifyContent: "left",
                  }}
                >
                  <select
                    value={teacherId || ""}
                    onChange={handleTeacherChange}
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      width: "20%",
                      backgroundColor: "#fff",
                    }}
                    className="form-select"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} {teacher.surname}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="calendar-wrapper">
                  {!teacherId ? (
                    <div
                      style={{
                        height: "400px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        color: "#888",
                      }}
                    >
                      No schedule available. Please select a teacher.
                    </div>
                  ) : timetableData.length === 0 ? (
                    <div
                      style={{
                        height: "400px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        color: "#888",
                      }}
                    >
                      Nothing assigned to this teacher.
                    </div>
                  ) : (
                    <FullCalendar
                      plugins={[timeGridPlugin, interactionPlugin]}
                      initialView="timeGridWeek"
                      headerToolbar={{
                        left: "", // No buttons (like previous/next/today)
                        center: "", // No title
                        right: "", // No buttons
                      }}
                      allDaySlot={false} // Hide all-day slot
                      height={"auto"} // Set auto height
                      slotMinTime={minMaxTimes.minStartTime} // Use dynamic min start time
                      slotMaxTime={minMaxTimes.maxEndTime} // Use dynamic max end time
                      slotDuration="00:10:00" // Set the slot duration to 10 minutes
                      slotLabelInterval="01:00:00" // Show labels at 1-hour intervals
                      events={timetableData} // Pass timetable events here
                      slotLabelFormat={{
                        hour: "2-digit",
                        minute: "2-digit",
                        omitZeroMinute: false,
                        meridiem: "short",
                      }}
                      dayHeaderFormat={{
                        weekday: "long", // Only show the weekday (Monday, Tuesday, etc.)
                      }}
                      views={{
                        timeGridWeek: {
                          titleFormat: {
                            // Hide dates, only show days of the week
                            month: "long",
                            year: "numeric",
                            day: "numeric",
                            omitCommas: true,
                          },
                        },
                      }}
                      editable={false} // Disable drag and drop
                      selectable={false} // Disable click to select
                      displayEventTime={true} // Show time for events
                      eventContent={(arg) => {
                        return (
                          <div
                            className="card-content"
                            style={{
                              borderRadius: "10px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: "5px",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "5px",
                              }}
                            >
                              <div style={subjectBlock}>
                                <span style={dotStyle} />
                                {arg.event.extendedProps.subjectName || "N/A"}
                              </div>
                              <div className="time-pill">{arg.timeText}</div>
                            </div>
                            <div>
                              <div style={{ marginBottom: "10px" }}>
                                <div style={infoRow}>
                                  <span style={labelStyle}>Class:</span>
                                  <strong>
                                    {arg.event.extendedProps.classname || "N/A"}
                                  </strong>
                                </div>
                                <div style={infoRow}>
                                  <span style={labelStyle}>Section:</span>
                                  <strong>
                                    {arg.event.extendedProps.sectionName ||
                                      "N/A"}
                                  </strong>
                                </div>

                                <div style={infoRow}>
                                  <span style={labelStyle}>Room:</span>
                                  <strong>
                                    {arg.event.extendedProps.roomNumber ||
                                      "N/A"}
                                  </strong>
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                  marginTop: "2px",
                                  fontFamily: "Manrope",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                }}
                              >
                                {/* <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_1_9757)">
                                  <circle
                                    cx="8"
                                    cy="6"
                                    r="2"
                                    stroke="#424242"
                                  />
                                  <circle
                                    cx="8.00016"
                                    cy="8.00016"
                                    r="6.66667"
                                    stroke="#424242"
                                  />
                                  <path
                                    d="M11.9794 13.3333C11.8733 11.4057 11.2831 10 7.99997 10C4.71681 10 4.12661 11.4057 4.02051 13.3333"
                                    stroke="#424242"
                                    strokeLinecap="round"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_1_9757">
                                    <rect
                                      width="16"
                                      height="16"
                                      fill="white"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                              {arg.event.extendedProps.staffName} */}
                                <div className="teacher">
                                  <div className="avatar">
                                    {getInitials(
                                      arg.event.extendedProps.staffName
                                    )}
                                  </div>
                                  <span>
                                    {arg.event.extendedProps.staffName}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                  )}
                </div>
              </div>
            </Fragment>
          </div>
        </Row>
      </Content>
    </div>
  );
};

const TeachersTimetable: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.TeachersTimetable" })}
      </PageTitle>
      <TeachersTimetablePage />
    </>
  );
};

export default TeachersTimetable;
