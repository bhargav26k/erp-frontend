import React from "react";
import Chart from "react-apexcharts";

const ChartsWidget19: React.FC = () => {
  const performanceData = {
    options: {
      chart: {
        id: "performance-chart",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
        zoom: {
          enabled: true,
        },
        foreColor: "#333", // Improve visibility of text
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        labels: {
          style: {
            fontSize: "14px", // Slightly increase the font size for better readability
            fontFamily: "Manrope",
            fontWeight: 600,
            color: "#1C335C",
          },
        },
        axisBorder: {
          show: true,
          color: "#E0E4F0",
        },
        axisTicks: {
          show: true,
          color: "#E0E4F0",
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
        colors: ["#3b82f6"], // Use a nice blue tone for the line
      },
      grid: {
        borderColor: "#E0E4F0",
        strokeDashArray: 4, // Dotted grid lines for a cleaner look
      },
      dataLabels: {
        enabled: true,
        formatter: (val: any) => val.toFixed(1), // Show precise values on each point
        style: {
          fontSize: "12px",
          fontFamily: "Manrope",
          fontWeight: 600,
          colors: ["#333"],
        },
      },
      markers: {
        size: 5, // Add markers on the line for better data visibility
        colors: ["#3b82f6"],
        strokeColors: "#fff",
        strokeWidth: 2,
      },
      yaxis: {
        title: {
          text: "Grade (%)",
          style: {
            fontSize: "14px",
            fontFamily: "Manrope",
            fontWeight: 700,
            color: "#1C335C",
          },
        },
        labels: {
          style: {
            fontSize: "12px",
            fontFamily: "Manrope",
            fontWeight: 600,
            color: "#1C335C",
          },
        },
        min: 70, // Set a minimum value for a better visual range
        max: 100,
      },
      tooltip: {
        theme: "light",
        x: {
          format: "MMM",
        },
        y: {
          formatter: (val: number) => `${val}%`,
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              width: "100%",
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
    series: [
      {
        name: "Grades",
        data: [80, 85, 78, 92, 88, 90, 95], // Actual data points
      },
    ],
  };

  return (
    <div
      className="charts-widget-19"
      style={{
        padding: "20px",
        backgroundColor: "rgb(242, 246, 255)",
        borderRadius: "16px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        fontFamily:'Manrope'
      }}
    >
      <h3
        style={{
          fontFamily: "Manrope",
          fontWeight: 700,
          fontSize: "20px",
          color: "#1C335C",
          marginBottom: "20px",
        }}
      >
        Student Performance Analytics
      </h3>
      <Chart
        options={performanceData.options}
        series={performanceData.series}
        type="line"
        height={405}
      />
    </div>
  );
};

export default ChartsWidget19;
