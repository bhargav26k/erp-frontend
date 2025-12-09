import "../../../../../app/pages/StaffPages/FinancialManagement/style.css";
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef } from "react";
import ApexCharts, {ApexOptions} from 'apexcharts'
import { useThemeMode } from "../../../layout/theme-mode/ThemeModeProvider";

const EngageWidget11 = () => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const { mode } = useThemeMode();
  
  
    const refreshChart = () => {
      if (!chartRef.current) {
        return;
      }
  
      const chart = new ApexCharts(chartRef.current, chartOptions());
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
    }, [chartRef, mode]);

  return(
  <div style={{ height: "360px", width: "100%",border: "1px solid #F2F4F5",}}>
    <div className="card-body d-flex flex-column justify-content-between  bgi-no-repeat bgi-size-cover bgi-position-x-center pb-0">
      <div style={{ display: "flex", padding: "10px 18px" }}>
        <span
          style={{
            fontSize: "16px",
            fontWeight: "600",
            fontStyle: "normal",
            color: "#000",
            fontFamily: "Manrope",
          }}
        >
          Logged in Activity
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div style={{ display: "flex", gap: "20px", padding: "5px" }}>
          <div
            style={{
              height: "90px",
              width: "200px",
              display:'flex',
              flexDirection:'column',
              backgroundColor: "#1F3259",
              borderRadius: "16px",
              padding: "10px 15px", 
              justifyContent:'space-between'
            }}
          >
            <div>
              <span
                style={{
                  color: "#FFFFFF",
                  fontWeight: "600",
                  lineHeight: "19.12px",
                  fontSize: "16px",
                  fontFamily: "Manrope",
                }}
              >
                
                % Fee Collected
                
              </span>
            </div>
            <div className="d-flex align-items-center" style={{gap:'10px'}}>
              <span
                style={{
                  color: "#A7FFB0",
                  fontWeight: "700",
                  fontSize: "30px",
                  lineHeight: "36px",
                  fontFamily: "Manrope",
                }}
              >
                585
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="29" viewBox="0 0 24 29" fill="none">
<path d="M13.0607 0.939339C12.4749 0.353552 11.5251 0.353552 10.9393 0.939339L1.3934 10.4853C0.807611 11.0711 0.807611 12.0208 1.3934 12.6066C1.97919 13.1924 2.92893 13.1924 3.51472 12.6066L12 4.12132L20.4853 12.6066C21.0711 13.1924 22.0208 13.1924 22.6066 12.6066C23.1924 12.0208 23.1924 11.0711 22.6066 10.4853L13.0607 0.939339ZM13.5 29L13.5 2H10.5L10.5 29H13.5Z" fill="#26C663"/>
</svg>
            </div>
          </div>
          <div
           style={{
            height: "90px",
            width: "200px",
            display:'flex',
            flexDirection:'column',
            backgroundColor: "#F2F6FF",
            borderRadius: "16px",
            padding: "10px 15px", 
            justifyContent:'space-between'
          }}
          >
            <div>
              <span
                style={{
                  color: "#000",
                  fontWeight: "600",
                  lineHeight: "19.12px",
                  fontSize: "16px",
                  fontFamily: "Manrope",
                }}
              >
                No. Of Inquires
              </span>
            </div>
            <div className="d-flex align-items-center" style={{gap:'10px'}}>
              <span
                style={{
                  color: "#000",
                  fontWeight: "700",
                  fontSize: "30px",
                  lineHeight: "36px",
                  fontFamily: "Manrope",
                }}
              >
                80
              </span>
              <span
                style={{
                  color: "#FFF",
                  backgroundColor:'rgba(38, 198, 99, 0.75)',
                  fontWeight: "700",
                  lineHeight: "16.39px",
                  fontSize: "12px",
                  fontFamily: "Manrope",
                  padding:'2px',
                  borderRadius:'8px',
                  width:'36px',
                  alignItems:'center',
                  textAlign:'center'
                }}
              >
                +5%
              </span>
            </div>
          </div>
          
          <div
           style={{
            height: "90px",
            width: "200px",
            display:'flex',
            flexDirection:'column',
            backgroundColor: "#F2F6FF",
            borderRadius: "16px",
            padding: "10px 15px", 
            justifyContent:'space-between'
          }}
          >
            <div>
              <span
                style={{
                  color: "#000",
                  fontWeight: "600",
                  lineHeight: "19.12px",
                  fontSize: "16px",
                  fontFamily: "Manrope",
                }}
              >
                No. of Admissions
              </span>
            </div>
            <div className="d-flex align-items-center" style={{gap:'10px'}}>
              <span
                style={{
                  color: "#000",
                  fontWeight: "700",
                  fontSize: "30px",
                  lineHeight: "36px",
                  fontFamily: "Manrope",
                }}
              >
                80
              </span>
              <span
                style={{
                  color: "#FFF",
                  backgroundColor:'rgba(38, 198, 99, 0.75)',
                  fontWeight: "700",
                  lineHeight: "16.39px",
                  fontSize: "12px",
                  fontFamily: "Manrope",
                  padding:'2px',
                  borderRadius:'8px',
                  width:'36px',
                  alignItems:'center',
                  textAlign:'center'
                }}
              >
                +5%
              </span>
            </div>
          </div>
          
          <div
           style={{
            height: "90px",
            width: "200px",
            display:'flex',
            flexDirection:'column',
            backgroundColor: "#F2F6FF",
            borderRadius: "16px",
            padding: "10px 15px", 
            justifyContent:'space-between'
          }}
          >
            <div>
              <span
                style={{
                  color: "#000",
                  fontWeight: "600",
                  lineHeight: "19.12px",
                  fontSize: "16px",
                  fontFamily: "Manrope",
                }}
              >
                Conversion Ratio
              </span>
            </div>
            <div className="d-flex align-items-center" style={{gap:'10px'}}>
              <span
                style={{
                  color: "#000",
                  fontWeight: "700",
                  fontSize: "30px",
                  lineHeight: "36px",
                  fontFamily: "Manrope",
                }}
              >
                20%
              </span>
              <span
                style={{
                  color: "#FFF",
                  backgroundColor:'#FF66A1',
                  fontWeight: "700",
                  lineHeight: "16.39px",
                  fontSize: "12px",
                  fontFamily: "Manrope",
                  padding:'2px',
                  borderRadius:'8px',
                  width:'36px',
                  alignItems:'center',
                  textAlign:'center'
                }}
              >
                -4%
              </span>
            </div>
          </div>
          
        </div>
        <div></div>
      </div>
      <div className="card-body">
      <div  ref={chartRef} className="mixed-widget-4-chart" style={{width:'70%',height:'60px',fontFamily:"Manrope"}}>     
      </div>
    </div>
    </div>
  </div>    
)
};

const chartOptions = (): ApexOptions => {
    const baseColor = '#4BCD60';
    const lightColor = '#ED5578FF';
  
    return {
      series: [100 - 75],
      chart: {
        fontFamily: 'Manrope',
        height: '180px', // Use 100% to fill the container height
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
            inverseOrder: true,   // Flip the chart horizontally
            hollow: {
              margin: 0,
              size: '30%',
            },
          dataLabels: {
            name: {
              show: false,
              fontWeight: '700',
            },
            value: {
              // color: labelColor,
              fontSize: '14px', // Set your desired font size
              fontWeight: '500',
              color: "#ED5578",
              fontFamily:'Manrope',
              offsetY: 5,
              show: true,
              formatter: function (val) {
                return val + '%';
              },
            },
          },
          track: {
            background: baseColor,
            strokeWidth: '60%',
          },
          
        },
      },
        colors: [lightColor],
  
      labels: ['Progress'],
    };
  };

export { EngageWidget11 };






