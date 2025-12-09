import { useRef, FC, useState, SetStateAction } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css"


const ChartsWidget16: FC = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [showOptimized, setShowOptimized] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Cumulative");

  const toggleOptimized = () => {
    setShowOptimized(!showOptimized);
  };

  const optionsMOM = {
    chart: {
      type: "column",
      height:'510px',
      backgroundColor: "transparent",
      style:{
          fontFamily:"Manrope",
          fontSize:'14px'
      }
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
        fontSize: '14px',
        fontFamily: "Manrope",
}
    },
    yAxis: {
      min: -1500000,
      allowDecimals: false,
      gridLineWidth: 1,
      title: {
        text: "",
      },
      labels: {
        enabled: true,
        fontFamily:"Manrope",
        fontSize:'14px'
      },
    },
    legend: {
      enable: true,
      style:{
        fontFamily:"Manrope",
        fontSize:'14px',
      }

    },
    tooltip: {
      shared: true,
       backgroundColor: '#F7F9FB',
      style: {
        fontSize: "14px",
        boxShadow: "0px 0px 1px 0px rgba(0, 0, 0, 0.15)",
        ontFamily:"Manrope",
      },
      borderRadius: 10,
      formatter: function () {
        let tooltip = ""; 

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
        const currentYearPoints = this.points.filter(
          (point: { series: { name: string | string[] }; }) => !point.series.name.includes("LY")
        );
        
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
        const lastYearPoints = this.points.filter(
          (point: { series: { name: string | string[]; visible: boolean }; }) => 
            point.series.name.includes("LY") && point.series.visible
        );
        

        // Check if there are visible last year values
        if (lastYearPoints.length > 0) {
          // Loop through each point and construct the tooltip content
          currentYearPoints.forEach((point: { y: unknown; color: unknown; }, index: string | number) => {
            const currentYearValue = point.y;
            const lastYearValue = lastYearPoints[index].y;

            // Add current year marker to the tooltip with 30px font size and bold marker
            tooltip += `<div style="color:${point.color};">\u25CF</div>&nbsp;`;

            // Add current year value to the tooltip with 16px font size and bold
            tooltip += `<div>₹${currentYearValue}</div><br />`;

            // Add last year value to the tooltip with 15px font size
            tooltip += `<div>₹${lastYearValue}</div>`;

            // Add a line break between current year and last year values
            tooltip += "<br>";
          });
        } else {
          // If there are no visible last year values, only add current year values to the tooltip
          currentYearPoints.forEach((point: { y: unknown; color: unknown; }) => {
            const currentYearValue = point.y;

            // Add current year marker to the tooltip with 30px font size and bold marker
            tooltip += `<div style="color:${point.color};display:inline-block;">\u25CF</div>`;

            // Add current year value to the tooltip with 16px font size and bold
            tooltip += `<div>₹${currentYearValue}</div><br />`;
          });
        }

        // Return the constructed tooltip
        return tooltip;
      },
    },
    plotOptions: {
      column: {
        stacking: "normal",
        pointWidth: 20,
        groupPadding: 0.26,
        // pointPadding: 0.02,
      },
      line: {
        stacking: "normal",
        // label:false,
        marker: {
          enabled: true,
          symbol: "diamond",
          radius: 3,
        },
        dataLabels: {
          enabled: false,
          inside: true, // Place data labels inside the column bars
          align: "left", // Align data labels to the left of the markers
          verticalAlign: "middle",
          crop: false,
          // align:'left',
          overflow: "none",
        },
        // zIndex: 2,
      },
    },
    series: [
      {
        name: "Total Income",
        data: [425812, 645291, 826174, 573896, 718403, 964158],
        stack: "Europe",
        color: "#1C335C",
      },
      {
        name: "Costs",
        data: [-325812, -421586, -538129, -697314, -874236, -962487],
        stack: "Europe",
        color: "#FF5B5B",
      },
      {
        name: "LY Income",
        data: [337342, 548963, 123456, 789012, 654321, 987654],
        stack: "North America",
        color: "#D9D9D9",
        visible: showOptimized,
        showInLegend: showOptimized,
      },
      {
        name: "LY Cost",
        data: [-325812, -439740, -678903, -123456, -987654, -876543],
        stack: "North America",
        color: "#FFC5B7",
        visible: showOptimized,
        showInLegend: showOptimized,
      },
      {
        name: "Profit",
        type: "line",
        data: [125812, -327841, 698574, 532106  , -874315, 465893], // Example profit data for Europe
        dashStyle: "line", // Make the line dotted
        color: "#4BCC60", // Set color for the profit line
        pointPlacement: showOptimized ? -0.12 : 0.001 
        
      },
      {
        name: "LY Profit",
        type: "line",
        data: [134243, -892456, -563874, -684239  , 728945, -915623], // Example profit data for North America
        dashStyle: "dot", // Make the line dotted
        color: "#004307", // Set color for the profit line
        pointPlacement: 0.12,
        visible: showOptimized,
        showInLegend: showOptimized,
      },
    ],
  };


   const optionsCumulative = {
      chart: {
        type: "line",
        height:'500px',
        backgroundColor: 'transparent',
        style: {
          // zIndex: 9999,
          fontFamily:"Manrope",
          fontSize:'14px' 
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
          fontSize: '14px',
          fontFamily:"Manrope", // Adjust x-axis label font size
  }
      },
      yAxis: {
        title: {
          text: ''
        },
        gridLineWidth: 1, 
        labels: {
          fontFamily:"Manrope",
            fontSize:'14px',
          formatter: function(this: { value: number }):string {
              // Format y-axis labels to display in normal numbers
              return this.value.toLocaleString();
          }
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
    // fontSize: "14px",
    // boxShadow: '0px 0px 16.6px 0px rgba(0, 0, 0, 0.15)',
    // fontFamily: "Manrope",
  },
  borderRadius: 10,
  formatter: function () {
    let tooltip = '';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
    const currentYearPoints = this.points.filter((point) => !point.series.name.includes('Last Year'));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
    const lastYearPoints = this.points.filter((point) => point.series.name.includes('Last Year') && point.series.visible);

    if (lastYearPoints.length > 0) {
      tooltip = '<div class="tooltip-container">';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
      currentYearPoints.forEach((point, index) => {
        const currentYearValue = point.y;
        const lastYearValue = lastYearPoints[index].y;

        tooltip += `<div class="tooltip-item">
                      <div class="marker" style="color: ${point.color}; font-size:18px;">&#9679;</div>
                      <div class="value" style="font-weight:800; font-size:12px">${currentYearValue}</div>
                      <br> <!-- Add line break after each value -->
                      <div class="marker" style="color: white; font-size:18px">&#9679;</div>
                      <div class="last-year-value" style="font-weight:500; font-size:12px" >${lastYearValue}</div>
                      <br> <!-- Add line break after each value -->
                  </div>`;
      });

      tooltip += '</div>';
    } else {
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

    return tooltip;
  }
}


,
      
      
      plotOptions: {
        series: {
          enabled:false
        },
        line: {
          marker: {
              enabled: true // Enable markers for data points
          }
      }
      },
      series: [
        {
          name: 'Expected fees',
          data: [439340, 439340, 486560, 651650, 818270, 1121430,],
          showInLegend: true,
          color: '#1F3259'
        },
        {
          name: 'Collected Fees',
          data: [249160, 249160, 379410, 297420, 298510, 324900 ],
          showInLegend: true,
          color: '#4BCD60',
        },
        {
          name: 'Due Fees',
          data: [117440, 117440, 300000, 160050, 197710, 201850 ],
          showInLegend: true,
          color:'#EB5578'
        },
        {
          name: 'EF Last Year',
          data: [439340, 486560, 651650, 818270, 112143,543770],
          dashStyle: 'Dash',
          showInLegend: showOptimized,
          color: '#98ABEE',
          visible: showOptimized, 
          // className: 'lastYear'
        },
        
        {
          name: 'CF Last Year',
          data: [249160, 379410, 297420, 298510, 324900, 243770],
          dashStyle: 'Dash',
          showInLegend: showOptimized,
          visible: showOptimized,
          // className: 'lastYear',
          color:'#9ADE7B'
        },
        
        {
          name: 'DF Last Year',
          data: [117440, 300000, 160050, 197710, 201850, 243770,],
          dashStyle: 'Dash',
          showInLegend: showOptimized,
          visible: showOptimized,
          // className: 'lastYear',
          color:'#E6A4B4'
        }
      ]
    };

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div className="mb-md-5 mb-lg-5"
      style={{
        width: "100%",
        height: "592px",
        padding: "24px 25px 9px 30px",
        borderRadius: "16px",
        backgroundColor: "#F2F6FF",
        fontFamily:"Manrope",
        // border:'1px solid'
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
              
            }}
          >
            Finance Trends
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
              border: "1px solid #DADADA",
              borderRadius: "42px",
              padding: "8px 9px 8px 9px",
              // alignItems: "center",
              gap: "10px",
            }}
          >
            <label
              style={{
                fontSize: "12px",
                lineHeight: "17px",
                fontWeight: "600",
                width: "30px",
                height: "26px",
                color: "#1F3259",
                paddingTop:'1px',
                fontFamily:"Manrope",
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
                style={{ width: "15px", height: "15px", border:'1px solid #B3B3B3' }}
                value="Cumulative"
                checked={selectedValue === "Cumulative"}
                onChange={handleChange}
              />
              <label
                className="form-check-label"
                htmlFor="exampleRadios1"
                style={{ fontSize: "12px",fontWeight:'600', color:'#252525',fontFamily:"Manrope", }}
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
                style={{ fontSize: "12px",fontWeight:'600', color:'#252525',fontFamily:"Manrope", }}
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
        <div
          ref={chartRef}
          style={{marginTop:'14px', }}
          
        />
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

export  { ChartsWidget16 };
