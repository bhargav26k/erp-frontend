/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, FC ,useState, SetStateAction} from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
import { DOMAIN,getMonthWiseEnquiries } from '../../../../app/routing/ApiEndpoints.tsx'; 
import { useAuth } from "../../../../app/modules/auth/index.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChartsWidget14: FC = ({ selectedValue }:any) => {
  const chartRef = useRef<HTMLDivElement | null>(null );
  
  const [chartData, setChartData] = useState({ categories: [
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar"
  ],series:{} });
  const [showOptimized, setShowOptimized] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("Cumulative");
  const {currentUser} = useAuth();
  const schoolId = currentUser?.school_id;
  
  const toggleOptimized = () => {
    setShowOptimized(!showOptimized);
  };

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${DOMAIN}/${getMonthWiseEnquiries}/${selectedValue}/${schoolId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();       
        // console.log(jsonData);
        
        const currentYearData = jsonData.currentYear;
        const lastYearData = jsonData.lastYear;
        
        // Extract month numbers from current year data
        // const currentYearMonths = currentYearData.map(item => item.month);
        
        // Extract values from current year data
        const enquiryData = currentYearData.map((item: { total_enquiries: any; }) => item.total_enquiries);
        const conversionData = currentYearData.map((item: { total_won: string; }) => parseInt(item.total_won, 10));
        
        // Extract values from last year data
        const lastYearEnquiryData = lastYearData.map((item: { total_enquiries: any; }) => item.total_enquiries);
        const lastYearConversionData = lastYearData.map((item: { total_won: string; }) => parseInt(item.total_won, 10));
        
        
  // console.log(enquiryData,conversionData);
  
        setChartData({
          categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"] ,
          series: [
            {
              name: "Enquiry",
              data: enquiryData,
              stack: "Leads",
              showInLegend: true,
              color: "#1C335C",
              
            },
            {
              name: "Conversion",
              data: conversionData,
              stack: "Leads",
              showInLegend: true,
              color: "#4BCD60",
            },
            {
              name: "--Last Year",
      data: lastYearEnquiryData,
      dashStyle: "Dash",
      stack: "Last Apr",
      color: "#4BCD60",
      visible: showOptimized,
      showInLegend: showOptimized,
            },
            {
              name: "--Last Year",
              data: lastYearConversionData,
              stack: "Last Apr",
              dashStyle: "Dash",
              color: "#314B2D",
              visible: showOptimized,
              showInLegend: showOptimized,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [showOptimized,selectedValue]);
  


  const optionsCumulative = {
    chart: {
      type: "line",
      height: "220px",
      backgroundColor: "transparent",
      style: {
        zIndex: 9999,
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
      categories: chartData.categories,
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
      max: 120,
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
        zIndex: 9999,
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
    // series: [
    //   {
    //     name: "Expected fees",
    //     data: [439, 439, 486, 651, 818, 1121],
    //     showInLegend: true,
    //     color: "#1F3259",
    //   },
    //   {
    //     name: "Collected Fees",
    //     data: [249, 249, 379, 297, 298, 324],
    //     showInLegend: true,
    //     color: "#4BCD60",
    //   },
    //   {
    //     name: "Due Fees",
    //     data: [117, 117, 300, 160, 197, 201],
    //     showInLegend: true,
    //     color: "#EB5578",
    //   },
    //   {
    //     name: "EF Last Year",
    //     data: [439, 486, 651, 818, 112, 543],
    //     dashStyle: "Dash",
    //     showInLegend: showOptimized,
    //     color: "#98ABEE",
    //     visible: showOptimized,
    //     // className: 'lastYear'
    //   },

    //   {
    //     name: "CF Last Year",
    //     data: [249, 379, 297, 298, 324, 243],
    //     dashStyle: "Dash",
    //     showInLegend: showOptimized,
    //     visible: showOptimized,
    //     // className: 'lastYear',
    //     color: "#9ADE7B",
    //   },

    //   {
    //     name: "DF Last Year",
    //     data: [117, 300, 160, 197, 201, 243],
    //     dashStyle: "Dash",
    //     showInLegend: showOptimized,
    //     visible: showOptimized,
    //     // className: 'lastYear',
    //     color: "#E6A4B4",
    //   },
    // ],
    series: chartData.series,
  };

  const optionsMOM = {
        chart: {
          type: "column",
          height: "220px",
      backgroundColor: "transparent",
      style: {
        zIndex: 9999,
        fontFamily: "Manrope",
        fontSize: "12px",
      },
          
        },
        title: {
          text: null, // Remove title
        },
        xAxis: {
          categories: chartData.categories,
          labels: {
              style: {
                fontSize: "12px",
                fontFamily: "Manrope",
              }
          }
      },
        yAxis: {
          allowDecimals: false,
          gridLineWidth: 1,
          min: 0,
          max: 150,
          title: {
            text: "",
          },
          labels: {
            style: {
              fontFamily: "Manrope",
              fontSize: "12px",
              formatter: function (this: { value: number }): string {
                // Format y-axis labels to display in normal numbers
                return this.value.toLocaleString();
              },

            }
        }
        },
        credits: {
          enabled: false, // Remove Highcharts branding
        },
        legend: {
          enabled: true,
          itemStyle: {
            color: '#333', // Set the color of legend items
            fontSize: '10px', // Set the font size of legend items
            fontWeight: 'normal', // Set the font weight of legend items
            // Add more styles as needed
            fontFamily: "Manrope",
        },
        
      },
        tooltip: {
          shared: true,
          style: {
            zIndex: 9999,
            fontSize: "12px",
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
                          <div class="value" style="font-weight:500; font-size:12px">${currentYearValue}</div>
                          <br> <!-- Add line break after each value -->
                          <div class="marker" style="color: #D9D9D9; font-size:18px">&#9679;</div>
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
          column: {
            stacking: "normal",
            pointWidth: 20,
            groupPadding: 0.3,
            pointPadding: 0.1,
            // borderWidth: 1,
            // borderColor: '#1C335C',
            // borderDashStyle: 'dot'
          },
        },
        
        series: chartData.series,
      // });
    }
  // }, [chartData]);
  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSelectedRadio(event.target.value);
  };
  return (
    <div className=""
      style={{
        width: "100%",
        height: "270px",
        padding: "20px 20px 0px 20px",
        borderRadius: "16px",
        backgroundColor: "#F7F9FB",
        fontFamily:"Manrope",
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
            Enquires Trends
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
                checked={selectedRadio === "Cumulative"}
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
                checked={selectedRadio === "MOM"}
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
        <div ref={chartRef} style={{ height: "225px" }}>
        {selectedRadio === "Cumulative" && (
          <HighchartsReact
            highcharts={Highcharts}
            options={optionsCumulative}
          />
        )}
        {selectedRadio === "MOM" && (
          <HighchartsReact highcharts={Highcharts} options={optionsMOM} />
        )}
        </div>
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  );
};

export { ChartsWidget14 };
