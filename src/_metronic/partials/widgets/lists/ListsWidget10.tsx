import { FC, useEffect, useState } from "react";
import { KTIcon } from "../../../helpers";

type Props = {
  className: string;
};

interface Notice {
  id: number;
  title: string;
  date: string; // Assuming date is provided as a string in "YYYY-MM-DD" format
}

const ListsWidget10: FC<Props> = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Month is 0-indexed, so add 1

    // Format the current month as "MM"
    const formattedMonth =
      currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;

    // Create start and end dates for the current month
    const start_date = `${currentYear}-${formattedMonth}-01`;
    const end_date = `${currentYear}-${formattedMonth}-${new Date(
      currentYear,
      currentMonth,
      0
    ).getDate()}`;

    const fetchNotices = async () => {
      try {
        const response = await fetch(
          "https://erp.innoveraschool.com/site/student_notices",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              class_id: "5",
              start_date,
              end_date,
            }),
          }
        );
        const data = await response.json();

        // Assuming the notices are an array in the response
        setNotices(data);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
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
      <div className="d-flex p-6 justify-content-between align-items-center">
        <div>
          <h3 className="card-title fw-bold text-gray-900">Notice Board</h3>
        </div>
        <div className="text-end">
          <a href="#" className="btn btn-sm btn-ghost">
            View More -{">"}
          </a>
        </div>
      </div>
      <div className="card-body pt-0 pb-0">
        {notices.slice(0, 4).map((notice, index) => (
          <div
            key={notice.id}
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
                {notice.title}
              </a>
              <span className="text-muted fw-semibold d-block">
                {new Date(notice.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ListsWidget10 };
