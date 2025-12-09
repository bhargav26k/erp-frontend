/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState, useRef } from "react";
import ApexCharts, {ApexOptions} from 'apexcharts'
import { useThemeMode } from "../../../layout/theme-mode/ThemeModeProvider";
import axios from "axios";
import { useAuth } from "../../../../../app/modules/auth";
import { DOMAIN } from "../../../../../app/routing/ApiEndpoints";


const CardsWidget26: React.FC = () => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const { mode } = useThemeMode();
    const { currentUser } = useAuth();
    const school_id = currentUser?.school_id;
    const session_id = currentUser?.session_id;
  
    const [stats, setStats] = useState({
      paid_students: 0,
      pending_students: 0,
      total_students: 0,
      paid_percentage: 0,
      pending_percentage: 0,
      last_year_due: 0,
    });
  
  
  
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${DOMAIN}/api/school/get-student-fee-stats`, {
          params: { school_id, session_id },
        });
  
        if (response.data) {
          
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching student fee stats:", error);
      }
    };

    useEffect(() => {
      fetchStats();
    }, [school_id, session_id]);


    const refreshChart = () => {
      if (!chartRef.current) {
        return;
      }
      const pending_percentage = parseFloat(stats?.pending_percentage);
      const chart = new ApexCharts(chartRef.current, chartOptions(pending_percentage));
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
    }, [chartRef, mode,stats.pending_percentage]);

  return (
    <div  className=" h-md-100"
      style={{
        width: "100%",
        // height: "135px",
        padding: "20px",
        borderRadius: "16px",
        backgroundColor: "#FAFAFA",
        display:'flex',
        flexDirection:'column',
        gap:'27px'
      }}
    >
      <div className="card-header d-flex" style={{width:'100%'}}>
        <div className="card-title d-flex flex-column" style={{width:'100%', justifyContent:'space-between',gap:'30px'}}>
        <span
          style={{
            fontSize: "16px",
            lineHeight: "19.12px",
            fontWeight: "700",
            color: "#212121",
            fontFamily:"Manrope",
          }}
        >
          Student Due and Received Fee
        </span>

      <div //1div whole box
        style={{
          display: "flex",
          width: "100%",
          height: "60px",
          gap: "15px",
          flex: "column",
          alignItems:'center',
          // border:'1px solid'

        }}
      >
        <div //2div textbox
          className="d-flex row"
          style={{
            width: "90%",
            height: "55px",
            gap: "15px"
          }}
        >
          <div style={{ width: "100%", height: "36px",display:'flex',flexDirection:'column', gap: "5px" }}>
            <div
              style={{
                display: "flex",
                // border:'1px solid',
                width: "100%",
                height: "18px",
                gap: "5px",
                flex: "column",
              }}
            >
              <div>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="5" cy="5" r="5" fill="#4BCD60" />
                </svg>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  lineHeight: "18px",
                  fontWeight: "700",
                  fontFamily:"Manrope",
                }}
              >
                 {stats.paid_students}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  lineHeight: "18px",
                  fontWeight: "500",
                  fontFamily:"Manrope",
                }}
              >
                Students paid
              </div>
            </div>
            <div
              style={{
                display: "flex",
                // border:'1px solid',
                width: "100%",
                height: "18px",
                gap: "5px",
                alignItems: "center",
              }}
            >
              <div>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="5" cy="5" r="5" fill="#FF5B5B" />
                </svg>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  lineHeight: "18px",
                  fontWeight: "700",
                  fontFamily:"Manrope",
                }}
              >
                {stats.pending_students}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  lineHeight: "18px",
                  fontWeight: "500",
                  fontFamily:"Manrope",
                }}
                >
                Students pending
              </div>
            </div>
          </div>
          <div style={{ width: "100%", height: "9px", gap: "12px" }}>
            <span style={{fontSize:'12px', fontWeight:'400',lineHeight:'16.39px', color:'#373737',fontFamily:"Manrope",}}>
              Total Payer <span style={{fontWeight:'700', fontSize:'12px',fontFamily:"Manrope",}}>  {stats.total_students} Students</span>
            </span>
          </div>
        </div>
        <div>
        <div  ref={chartRef} className="mixed-widget-4-chart" style={{width:'70%',height:'60px',fontFamily:"Manrope"}}>     
        </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

const chartOptions = (pendingPercentage: number): ApexOptions => {
  const baseColor = '#4BCD60';
  const lightColor = '#ED5578FF';

  return {
    series: [pendingPercentage],
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
              return val + "%";
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


export { CardsWidget26 };
