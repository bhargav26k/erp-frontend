/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../../app/modules/auth";
import { DOMAIN } from "../../../../../app/routing/ApiEndpoints";

const CardsWidget21: FC = () => {
  const [filter, setFilter] = useState("yearly");
  const [onTimePercentage, setOnTimePercentage] = useState("0%");
  const [isLoading, setIsLoading] = useState(false);
  const {currentUser} = useAuth();
  const school_id = currentUser?.school_id; 
  const session_id = currentUser?.session_id; 

  const fetchOnTimeStats = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${DOMAIN}/api/school/get-on-time-fee-stats`,
        {
          params: {
            school_id: school_id, // Replace with actual school ID
            session_id: session_id, // Replace with actual session ID
            filter,
          },
        }
      );

      if (response.data) {
        setOnTimePercentage(response.data.percentage);
      }
    } catch (error) {
      console.error("Error fetching on-time fee stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOnTimeStats();
  }, [filter,school_id,session_id]);
  return (
    <div
      className="h-md-100 mb-md-5 mb-lg-5"
      style={{
        backgroundColor: "#1F3259",
        borderRadius: "16px",
        padding: "20px",
        gap: "27px",
        display: "flex",
        border: "1px solid green",
      }}
    >
      <div className="card-header d-flex">
        <div className="card-title d-flex flex-column justify-content-between">
          <span
            style={{
              color: "#FFFFFF",
              fontWeight: "600",
              lineHeight: "19.12px",
              fontSize: "16px",
              fontFamily: "Manrope",
            }}
          >
            On Time Fee
          </span>
          <div>
            <div
              className="d-flex align-items-center"
              style={{
                width: "144px",
                height: "36px",
                gap: "8px",
                marginBottom: "5px",
              }}
            >
              <span
                style={{
                  color: "#A7FFB0",
                  fontWeight: "700",
                  fontSize: "32px",
                  lineHeight: "36px",
                  fontFamily: "Manrope",
                }}
              >
                {isLoading ? (
                  <span>Loading...</span>
                ) : (
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      color: "#A7FFB0",
                    }}
                  >
                    {onTimePercentage}
                  </h1>
                )} 
              </span>
              {/* <div
                style={{ display: "flex", gap: "5px", alignItems: "center" }}
              >
                <span
                  style={{
                    fontFamily: "Manrope",
                    color: "#FFF",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  
                </span>
                <span style={{ width: "69px", height: "18px", gap: "10px" }}>
                  <svg
                    viewBox="0 0 13 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      width: "16.5px",
                      height: "11px",
                      color: "#29B837",
                    }}
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6.95488 1.60777L12.5 0L11.1198 5.6061L9.39804 3.9532L6.62069 6.84627C6.52641 6.94448 6.39615 7 6.26 7C6.12385 7 5.99359 6.94448 5.89931 6.84627L3.86 4.72199L0.860694 7.84627C0.669457 8.04547 0.35294 8.05193 0.153735 7.86069C-0.0454709 7.66946 -0.0519304 7.35294 0.139307 7.15373L3.49931 3.65373C3.59359 3.55552 3.72385 3.5 3.86 3.5C3.99615 3.5 4.12641 3.55552 4.22069 3.65373L6.26 5.77801L8.67665 3.26067L6.95488 1.60777Z"
                      fill="#29B837"
                    />
                  </svg>
                </span>
              </div> */}
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              {/* <span
              style={{
                color: "#C6E0F3",
                fontWeight: "400",
                lineHeight: "16.39px",
                fontSize: "12px",
                fontFamily:"Manrope",
              }}
            >
              Last Year{" "} */}
              <span
                style={{
                  color: "#FFF",
                  fontWeight: "700",
                  lineHeight: "16.39px",
                  fontSize: "12px",
                  fontFamily: "Manrope",
                  cursor: "pointer",
                  textDecoration: filter === "yearly" ? "underline" : "none",
                }}
                onClick={() => setFilter("yearly")}
              >
                Yearly
              </span>
              {/* </span> */}
              <span
                style={{
                  // marginTop:'15px',
                  // border:'1px solid',
                  color: "#C6E0F3",
                  fontWeight: "400",
                  lineHeight: "16.39px",
                  fontSize: "12px",
                  fontFamily: "Manrope",
                  textDecoration: filter === "6m" ? "underline" : "none",
                  cursor: "pointer",
                }}
                onClick={() => setFilter("6m")}
              >
                6M
              </span>
              <span
                style={{
                  // marginTop:'15px',
                  // border:'1px solid',
                  textDecoration: filter === "3m" ? "underline" : "none",
                  color: "#C6E0F3",
                  fontWeight: "400",
                  lineHeight: "16.39px",
                  fontSize: "12px",
                  fontFamily: "Manrope",
                  cursor: "pointer",
                }}
                onClick={() => setFilter("3m")}
              >
                3M
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CardsWidget21 };
