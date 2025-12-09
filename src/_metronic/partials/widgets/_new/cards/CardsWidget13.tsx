/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from "react";
import { useEffect,useState } from "react";
import { DOMAIN,getWinRatePercentage } from '../../../../../app/routing/ApiEndpoints.tsx'; 
import { useAuth } from "../../../../../app/modules/auth/index.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CardsWidget13: FC = ({ selectedValue }:any) => {
  const [conversionRatio, setConversionRatio] = useState<number | null>(null);
  const [lastYearRatio, setLastYearRatio] = useState<number | null>(null);
  const {currentUser} = useAuth();
  const schoolId = currentUser?.school_id;
  

 
  const fetchEnquiries = async () => {
    try {
      const response = await fetch(`${DOMAIN}/${getWinRatePercentage}/${selectedValue}/${schoolId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch enquiries");
      }
      const data = await response.json();
      setConversionRatio(data.currentYear);
      setLastYearRatio(data.lastYear);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [selectedValue]);
  return (
    <div className="col-md-12 col-lg-12 col-xl-12"
      style={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "  #F2F6FF",
        width: "100%",
        height: "107px",
        borderRadius: "16px",
        justifyContent: "space-between",
        padding: "20px 15px",
        // gap: "60px",
        // justifyContent: "",
        alignItems: "start",
        fontFamily:"Manrope",
      }}
    >
      <div style={{ width: "55%", height: "34px", }}>
        <span
          style={{
            color: "#000000",
            fontWeight: "600",
            lineHeight: "21.86px",
            fontSize: "16px",
          }}
        >
          Conversion Ratio
        </span>
      </div>
      <div
        style={{
          width: "45%",
          height: "75px",
          gap: "10px",
          display: "flex",
          flexDirection: "column",
          // justifyContent:'end',
          // marginTop:'5px'
        }}
      >
        <div
          style={{
            width: "100%",
            height: "36px",
            display: "flex",
            // alignItems: "right",
            gap: "3px",
            justifyContent:'right'

          }}
        >
          <span
            style={{
              fontSize: "30px",
              fontWeight: "600",
              lineHeight: "36px",
              color: "#29B837",
            }}
          >
            {conversionRatio !== null ? `${conversionRatio}` : "Loading..."}<span style={{  fontSize: "15px",}}>%</span>
          </span>
          {/* <svg
            width="13"
            height="8"
            viewBox="0 0 13 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.95488 1.60777L12.5 0L11.1198 5.6061L9.39804 3.9532L6.62069 6.84627C6.52641 6.94448 6.39615 7 6.26 7C6.12385 7 5.99359 6.94448 5.89931 6.84627L3.86 4.72199L0.860694 7.84627C0.669457 8.04547 0.35294 8.05193 0.153735 7.86069C-0.0454709 7.66946 -0.0519304 7.35294 0.139307 7.15373L3.49931 3.65373C3.59359 3.55552 3.72385 3.5 3.86 3.5C3.99615 3.5 4.12641 3.55552 4.22069 3.65373L6.26 5.77801L8.67665 3.26067L6.95488 1.60777Z"
              fill="#29B837"
            />
          </svg> */}
        </div>
        <div style={{ width: "100%", height: "39px",display:'flex', justifyContent:'right',textAlign:'right' }}>
          <span
            style={{
              fontSize: "12px",
              fontWeight: "400",
              lineHeight: "16.39px",
              color: "#000000",
            }}
            >
            Last Year{" "}
            <span
              style={{
                fontSize: "12px",
                fontWeight: "700",
                lineHeight: "16.39px",
                color: "#000000",
              }}
            >
              {lastYearRatio !== null ? `${lastYearRatio}%` : "Loading..."}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export { CardsWidget13 };
