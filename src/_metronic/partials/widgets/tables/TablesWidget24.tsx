import React, { useState } from "react";
import { useAuth } from "../../../../app/modules/auth";

const TablesWidget24: React.FC = () => {
  const [showLastYearValue, setLastYearValue] = useState(false);

  const [selectedFilter1, setselectedFilter1] = useState("Income Breakdown");
  const [selectedFilter2, setselectedFilter2] = useState("by Category");

  const handleSelectBreakdown = (value: string) => {
    setselectedFilter1(value);
  };
  const handleSelectBy = (value: string) => {
    setselectedFilter2(value);
  };

  const handelLastYear = () => {
    setLastYearValue((prevState) => !prevState);
  };

  const { currentUser } = useAuth();
  const currency = currentUser.currency_symbol;

  return (
    <div
      className="mb-md-5 mb-lg-5"
      style={{
        width: "100%",
        height: "592px",
        // borderRadius: "16px",
        // border: "1px solid black",
        // overflowX: "auto",
        borderRadius: "16px",
        border: "1px solid #DADADA",
        fontFamily: "Manrope",
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
            backgroundColor: "#F5F5F5",
            display: "flex",
            flexDirection: "column",
            borderRadius: "16px 16px 0px 0px",
            // width:'100%',
            height: "120px",
            maxHeight: "100%",
            justifyContent: "space-between",
            zIndex: 999,
            paddingLeft: "24px",
            paddingRight: "24px",
            // borderBottom: "1px solid #DADADA",
          }}
        >
          <caption
            style={{
              height: "36px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "24px",

              padding: "0px",
            }}
          >
            <div style={{ display: "flex", gap: "0px", alignItems: "left" }}>
              <div
                className="dropdown"
                id="exampleFormControlInput1"
                style={{ width: "160px" }}
              >
                <button
                  className="dropdown-toggle"
                  style={{
                    width: "100%",
                    display: "flex",
                    // justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
                    color: "#000",
                    fontWeight: "700",
                  }}
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedFilter1}
                </button>
                <ul className="dropdown-menu" style={{ width: "100%" }}>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleSelectBreakdown("Cost Breakdown")}
                    >
                      Cost Breakdown
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleSelectBreakdown("Income Breakdown")}
                    >
                      Income Breakdown
                    </a>
                  </li>
                </ul>
              </div>
              <div
                className="dropdown"
                id="exampleFormControlInput1"
                style={{ width: "110px" }}
              >
                <button
                  className="dropdown-toggle"
                  style={{
                    width: "100%",
                    display: "flex",
                    // justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
                    color: "#000",
                    fontWeight: "700",
                  }}
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedFilter2}
                </button>
                <ul className="dropdown-menu" style={{ width: "100%" }}>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleSelectBy("by Class")}
                    >
                      by Class
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleSelectBy("by Category")}
                    >
                      by Category
                    </a>
                  </li>
                </ul>
              </div>
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
                    color: "#000",
                    paddingTop: "2px",
                    fontFamily: "Manrope",
                  }}
                  htmlFor="googleswitch"
                >
                  LYSM
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
                    fontFamily: "Manrope",
                  }}
                >
                  Category
                </span>
              </th>

              <th style={{ width: "fit-content", height: "18px" }}>
                {selectedFilter1 === "Cost Breakdown" && (
                  <a
                    href="#"
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#000",
                      marginRight: "50px",
                    }}
                  >
                    Cost
                  </a>
                )}
                {selectedFilter1 === "Income Breakdown" && (
                  <a
                    href="#"
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#000",
                    }}
                  >
                    Income
                  </a>
                )}
              </th>
              <th style={{ width: "fit-content", height: "18px" }}>
                {selectedFilter1 === "Cost Breakdown" && (
                  <a
                    href="#"
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#000",
                      // marginRight: "15px",
                    }}
                  >
                    Budget
                  </a>
                )}
                {selectedFilter1 === "Income Breakdown" && (
                  <a
                    href="#"
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#000",
                    }}
                  >
                    Profit Share
                  </a>
                )}
                {/* <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    lineHeight: "18px",
                    color: "#000",
                    fontFamily: "Manrope",
                  }}
                >
                  Profit Share
                </span> */}
              </th>
            </tr>
          </div>
        </thead>

        <tbody
          className=""
          style={{
            display: "block",
            height: "418px",
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
              justifyContent: "center",
              width: "100%",
              backgroundColor: "#F7F9FB",
            }}
          >
            <tr
              className=""
              style={{
                width: "100%",
                height: "61px",
                display: "flex",
                paddingLeft: "24px",
                paddingRight: "24px",
                paddingTop: "16px",
                justifyContent: "space-between",
              }}
            >
              <td>
                <div
                  className=""
                  style={{
                    width: "fit-content",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                  }}
                >
                  {selectedFilter2 === "by Class" && (
                    <a
                      href="#"
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#000",
                        marginRight: "36px",
                      }}
                    >
                      Class 1
                    </a>
                  )}
                  {selectedFilter2 === "by Category" && (
                    <a
                      href="#"
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#000",
                      }}
                    >
                      Tuition Fees
                    </a>
                  )}
                </div>
              </td>
              <td style={{ width: "fit-content" }}>
                {selectedFilter1 === "Cost Breakdown" && (
                  <div
                    style={{
                      width: "fit-content",
                      display: "flex",
                      marginLeft: "70px",
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
                      ₹32581222 (45%)
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
                        ₹30019909 (55%)
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                )}

                {selectedFilter1 === "Income Breakdown" && (
                  <div
                    style={{
                      width: "fit-content",
                      display: "flex",
                      marginRight: "50px",
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
                      {currency + " " + "42,58,1222"}
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
                        {currency + " " + "40,01,9909"}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </td>
              <td style={{ width: "fit-content" }}>
                {selectedFilter1 === "Cost Breakdown" && (
                  <div
                    style={{
                      width: "fit-content",
                      display: "flex",
                      // marginRight: "20px",
                      justifyContent: "end",
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
                      ₹32581222 (45%)
                    </span>
                    {showLastYearValue ? (
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "400",
                          lineHeight: "18px",
                          color: "#737373",
                          fontFamily: "Manrope",
                          textAlign: "end",
                        }}
                      >
                        ₹30019909 (55%)
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                )}

                {selectedFilter1 === "Income Breakdown" && (
                  <div
                    style={{
                      width: "fit-content",
                      display: "flex",
                      // marginRight: "65px",
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
                      34%
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
                        36%
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </td>
            </tr>
          </div>
          <div
            className="tile-shadow"
            style={{
              display: "flex",
              justifyContent: "center",
              height: "61px",
              width: "100%",
              alignItems: "center",
            }}
          >
            <tr
              className=""
              style={{
                width: "100%",
                height: "55px",
                display: "flex",
                paddingLeft: "24px",
                paddingRight: "24px",
                paddingTop: "14px",
                justifyContent: "space-between",
                backgroundColor: "#FFF",
              }}
            >
              <td>
                <div
                  className=""
                  style={{
                    width: "fit-content",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                  }}
                >
                  {selectedFilter2 === "by Class" && (
                    <a
                      href="#"
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#000",
                        marginRight: "48px",
                      }}
                    >
                      Class 1
                    </a>
                  )}
                  {selectedFilter2 === "by Category" && (
                    <a
                      href="#"
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#000",
                      }}
                    >
                      Transport Fee
                    </a>
                  )}
                </div>
              </td>
              <td style={{ width: "fit-content" }}>
                {selectedFilter1 === "Cost Breakdown" && (
                  <div
                    style={{
                      width: "fit-content",
                      display: "flex",
                      marginLeft: "55px",
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
                      ₹32581222 (45%)
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
                        ₹30019909 (55%)
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                )}

                {selectedFilter1 === "Income Breakdown" && (
                  <div
                    style={{
                      width: "fit-content",
                      display: "flex",
                      marginRight: "65px",
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
                      {currency + " " + "42,58,1222"}
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
                        {currency + " " + "40,01,9909"}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </td>
              <td style={{ width: "fit-content" }}>
                {selectedFilter1 === "Cost Breakdown" && (
                  <div
                    style={{
                      width: "fit-content",
                      display: "flex",
                      // marginRight: "20px",
                      justifyContent: "end",
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
                      ₹32581222 (45%)
                    </span>
                    {showLastYearValue ? (
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "400",
                          lineHeight: "18px",
                          color: "#737373",
                          fontFamily: "Manrope",
                          textAlign: "end",
                        }}
                      >
                        ₹30019909 (55%)
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                )}

                {selectedFilter1 === "Income Breakdown" && (
                  <div
                    style={{
                      width: "fit-content",
                      display: "flex",
                      // marginRight: "65px",
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
                      34%
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
                        36%
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </td>
            </tr>
          </div>
          <div
            className="tile-shadow"
            style={{
              display: "flex",
              height: "61px",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              backgroundColor: "#F7F9FB",
            }}
          >
            <tr
              className=""
              style={{
                width: "100%",
                height: "61px",
                display: "flex",
                paddingLeft: "24px",
                paddingRight: "24px",
                paddingTop: "14px",
                justifyContent: "space-between",
              }}
            >
              <td>
                <div
                  className=""
                  style={{
                    width: "fit-content",
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: "column",
                  }}
                >
                  {selectedFilter2 === "by Class" && (
                    <a
                      href="#"
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#000",
                        marginRight: "28px",
                      }}
                    >
                      Class 1
                    </a>
                  )}
                  {selectedFilter2 === "by Category" && (
                    <a
                      href="#"
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#000",
                      }}
                    >
                      Event 1 Fee
                    </a>
                  )}
                </div>
              </td>
              <td style={{ width: "fit-content" }}>
                {selectedFilter1 === "Cost Breakdown" && (
                  <div
                    style={{
                      width: "fit-content",
                      display: "flex",
                      marginLeft: "75px",
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
                      ₹32581222 (35%)
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
                        ₹30019909 (55%)
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                )}

                {selectedFilter1 === "Income Breakdown" && (
                  <div
                    style={{
                      width: "fit-content",
                      display: "flex",
                      marginRight: "45px",
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
                      {currency + " " + "42,58,1222"}
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
                        {currency + " " + "40,01,9909"}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </td>
              <td style={{ width: "fit-content" }}>
                {selectedFilter1 === "Cost Breakdown" && (
                  <div
                    style={{
                      width: "fit-content",
                      display: "flex",
                      // marginRight: "20px",
                      justifyContent: "end",
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
                      ₹32581222 (45%)
                    </span>
                    {showLastYearValue ? (
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "400",
                          lineHeight: "18px",
                          color: "#737373",
                          fontFamily: "Manrope",
                          textAlign: "end",
                        }}
                      >
                        ₹30019909 (55%)
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                )}

                {selectedFilter1 === "Income Breakdown" && (
                  <div
                    style={{
                      width: "fit-content",
                      display: "flex",
                      // marginRight: "65px",
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
                      34%
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
                        36%
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </td>
            </tr>
          </div>
        </tbody>
        {/* end::Table body */}
      </table>
      {/* end::Table */}
    </div>
  );
};

export { TablesWidget24 };

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
