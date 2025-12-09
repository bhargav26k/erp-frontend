/* eslint-disable no-constant-condition */
import { FC } from "react";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
const HeaderUserMenu: FC = () => {
  const { currentUser, logout } = useAuth();
  const userRole = currentUser?.role;
  const pathname = location.pathname;
  const pathParts = pathname.split("/").filter((part) => part !== "");
  

  return (
    <>
    { (userRole === 'admin') && (pathParts.toString() === 'dashboard' || pathParts.toString() === 'user-roles') ? (
       <></>
      ) : (
        <div
          className="menu menu-sub menu-sub-dropdown menu-column menu-rounded  w-200px"
          data-kt-menu="true"
          style={{
            background: "#FFFFFF",
            // width: "130px",
            gap: "10px",
            padding: "0px 0px 8px 0px",
            boxShadow: "0px 2px 16.600000381469727px 0px #00000026",
            fontWeight: "300",
            height: "428px",
          }}
        >
          <div
            className=""
            style={{
              width: "100%",
              height: "420px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              className=""
              style={{
                width: "100%",
                height: "34px",
                padding: "0px 12px 0px 8px",
                marginTop: "13px",
                gap: "5px",
                display: "flex",
                flexDirection: "column",
                marginBottom: "16px",
              }}
            >
              <Link to={"/fee-&-payments/view-fee-master"}>
                <div
                  className={`menu-item  text-black  side-menu`}
                  style={{
                    width: "100%",
                    height: "26px",
                    paddingLeft: "5px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      lineHeight: "14.52px",
                      backgroundColor: "transparent",
                      fontFamily: "Manrope",
                    }}
                  >
                    Collect Fess
                  </span>
                </div>
              </Link>
              <Link to={"/fee-&-payments/view-fee-master"}>
                <div
                  className={`menu-item text-black side-menu`}
                  style={{
                    width: "100%",
                    height: "26px",
                    paddingLeft: "5px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  // onMouseOver={(e) => (
                  //   (e.currentTarget.style.backgroundColor = "lightgray"),
                  //   (e.currentTarget.style.cursor = "pointer"),
                  //   (e.currentTarget.style.borderRadius = "5px")
                  // )}
                  // onMouseOut={(e) =>
                  //   (e.currentTarget.style.backgroundColor = "#F3F3F3")
                  // }
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      lineHeight: "14.52px",
                      backgroundColor: "transparent",
                      fontFamily: "Manrope",
                    }}
                  >
                    Add Fee Master
                  </span>
                </div>
              </Link>
            </div>
            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#BDC5CB",
              }}
            ></div>
            <div
              className="bg-transparent"
              style={{
                width: "143px",
                height: "34px",
                padding: "0px 12px 0px 12px",
                // marginTop:'px',
                gap: "20px",
                display: "flex",
                flexDirection: "column",
                marginBottom: "16px",
              }}
            >
              <div
                className={`menu-item bg-transparent text-black`}
                style={{ width: "129px", height: "9px" }}
                // onMouseOver={(e) => (
                //   (e.currentTarget.style.backgroundColor = "lightgray"),
                //   (e.currentTarget.style.cursor = "pointer"),
                //   (e.currentTarget.style.borderRadius = "5px")
                // )}
                // onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#F3F3F3")}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    lineHeight: "14.52px",
                    color: "#00000",
                    fontFamily: "Manrope",
                  }}
                >
                  View Fee Group List
                </span>
              </div>
              <div
                className={`menu-item bg-transparent`}
                style={{ width: "106px", height: "9px" }}
                // onMouseOver={(e) => (
                //   (e.currentTarget.style.backgroundColor = "lightgray"),
                //   (e.currentTarget.style.cursor = "pointer"),
                //   (e.currentTarget.style.borderRadius = "5px")
                // )}
                // onMouseOut={(e) =>
                //   (e.currentTarget.style.backgroundColor = "#F3F3F3")
                // }
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    lineHeight: "16.39px",
                    color: "#00000",
                    fontFamily: "Manrope",
                  }}
                >
                  Add Fee Group
                </span>
              </div>
            </div>

            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#BDC5CB",
              }}
            ></div>
            <div
              className="bg-transparent"
              style={{
                width: "143px",
                height: "34px",
                padding: "0px 12px 0px 12px",
                gap: "20px",
                display: "flex",
                flexDirection: "column",
                marginBottom: "16px",
              }}
            >
              <div
                className={`menu-item bg-transparent`}
                style={{ width: "119px", height: "9px" }}
                // onMouseOver={(e) => (
                //   (e.currentTarget.style.backgroundColor = "lightgray"),
                //   (e.currentTarget.style.cursor = "pointer"),
                //   (e.currentTarget.style.borderRadius = "5px")
                // )}
                // onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#F3F3F3")}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    lineHeight: "14.52px",
                    color: "#00000",
                    fontFamily: "Manrope",
                  }}
                >
                  View Fee Type List
                </span>
              </div>
              <div
                className={`menu-item bg-transparent`}
                style={{ width: "96px", height: "9px" }}
                // onMouseOver={(e) => (
                //   (e.currentTarget.style.backgroundColor = "lightgray"),
                //   (e.currentTarget.style.cursor = "pointer"),
                //   (e.currentTarget.style.borderRadius = "5px")
                // )}
                // onMouseOut={(e) =>
                //   (e.currentTarget.style.backgroundColor = "#F3F3F3")
                // }
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    lineHeight: "16.39px",
                    color: "#00000",
                    fontFamily: "Manrope",
                  }}
                >
                  Add Fee Type
                </span>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#BDC5CB",
              }}
            ></div>

            <div
              className="bg-transparent"
              style={{
                width: "143px",
                height: "34px",
                padding: "0px 12px 0px 12px",
                gap: "20px",
                display: "flex",
                flexDirection: "column",
                marginBottom: "16px",
              }}
            >
              <div
                className={`menu-item bg-transparent text-black`}
                style={{ width: "149px", height: "9px" }}
                // onMouseOver={(e) => (
                //   (e.currentTarget.style.backgroundColor = "lightgray"),
                //   (e.currentTarget.style.cursor = "pointer"),
                //   (e.currentTarget.style.borderRadius = "5px")
                // )}
                // onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#F3F3F3")}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    lineHeight: "14.52px",
                    color: "#00000",
                    fontFamily: "Manrope",
                  }}
                >
                  View Fee Discount List
                </span>
              </div>
              <div
                className={`menu-item bg-transparent text-black`}
                style={{ width: "140px", height: "9px" }}
                // onMouseOver={(e) => (
                //   (e.currentTarget.style.backgroundColor = "lightgray"),
                //   (e.currentTarget.style.cursor = "pointer"),
                //   (e.currentTarget.style.borderRadius = "5px")
                // )}
                // onMouseOut={(e) =>
                //   (e.currentTarget.style.backgroundColor = "#F3F3F3")
                // }
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    lineHeight: "16.39px",
                    color: "#00000",
                    fontFamily: "Manrope",
                  }}
                >
                  Add Fee Discount
                </span>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#BDC5CB",
              }}
            ></div>

            <div
              className="bg-transparent"
              style={{
                width: "143px",
                height: "20px",
                padding: "0px 12px 0px 12px",
                // gap: "15px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className={`menu-item bg-transparent`}
                style={{ width: "130px", height: "9px" }}
                // onMouseOver={(e) => (
                //   (e.currentTarget.style.backgroundColor = "lightgray"),
                //   (e.currentTarget.style.cursor = "pointer"),
                //   (e.currentTarget.style.borderRadius = "5px")
                // )}
                // onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#F3F3F3")}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    lineHeight: "14.52px",
                    color: "#00000",
                    fontFamily: "Manrope",
                  }}
                >
                  Set Fee Reminder
                </span>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#BDC5CB",
              }}
            ></div>
            <div
              className="bg-transparent"
              style={{
                width: "143px",
                height: "34px",
                padding: "0px 12px 0px 12px",
                gap: "15px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className={`menu-item bg-transparent`}
                style={{ width: "130px", height: "9px" }}
                // onMouseOver={(e) => (
                //   (e.currentTarget.style.backgroundColor = "lightgray"),
                //   (e.currentTarget.style.cursor = "pointer"),
                //   (e.currentTarget.style.borderRadius = "5px")
                // )}
                // onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#F3F3F3")}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    lineHeight: "14.52px",
                    color: "#00000",
                    fontFamily: "Manrope",
                  }}
                >
                  Fee Carry Forward
                </span>
              </div>
            </div>

            {/* <Link to="/dashboard">
              <div
                className={`menu-item bg-transparent`}
                style={{ padding: "5px" }}
                onMouseOver={(e) => (
                  (e.currentTarget.style.backgroundColor = "lightgray"),
                  (e.currentTarget.style.cursor = "pointer"),
                  (e.currentTarget.style.borderRadius = "5px")
                )}
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F3F3F3")
                }
              >
                Fee Carry Forward
              </div>
            </Link> */}
          </div>
        </div>
      )}
    </>
  );
};

export { HeaderUserMenu };
