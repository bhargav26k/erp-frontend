/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC,useEffect, useState } from "react";
import { useAuth } from "../../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../../app/routing/ApiEndpoints";

const CardsWidget34: FC = () => {

  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;

  const [totalAnnouncements, setTotalAnnouncements] = useState();


  useEffect(() => {
    const fetchTotalAnnouncements = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-totalannouncements/${school_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTotalAnnouncements(data.totalLmsAnnouncements);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTotalAnnouncements();
  }, []);

  return (
    <div
      className="h-md-100 mb-md-5 mb-lg-5"
      style={{
        backgroundColor: "#1F3259",
        borderRadius: "16px",
        gap: "10px",
        // height:'auto',
        padding:'18px',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="card-header"
        style={{
          display: "flex",
          width:'100%',
          justifyContent: "center",
        }}
      >
        <div
          className="card-title"
          style={{
            justifyContent: "center",

            display: "flex",
            flexDirection: "column",
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontWeight: "600",
              lineHeight: "30.12px",
              fontSize: "20px",
              fontFamily: "Manrope",
            }}
          >
            Total Announcements
          </span>
        </div>
      </div>
      <div
        className="card-body"
        style={{
          display: "flex",
          width:'100%',
          justifyContent: "center",alignItems:'center'
        }}
      >
        <div
          className="d-flex"
          style={{
            gap: "24px",
          }}
        >
          <span
            style={{
              color: "#A7FFB0",
              fontWeight: "700",
              fontSize: "42px",
              lineHeight: "30px",
              fontFamily: "Manrope",
            }}
          >
            {totalAnnouncements}
          </span>
        </div>
      </div>
    </div>
  );
};

export { CardsWidget34 };
