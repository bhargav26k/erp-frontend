import { useEffect, FC } from "react";
import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import funnel from "highcharts/modules/funnel";
import { useThemeMode } from "../../layout/theme-mode/ThemeModeProvider";




HighchartsMore(Highcharts);
funnel(Highcharts as any);


const ChartsWidget17: FC = () => {
    const { mode } = useThemeMode();
  

    useEffect(() => {
      const areaChartOptions: Highcharts.Options = {
        chart: {
          type: "funnel",
          backgroundColor: "rgba(0, 0, 0, 0)",
          height:'50%',
          inverted: true,
        },
        title: {
          text: "",
        },
        xAxis: {
          visible: false, // Hide the x-axis since it's not needed in a horizontal funnel
        },
        yAxis: {
          reversed: true, // Reverse the y-axis to display in the correct order
          labels: {
            rotation: 0, // Rotate the labels to display horizontally
          },
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b> ({point.y:,.0f})",
              softConnector: true,
              rotation: 270, // Rotate the data labels to be readable
              align: 'left',
              inside: true,
              verticalAlign: 'middle',
            },
            center: ["40%", "50%"], // Adjust center as needed
            neckWidth: "30%",
            neckHeight: "0%",
            width: "60%",
            horizontal:true,
          } as any,
        },
        credits: {
          enabled: false, // Disable the Highcharts credit label
        },
        legend: {
          enabled: false,
        },
        series: [
          {
            name: "Unique users",
            type:'area',
            data: [
              ["Website visits", 8000],
              ["Downloads", 3685],
              ["Requested price list", 1987],
              ["Invoice sent", 976],
              ["Finalized", 846],
            ],
            dataLabels: {
              style: {
                color: "black", // Change the color to your desired color
                fontWeight: "bold",
                fontSize: "12px",
                // Add other styling properties as needed
              },
            },
          } as any,
        ],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 400,
              },
              chartOptions: {
                plotOptions: {
                  series: {
                    dataLabels: {
                      inside: true,
                    },
                    center: ["50%", "50%"],
                    width: "80%",
                  } as any,
                },
              },
            },
          ],
        },
      };
      Highcharts.chart("area-container", areaChartOptions);
    }, [mode]);

  return (
    <div
      style={{
        width: "698px",
        height: "281px",
        padding: "24px",
        borderRadius: "16px",
        backgroundColor: "#F7F9FB",
      }}
    >
      <div
        style={{
          width: "658px",
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
              fontSize: "14px",
              fontWeight: "700",
              lineHeight: "19.12px",
              color: "#000000",
            }}
          >
            Fee Status Trends
          </span>
        </div>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className="card-body">
        {/* begin::Chart */}
        <div  id="area-container" style={{ height: "223px" }} />
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  );
};

export { ChartsWidget17 };






        // <div id="kt_charts_widget_1_chart" >
        //   <div id="area-container" />
        // </div>
