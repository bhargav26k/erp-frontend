import { FC, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";

const ChartsWidget1: FC = () => {
  const [showOptimized, setShowOptimized] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Cumulative");

  const toggleOptimized = () => {
    setShowOptimized(!showOptimized);
  };

  const optionsCumulative = {
    chart: {
      type: "line",
      height: "500px",
      backgroundColor: "transparent",
      style: {
        // zIndex: 9999,
        fontFamily: "Manrope",
        fontSize: "14px",
      },
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      gridLineWidth: 0,
      labels: {
        fontSize: "14px",
        fontFamily: "Manrope", // Adjust x-axis label font size
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      gridLineWidth: 1,
      labels: {
        fontFamily: "Manrope",
        fontSize: "14px",
        formatter: function (this: { value: number }): string {
          // Format y-axis labels to display in normal numbers
          return this.value.toLocaleString();
        },
      },
      min: 0, // Set minimum value for y-axis
      // max: 1250000,
    },
    legend: {
      enable: true,
      style: {
        fontFamily: "Manrope",
        fontSize: "14px",
      },
    },
    tooltip: {
      shared: true,
      style: {
        // zIndex: 9999,
        fontSize: "14px",
        boxShadow: "0px 0px 1px 0px rgba(0, 0, 0, 0.15)",
        fontFamily: "Manrope",
      },
      borderRadius: 10,
      formatter: function () {
        let tooltip = "";
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const currentYearPoints = this.points.filter(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
          (point) => !point.series.name.includes("Last Year")
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const lastYearPoints = this.points.filter(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
          (point) =>
            point.series.name.includes("Last Year") && point.series.visible
        );
        if (lastYearPoints.length > 0) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          currentYearPoints.forEach((point, index) => {
            const currentYearValue = point.y;
            const lastYearValue = lastYearPoints[index].y;

            // Add current year marker to the tooltip with 30px font size and bold marker
            tooltip += `<div class="tooltip-item">
                      <div class="marker" style="color: ${point.color}; font-size:18px;">&#9679;</div>
                      <div class="value" style="font-weight:800; font-size:12px">${currentYearValue}</div>
                      <br> <!-- Add line break after each value -->
                      <div class="marker" style="color: white; font-size:18px">&#9679;</div>
                      <div class="last-year-value" style="font-weight:500; font-size:12px" >${lastYearValue}</div>
                      <br> <!-- Add line break after each value -->
                  </div>`;
          });

          tooltip += "</div>";
        } else {
          // If there are no visible last year values, only add current year values to the tooltip

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          currentYearPoints.forEach((point) => {
            const currentYearValue = point.y;
            tooltip += `<div class="tooltip-item">
                  <div class="marker" style="color: ${point.color};">&#9679;</div>
                  <div class="value">${currentYearValue}</div>
                  <br> <!-- Add line break after each value -->
              </div>`;
          });
        }

        // Return the constructed tooltip
        return tooltip;
      },
    },

    plotOptions: {
      series: {
        enabled: false,
      },
      line: {
        marker: {
          enabled: true, // Enable markers for data points
        },
      },
    },
    series: [
      {
        name: "Expected fees",
        data: [439340, 439340, 486560, 651650, 818270, 1121430],
        showInLegend: true,
        color: "#1F3259",
      },
      {
        name: "Collected Fees",
        data: [249160, 249160, 379410, 297420, 298510, 324900],
        showInLegend: true,
        color: "#4BCD60",
      },
      {
        name: "Due Fees",
        data: [117440, 117440, 300000, 160050, 197710, 201850],
        showInLegend: true,
        color: "#EB5578",
      },
      {
        name: "EF Last Year",
        data: [439340, 486560, 651650, 818270, 112143, 543770],
        dashStyle: "Dash",
        showInLegend: showOptimized,
        color: "#98ABEE",
        visible: showOptimized,
        // className: 'lastYear'
      },

      {
        name: "CF Last Year",
        data: [249160, 379410, 297420, 298510, 324900, 243770],
        dashStyle: "Dash",
        showInLegend: showOptimized,
        visible: showOptimized,
        // className: 'lastYear',
        color: "#9ADE7B",
      },

      {
        name: "DF Last Year",
        data: [117440, 300000, 160050, 197710, 201850, 243770],
        dashStyle: "Dash",
        showInLegend: showOptimized,
        visible: showOptimized,
        // className: 'lastYear',
        color: "#E6A4B4",
      },
    ],
  };

  const optionsMOM = {
    chart: {
      type: "column",
      height: "500px",
      backgroundColor: "transparent",
      style: {
        // zIndex: 9999,
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
      categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
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
        // zIndex: 9999,
        fontSize: "14px",
        boxShadow: "0px 0px 1px 0px rgba(0, 0, 0, 0.15)",
        fontFamily: "Manrope",
      },
      borderRadius: 10,
      formatter: function (this: Highcharts.TooltipFormatterContextObject) {
        let tooltip = "";

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const currentYearPoints = this.points.filter(
          (point) => !point.series.name.includes("Last Year")
        );

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const lastYearPoints = this.points.filter(
          (point) =>
            point.series.name.includes("Last Year") && point.series.visible
        );

        // Check if there are visible last year values
        if (lastYearPoints.length > 0) {
          // Loop through each point and construct the tooltip content
          currentYearPoints.forEach((point, index) => {
            const currentYearValue = point.y;
            const lastYearValue = lastYearPoints[index]?.y ?? 0; // Use optional chaining to handle undefined
            tooltip += `<div class="tooltip-item">
                    <div class="marker" style="color: ${point.color}; font-size:18px;">&#9679;</div>
                    <div class="value" style="font-weight:800; font-size:12px">${currentYearValue}</div>
                    <br> <!-- Add line break after each value -->
                    <div class="marker" style="color: white; font-size:18px">&#9679;</div>
                    <div class="last-year-value" style="font-weight:500; font-size:12px" >${lastYearValue}</div>
                    <br> <!-- Add line break after each value -->
                </div>`;
          });
        } else {
          // If there are no visible last year values, only add current year values to the tooltip
          currentYearPoints.forEach((point) => {
            const currentYearValue = point.y;
            tooltip += `<div class="tooltip-item">
                    <div class="marker" style="color: ${point.color};">&#9679;</div>
                    <div class="value">${currentYearValue}</div>
                    <br> <!-- Add line break after each value -->
                </div>`;
          });
        }

        // Return the constructed tooltip
        return tooltip;
      },

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      positioner: function (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this: Highcharts.TooltipPositionerCallbackContextObject,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        labelWidth,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        labelHeight,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        point
      ) {
        let xPos = point.plotX - labelWidth / 5;
        let yPos = point.plotY - labelHeight + 50;

        // Adjust tooltip position to keep it within the graph bounds
        if (xPos < 0) {
          xPos = 0;
        } else if (xPos + labelWidth > this.chart.plotWidth) {
          xPos = this.chart.plotWidth - labelWidth;
        }

        if (yPos < 0) {
          yPos = 0;
        } else if (yPos + labelHeight > this.chart.plotHeight) {
          yPos = this.chart.plotHeight - labelHeight;
        }

        return {
          x: xPos,
          y: yPos,
        };
      },
    },
    plotOptions: {
      column: {
        grouping: false,
        shadow: false,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Expected Fees",
        color: "#1F3259",
        data: [150, 73, 20, 63, 33, 46],
        pointPadding: 0.38,
        pointPlacement: -0.12,
      },
      {
        name: "Collected Fee",
        color: "#4BCD60",
        data: [170, 150, 130, 145, 163, 189],
        pointPadding: 0.4,
        pointPlacement: 0.08,
      },
      {
        name: "Due Fee",
        color: "#EB5578",
        data: [183.6, 178.8, 198.5, 155, 174, 171],
        tooltip: {
          valuePrefix: "$",
          valueSuffix: " M",
        },
        pointPadding: 0.4,
        pointPlacement: 0.27,
        yAxis: 1,
      },
      {
        name: "EF Last Year",
        color: "#98ABEE",
        data: [140, 90, 40, 20, 133, 84],
        pointPadding: 0.4328,
        pointPlacement: -0.12,
        visible: showOptimized,
        showInLegend: showOptimized,
      },

      {
        name: "CF Last Year",
        color: "#9ADE7B", //74E291
        data: [65, 55, 35, 100, 124, 36],
        pointPadding: 0.45,
        pointPlacement: 0.08,
        visible: showOptimized,
        showInLegend: showOptimized,
      },

      {
        name: "DF Last Year",
        color: "#E6A4B4",
        data: [203.6, 198.8, 208.5, 88, 125, 69],
        tooltip: {
          valuePrefix: "$",
          valueSuffix: " M",
        },
        pointPadding: 0.45,
        pointPlacement: 0.27,
        yAxis: 1,
        visible: showOptimized,
        showInLegend: showOptimized,
      },
    ],
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div
      className=""
      style={{
        width: "100%",
        height: "586px",
        padding: "24px",
        borderRadius: "16px",
        backgroundColor: "#F7F9FB",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "36px",
          gap: "145px",
          display: "flex",
          // border: "1px solid",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "315px" }}>
          <span
            style={{
              width: "122px",
              height: "10px",
              fontSize: "16px",
              fontWeight: "700",
              lineHeight: "19.12px",
              color: "#000000",
              fontFamily: "Manrope",
            }}
          >
            Fee Status Trends
          </span>
        </div>
        <div
          style={{
            width: "412px",
            height: "36px",
            gap: "23px",
            display: "flex",
            justifyContent: "end",
          }}
        >
          <div
            style={{
              width: "95px",
              height: "36px",
              display: "flex",
              border: "1px solid #EEEEEE",
              borderRadius: "42px",
              padding: "8px 9px 8px 9px",
              gap: "10px",
              // justifyContent:'center',
              // alignItems:'center'
            }}
          >
            <label
              style={{
                fontSize: "12px",
                lineHeight: "17px",
                fontWeight: "600",
                width: "30px",
                height: "20px",
                color: "#252525",
                paddingTop: "1px",
                fontFamily: "Manrope",
              }}
              htmlFor="googleswitch"
            >
              LYSM
            </label>
            <div className="form-check  form-switch">
              <input
                className="form-check-input bg-pink"
                type="checkbox"
                id="googleswitch "
                style={{
                  width: "35px",
                  height: "20px",
                  gap: "10px",
                  color: "#1F3259",
                }}
                onClick={toggleOptimized}
                // checked={data.google}
                // onChange={() =>
                //   updateData({
                //     google: !data.google,
                //   })
                // }
              />
            </div>
          </div>
          <div
            style={{
              width: "166px",
              height: "36px",
              border: "1px solid #DADADA",
              borderRadius: "42px",
              padding: "7px 9px 8px 10px",
              display: "flex",
              gap: "10px",
            }}
          >
            <div
              className="form-check"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios1"
                style={{ width: "15px", height: "15px" }}
                value="Cumulative"
                checked={selectedValue === "Cumulative"}
                onChange={handleChange}
              />
              <label
                className="form-check-label"
                htmlFor="exampleRadios1"
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#252525",
                  fontFamily: "Manrope",
                }}
              >
                Cumulative
              </label>
            </div>
            <div
              className="form-check"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios2"
                value="MOM"
                style={{ width: "15px", height: "15px" }}
                checked={selectedValue === "MOM"}
                onChange={handleChange}
              />
              <label
                className="form-check-label"
                htmlFor="exampleRadios2"
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#252525",
                  fontFamily: "Manrope",
                }}
              >
                MOM
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className="card-body">
        {/* begin::Chart */}
        <div style={{ marginTop: "14px" }} />
        {selectedValue === "Cumulative" && (
          <HighchartsReact
            highcharts={Highcharts}
            options={optionsCumulative}
          />
        )}
        {selectedValue === "MOM" && (
          <HighchartsReact highcharts={Highcharts} options={optionsMOM} />
        )}
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  );
};

export { ChartsWidget1 };
