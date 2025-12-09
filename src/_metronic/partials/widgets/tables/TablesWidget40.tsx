import React, { useEffect, useState } from "react";
// import { CreateAdminModal } from "../../../../_metronic/partials/modals/create-app-stepper/CreateAdminModal";
// import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { DOMAIN,getAssignedRoles } from "../../../../app/routing/ApiEndpoints";
import { useNavigate } from "react-router-dom";

interface TablesWidget40Props {
  schoolId: string | null;
}

interface SchoolDetail {
  role_id:number;
  role_name:string;
  user_name : string;
  upadated_at : string;
  is_active : string;
}

const TablesWidget40: React.FC<TablesWidget40Props> =  ({ schoolId }) => {
  const [schoolDetails, setSchoolDetails] = useState<SchoolDetail[]>([]);
  
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/${getAssignedRoles}/${schoolId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSchoolDetails(data);
        // console.log(data);
      } catch (error) {
        console.error("Error fetching school details:", error);
      }
    };

    fetchData();
  }, [schoolId]);


  const handleAddRoles  = () => () => {
    Navigate(`/superadmin/manage/academies/roles?schoolId=${schoolId}`);
  }


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div
      className=""
      style={{
        width: "100%",
        height: "600px",
        borderRadius: "16px",
        // border: "1px solid #F5F5F5",
        overflow: "hidden",
        border: "1px solid gray",
      }}
    >
      <table
        className=""
        style={{
          top: "223px",
          height: "808px",
          maxHeight: "100%",
          borderCollapse: "collapse",
          // tableLayout: "fixed",
          overflowX: "hidden",
          overflowY: "auto",
          whiteSpace: "nowrap",
          width: "100%",
        }}
      >
        <thead
          style={{
            position: "sticky",
            top: "0",
            zIndex: "1",
            height: "133px",
            maxHeight: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#1C335C",
            justifyContent: "space-between",
            gap: "0px",
            padding: "9px 24px 9px 24px",
          }}
        >
          <caption
            style={{
              paddingLeft: "20px",
              paddingRight: "20px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "24px",
              padding: "0px",
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  lineHeight: "21.86px",
                  color: "#FFFFFF",
                  fontFamily: "Manrope",
                }}
              >
                Manage Roles
              </span>
            </div>
            <div style={{ display: "flex" }}>
              <span
                style={{
                  height: "36px",
                  borderRadius: "8px",
                  padding: "8px 10px 8px 10px",
                  gap: "5px",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  flexDirection: "row",
                  cursor: "pointer",
                }}
                onClick={handleAddRoles()}
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_103_1850)">
                    <path
                      d="M1.66663 10C1.66663 6.07165 1.66663 4.10746 2.88701 2.88708C4.1074 1.66669 6.07159 1.66669 9.99996 1.66669C13.9283 1.66669 15.8925 1.66669 17.1129 2.88708C18.3333 4.10746 18.3333 6.07165 18.3333 10C18.3333 13.9284 18.3333 15.8926 17.1129 17.113C15.8925 18.3334 13.9283 18.3334 9.99996 18.3334C6.07159 18.3334 4.1074 18.3334 2.88701 17.113C1.66663 15.8926 1.66663 13.9284 1.66663 10Z"
                      stroke="black"
                      stroke-width="1.5"
                    />
                    <path
                      d="M12.5 10L10 10M10 10L7.5 10M10 10L10 7.5M10 10L10 12.5"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_103_1850">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <div style={{ width: "65px", height: "9px" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#000000",
                      lineHeight: "16.39px",
                      fontFamily: "Manrope",
                    }}
                  >
                     {schoolDetails.length === 0 ? "Add Roles" : "Edit Roles"}
                  </span>
                </div>
              </span>
            </div>
           
          </caption>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <tr
              style={{
                width: "100%",
                height: "34px",
                display: "flex",
                paddingRight: "24px",
                // justifyContent: "space-around",
                gap: "30px",
                // backgroundColor:'#1C335C',
                // backgroundColor:'#F5F5F5',
                // paddingLeft: "15px",
                // paddingTop: "15px",
                // paddingRight:'35px'
              }}
            >
              <th style={{ width: "15%", height: "18px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    lineHeight: "18px",
                    color: "#FFFFFF",
                    position: "sticky",
                    top: "0",
                    zIndex: "1",
                    fontFamily: "Manrope",
                  }}
                >
                  Id
                </span>
              </th>
              <th style={{ width: "35%", height: "18px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    lineHeight: "18px",
                    color: "#FFFFFF",
                    position: "sticky",
                    top: "0",
                    zIndex: "1",
                    fontFamily: "Manrope",
                  }}
                >
                  Name
                </span>
              </th>
              <th style={{ width: "35%", height: "18px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    lineHeight: "18px",
                    color: "#FFFFFF",
                    position: "sticky",
                    top: "0",
                    zIndex: "1",
                    fontFamily: "Manrope",
                  }}
                >
                  Who Updated
                </span>
              </th>
              <th style={{ width: "35%", height: "18px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    lineHeight: "18px",
                    color: "#FFFFFF",
                    position: "sticky",
                    top: "0",
                    zIndex: "1",
                    fontFamily: "Manrope",
                  }}
                >
                  Upadted At
                </span>
              </th>
              <th style={{ width: "10%", height: "18px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    lineHeight: "18px",
                    color: "#FFFFFF",
                    position: "sticky",
                    top: "0",
                    zIndex: "1",
                    fontFamily: "Manrope",
                  }}
                >
                  IsActive
                </span>
              </th>
            </tr>
          </div>
        </thead>
        <tbody
          className=""
          style={{
            display: "block",
            height: "265px",
            overflowY: "auto",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            className="tile-shadow"
            style={{
              display: "flex",
              height: "61px",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              backgroundColor: "#F7F9FB",
              flexDirection: "column",
            }}
          >
            {schoolId ? (
              schoolDetails.map((schoolDetail, index) => (
                <tr
                  key={index}
                  style={{
                    width: "100%",
                    height: "61px",
                    display: "flex",
                    paddingLeft: "24px",
                    backgroundColor: index % 2 === 0 ? "#F7F9FB" : "#FFFFFF",
                    paddingTop: "18px",
                    paddingBottom: "15px",
                  }}
                >
                  <td style={{ width: "20%" }}>
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
                        className=""
                        style={{
                          fontFamily: "Manrope",
                          fontSize: "14px",
                          fontWeight: "700",
                          color: "#000",
                        }}
                      >
                        {schoolDetail.role_id}
                      </a>
                    </div>
                  </td>
                  <td style={{ width: "35%" }}>
                    <div
                      style={{
                        width: "fit-content",
                        display: "flex",
                        marginRight: "25px",
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
                        {schoolDetail.role_name}
                      </span>
                    </div>
                  </td>
                  <td style={{ width: "35%" }}>
                    <div
                      style={{
                        width: "fit-content",
                        display: "flex",
                        marginRight: "25px",
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
                        {schoolDetail.user_name}
                      </span>
                    </div>
                  </td>
                  <td style={{ width: "35%" }}>
                    <div
                      style={{
                        width: "fit-content",
                        display: "flex",
                        marginRight: "25px",
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
                        {formatDate(schoolDetail.upadated_at)}
                      </span>
                    </div>
                  </td>
                  <td style={{ width: "15%" }}>
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
                        {schoolDetail.is_active}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td 
                /* @ts-ignore */
                colSpan="5">No Admins for the school</td>
              </tr>
            )}
          </div>
        </tbody>
        {/* end::Table body */}
      </table>
      {/* end::Table */}
    </div>
  );
};

export { TablesWidget40 };
