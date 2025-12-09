/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from "react";
import { useEffect, useRef,useState } from "react";
import ApexCharts, { ApexOptions } from "apexcharts";
import { useThemeMode } from "../../../layout/theme-mode/ThemeModeProvider";
import { DOMAIN,getEnquiriesBySources } from '../../../../../app/routing/ApiEndpoints.tsx'; 
import { useAuth } from "../../../../../app/modules/auth/index.ts";

interface Enquiry {
  source: string;
  total_enquiries: number;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CardsWidget14: FC = ({ selectedValue }:any) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { mode } = useThemeMode();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const {currentUser} = useAuth();
  const schoolId = currentUser?.school_id;

  const fetchEnquiries = async () => {
    try {
      const response = await fetch(`${DOMAIN}/${getEnquiriesBySources}/${selectedValue}/${schoolId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch enquiries");
      }
      const data = await response.json();
      setEnquiries(data);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    }
  };
  useEffect(() => {
    fetchEnquiries();
  }, [selectedValue]);



  const refreshChart = () => {
    if (!chartRef.current) {
      return;
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(enquiries));
    if (chart) {
      chart.render();
    }

    return chart;
  };

  useEffect(() => {
    const chart = refreshChart();

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, mode,enquiries]);
  return (
    <div className=" h-md-100"
      style={{
        backgroundColor: "rgba(245, 245, 245, 1)",
        width: "100%",
        height: "206px",
        borderRadius: "16px",
        padding: "20px",
        gap: "12px",
        display: "flex",
        justifyContent: "start",
        alignItems: "start",
        flexDirection: "column",
      }}
    >
      <div style={{ width: "100%", height: "12px" }}>
        <span
          style={{
            color: "#212121",
            fontWeight: "600",
            lineHeight: "21.86px",
            fontSize: "16px",
          }}
        >
          Lead Channels
        </span>
      </div>
      
      <div className="cardWidgets"
        style={{
          width: "100%",
          height: "168px",
          display: "flex",
          flexDirection: "column",
          justifyContent:'center',
          // alignItems:'center'
        }}
      >
        <div
          ref={chartRef}
          className="mixed-widget-4-chart"
          style={{ width: "100%", height: "152px", overflow:'hidden'}}
        ></div>
      </div>
    </div>
  );
};
const chartOptions = (enquiries: Enquiry[]): ApexOptions => {
  const seriesData = enquiries.map((enquiry) => enquiry.total_enquiries);
  const labels = enquiries.map((enquiry) => enquiry.source);

  return {
    series: seriesData,
    labels: labels,

    chart: {
      width: 490,
      type: "donut",
    },

    dataLabels: {
      enabled: false,
    },

    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 900,
          },
          legend: {
            show: true,
          },
        },
      },
    ],

    legend: {
      position: "right",
      offsetY: -20,
      width: 240,
      formatter: function (seriesName, opts) {
        const seriesValue = opts.w.globals.series[opts.seriesIndex]; // Getting the series value directly
        return `<span style="font-weight: bold;">${seriesValue}%</span> ${seriesName}`;
      }
    },

    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
           
          },
        }
      }
    },
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#3F51B5', '#03A9F4', '#4CAF50', '#FF9800', '#F44336', '#1b8f7f'],
  };
};


export { CardsWidget14 };
