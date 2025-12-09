import { useEffect, useRef, FC } from "react";
import ApexCharts, { ApexOptions } from "apexcharts";
import { KTIcon } from "../../../helpers";
import { Dropdown1 } from "../../content/dropdown/Dropdown1";
import { getCSS, getCSSVariableValue } from "../../../assets/ts/_utils";
import { useThemeMode } from "../../layout/theme-mode/ThemeModeProvider";

type Props = {
  className: string;
};

const ChartsWidget12: FC<Props> = ({ className }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { mode } = useThemeMode();

  useEffect(() => {
    const chart = refreshChart();

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [chartRef, mode]);

  const refreshChart = () => {
    if (!chartRef.current) {
      return;
    }

    const height = parseInt(getCSS(chartRef.current, "height"));

    const chart = new ApexCharts(chartRef.current, getChartOptions(height));
    if (chart) {
      chart.render();
    }

    return chart;
  };

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className="card-header border-0 pt-5">
        {/* begin::Title */}
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">
            Income vs expense - Source
          </span>

          {/* <span className='text-muted fw-semibold fs-7'>More than 400 new members</span> */}
        </h3>
        {/* end::Title */}

        {/* begin::Toolbar */}
        <div className="card-toolbar">
          {/* begin::Menu */}
          <button
            type="button"
            className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
            data-kt-menu-flip="top-end"
          >
            <KTIcon iconName="category" className="fs-2" />
          </button>
          <Dropdown1 />
          {/* end::Menu */}
        </div>
        {/* end::Toolbar */}
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className="card-body py-0">
        {/* begin::Chart */}
        <div
          ref={chartRef}
          id="kt_charts_widget_1_chart"
          style={{ height: "400px" }}
        />
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  );
};

export { ChartsWidget12 };

function getChartOptions(height: number): ApexOptions {
  const labelColor = getCSSVariableValue("--bs-gray-900");
  const borderColor = getCSSVariableValue("--bs-gray-200");
  const baseColor = getCSSVariableValue("--bs-green");
  const secondaryColor = getCSSVariableValue("--bs-red");
    const lightRedColor = 'rgb(255, 56, 0)';

  return {
    series: [
      {
        name: "Recieved",
        data: [44, 55, 57, 56, 61, 58,57, 56, 61, 58,57, 56],
      },
      {
        name: "Due",
        data: [76, 85, 101, 98, 87, 105,101, 98, 87, 105,105,101],
      },
    ],
    chart: {
      fontFamily: "inherit",
      type: "bar",
      height: height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "40%",
        borderRadius: 1,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Salary","Admin","Transport","Events","Trips","Loren","Loren","Loren","Loren","Loren", "Loren", "Loren"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: "12 px",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val) {
          return val + " Students";
        },
      },
    },
    colors: [baseColor, lightRedColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };
}
