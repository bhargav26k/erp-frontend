import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useAuth } from "../../modules/auth/core/Auth";


interface Entry {
  type: string;
  date: string;
}

const StuAttendance: React.FC = () => {
  const { currentUser } = useAuth();
  const initialData: Entry[] = [];

  // const [attendanceData, setAttendanceData] = useState<AttendanceData>({});
  const [apiData, setApiData] = useState<Entry[]>(initialData);

  useEffect(() => {
    const fetchData = async () => {
      // const student_id = currentUser?.student_id;
      try {
        const response = await fetch(
          "https://erp.innoveraschool.com/site/student_attendance",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ student_id: 930 }),
          }
        );
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="p-20">
      <div className="">
        <h2><span className="text-success">{currentUser?.firstname}'s</span> Attendance</h2>
      </div>
      <div className="">
        <FullCalendar
          plugins={[dayGridPlugin]}
          events={apiData.map((entry) => ({
            title: entry.type,
            start: entry.date,
          }))}
        />
      </div>
    </div>
  );
};

export default StuAttendance;
