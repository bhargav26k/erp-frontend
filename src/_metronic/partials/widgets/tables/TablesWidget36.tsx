import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";

interface Uploads {
  id: number;
  class: string;
  section: string;
  subject: string;
  staff_name: string;
  upload_type: string;
  created_at: string;
  // Add other properties as needed
}

const TablesWidget36: React.FC = () => {

  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;

  const [getAllUploads, setAllUploads] = useState<Uploads[]>([]);


  useEffect(() => {
    const fetchAllUploads = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-alluploads/${school_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAllUploads(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllUploads();
  }, []);


  const formatDate = (dateString: string | number | Date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
     /* @ts-ignore */
    return date.toLocaleDateString('en-GB', options);
  };


  return (

    <div className="" 
      style={{
        width: "100%",
        height: "645px",
        borderRadius: "16px",
        border: "1px solid #D2D2D2",
        overflow: "hidden",
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
            backgroundColor:'#F5F5F5',  
            display: "flex",
            flexDirection: "column",
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
              // backgroundColor: "#1C335C",
              // backgroundColor:'#1C335C',
              // padding: "20px",
              paddingLeft:'20px',
              paddingRight:'20px',
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop:'24px',
              
              padding:'0px',
              // border:'1px solid'
            }}><div  style={{display:'flex', gap:'10px'}}>
            <span
              style={{ color: "#000", fontSize: "16px", fontWeight: "600",fontFamily:"Manrope", }}
            >
       Recent Uploads 
            </span>
          </div>
          
          </caption>
          <div style={{display:'flex'}}>   
          <tr
            style={{
              width: "100%",
              height: "34px",
              display: "flex",
              paddingRight:'44px',
              gap: "0px",
              // backgroundColor:'#1C335C',
              // backgroundColor:'#F5F5F5',
              // paddingLeft: "24px",
              // paddingTop: "15px",   
              // paddingRight:'35px'
            }}
          >
            <th style={{width:'80px',   height: "18px" }}>
              <span
                style={{
                  
                  fontSize: "14px",
                  fontWeight: "700",
                  lineHeight: "18px",
                  color: "#000",
                  fontFamily:"Manrope",
                }}
              >
                Class
              </span>
            </th>
            <th style={{width:'80px', height: "18px" }}>
              <span
                 style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  lineHeight: "18px",
                  color: "#000",
                  fontFamily:"Manrope",
                }}
              >
                Section
              </span>
            </th>
            <th style={{width:'150px',height: "18px" }}>
              <span
                 style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  lineHeight: "18px",
                  color: "#000",
                  fontFamily:"Manrope",
                }}
              >
                Subject
              </span>
            </th>
            <th style={{width:'120px',height: "18px" }}>
              <span
                 style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  lineHeight: "18px",
                  color: "#000",
                  fontFamily:"Manrope",
                }}
              >
                Staff
              </span>
            </th>
            <th style={{width:'200px', height: "18px" }}>
              <span
                 style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  lineHeight: "18px",
                  color: "#000",
                  fontFamily:"Manrope",
                }}
              >
              Upload Type
              </span>
            </th>
            <th style={{ height: "18px"  }}>
              <span
                 style={{
                  width:'50px',
                  fontSize: "14px",
                  fontWeight: "700",
                  lineHeight: "18px",
                  color: "#000",
                  fontFamily:"Manrope",
                }}
              >
              Upload Date
              </span>
            </th>
          </tr>
          </div>
        </thead>
        <tbody className="border"
          style={{
            display: "block", 
            height: "525px", 
            overflowY: "auto",
            flexDirection: "column",
            flex:1,
            justifyContent: "center",
          }}
        >
          
          {getAllUploads.map((item, index) => (

         <div className="tile-shadow" style={{display:'flex',height: "61px", alignItems:'center', justifyContent:'center', width:'100%',backgroundColor:'#F7F9FB'}}>
          <tr className=""
          key={index}
            style={{
              width: "100%",
              height: "61px",
              display:'flex',
              paddingLeft:'26px',
              paddingRight:'10px',
              paddingTop: "18px",
              gap:'0px'
            }}
          >
            
              <td>
                <div className=""
                  style={{
                    width: "70px",
                    display: "flex",
                    flexDirection: "column",
                    marginRight:'20px'
                  }}
                ><span
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  lineHeight: "18px",
                  color: "#1F1F1F",
                  fontFamily:"Manrope",
                }}
              >
                {item.class}
              </span>
                </div>
              </td>
              <td>
                <div
                  style={{
                    width:'30px',
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                    marginRight:'30px'
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
                    {item.section}
                  </span>
                </div>
              </td>
              <td>
                <div
                  style={{
                    width:'80px',
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                    marginRight:'30px'
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
                    {item.subject}
                  </span>
                </div>
              </td>
              <td>
                <div
                  style={{
                    width:'140px',
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                    marginRight:'30px'
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
                    {item.staff_name}
                  </span>
                </div>
              </td>
              <td>
                <div
                  style={{
                    width:'120px',
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                    marginRight:'70px'
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
                    {item.upload_type}
                  </span>
                </div>
              </td>
            
            <td>
                <div
                  style={{
                    width:'120px',
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
                    {formatDate(item.created_at)}
                  </span>
                  
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

export { TablesWidget36 };

