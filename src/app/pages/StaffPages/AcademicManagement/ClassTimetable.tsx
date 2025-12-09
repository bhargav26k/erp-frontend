import React, { Fragment, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // for user interactions
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import { Content } from "../../../../_metronic/layout/components/content";
import "./style.css"; // Import custom CSS for styles
import { Button, Row } from "react-bootstrap";
import { CardsWidget36 } from "../../../../_metronic/partials/widgets/_new/cards/CardsWidget36";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import { useAuth } from "../../../modules/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClassTimetablePage = () => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const sessionId = currentUser?.session_id;
  console.log(sessionId);
  
  const [showForm, setShowForm] = useState(false);
  const [refersh,setRefersh] = useState(false);

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [timetableData, setTimetableData] = useState([]);

  const [classId, setClassId] = useState(null);

  const [sectionId, setsectionId] = useState(null);
  const [minMaxTimes, setMinMaxTimes] = useState({
    minStartTime: "08:00",
    maxEndTime: "14:00",
  });

  const handleToggleView = () => {
    if (!showForm && (!classId || !sectionId)) {
      // Only block when we're trying to *open* the form
      toast.error(
        "Please select both a class and a section before adding a timetable"
      );
      return;
    }
    setShowForm(!showForm);
  };
  useEffect(()=>{
    if(!showForm){
      setRefersh(true);
    }
    else{
      setRefersh(false);

    }
  })

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const class_id = e.target.value;
    setClassId(class_id);
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const section_id = e.target.value;
    setsectionId(section_id);
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-classes?schoolId=${school_id}&sessionId=${sessionId}`
        );
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      if (classId === null) {
        console.log("No class selected");
        return; // Return early if classId is null, preventing further execution
      }
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-classwise-sections?schoolId=${school_id}&classId=${classId}`
        );
        const data = await response.json();

        setSections(data); // Set the fetched sections to the state
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    // Only call fetchSections if classId is not null
    if (classId !== null) {
      fetchSections(); // Call the function when classId changes and is valid
    }
  }, [classId]); // Re-run effect when classId changes

  const fetchTimetableData = async () => {
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/time-table?class_id=${classId}&section_id=${sectionId}&school_id=${school_id}&sessionId=${sessionId}`
      );
      const data = await response.json();

      // Set timetable data as is (without adjusting individual times)
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
        }) => ({
          subjectId: subject.subject_id,
          startTime: subject.startTime,
          endTime: subject.endTime,
          daysOfWeek: subject.daysOfWeek,
          staffName: subject.staffName,
          roomNumber: subject.room,
          id: subject.id,
          subjectName: subject.subjectName,
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

  useEffect(() => {
    if (classId && sectionId) {
      fetchTimetableData();
    }
  }, [classId, sectionId,refersh]);

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

  return (
    <div>
      <ToastContainer position="top-center" autoClose={4000} />
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
                      Student's Time Table
                    </h3>
                  </div>

                  {/* Toggle button: Switch between Calendar and Form */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 12px",
                      backgroundColor:
                        classId && sectionId ? "#1C335C" : "#85909D",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                    onClick={handleToggleView}
                  >
                    <span
                      style={{
                        marginRight: "8px",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "700",
                        fontFamily: "Manrope",
                      }}
                    >
                      {showForm ? "Back to Calendar" : "Add New Schedule"}
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_1_6269)">
                        <path
                          d="M1.66663 10.0001C1.66663 6.07171 1.66663 4.10752 2.88701 2.88714C4.1074 1.66675 6.07159 1.66675 9.99996 1.66675C13.9283 1.66675 15.8925 1.66675 17.1129 2.88714C18.3333 4.10752 18.3333 6.07171 18.3333 10.0001C18.3333 13.9285 18.3333 15.8926 17.1129 17.113C15.8925 18.3334 13.9283 18.3334 9.99996 18.3334C6.07159 18.3334 4.1074 18.3334 2.88701 17.113C1.66663 15.8926 1.66663 13.9285 1.66663 10.0001Z"
                          stroke="white"
                          stroke-width="1.5"
                        />
                        <path
                          d="M12.5 10L10 10M10 10L7.5 10M10 10L10 7.5M10 10L10 12.5"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1_6269">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
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
                    value={classId || ""}
                    onChange={handleClassChange}
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      width: "20%",
                      backgroundColor: "#fff",
                    }}
                    className="form-select"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.class}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sectionId || ""}
                    onChange={handleSectionChange}
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      width: "20%",
                      backgroundColor: "#fff",
                    }}
                    className="form-select"
                  >
                    <option value="">Select Section</option>
                    {sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.section}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Conditionally show either the Calendar or the Form */}
                <div className="calendar-wrapper">
                  {!showForm ? (
                    classId && sectionId ? (
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
                        eventContent={(arg) => (
                          <div
                            className="card-content"
                            style={{
                              borderRadius: "10px",
                              overflowY: "auto",
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
                              <div
                                style={{
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                }}
                              >
                                <svg
                                  width="10"
                                  height="11"
                                  viewBox="0 0 10 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle
                                    cx="5"
                                    cy="5.5"
                                    r="5"
                                    fill="#EB5578"
                                  />
                                </svg>
                                {arg.event.extendedProps.subjectName}
                              </div>
                              <div className="time-pill">{arg.timeText}</div>
                            </div>
                            <div>
                              <div style={{ color: "gray" }}>
                                {arg.event.extendedProps.roomNumber}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                  marginTop: "2px",
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
                                </svg> */}
                                {/* {arg.event.extendedProps.staffName} */}
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
                        )}
                      />
                    ) : (
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
                        No Sechdule available. Please select a class.
                      </div>
                    )
                  ) : (
                    // Display the form when "Add New Schedule" is clicked
                    <CardsWidget36 classId={classId} sectionId={sectionId} />
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

const ClassTimetable: React.FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ClassTimetable" })}
      </PageTitle>
      <ClassTimetablePage />
    </>
  );
};

export default ClassTimetable;
