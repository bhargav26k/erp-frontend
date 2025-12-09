// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
// import { DOMAIN, getTimetableStudentWise } from "../../../../app/routing/ApiEndpoints";
// import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import { useAuth } from "../../../../app/modules/auth/core/Auth";
// import '../../../../app/pages/StudentPages/style.css';
// import { toAbsoluteUrl } from "../../../helpers";

// const localizer = momentLocalizer(moment);

// export const VIEW_OPTIONS = [
//   { id: Views.DAY, label: "Day" },
//   { id: Views.WEEK, label: "Week" },
//   { id: Views.MONTH, label: "Month" }
// ];

// interface TablesWidget25Props {
//   defaultViewProp: string; // Define the prop 'defaultViewProp'
//   toolbarAction: string | null; // Define toolbarAction as a string or null
//   DateText: (datetext: SetStateAction<null>) => void; // Define DateText as a function that accepts a string
//   Clicks: number; // Define Clicks as a number
// }

// interface TimetableEvent {
//   subject_name: string;
//   staff_name: string;
//   staff_surname: string;
//   start_time: string;
//   end_time: string;
//   day: string;
// }

// interface EventData {
//   title: string;
//   description: string;
//   teacher: string;
//   startHour: number;
//   startMinute: number;
//   endHour: number;
//   endMinute: number;
//   day: string;
// }

// const TablesWidget25: React.FC<TablesWidget25Props> = ({ defaultViewProp, toolbarAction, DateText, Clicks }) => {
//   const [view, setView] = useState(Views.WEEK);
//   const [date, setDate] = useState<Date>(moment("2024-03-28").toDate());
//   const [eventsData, setEventsData] = useState<EventData[]>([]);
  
//   useEffect(() => {
//     const matchingOption = VIEW_OPTIONS.find(option => option.label.toLowerCase() === defaultViewProp.toLowerCase());
//     if (matchingOption) {
//                             /* @ts-ignore */

//       setView(matchingOption.id);
//     }
//   }, [defaultViewProp]);

//   const onPrevClick = useCallback(() => {
//                           /* @ts-ignore */

//     if (view === Views.DAY) {
//       setDate(moment(date).subtract(1, "d").toDate());
//     } else if (view === Views.WEEK) {
//       setDate(moment(date).subtract(1, "w").toDate());
//     } else {
//       setDate(moment(date).subtract(1, "M").toDate());
//     }
//   }, [view, date]);

//   const onNextClick = useCallback(() => {                      /* @ts-ignore */

//     if (view === Views.DAY) {
//       setDate(moment(date).add(1, "d").toDate());
//     } else if (view === Views.WEEK) {
//       setDate(moment(date).add(1, "w").toDate());
//     } else {
//       setDate(moment(date).add(1, "M").toDate());
//     }
//   }, [view, date]);

//   useEffect(() => {
//     if (toolbarAction === 'prev') {
//       onPrevClick();
//     } else if (toolbarAction === 'next') {
//       onNextClick();
//     }
//   }, [toolbarAction, Clicks, onPrevClick, onNextClick]);
  
//   const dateTextConverter = useMemo(() => {                     
//  /* @ts-ignore */
//     if (view === Views.DAY) {
//        /* @ts-ignore */
//       DateText(moment(date).format("ddd, MMM DD"));
//     }
//     if (view === Views.WEEK) {
//       const from = moment(date).startOf("week");
//       const to = moment(date).endOf("week");
//        /* @ts-ignore */
//       DateText(`${from.format("MMM DD")} to ${to.format("MMM DD")}`);
//     }                      /* @ts-ignore */

//     if (view === Views.MONTH) {
//        /* @ts-ignore */
//       DateText(moment(date).format("MMMM YYYY"));
//     }
//   }, [view, date, DateText]);

//   const { currentUser } = useAuth();
//                         /* @ts-ignore */

//   const classId = currentUser?.class_id;                      /* @ts-ignore */

//   const sectionId = currentUser?.section_id;
//   const [timetable, setTimetable] = useState<TimetableEvent[]>([]);

//   const fetchTimeTable = async () => {
//     try {
//       const response = await fetch(`${DOMAIN}/${getTimetableStudentWise}/${classId}/${sectionId}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch timetable");
//       }
//       const data = await response.json();
//       setTimetable(data);
//     } catch (error) {
//       console.error("Error fetching timetable:", error);
//     }
//   };

//   useEffect(() => {
//     fetchTimeTable();
//   }, []);

//   useEffect(() => {
//     const mappedData = timetable.map(item => ({
//       title: item.subject_name,
//       description: `Teacher: ${item.staff_name} ${item.staff_surname}`,
//       teacher: `${item.staff_name} ${item.staff_surname}`,
//       startHour: parseInt(item.start_time.substring(0, 2)),
//       startMinute: parseInt(item.start_time.substring(3, 5)),
//       endHour: parseInt(item.end_time.substring(0, 2)),
//       endMinute: parseInt(item.end_time.substring(3, 5)),
//       day: item.day
//     }));
//     setEventsData(mappedData);
//   }, [timetable]);

//   function generateEvents(startDate: Date, endDate: Date, eventsData: EventData[]) {                      /* @ts-ignore */

//     const events = [];
//     const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//                         /* @ts-ignore */

//     const currentDate = new Date(startDate);
//     while (currentDate <= endDate) {
//       const dayOfWeek = daysOfWeek[currentDate.getDay()];
    
//       const dayEvents = eventsData.filter(event => event.day === dayOfWeek);
    
//       dayEvents.forEach(event => {
//         const start = new Date(currentDate);
//         start.setHours(event.startHour);
//         start.setMinutes(event.startMinute);
      
//         const end = new Date(currentDate);
//         end.setHours(event.endHour);
//         end.setMinutes(event.endMinute);
      
//         events.push({
//           title: event.title,
//           description: event.description,
//           teacher: event.teacher,
//           start: start,
//           end: end,
//           day: dayOfWeek
//         });
//       });
    
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
//                         /* @ts-ignore */

//     return events;
//   }

//   const startDate = new Date(2024, 0, 1); // January 1, 2024
//   const endDate = new Date(2024, 2, 28); // March 28, 2024

//   const events = generateEvents(startDate, endDate, eventsData);

//   const MyTimeGutter = () => {
//     return (
//       <div className="rbc-label rbc-time-header-gutter" style={{ width: '100%', height:'100%', minWidth: '50px', maxWidth: '64.5156px', color: '#000', display:'flex', justifyContent:'center', alignItems:'center', fontSize:'16px', fontFamily:'Manrope', fontWeight:'500' }}>
//         Time
//       </div>
//     );
//   };
//   const EventComponent = ({ event }: { event: any }) => (
//     <div style={{
//       display:'flex',
//       flexDirection:'column',
//       justifyContent:'space-between',
//       height:'100%',
//       padding:'5px',
//       fontFamily:'Manrope',
//     }}>
//       <div style={{display:'flex', justifyContent:'space-between'}}>
//         <span style={{ fontFamily:'Manrope', fontWeight:'600', fontSize:'16px', color:'#212121' }}>{event.title}</span>
//         <img src={toAbsoluteUrl('media/avatars/abc-block.png')} style={{ width:'25px', height:'25px' }} alt="Avatar" />
//       </div>
//       <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
//         <span style={{ color:'#727272', fontSize:'12px', fontWeight:'400' }}>{event.description}</span>
//         <div><img src={toAbsoluteUrl('media/avatars/profile.png')} style={{ borderRadius:'15px', width:'25px', height:'25px' }} alt="Profile" /> {event.teacher}</div>
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ height: 700, borderRadius:'10px' }}>
//       <Calendar
//         localizer={localizer}
//         defaultView={Views.WEEK}
//         startAccessor="start"
//         endAccessor="end"
//         events={events}
//         style={{ height: 800 }}
//         toolbar={false}
//         view={view}
//         min={new Date("2024-03-28T08:00:00")}
//         max={new Date("2024-03-28T17:00:00")}
//         components={{ timeGutterHeader: MyTimeGutter, event: EventComponent }}
//         showMultiDayTimes
//         date={date}
//       />
//     </div>
//   );
// };

// export { TablesWidget25 };



































// // function calculateDate(hour, minute, dayOfWeek) {
// //   const today = new Date();
// //   const currentYear = today.getFullYear();
// //   const currentMonth = today.getMonth(); // January is 0, December is 11
// //   const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// //   const dayIndex = days.indexOf(dayOfWeek);
// //   const currentDate = today.getDate(); // Current day of the month
// //   const currentDay = today.getDay(); // Current day of the week (0 for Sunday, 1 for Monday, etc.)

// //   // Calculate the difference between today's day and the desired day of the week
// //   let dayDifference = dayIndex - currentDay;
// //   if (dayDifference < 0) {
// //     // If the desired day of the week is earlier in the week than today, add 7 days
// //     dayDifference += 7;
// //   }

// //   // Calculate the date of the next occurrence of the desired day of the week
// //   const nextDate = currentDate + dayDifference;
// //   const eventDate = new Date(currentYear, currentMonth, nextDate, hour, minute);

// //   return eventDate;
// // }






// // date wise data insertion 
// // const eventsData = [
// //   {
// //     title: 'Science',
// //     description: 'Experiment demonstration',
// //     teacher: 'Emily Johnson',
// //     startHour: 9,
// //     startMinute: 30,
// //     endHour: 10,
// //     endMinute: 30,
// //     day: 'Tuesday',
// //     date: new Date(2024, 2, 29) // March 29, 2024
// //   },
// //   {
// //     title: 'History',
// //     description: 'Discussion on ancient civilizations',
// //     teacher: 'Michael Brown',
// //     startHour: 13,
// //     startMinute: 0,
// //     endHour: 14,
// //     endMinute: 0,
// //     day: 'Thursday',
// //     date: new Date(2024, 2, 31) // March 31, 2024
// //   },
// //   {
// //     title: 'Art',
// //     description: 'Painting session',
// //     teacher: 'Sophia Lee',
// //     startHour: 11,
// //     startMinute: 0,
// //     endHour: 12,
// //     endMinute: 0,
// //     day: 'Friday',
// //     date: new Date(2024, 3, 1) // April 1, 2024
// //   },
// //   {
// //     title: 'Physical Education',
// //     description: 'Outdoor sports activities',
// //     teacher: 'David Martinez',
// //     startHour: 14,
// //     startMinute: 30,
// //     endHour: 16,
// //     endMinute: 0,
// //     day: 'Monday',
// //     date: new Date(2024, 3, 3) // April 3, 2024
// //   },
// //   {
// //     title: 'Music',
// //     description: 'Instrumental practice',
// //     teacher: 'Anna Wilson',
// //     startHour: 10,
// //     startMinute: 0,
// //     endHour: 11,
// //     endMinute: 0,
// //     day: 'Wednesday',
// //     date: new Date(2024, 3, 5) // April 5, 2024
// //   }
// // ];


// // const events = eventsData.map(eventData => {
// //   const { title, description, teacher, startHour, startMinute, endHour, endMinute, day, date } = eventData;

// //   // Get the year, month, and day from the event date
// //   const year = date.getFullYear();
// //   const month = date.getMonth();
// //   const dayOfMonth = date.getDate();

// //   // Calculate the start and end time
// //   const start = new Date(year, month, dayOfMonth, startHour, startMinute);
// //   const end = new Date(year, month, dayOfMonth, endHour, endMinute);

// //   // Calculate the day of the week
// //   const currentDayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

// //   return {
// //     title: title,
// //     description: description,
// //     teacher: teacher,
// //     start: start,
// //     end: end,
// //     day: currentDayOfWeek
// //   };
// // });



// // const eventsData = [
// //   {
// //     title: 'Science',
// //     description: 'Experiment demonstration',
// //     teacher: 'Emily Johnson',
// //     startHour: 9,
// //     startMinute: 30,
// //     endHour: 10,
// //     endMinute: 30,
// //     day: 'Tuesday'
// //   },
// //   {
// //     title: 'History',
// //     description: 'Discussion on ancient civilizations',
// //     teacher: 'Michael Brown',
// //     startHour: 13,
// //     startMinute: 0,
// //     endHour: 14,
// //     endMinute: 0,
// //     day: 'Thursday'
// //   },
// //   {
// //     title: 'Art',
// //     description: 'Painting session',
// //     teacher: 'Sophia Lee',
// //     startHour: 11,
// //     startMinute: 0,
// //     endHour: 12,
// //     endMinute: 0,
// //     day: 'Friday'
// //   },
// //   {
// //     title: 'Physical Education',
// //     description: 'Outdoor sports activities',
// //     teacher: 'David Martinez',
// //     startHour: 14,
// //     startMinute: 30,
// //     endHour: 16,
// //     endMinute: 0,
// //     day: 'Monday'
// //   },
// //   {
// //     title: 'Music',
// //     description: 'Instrumental practice',
// //     teacher: 'Anna Wilson',
// //     startHour: 10,
// //     startMinute: 0,
// //     endHour: 11,
// //     endMinute: 0,
// //     day: 'Wednesday'
// //   }
// // ];