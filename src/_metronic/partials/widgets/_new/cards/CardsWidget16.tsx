import { FC,useState,useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// import "../../../../app/pages/StaffPages//FinancialManagement/style.css
import { DOMAIN, getEnquiriesStatus } from '../../../../../app/routing/ApiEndpoints.tsx'; 
import { useAuth } from "../../../../../app/modules/auth/index.ts";


interface Enquiries {
  total_enquiries: number;
  active_enquiries: number;
  won_enquiries: number;
  dead_enquiries: number;
  admissions_done: number;
}

 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
const CardsWidget16: FC = ({ selectedValue }:any) => {
  const {currentUser} = useAuth();
  const schoolId = currentUser?.school_id;
  const [enquiries, setEnquiries] = useState<Enquiries>({
    total_enquiries: 0,
    active_enquiries: 0,
    won_enquiries: 0,
    dead_enquiries: 0,
    admissions_done: 0
  });


  useEffect(() => {
    const fetchEnquiries = async () => {
      // setLoading(true);
      // setError(null);

      try {
        const response = await fetch(`${DOMAIN}/${getEnquiriesStatus}/${selectedValue}/${schoolId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        // console.log(data);
        
        setEnquiries(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // setError('Error fetching data. Please try again later.');
      } finally {
        // setLoading(false);
      }
    };

    fetchEnquiries();
  }, [selectedValue]);


  const optionsMOM = {
    chart: {
      type: "column",
      height: 170,
      backgroundColor: "transparent",
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: [
        "Leads",
        "Applications Started",
        "Paid Application",
        "Submmited Application",
        "Enrollment",
      ],
      title: {
        text: "",
      },
      labels: {
        enabled: true,
        style: {
          fontSize: "12px", // Set font size to 14px
          fontWeight: "600", // Set font weight to 600
          fontFamily: "Manrope", // Set font family to Manrope
          textAlign: "left", // Set text alignment to left
          padding: 0,
        },
      },
      gridLineColor: "#95BACF",
      gridLineWidth: 2,
      lineWidth: 0,
    },
    yAxis: {
      min: 0,
      max: 500, // Set the maximum value of the y-axis
      title: {
        text: "",
      },
      labels: {
        enabled: false, // Disable y-axis labels
      },
      gridLineWidth: 0,
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      column: {
        borderRadius: "0%",
        dataLabels: {
          enabled: true,
          align: "left", // Align data labels to the left
          crop: false,
          overflow: "none",
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
formatter: function (this: Highcharts.PointLabelObject) {
  const totalValue = (this.series.data[0].y as number);
  const percentage = Math.round((this.y as number / totalValue) * 100);

  return `<div style="position: relative; overflow: visible;">
            <div style="position: absolute;">
            <span style="font-weight: 600; font-size: 16px; font-family: Manrope; color: rgba(0, 0, 0, 1);">
${Number(this.y).toLocaleString()}
</span>
          
<span style="font-family: Manrope; font-size: 12px; font-weight: 600; color: gray; border: 1px solid black; padding: 2px 5px; border-radius: 5px;">
${percentage}%
</span>

            </div>
          </div>`;
},
          style: {
            fontWeight: "normal", // Set font weight for the category name
          },
        },
        groupPadding: 0.0, // Adjust group padding
        pointPadding: 0.01, // Adjust point padding
      },
    },

    legend: {
      enabled: false, 
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false, // Disable exporting module
    },
    series: [
      {
        name: "",
        data: [
          {
 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error            
            y: enquiries[0]?.total_enquiries,
            color: {
              linearGradient: { x1: 0, y1: 0, x2: 5, y2: 0 },
              stops: [
                [0.0002, "#1C335C"], // Adjusted for 0.02% position
                [2.1097, "rgba(166, 28, 37, 0.47)"], // Adjusted for 510.97% position
              ],
            },
          },
          {
             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
            y: enquiries[0]?.active_enquiries,
            color: {
              linearGradient: { x1: -1.5, y1: 0, x2: 5, y2: 0 },
              stops: [
                [-2.0297, "#1C335C"], // Adjusted for -202.97% position
                [3.0102, "rgba(166, 28, 37, 0.47)"], // Adjusted for 301.02% position
              ],
            },
          },
          {
             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
            y: enquiries[0]?.won_enquiries,
            color: {
              linearGradient: { x1: -2.5, y1: 0, x2: 5, y2: 0 },
              stops: [
                [-3.0397, "#1C335C"], // Adjusted for -303.97% position
                [1.9943, "rgba(166, 28, 37, 0.47)"], // Adjusted for 199.43% position
              ],
            },
          },
          {
             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
            y: enquiries[0]?.dead_enquiries,
            color: {
              linearGradient: { x1: -4, y1: 0, x2: 5, y2: 0 },
              stops: [
                [-4.0986, "#1C335C"], // Adjusted for -409.86% position
                [0.9994, "rgba(166, 28, 37, 0.47)"], // Adjusted for 99.94% position
              ],
            },
          },
          {
             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
            y: enquiries[0]?.admissions_done ,
            color: {
              linearGradient: { x1: -5, y1: 0, x2: 5, y2: 0 },
              stops: [
                [-4.0986, "#1C335C"], // Adjusted for -409.86% position
                [0.9994, "rgba(166, 28, 37, 0.47)"], // Adjusted for 99.94% position
              ],
            },
          },
        ],
      },
    ],
  };

  return (
    <div
      className=" "
      style={{
        width: "100%",
        height: "235px",
        padding: "20px 25px 0px 30px",
        borderRadius: "16px",
        backgroundColor: "#F5F5F5",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          // height: "36px",
          gap: "14px",
          display: "flex",
          flexDirection: "column",
          padding: "0px  ",
          // border: "1px solid",
        }}
      >
        <span
          style={{
            // width: "100%",
            height: "10px",
            fontSize: "16px",
            fontWeight: "700",
            lineHeight: "19.12px",
            color: "#000000",
            fontFamily: "Manrope",
          }}
        >
          Lead - Enrollment
        </span>
      </div>
      <div className="card-body" style={{ height: "200px", width: "100%", paddingTop:'15px'}}>
        <HighchartsReact highcharts={Highcharts} options={optionsMOM} />
      </div>
    </div>
  );
};

export { CardsWidget16 };
