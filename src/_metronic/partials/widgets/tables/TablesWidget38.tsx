import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";


interface Announcement {
  classes: string;
  sections: string;
  subjects: string;
  announcement_title:string;
  staff:string;
  start_date:string;
}



const TablesWidget38: React.FC = () => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;

  const [getAllAnnouncements, setAllAnnouncemnets] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAllAnnouncements = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-allannouncements/${school_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAllAnnouncemnets(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllAnnouncements();
  }, [school_id]);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Handle invalid date
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-GB", options);
  };
  

  return (
    <div
      className=""
      style={{
        width: "100%",
        height: "640px",
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
            height:'640px',
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
            // paddingRight: "24px",
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
              //
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
                Recent Announcements
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
                  Section
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
                  Subject
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
                  Staff
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
                  Date
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
            height: "518px", // Set the height to match the container
            overflowY: "auto",
            overflowX: "hidden", // Prevent horizontal scrolling
          }}
        >
          {getAllAnnouncements.map((item, index) => (
            <div
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
              <tr
                className=""
                key={index}
                style={{
                  width: "100%",
                  height: "61px",
                  display: "flex",
                  paddingLeft: "36px",
                  paddingRight: "10px",
                  paddingTop: "18px",
                  gap: "20px",
                  //   justifyContent:'space-between  ',
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
                      {item.classes}
                    </a>
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      width: "60px",
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
                      {item.sections}
                    </span>
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      width: "10px",
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
                      {item.subjects}
                    </span>
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      width: "180px",
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
                      {item.announcement_title}
                    </span>
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      width: "70px",
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
                      {item.staff}
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
                      {formatDate(item.start_date)}
                    </span>
                  </div>
                </td>
              </tr>
            </div>
          ))}
        </tbody>
        {/* end::Table body */}
      </table>
      {/* end::Table */}
    </div>
  );
};

export { TablesWidget38 };
