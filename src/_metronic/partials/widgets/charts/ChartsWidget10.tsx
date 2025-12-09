import { useEffect, useRef, FC } from "react";
// import { getCSS, getCSSVariableValue } from "../../../assets/ts/_utils";
import { useThemeMode } from "../../layout/theme-mode/ThemeModeProvider";
import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import funnel from "highcharts/modules/funnel";

HighchartsMore(Highcharts);
funnel(Highcharts as any);

type Props = {
  className: string;
};

const ChartsWidget10: React.FC<Props> = ({ className }) => {
  const { mode } = useThemeMode();
  

  useEffect(() => {
    const areaChartOptions: Highcharts.Options = {
      chart: {
        type: "funnel",
        backgroundColor: "rgba(0, 0, 0, 0)",
        height:'450px',
      },
      title: {
        text: "",
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b> ({point.y:,.0f})",
            softConnector: true,
          },
          center: ["40%", "50%"], // Adjust center as needed
          neckWidth: "30%",
          neckHeight: "0%",
          width: "60%",
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
    <div className={`card ${className}`}>
      <div className="card-body">
        <div id="kt_charts_widget_1_chart" >
          <div id="area-container" />
        </div>
      </div>
    </div>
  );
};
export { ChartsWidget10 };
