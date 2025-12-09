import { FC, useEffect, useState } from "react";
import { KTIcon } from "../../../helpers";
// import { Dropdown1 } from "../../content/dropdown/Dropdown1";

type Props = {
  className: string;
};

interface TimetableItem {
  id: number;
  subject_name: string;
  time_from: string;
  time_to: string;
  room_no: string;
  // Add other properties as needed
}

const ListsWidget11: FC<Props> = () => {
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

        // Get today's timetable
        const today = new Date().toLocaleDateString("en-US", {
          weekday: "long",
        });
        const todaysTimetableData = data[today] || [];
        setTimetableData(todaysTimetableData);
      } catch (error) {
        console.error("Error fetching timetable data:", error);
      }
    };

    fetchTimetableData();
  }, []);

  const getColorByIndex = (index: number) => {
    switch (index) {
      case 0:
        return "warning";
      case 1:
        return "success";
      case 2:
        return "danger";
      case 3:
        return "info";
      default:
        return "info"; // or any default color
    }
  };

  return (
    <div className="card card-xl-stretch mb-5 mb-xl-8">
     <div className="d-flex p-6 justify-content-between align-items-center" >
        <div>
        <h3 className="card-title fw-bold text-gray-900">Today's Time Table</h3>
        </div>
        <div className="text-end">
        <a href="#" className="btn btn-sm btn-ghost">View More -{">"}</a>
      </div>
        
      </div>
      <div
        className="card-body pt-0 pb-0"
        style={{ maxHeight: "375px", overflowY: "auto" }}
      >
        
          {timetableData.map((item, index) => (
            <div
              key={item.id}
              className={`d-flex align-items-center rounded p-5 mb-7 ${
                index === 0
                  ? "bg-light-warning"
                  : index === 1
                  ? "bg-light-success"
                  : index === 2
                  ? "bg-light-danger"
                  : "bg-light-info"
              }`}
            >
              <span className={`text-${getColorByIndex(index)} me-5`}>
                <KTIcon
                  iconName="abstract-26"
                  className={`text-${getColorByIndex(index)} fs-1 me-5`}
                />
              </span>
              <div className="flex-grow-1 me-2">
                <a
                  href="#"
                  className="fw-bold text-gray-800 text-hover-primary fs-6"
                >
                  {item.subject_name}
                </a>
                <span className="text-muted fw-semibold d-block">
                  {item.time_from} to {item.time_to} in Room {item.room_no}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export { ListsWidget11 };
