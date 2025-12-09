import { FC, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
import {
  DOMAIN,
  getAllAdmissions,
} from "../../../../app/routing/ApiEndpoints.tsx";
import { useAuth } from "../../../../app/modules/auth/index.ts";

interface Admissions {
  total_admissions_this_year: number;
  total_admissions_past_year: number;
  total_admissions_today: number;
  total_admissions_this_week: number;
  total_admissions_this_month: number;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChartsWidget15: FC = ({ selectedValue }: any) => {
  const [admissions, setAdmissions] = useState<Admissions>({
    total_admissions_today: 0,
    total_admissions_this_week: 0,
    total_admissions_this_month: 0,
    total_admissions_this_year: 0,
    total_admissions_past_year: 0,
  });

  const [admissionsData, setAdmissionsData] = useState<number[]>([0, 0]);

  // console.log(admissions.total_admissions_last_3_years[0].total_admissions);


  const currentYear = new Date().getFullYear();
  const currentFinancialYear = `${currentYear - 1}-${currentYear}`;
  const pastFinancialYear = `${currentYear - 2}-${currentYear - 1}`;

  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;

  useEffect(() => {
    const fetchAdmissions = async () => {
      // setLoading(true);
      // setError(null);

      try {
        const response = await fetch(
          `${DOMAIN}/${getAllAdmissions}/${selectedValue}/${schoolId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        // console.log(data);

        // console.log(data);
        setAdmissions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // setError('Error fetching data. Please try again later.');
      } finally {
        // setLoading(false);
      }
    };

    fetchAdmissions();
  }, [selectedValue]);

  useEffect(() => {
    // Destructure admissions directly
    const { total_admissions_this_year, total_admissions_past_year } = admissions;
    setAdmissionsData([total_admissions_this_year, total_admissions_past_year]);
  }, [admissions]);
  

  const optionsMOM = {
    chart: {
      type: "column",
      height: "385px",
      backgroundColor: "transparent",
      style: {
        zIndex: 9999,
        fontFamily: "Manrope",
        fontSize: "14px", // Set the z-index to a high value
      },
    },

    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },

    xAxis: {
      categories: [pastFinancialYear, currentFinancialYear],
      labels: {
        fontSize: "14px",
        fontFamily: "Manrope", // Adjust x-axis label font size
      },
    },

    yAxis: [
      {
        min: 0,
        title: {
          text: "",
        },
        labels: {
          enabled: true,
          fontFamily: "Manrope",
          fontSize: "14px",
        },
      },
      {
        title: {
          text: "",
        },
        opposite: false,
        labels: {
          enabled: false,
          fontSize: "14px", // Disable labels on the right side
        },
      },
    ],
    legend: {
      enable: true,
      style: {
        fontFamily: "Manrope",
        fontSize: "14px",
      },
    },

    tooltip: {
      shared: true,
      backgroundColor: "#F7F9FB",
      style: {
        zIndex: 9999,
        fontSize: "14px",
        boxShadow: "0px 0px 1px 0px rgba(0, 0, 0, 0.15)",
        fontFamily: "Manrope",
      },
      borderRadius: 10,
      format:
        "<b>{key}</b><br/>{series.name}: {y}<br/>" +
        "Total: {point.stackTotal}",
    },

    plotOptions: {
      column: {
        stacking: "normal",
      },
    },

    series: [
      {
        name: "Capacity",
        data: [200, 400],
        stack: "Europe",
        color: "#26C663",
      },
      {
        name: "Admissions",
        data: admissionsData,
        stack: "Europe",
        color: "#1C335C",
      },
    ],
  };

  return (
    <div
      style={{
        width: "100%",
        height: "520px",
        padding: "24px",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        backgroundColor: "#F2F6FF",
        fontFamily: "Manrope",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "12px",
          // border: "1px solid",
        }}
      >
        <span
          style={{
            fontSize: "16px",
            fontWeight: "700",
            lineHeight: "0",
            color: "#000000",
          }}
        >
          Admissions
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "62px",
          gap: "23px",
          display: "flex",
          // border: "1px solid",
          justifyContent: "space-evenly",
        }}
      >
        <div
          style={{
            width: "30%",
            height: "62px",
            gap: "86px",
            padding: "20px",
            border: "1px solid #85ACE6",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              height: "26px",
              width: "100%",
              //   border: "1px solid",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                // border: "1px solid",
                fontWeight: "800",
                lineHeight: "16px",
                textAlign: "left",
                color: "#000000",
              }}
            >
              Today
            </span>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "600",
                lineHeight: "18px",
                color: "#000000",
                textAlign: "right",
              }}
            >
              {admissions.total_admissions_today}
            </span>
          </div>
        </div>
        <div
          style={{
            width: "30%",
            height: "62px",
            gap: "86px",
            padding: "20px",
            border: "1px solid #85ACE6",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              height: "26px",
              width: "100%",
              //   border: "1px solid",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                // border: "1px solid",
                fontWeight: "800",
                lineHeight: "16px",
                textAlign: "left",
                color: "#000000",
              }}
            >
              This Week
            </span>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "600",
                lineHeight: "18px",
                color: "#000000",
                textAlign: "right",
              }}
            >
              {admissions.total_admissions_this_week}
            </span>
          </div>
        </div>
        <div
          style={{
            width: "30%",
            height: "62px",
            gap: "86px",
            padding: "20px",
            border: "1px solid #85ACE6",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              height: "26px",
              width: "100%",
              //   border: "1px solid",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                // border: "1px solid",
                fontWeight: "800",
                lineHeight: "16px",
                textAlign: "left",
                color: "#000000",
              }}
            >
              This Month
            </span>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "600",
                lineHeight: "18px",
                color: "#000000",
                textAlign: "right",
              }}
            >
              {admissions.total_admissions_this_month}
            </span>
          </div>
        </div>
      </div>

      <div className="card-body">
        <HighchartsReact highcharts={Highcharts} options={optionsMOM} />
      </div>
    </div>
  );
};

export { ChartsWidget15 };
