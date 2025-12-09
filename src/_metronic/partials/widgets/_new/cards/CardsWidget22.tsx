import clsx from "clsx";
import { useThemeMode } from "../../../../../_metronic/partials";
import { useEffect, useState } from "react";

type Props = {
  className: string;
  title: string;
};

type TimetableItem = {
  day: string;
  id: string;
  subject_name: string;
  time_from: string;
  time_to: string;
  room_no: string;
  // Add other properties as needed
};

const CardsWidget22 = ({ className, title }: Props) => {
  const { mode } = useThemeMode();
  const [timetableData, setTimetableData] = useState<TimetableItem[]>([]);

  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        const response = await fetch(
          "https://erp.innoveraschool.com/site/student_timetable",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              class_id: "3",
              section_id: "7",
            }),
          }
        );
        const data = await response.json();

        // Filter timetable data for the specific day
        const dayTimetableData = data[title] || [];
        setTimetableData(dayTimetableData);
      } catch (error) {
        console.error("Error fetching timetable data:", error);
      }
    };

    fetchTimetableData();
  }, [title]);

  return (
    <div>
      <div
        className={`card card-flush border d-flex justify-content-center ali bgi-no-repeat bgi-size-contain bgi-position-x-end ${className}`}
        style={
          mode === "light"
            ? {
                background:
                  "linear-gradient(to bottom, orange -80%, white 60%)",
              }
            : {}
        }
      >
        <div className="card-header">
          <div className="card-title d-flex flex-column align-items-center mx-auto">
            <span className="fs-1 fw-bold text-white me-2 lh-1 ls-n2 text-gray-900">
              {title}
            </span>
          </div>
        </div>
      </div>
      {timetableData && timetableData.length > 0 ? (
        timetableData.map((item) => (
          <div
            className={`card card-flush border d-flex justify-content-center ali bgi-no-repeat bgi-size-contain bgi-position-x-end p-1 ${className}`}
            style={
              mode === "light"
                ? {
                    background:
                      "linear-gradient(to bottom, orange -80%, white 60%)",
                  }
                : {}
            }
          >
            <li key={item.id} className="list-unstyled">
              <div className="card-header">
                <div className="card-title d-flex flex-column align-items-center mx-auto">
                  <span className="fs-5 text-white me-2 lh-2 text-gray-800">
                    {item.subject_name} - {item.time_from} to {item.time_to} in
                    Room {item.room_no}
                  </span>
                </div>
              </div>
            </li>
          </div>
        ))
      ) : (
        <div
          className={`card card-flush border d-flex justify-content-center ali bgi-no-repeat bgi-size-contain bgi-position-x-end p-2 ${className}`}
          style={
            mode === "light"
              ? {
                  background:
                    "linear-gradient(to bottom, orange -80%, white 60%)",
                }
              : {}
          }
        >
          <div className="card-header">
            <div className="card-title d-flex flex-column align-items-center mx-auto">
              <span className="fs-5 text-white me-2 lh-2 text-gray-800">
                No Schedule
              </span>
            </div>
          </div>
        </div>
      )}
      {/* <div>
        
        <ul>
          {timetableData.map((item) => (
            <li key={item.id}>
              {item.subject_name} - {item.time_from} to {item.time_to} in Room{" "}
              {item.room_no}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export { CardsWidget22 };
