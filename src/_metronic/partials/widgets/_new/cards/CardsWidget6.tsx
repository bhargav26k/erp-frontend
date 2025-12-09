/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, useState, useEffect  } from "react";
import { DOMAIN ,getTotalNumberofEnquiries} from '../../../../../app/routing/ApiEndpoints.tsx'; 
import { useAuth } from "../../../../../app/modules/auth/index.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CardsWidget6: FC = ({ selectedValue }:any) => {
  const [data, setData] = useState({
    today: "",
    thisWeek: "",
    thisMonth: "",
    thisYear:"",
    lastYear: "",
  });
// console.log(selectedValue);
const {currentUser} = useAuth();
const schoolId = currentUser?.school_id;




  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/${getTotalNumberofEnquiries}/${selectedValue}/${schoolId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedValue]);

  // console.log(data);
  
  return (
    <div
      className=""
      style={{
        height:'160px',
        width: "100%",
        backgroundColor: "#1F3259",
        borderRadius: "16px",
        padding: "20px",
        gap: "18px",
        display: "flex",
        // border: "1px solid green",
        fontFamily: "Manrope",
      }}
    >
      <div className="card-header d-flex ">
        <div
          className="card-title"
          style={{
            display: "flex",
            flexDirection: "column",
            // justifyContent: "space-between",
            gap: "19px",
            width:"100%"
          }}
        >
          <div>
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: "700",
                lineHeight: "19.12px",
                fontSize: "16px",
                fontFamily: "Manrope",
              }}
            >
              Enquiries
            </span>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px",width:'100%' }}
          >
            <div style={{ display: "flex", flexDirection: "row", width:'100%' }}>
              <div style={{ width: "auto", maxWidth:"121px"}}>
                <div
                  className="d-flex align-items-start"
                  style={{
                    width: "100%",
                    height: "55px",
                    gap: "3px",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 1)",
                      fontWeight: "600",
                      fontSize: "14px",
                      lineHeight: "15px",
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      color: "rgba(167, 255, 176, 1)",
                      fontWeight: "700",
                      fontSize: "30px",
                      lineHeight: "36px",
                    }}
                  >
                    {data.thisYear ? data.thisYear : "~"}
                  </span>
                </div>
              </div>
              <div style={{ marginLeft:'45px',marginRight:'45px' }}>
                <svg
                  width="2"
                  height="53"
                  viewBox="0 0 2 53"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L0.999998 52"
                    stroke="url(#paint0_linear_236_1861)"
                    stroke-linecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_236_1861"
                      x1="0.500053"
                      y1="68.6047"
                      x2="0.500053"
                      y2="-13.2326"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="white" stop-opacity="0.46" />
                      <stop offset="0.515" stop-color="white" />
                      <stop offset="1" stop-color="white" stop-opacity="0.49" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div style={{width: "auto", maxWidth:"78px" }}>
                <div
                  className="d-flex align-items-start"
                  style={{
                    width: "100%",
                    height: "55px",
                    gap: "3px",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 1)",
                      fontWeight: "600",
                      fontSize: "14px",
                      lineHeight: "15px",
                    }}
                  >
                    Today
                  </span>
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 1)",
                      fontWeight: "700",
                      fontSize: "30px",
                      lineHeight: "36px",
                    }}
                  >
                    {data.today}
                  </span>
                </div>
              </div>
              <div style={{  marginLeft:'45px',marginRight:'45px'}}>
                <svg
                  width="2"
                  height="53"
                  viewBox="0 0 2 53"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L0.999998 52"
                    stroke="url(#paint0_linear_236_1861)"
                    stroke-linecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_236_1861"
                      x1="0.500053"
                      y1="68.6047"
                      x2="0.500053"
                      y2="-13.2326"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="white" stop-opacity="0.46" />
                      <stop offset="0.515" stop-color="white" />
                      <stop offset="1" stop-color="white" stop-opacity="0.49" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div style={{ width: "auto", maxWidth:"78px" }}>
                <div
                  className="d-flex align-items-start"
                  style={{
                    width: "100%",
                    height: "55px",
                    gap: "3px",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 1)",
                      fontWeight: "600",
                      fontSize: "14px",
                      lineHeight: "15px",
                    }}
                  >
                    This Week
                  </span>
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 1)",
                      fontWeight: "700",
                      fontSize: "30px",
                      lineHeight: "36px",
                    }}
                  >
                    {data.thisWeek}
                  </span>
                </div>
              </div>
              <div style={{  marginLeft:'45px',marginRight:'45px'    }}>
                <svg
                  width="2"
                  height="53"
                  viewBox="0 0 2 53"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L0.999998 52"
                    stroke="url(#paint0_linear_236_1861)"
                    stroke-linecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_236_1861"
                      x1="0.500053"
                      y1="68.6047"
                      x2="0.500053"
                      y2="-13.2326"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="white" stop-opacity="0.46" />
                      <stop offset="0.515" stop-color="white" />
                      <stop offset="1" stop-color="white" stop-opacity="0.49" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div style={{ width: "auto", maxWidth:"78px",}}>
                <div
                  className="d-flex align-items-start"
                  style={{
                    width: "100%",
                    height: "55px",
                    gap: "3px",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 1)",
                      fontWeight: "600",
                      fontSize: "14px",
                      lineHeight: "15px",
                    }}
                  >
                    This Month
                  </span>
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 1)",
                      fontWeight: "700",
                      fontSize: "30px",
                      lineHeight: "36px",
                    }}
                  >
                    {data.thisMonth}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <span
                style={{
                  color: "#C6E0F3",
                  fontWeight: "400",
                  lineHeight: "16.39px",
                  fontSize: "12px",
                }}
              >
                Last Year : {" "}
                <span
                  style={{
                    color: "#C6E0F3",
                    fontWeight: "700",
                    lineHeight: "16.39px",
                    fontSize: "12px",
                  }}
                >
                  {data.lastYear ? data.lastYear : "*No Data available*"}

                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CardsWidget6 };
