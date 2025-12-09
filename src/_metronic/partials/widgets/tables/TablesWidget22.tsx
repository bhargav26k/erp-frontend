import React, { useState,useEffect } from "react";
import { DOMAIN,getClassWiseEnquiryThisYear } from '../../../../app/routing/ApiEndpoints.tsx'; 
import { useAuth } from "../../../../app/modules/auth/index.ts";


interface EnquiryData {
  class: string;
  total_inquiries: number;
  win_percentage: number;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TablesWidget22: React.FC = ({ selectedValue }:any) => {
  const [showLastYearValue, setLastYearValue] = useState(false);
  const [currentYearData, setCurrentYearData] = useState<EnquiryData[]>([]);
  const [lastYearData, setLastYearData] = useState<EnquiryData[]>([]);
  const {currentUser} = useAuth();
  const schoolId = currentUser?.school_id;


  const handelLastYear = () => {
    setLastYearValue((prevState) => !prevState);
  };
  // console.log(currentYearData,setLastYearValue);
  





  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${DOMAIN}/${getClassWiseEnquiryThisYear}/${selectedValue}/${schoolId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const json = await response.json();
        setCurrentYearData(json.currentYear);
        setLastYearData([...json.lastYear]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedValue]);

  return (
    <div className="h-md-150"
    style={{
      width: "100%",
      height: "610px",
      borderRadius: "16px",
      border: "1px solid #DADADA",
      overflow: "hidden",
      fontFamily:"Manrope",
      }}
    >

      <table
        className=""
        style={{
          top: "123px",
          width: "100%",
          // height: "250px",
          borderCollapse: "collapse",
          // overflowX: "hidden",
          overflowY: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <thead
          style={{
            // border:'1px solid ',
            backgroundColor: "#F5F5F5",
            display: "flex",
            flexDirection: "column",
            borderRadius: "16px 0px 0px 0px",
            // width:'100%',
            height: "120px",
            maxHeight: "100%",
            justifyContent: "space-between",
            zIndex:999,
            paddingLeft:'24px',
            paddingRight:'24px',
            // borderBottom: "1px solid #DADADA",
          }}
        >
          <caption
            style={{
              height:'36px',
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop:'24px',
             
              padding:'0px',
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <span
                style={{
                  color: "#000",
                  fontSize: "16px",
                  fontWeight: "600",
                  fontFamily: "Manrope",
                }}
              >
                Enquiry Breakdown by Class
              </span>
            </div>
            <div className="">
              <div
                style={{
                  width: "80px",
                  height: "36px",
                  display: "flex",
                  border: "1px solid #DADADA",
                  borderRadius: "42px",
                  padding: "7px 9px 8px 10px",
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
                    height: "20px",
                    color: "#000",
                    paddingTop: "2px",
                    fontFamily: "Manrope",
                  }}
                  htmlFor="googleswitch"
                >
                  LY
                </label>
                <div
                  className="form-check  form-switch" 
                  style={{ paddingTop: "2px" }}
                >
                  <input
                    className="form-check-input bg-pink"
                    type="checkbox"
                    // id="googleswitch"
                    style={{
                      width: "35px",
                      height: "20px",
                      gap: "10px",
                      color: "#1F3259",
                      // paddingTop:'5px'
                    }}
                    onClick={() => handelLastYear()}
                  />
                </div>
              </div>
            </div>
          </caption>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <tr
              style={{
                width: "100%",
              height: "34px",
              // paddingRight:'24px',
              display: "flex",
              justifyContent: "space-between",
              }}
            >
              <th style={{ width: "fit-content", height: "18px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    lineHeight: "18px",
                    color: "#000",
                    fontFamily: "Manrope",
                  }}
                >
                  Class
                </span>
              </th>
              <th style={{ width: "fit-content", height: "18px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    lineHeight: "18px",
                    color: "#000",
                    fontFamily: "Manrope",
                  }}
                >
                  Enquires
                </span>
              </th>
              <th style={{ width: "fit-content", height: "18px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    lineHeight: "18px",
                    color: "#000",
                    fontFamily: "Manrope",
                  }}
                >
                  Conversion Ratio
                </span>
              </th>
            </tr>
          </div>
        </thead>
        <tbody
          className=""
          style={{
            display: "block",
            height: "480px",
            overflowY: "auto",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {Array.isArray(currentYearData) && currentYearData.length > 0 ? (
        currentYearData.map((item, index) => (
          <div
          key={index}
            className="tile-shadow"
            style={{
              display: "flex",
              height: "61px",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              // backgroundColor: "#F7F9FB",
              background: index % 2 === 0 ? '#F7F9FB' : 'white',
              
            }}
          >
            <tr
              className=""
              style={{
                width: "100%",
              height: "61px",
              display:'flex',
              paddingLeft:'24px',
              paddingRight:'24px',
              paddingTop: "18px",
              justifyContent:'space-between',
              // gap:'20px'
              }}
            >
              <td style={{  width:'22%'}}>
                <div
                  className=""
                  style={{
                    width: "fit-content",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                  }}
                >
                  <a
                    href="#"
                    className=""
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#000",
                    }}
                  >
                   {item.class}
                  </a>
                </div>
              </td>
              <td style={{width:'30%', display:'flex',justifyContent:'center'}}>
                <div
                  style={{
                    width: "fit-content",
                    display: "flex",
               
                    justifyContent: "start",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      lineHeight: "18px",
                      color: "#1F1F1F",
                      fontFamily: "Manrope",
                    }}
                  >
                    {item.total_inquiries}
                  </span>
                  {showLastYearValue ? (
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "400",
                        lineHeight: "18px",
                        color: "#737373",
                        fontFamily: "Manrope",
                      }}
                    >
                     {lastYearData.length !== 0 && lastYearData[index] ? 
  (lastYearData[index].total_inquiries != null ? 
    lastYearData[index].total_inquiries 
    : '-') 
  : '-'
}

                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </td>
              <td style={{width:'30%', display:'flex',justifyContent:'end'}} >
                <div
                  style={{
                    width: "fit-content",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      lineHeight: "18px",
                      color: "#1F1F1F",
                      fontFamily: "Manrope",
                    }}
                  >
                     {item.win_percentage}%
                  </span>
                  {showLastYearValue ? (
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "400",
                        lineHeight: "18px",
                        color: "#737373",
                        fontFamily: "Manrope",
                      }}
                    >
                       {lastYearData[index] && lastYearData[index].win_percentage}%
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </td>
            </tr>
          </div>
           ))
          )
            : (
             <div>No data available</div> 
           )}
        </tbody>
      </table>
    </div>
  );
};

export { TablesWidget22 };

