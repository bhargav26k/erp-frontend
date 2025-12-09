// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { Fragment, useEffect, useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction"; // needed for event click functionality
// import moment from "moment";
// import { DOMAIN } from "../../../../../app/routing/ApiEndpoints";
// import { useAuth } from "../../../../../app/modules/auth";
// import './SchoolEventsCalendar.css'; // Custom CSS file for styling

// interface Event {
//   title: string;
//   start: string; // ISO date string
//   end: string;   // ISO date string
//   description?: string;
//   backgroundColor?: string; // FullCalendar expects backgroundColor property for styling
//   borderColor?: string;     // FullCalendar expects borderColor property for styling
// }

// export default function SchoolEventsCalendar() {
//   const [events, setEvents] = useState<Event[]>([]);
//   const { currentUser } = useAuth();
//   const schoolID = currentUser?.school_id;

//   // Fetch events from the server or your database
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await fetch(`${DOMAIN}/api/school/all-events/${schoolID}`);
//         const eventData = await response.json();

//         // Map the data from your backend and include backgroundColor and borderColor
//         const formattedEvents = eventData.map((event: any) => ({
//           title: event.event_title,  // Event title
//           start: moment(event.start_date).format('YYYY-MM-DDTHH:mm:ss'),  // Format the start date
//           end: moment(event.end_date).format('YYYY-MM-DDTHH:mm:ss'),      // Format the end date
//           description: event.event_description, // Optional description field
//           backgroundColor: event.event_color || '#3b82f6',  // Event color from backend or default to blue
//           borderColor: event.event_color || '#000',         // Event border color from backend or default to black
//         }));

//         setEvents(formattedEvents); // Update the state with formatted events
//       } catch (error) {
//         console.error("Error fetching events:", error);
//       }
//     };

//     fetchEvents();
//   }, [schoolID]);

//   return (
//     <Fragment>
//       <div
//         className="calendar-container"
//         style={{
//           padding: "20px",
//           backgroundColor: "rgb(242, 246, 255)",
//           borderRadius: "16px",
//           boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
//           fontFamily:'Manrope'
//         }}
//       >
//         <h3 className="calendar-title" style={{textAlign:'start'}}>School Events Calendar</h3>
//         <div className="calendar-wrapper">
//           <FullCalendar
//             plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//             initialView="dayGridMonth"
//             events={events} // Use the state for events
//             dateClick={(info) => alert(`Clicked on: ${info.dateStr}`)} // Handle date click
//             eventClick={(info) => alert(`Event: ${info.event.title}`)} // Handle event click

//             // Customize the header toolbar
//             headerToolbar={{
//               left: 'prev,next today',
//               center: 'title', // The title will be the month and year
//               right: 'dayGridMonth,dayGridWeek,dayGridDay'
//             }}

//             height="auto"
//             // Customize the title rendering (Month and Year)
//             titleFormat={{
//               year: 'numeric',
//               month: 'long'
//             }}  // Example: "September 2024"
//           />
//         </div>
//       </div>
//     </Fragment>
//   );
// }

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { DOMAIN } from "../../../../../app/routing/ApiEndpoints";
import { useAuth } from "../../../../../app/modules/auth";
import { Modal, Button } from "react-bootstrap";
import "./SchoolEventsCalendar.css";

interface Event {
  title: string;
  start: string;
  end: string;
  description?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export default function SchoolEventsCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { currentUser } = useAuth();
  const schoolID = currentUser?.school_id;
  const session_name = currentUser?.session_name;

  // Fetch events from the server or your database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/all-events/${schoolID}`
        );
        const eventData = await response.json();
        // Map the data from your backend and include backgroundColor and borderColor
        const formattedEvents = eventData.map((event: any) => ({
          title: event.event_title, // Event title
          start: moment(event.start_date).format("YYYY-MM-DDTHH:mm:ss"),
          end: moment(event.end_date).format("YYYY-MM-DDTHH:mm:ss"),
          description: event.event_description,
          role: event.role,
          backgroundColor: event.event_color || "#3b82f6",
          borderColor: event.event_color || "#000",
        }));

        setEvents(formattedEvents); // Update the state with formatted events
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [schoolID]);

  // Handle event click to show modal with event details
  const handleEventClick = (info: any) => {
    const eventDetails = {
      title: info.event.title,
      description: info.event.extendedProps.description,
      role: info.event.extendedProps.role,
      start_date: info.event.start,
      end_date: info.event.end,
    };
    setSelectedEvent(eventDetails);
    setShowModal(true); // Show the modal
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <Fragment>
      <div className="calendar-container">
        <div className="calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            height={625}
            contentHeight={625}
            eventClick={handleEventClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek,dayGridDay",
            }}
            titleFormat={{
              year: "numeric",
              month: "long",
            }}
          />
        </div>
      </div>
      {/* Modal to show event details */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#1C335C", borderBottom: "none" }}
          closeVariant="white"
        >
          <Modal.Title
            style={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 600,
              fontSize: "18px",
              color: "#ffffff",
            }}
          >
            {selectedEvent?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "14px",
            color: "#2e3340",
            padding: "24px",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <strong>Description:</strong>
            <span style={{ marginLeft: "8px", color: "#4a4f55" }}>
              {selectedEvent?.description || "N/A"}
            </span>
          </div>
        </Modal.Body>
        <Modal.Footer
          style={{
            padding: "16px",
            borderTop: "none",
            backgroundColor: "#f8f9fa",
          }}
        >
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            style={{
              backgroundColor: "#dde2ed",
              color: "#1C335C",
              border: "none",
              fontFamily: "Manrope, sans-serif",
              fontWeight: 500,
              padding: "8px 16px",
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
