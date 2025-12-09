import React,  { useState, useEffect } from "react";
import { DOMAIN,getStudentAdmissionDetails } from '../../../../app/routing/ApiEndpoints.tsx'; 
import { useAuth } from "../../../../app/modules/auth/index.ts";

// interface StudentData {
//   classNames: ClassName[];
//   currentYearOccupancy: Occupancy[];
//   currentYearStudents: Student[];
//   currentYearTarget: Target[];
//   lastYearOccupancy: Occupancy[];
//   lastYearStudents: Student[];
// }

 // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any
const TablesWidget23: React.FC = ({ selectedValue }:any) => {
  const [showLastYearValue, setLastYearValue] = useState(false);
  const [data, setData] = useState({
    classNames: [],
    currentYearOccupancy: [],
    currentYearStudents: [],
    currentYearTarget: [],
    lastYearOccupancy: [],
    lastYearStudents: [],
  });
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
// console.log(selectedValue);


  const handelLastYear = () => {
    setLastYearValue((prevState) => !prevState);
  };

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${DOMAIN}/${getStudentAdmissionDetails}/${selectedValue}/${schoolId}`);
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


  return (
    <div
      style={{
        width: "100%",
        height: "594px",
        // borderRadius: "16px",
        // border: "1px solid black",
        // overflowX: "auto",
        borderRadius: "16px",
        border: "1px solid #DADADA",
        fontFamily:"Manrope",
      }}
    >
        {/* <div
          style={{
            width: "100%",
            height: "80px",
            padding: "9px 0px 9px 0px",
            display: "flex",
            gap: "20px",
            backgroundColor: "#F5F5F5",
            borderRadius: "16px 16px 0px 0px",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "95%",
              height: "36px",
              top: "24px",
              display: "flex",
              paddingLeft: "40px",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "200px", height: "10px" }}>
              <span
                style={{
                  fontSize: "18px",
                  lineHeight: "19.12px",
                  fontWeight: "700",
                  color: "#000000",
                  fontFamily:"Manrope", 
                }}
              >
                Admissions By Class
              </span>
            </div>
            <div className="">
              <div
                style={{
                  width: "85px",
                  height: "36px",
                  border: "1px solid #E3E3E3",
                  borderRadius: "42px",
                  padding: "8px 9px 8px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <label
                  style={{
                    fontSize: "12px",
                    lineHeight: "16.39px",
                    fontWeight: "500",
                    width: "25px",
                    height: "16px",
                    color: "#1F3259",
                  }}
                  htmlFor="googleswitch"
                >
                  LY
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
                    // checked={data.google}
                    // onChange={() =>
                    //   updateData({
                    //     google: !data.google,
                    //   })
                    // }
                  />
                </div>
              </div>
            </div>
          </div>
        </div> */}

      <table
        style={{
          top: "123px",
          width: "100%",
          // height: "485px",
          // border:'1px solid #F5F5F5',
          borderCollapse: "collapse",
          
          overflowY: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <thead
          style={{
            // border:'1px solid ',
            backgroundColor:'#F5F5F5',  
            display: "flex",
            flexDirection: "column",
            borderRadius: "16px 16px 0px 0px",
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
          <caption  style={{  
               height:'36px',
               display: "flex",
               flexDirection: "row",
               justifyContent: "space-between",
               marginTop:'24px',
              
               padding:'0px',
            }}><div  style={{display:'flex', gap:'10px'}}>
            <span
              style={{ color: "#000", fontSize: "16px", fontWeight: "600",fontFamily:"Manrope", }}
            >
              Admissions by Class
            </span>
          </div>
          <div className="">
            <div
              style={{
                width: "95px",
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
                  color:'#000',
                paddingTop:'2px',
                fontFamily:"Manrope",
                }}
                htmlFor="googleswitch"
              >
                LYSM
              </label>
              <div className="form-check  form-switch" style={{paddingTop:'2px'}}>
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
          <div style={{display:'flex',justifyContent:'center'}}>   
          <tr
            style={{
              width: "100%",
              height: "34px",
              // paddingRight:'24px',
              display: "flex",
              justifyContent: "space-between",
              // gap: "20px",
              // backgroundColor:'#1C335C',
              // backgroundColor:'#F5F5F5',
              // paddingLeft: "15px",
              // paddingTop: "15px",   
              // paddingRight:'35px'
            }}
          >
            <th style={{ width: "fit-content", height: "18px" }}>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  lineHeight: "18px",
                  color: "#000",
                  fontFamily:"Manrope",
                }}
              >
                Category
              </span>
            </th>
            <th style={{ width: "fit-content",height: "18px" }}>
              <span
                 style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  lineHeight: "18px",
                  color: "#000",
                  fontFamily:"Manrope",
                }}
              >
                Admission
              </span>
            </th>
            <th style={{ width: "fit-content", height: "18px" }}>
              <span
                 style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  lineHeight: "18px",
                  color: "#000",
                  fontFamily:"Manrope",
                }}
              >
              Capacity
              </span>
            </th>
            <th style={{ width: "fit-content", height: "18px"  }}>
              <span
                 style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  lineHeight: "18px",
                  color: "#000",
                  fontFamily:"Manrope",
                }}
              >
              Occupancy%
              </span>
            </th>
            <th style={{ width: "fit-content", height: "18px"  }}>
              <span
                 style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  lineHeight: "18px",
                  color: "#000",
                  fontFamily:"Manrope",
                }}
              >
              Target%
              </span>
            </th>
          </tr>
          </div>
        </thead>

        <tbody className=""
          style={{
            display: "block", 
            height: "470px",
            borderRadius:'0px 0px 10px 10px ', 
            overflowY: "auto",
            flexDirection: "column",
            flex:1,
            justifyContent: "center",
            // border:'1px solid black'
          }}
        >
       {data && data.classNames && data.classNames.map((className, index) => (
         <div className="tile-shadow"  key={index}   style={{display:'flex',height: "61px", alignItems:'center', justifyContent:'center', width:'100%',backgroundColor:'#F7F9FB'}}>
          <tr className=""
            style={{
              width: "100%",
              height: "61px",
              display:'flex',
              paddingLeft:'24px',
              paddingRight:'24px',
              paddingTop: "18px",
              justifyContent:'space-between',
            }}
          >
              <td>
                <div className=""
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
                    style={{fontFamily:"Manrope",fontSize:'14px', fontWeight:'700', color:'#000'}}
                  >
                    
                 {className.
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
                 class}
                  </a>
                </div>
              </td>
              <td style={{width:'fit-content'}}>
                <div
                  style={{
                    width: "fit-content",
                    display: "flex",
                    marginLeft:'0px',
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
                      fontFamily:"Manrope",
                    }}
                  >
                  {data.currentYearStudents.length !==0 && data.currentYearStudents[index] ? ( data.currentYearStudents[index].
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error 
                  total_students_current_year) : '-'}
                  </span>
                  {showLastYearValue && data?.lastYearStudents && data.lastYearStudents[index]?.
                   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error 
                  total_students_previous_year ? (
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "400",
                        lineHeight: "18px",
                        color: "#737373",
                        fontFamily:"Manrope",
                      }}
                    >
                      {data.lastYearStudents.length !==0 && data.lastYearStudents[index] ? ( data.lastYearStudents[index].
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error 
          total_students_previous_year) : '-'}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </td>
              <td style={{width:'fit-content'}}>
                <div
                  style={{
                    width: "fit-content",
                    display: "flex",
                    marginRight:'10px',
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
                      fontFamily:"Manrope",
                    }}
                  >
                    100
                  </span>
                  {showLastYearValue ? (
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "400",
                        lineHeight: "18px",
                        color: "#737373",
                        fontFamily:"Manrope",
                      }}
                    >
                      100
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </td>
            <td style={{width:'fit-content'}}>
              <div
                style={{
                  width: "fit-content",
                  display: "flex",
                  justifyContent: "start",
                  marginRight:'20px',
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "400",
                    lineHeight: "18px",
                    color: "#1F1F1F",
                    fontFamily:"Manrope",
                  }}
                >
                   {data.currentYearOccupancy.length !==0 && data.currentYearOccupancy[index] ? ( data.currentYearOccupancy[index].
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error 
          occupancy_percentage) + '%': '-'}
                  
               
                </span>
                {showLastYearValue && data?.lastYearOccupancy && data.lastYearOccupancy[index]?.
                 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error 
                occupancy_percentage ? (
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "18px",
                      color: "#737373",
                      fontFamily:"Manrope",
                    }}
                  >
                    {data.lastYearOccupancy[index].
                     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error 
                    occupancy_percentage}%
                  </span>
                ) : (
                  ""
                )}
              </div>
            </td>
            <td>
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
                    fontFamily:"Manrope",
                  }}
                >
                    {data.currentYearTarget.length !==0 && data.currentYearTarget[index] ? ( data.currentYearTarget[index].
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error 
          target_occupancy)+'%' : '-'}

                 
                </span>
                
                {showLastYearValue && data?.
                 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error 
                lastYearTarget && data.lastYearTarget[index]?.target_occupancy  ? (
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "18px",
                      color: "#737373",
                      fontFamily:"Manrope",
                    }}
                  >
                    {data.
                     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error 
                    lastYearTarget[index].target_occupancy}%
                  </span>
                ) : (
                  ""
                )}
              </div>
            </td>
          </tr>
          </div>
          

       ))}
          
          
          
        </tbody>
        {/* end::Table body */}
      </table>
      {/* end::Table */}
    </div>
  );
};

export { TablesWidget23 };

//this is the code when the list is comeing from the api and it has the functionallity to behave in such as way that the odd will not have the background color and even will
// const dataFromApi = [/* your API data here */];

// <table
//   style={{ top: "123px", width: "619px", height: "408px", borderCollapse: "collapse" }}
// >
//   <tbody className="d-flex justify-content-center">
//     {dataFromApi.map((item, index) => (
//       <tr
//         key={index}
//         style={{
//           width: "520px",
//           height: "51px",
//           gap: "45px",
//           display: "flex",
//           paddingTop: '15px',
//           background: index % 2 === 0 ? 'lightblue' : 'white',
//         }}
//       >
//         <td style={{ width: "110px" }}>
//           <div className="d-flex justify-content-start">
//             <a href="#" className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6">
//               {item.field1}
//             </a>
//           </div>
//         </td>
//         <td style={{ width: "110px" }}>
//           <div className="d-flex justify-content-start">
//             <a href="#" className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6">
//               {item.field2}
//             </a>
//           </div>
//         </td>
//         <td style={{ width: "110px" }}>
//           <div className="d-flex justify-content-start">
//             <a href="#" className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6">
//               {item.field3}
//             </a>
//           </div>
//         </td>
//         <td style={{ width: "110px" }}>
//           <div className="d-flex justify-content-start">
//             <a href="#" className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6">
//               {item.field4}
//             </a>
//           </div>
//         </td>
//       </tr>
//     ))}
//   </tbody>
// </table>
