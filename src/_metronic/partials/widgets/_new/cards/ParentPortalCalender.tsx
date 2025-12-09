import React, { Fragment, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { DOMAIN } from "../../../../../app/routing/ApiEndpoints";
import { Modal, Button } from "react-bootstrap";
import "./ParentPortalCalender.css";

// Custom hook to detect mobile view
const useMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return isMobile;
};

interface Event {
  title: string;
  start: string;
  end: string;
  description?: string;
  role?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export default function ParentPortalCalender({schoolId, sessionId}) {
  console.log(schoolId,sessionId);
  
  const isMobile = useMobile();
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);


  useEffect(() => {
    const fetchEvents = async () => {
      if(!schoolId || !sessionId) return;
      const school_id = schoolId;
      const session_id = sessionId;
      try {
        const res = await fetch(`${DOMAIN}/get-events/${school_id}/${session_id}`);
        const data = await res.json();
        console.log(data);
        
        const mapped = data.map((e: any) => ({
          title: e.event_title,
          start: moment(e.start_date).format("YYYY-MM-DDTHH:mm:ss"),
          end: moment(e.end_date).format("YYYY-MM-DDTHH:mm:ss"),
          description: e.event_description,
          role: e.role,
          backgroundColor: e.event_color || "#1C335C",
          borderColor: e.event_color || "#1C335C",
        }));
        setEvents(mapped);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, [schoolId,sessionId]);

  const handleEventClick = (info: any) => {
    setSelectedEvent({
      title: info.event.title,
      description: info.event.extendedProps.description,
      role: info.event.extendedProps.role,
      start: info.event.startStr,
      end: info.event.endStr,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  // Define different toolbar layouts for mobile vs desktop
  // Define different toolbar layouts for mobile vs desktop
// Define different toolbar layouts for mobile vs desktop
const headerToolbar = isMobile
  // On mobile, place arrows in left/right chunks and title centered
  ? { left: "prev,next", center: "title", right: "" }
  : { left: "prev,next today", center: "title", right: "dayGridMonth,dayGridWeek,dayGridDay" };

  const footerToolbar = isMobile
    ? { left: "", center: "", right: "dayGridMonth,dayGridWeek,dayGridDay" }
    : undefined;

  return (
    <Fragment>
      <div className="calendar-container dashboard-calendar">
        <div className="calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
            headerToolbar={headerToolbar}
            footerToolbar={footerToolbar}
            height={isMobile ? 400 : 500}
            contentHeight={isMobile ? 400 : 500}
            aspectRatio={isMobile ? 1 : 1.5}
            eventColor="#1C335C"
            eventTextColor="#fff"
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            handleWindowResize={true}
          />
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton style={{ backgroundColor: '#1C335C', borderBottom: 'none' }} closeVariant="white">
          <Modal.Title style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: '18px', color: '#ffffff' }}>
            {selectedEvent?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', color: '#2e3340', padding: '24px' }}>
          <div style={{ marginBottom: '12px' }}>
            <strong>Description:</strong>
            <span style={{ marginLeft: '8px', color: '#4a4f55' }}>{selectedEvent?.description || 'N/A'}</span>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ padding: '16px', borderTop: 'none', backgroundColor: '#f8f9fa' }}>
          <Button variant="secondary" onClick={handleCloseModal} style={{ backgroundColor: '#dde2ed', color: '#1C335C', border: 'none', fontFamily: 'Manrope, sans-serif', fontWeight: 500, padding: '8px 16px' }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}


