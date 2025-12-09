import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";



interface Deadline {
  id: number;
  title: string;
  class: string; 
  type : string;
  subject : string;
  staff_name : string;
  end_date : string;
}

const TablesWidget37: React.FC = () => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;

  const [allUpcomingDeadlines, setAllUpcomingDeadlines] = useState<Deadline[]>([]);

  useEffect(() => {
    const fetchAllAnnouncements = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-allupcomingdeadlines/${school_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAllUpcomingDeadlines(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllAnnouncements();
  }, []);


  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date: Date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
};



  return (
    <div
      className=""
      style={{
        width: "100%",
        height: "310px",
        borderRadius: "16px",
        border: "1px solid #D2D2D2",
        overflow: "hidden",
      }}
    >
      <table
        className=""
        style={{
          top: "123px",
          width: "100%",
          borderCollapse: "collapse",
          overflowY: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <thead
          style={{
            // border:'1px solid ',
            backgroundColor: "#F5F5F5",
            display: "flex",
            flexDirection: "column",
            // width:'100%',
            height: "120px",
            maxHeight: "100%",
            justifyContent: "space-between",
            zIndex: 999,
            paddingLeft: "24px",
            // borderBottom: "1px solid #DADADA",
          }}
        >
          <caption
            style={{
              paddingLeft: "20px",
              paddingRight: "20px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "24px",
              padding: "0px",
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <span
                style={{
                  color: "#000",
                  fontSize: "16px",
                  fontWeight: "600",
                  fontFamily: "Manrope",
                }}
              >
                Upcomming DeadLines
              </span>
            </div>
          </caption>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <tr
              style={{
                width: "100%",
                height: "34px",
                display: "flex",
                gap: "30px",
              }}
            >
              <th style={{ width: "100px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    lineHeight: "18px",
                    color: "#000",
                    fontFamily: "Manrope",
                  }}
                >
                  Class
                </span>
              </th>
              <th style={{ width: "100px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    lineHeight: "18px",
                    color: "#000",
                    fontFamily: "Manrope",
                  }}
                >
                  Title
                </span>
              </th>
              <th style={{ width: "120px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    lineHeight: "18px",
                    color: "#000",
                    fontFamily: "Manrope",
                  }}
                >
                  Type
                </span>
              </th>
              <th style={{ width: "120px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    lineHeight: "18px",
                    color: "#000",
                    fontFamily: "Manrope",
                  }}
                >
                  Course
                </span>
              </th>
              <th style={{ width: "120px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    lineHeight: "18px",
                    color: "#000",
                    fontFamily: "Manrope",
                  }}
                >
                  Instructor
                </span>
              </th>
              <th style={{ width: "120px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    lineHeight: "18px",
                    color: "#000",
                    fontFamily: "Manrope",
                  }}
                >
                  Due Date
                </span>
              </th>
            </tr>
          </div>
        </thead>
        <tbody
          className=""
          style={{
            display: "block",
            width: '100%',
            height: "188px", // Set the height to match the container
            overflowY: "auto",
            overflowX: "hidden", // Prevent horizontal scrolling
          }}
        >
          {allUpcomingDeadlines.map((item, index) => (
            <tr
              key={index}
              className="tile-shadow"
              style={{
                display: "flex",
                height: "61px",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                backgroundColor: "#F7F9FB",
                gap: "30px",
              }}
            >
              <td>
                <div
                  className=""
                  style={{
                    width: "90px",
                    display: "flex",
                    flexDirection: "column",
                    marginRight: "20px",
                  }}
                >
                  <a
                    href="#"
                    className=""
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#000",
                    }}
                  >
                    {item.class}
                  </a>
                </div>
              </td>
              <td>
                <div
                  style={{
                    width: "80px",
                    overflow:'hidden',
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                    marginRight: "30px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      lineHeight: "18px",
                      color: "#1F1F1F",
                      fontFamily: "Manrope",
                    }}
                  >
                    {item.title}
                  </span>
                </div>
              </td>
              <td>
                <div
                  style={{
                    width: "30px",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                    marginRight: "70px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      lineHeight: "18px",
                      color: "#1F1F1F",
                      fontFamily: "Manrope",
                    }}
                  >
                    {item.type}
                  </span>
                </div>
              </td>
              <td>
                <div
                  style={{
                    width: "80px",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                    marginRight: "30px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      lineHeight: "18px",
                      color: "#1F1F1F",
                      fontFamily: "Manrope",
                    }}
                  >
                    {item.subject}
                  </span>
                </div>
              </td>
              <td>
                <div
                  style={{
                    width: "120px",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      lineHeight: "18px",
                      color: "#1F1F1F",
                      fontFamily: "Manrope",
                    }}
                  >
                    {item.staff_name}
                  </span>
                </div>
              </td>
              <td>
                <div
                  style={{
                    width: "100px",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column"
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      lineHeight: "18px",
                      color: "#1F1F1F",
                      fontFamily: "Manrope",
                    }}
                  >
                    {formatDate(item.end_date)}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        {/* end::Table body */}
      </table>
      {/* end::Table */}
    </div>
  );
};

export { TablesWidget37 };
