import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import axios from "axios";

const TablesWidget11: React.FC = () => {
  const [showLastYearValue, setLastYearValue] = useState(false);

  const handelLastYear = () => {
    setLastYearValue((prevState) => !prevState);
  };
  const [data, setData] = useState([]);
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const session_id = currentUser?.session_id;
  const currency = currentUser?.currency_symbol;

  const fetchClassWiseStats = async () => {
    try {
      const response = await axios.get(
        `${DOMAIN}/api/school/get-class-wise-fee-stats`,
        {
          params: { school_id, session_id },
        }
      );
      if (response.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching class-wise fee stats:", error);
    }
  };

  useEffect(() => {
    fetchClassWiseStats();
  }, [school_id,session_id]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        backgroundColor: "#F2F6FF",
        borderRadius: "15px",
        padding: "10px",
        height:'580px'
      }}
    >
      <div
        className="modal-header"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
          fontFamily: "Manrope",
          display: "flex",
          alignItems: "center",
          justifyContent: "normal",
          padding:'10px'
        }}
      >
       
        <h2
          style={{ fontFamily: "Manrope", fontSize: "18px", fontWeight: "500" }}
        >
          {" "}
          Fee Breakdown by Class For Current Session
        </h2>
      </div>
      <div
        className="modal-body px-lg-5"
        style={{ backgroundColor: "#F2F6FF", fontFamily: "Manrope" }}
      >
        <div style={{ height: "auto", overflowY: "auto", overflowX: "auto" }}>
          <table
            className="table"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "rgb(242, 246, 255)",
                  borderBottom: "1px solid #E0E4F0",
                  fontFamily: "Manrope",
                  fontWeight: "600",
                  color: "#1C335C",
                  fontSize: "14px",
                }}
              >
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Class
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Expected Fee
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Collected Fee
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Due Fee
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  key={index}
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? "rgb(242, 246, 255)" : "#FFFFFF",
                    borderBottom: "1px solid #E0E4F0",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    color: "#1C335C",
                  }}
                >
                  <td style={{ padding: "10px 15px", textAlign: "left",minWidth: "150px",fontFamily:'Manrope', fontSize:'14px',fontWeight:'500' }}>
                    {item.class_name || "N/A"}
                  </td>
                  <td style={{ padding: "10px 15px", textAlign: "left",minWidth: "150px",fontFamily:'Manrope', fontSize:'14px',fontWeight:'500' }}>
                     { currency + " " + item.expected_fee?.toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 15px", textAlign: "left",minWidth: "150px",fontFamily:'Manrope', fontSize:'14px',fontWeight:'500' }}>
                    {currency + " " +item.collected_fee?.toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 15px", textAlign: "left",minWidth: "150px",fontFamily:'Manrope', fontSize:'14px',fontWeight:'500' }}>
                    {currency + " " + item.due_fee?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { TablesWidget11 };

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
