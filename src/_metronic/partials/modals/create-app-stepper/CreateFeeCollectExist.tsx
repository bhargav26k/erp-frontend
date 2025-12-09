import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Modal, Button } from "react-bootstrap";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import React from "react";

type Props = {
  show: boolean;
  handleClose: () => void;
  feeGroup_id: string | undefined;
  class_id: string | undefined;
  setRefresh: (refresh: boolean) => void;
};

// interface FeeType {
//   fee_type_id: number;
//   fee_type_name: string;
//   amount: string;
//   due_date: string;
// }

// interface FeeGroup {
//   fee_group_id: number;
//   fee_group_name: string;
//   fee_session_group_id:string;
//   fees: FeeType[];
// }

// interface ApplicationData {
//   fee_group_id: number;
//   fee_type_id: number;
//   fee_session_group_id:string;
//   fee_group_name: string;
//   fee_type_name: string;
//   amount: string;
//   due_date: string;
//   adjustment: string;
//   is_active: string;
//   checked: boolean;
// }




interface DataItem {
    status: string;
    name: string;
  }

  interface FilterData {
    student_email: string;
    student_name: string;
    id: number;
    enquiry_id: string;
    date: string;
    class: string;
    name: string;
    source: string;
    email: string;
    follow_up_date: string;
    status: string;
    enquiry_type: string;
    updated_at : string;
    student_phone : string;
  
  }


const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateFeeCollectExist = ({
  show,
  handleClose,
  feeGroup_id,
  class_id,
  setRefresh,
}: Props) => {

  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const [data, setData] = useState<DataItem[]>([]);
  const [filteredData, setFilteredData] = useState<FilterData[]>([]);


  const fee_group_id = feeGroup_id;

useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-studentcollectfee/${schoolId}/${class_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        setData(responseData);
        setFilteredData(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEnquiries();
    setRefresh(true);
  }, [schoolId,feeGroup_id]);


  
  const handleClick = async () => {
   

  };



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const handleActionModal = (value: string) => {
    setShowActionModal(true);
  };
  const handleActionModalClose = () => {
    setShowActionModal(false);
  };

  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      size="lg"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      show={show}
      onHide={handleClose}
    >
      <div
        className="modal-content"
        style={{ padding: "20px 5px", borderRadius: "17px" }}
      >
        <div
          className="modal-header border-0"
          style={{ width: "100%", height: "27px" }}
        >
          <span
            className=""
            id="staticBackdropLabel"
            style={{
              justifyContent: "center",
              textAlign: "center",
              alignItems: "center",
              fontSize: "24px",
              fontWeight: "600",
              fontFamily: "Manrope",
            }}
          >
            Collect Fee
          </span>
          <span
            data-bs-dismiss="modal"
            onClick={handleClose}
            aria-label="Close"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="16" fill="#ECECEC" />
              <path
                d="M22.8572 9.14294L9.14288 22.8572M9.14288 9.14294L22.8572 22.8572"
                stroke="#464646"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <hr />
        <div className="modal-body" style={{ padding: "20px" }}>
          <div style={{ width: "auto", height: "100%", overflow: "hidden" }}>
        <table
          //   className="col-xxl-12"
          style={{
            top: "223px",
            height: "612px",
            maxHeight: "100%",
            borderCollapse: "collapse",
            // tableLayout: "fixed",
            overflowX: "hidden",
            overflowY: "auto",
            whiteSpace: "nowrap",
            width: "100%",
            // border:'8px solid black'
          }}
        >
          <thead
            className=""
            style={{
              height: "123px",
              maxHeight: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#1C335C",
              //   width:'fit-content',
              // overflowY: "auto",
              // overflowX: "hidden",
              justifyContent: "space-between",
              zIndex: 999,
            }}
          >
            <div>
              <caption
                style={{
                  backgroundColor: "#1C335C",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // tableLayout: "fixed",
                  // borderCollapse: "collapse",  

                  // border:'1px solid'
                  width: "98%",
                }}
                className="col-xxl-12 col-lg-6"
              >
                <div>
                  <span
                    style={{
                      color: "#FFF",
                      fontSize: "16px",
                      fontWeight: "700",
                      fontFamily: "Manrope",
                    }}
                  >
                    Admission Fees
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    className="input-group flex-nowrap"
                    style={{
                      width: "300px",
                      height: "36px",
                      borderRadius: "8px",
                      border: "1px solid #D9D9D9",
                    }}
                  >
                    <span
                      className="input-group-text border-0 pe-1 pr-0"
                      style={{ backgroundColor: "transparent" }}
                      id="addon-wrapping"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_582_4295)">
                          <circle
                            cx="8.50002"
                            cy="7.66665"
                            r="6.33333"
                            stroke="white"
                            stroke-width="1.5"
                          />
                          <path
                            d="M14.1667 13.3333L15.5 14.6666"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_582_4295">
                            <rect
                              width="16"
                              height="16"
                              fill="white"
                              transform="translate(0.833374)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                    <input
                      type="text"
                      style={{
                        backgroundColor: "transparent",
                        color: "#FFFFFF",
                      }}
                      className="form-control border-0"
                      placeholder="Search ...."
                      aria-label="Search"
                      aria-describedby="addon-wrapping"
                    //   onChange={handleSearch}
                    //   value={searchQuery}
                    />
                  </div>
                </div>
              </caption>
            </div>
            <tr
              style={{
                height: "61px",
                gap: "40px",
                display: "flex",
                paddingTop: "10px",
                paddingLeft: "25px",
                // paddingBottom:'10px',
                // position: "sticky",
                // top: 0,
                width: "auto",
                // border:'1px solid white',
                overflowY: "auto",
                overflowX: "hidden",
                backgroundColor: "#1C335C",
                // zIndex: 100,
              }}
            >
              <th>
                <div style={{ width: "100px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    Appliation Id
                  </span>
                </div>
              </th>
              <th>
                <div style={{ width: "270px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    Student Name
                  </span>
                </div>
              </th>
              
        
              <th>
                <div
                  style={{
                    width: "260px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#FFFFFF",
                      fontFamily: "Manrope",
                    }}
                  >
                    Status
                  </span>
                </div>
              </th>

              <th>
                <div
                  style={{
                    width: "80px",
                    // textAlign:'left'
                    // border:'1px solid',
                    display: "flex",
                    justifyContent: "end",
                    fontFamily: "Manrope",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      lineHeight: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    Actions
                  </span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody
            className="col-xxl-12 h-[s]"
            style={{
              height: "105%",
              // maxHeight: "100%",
              display: "flex",
              flexDirection: "column",
              minHeight: "calc(100vh - 550px)",
              overflowY: "auto",
            }}
          >
            {filteredData.map((item, index) => (
              <tr
                key={index}
                style={{
                  height: "61px",
                  gap: "40px",
                  paddingLeft: "25px",
                  paddingRight: "55px",
                  paddingTop: "16px",
                  width: "100%",
                  display: "flex",
                  backgroundColor: index % 2 === 0 ? "#F5F5F5" : "#FFF",
                  // border:'1px solid'
                }}
              >
                <td>
                  <div
                    style={{
                      width: "100px",
                      display: "flex",
                      justifyContent: "start",
                      flexDirection: "column",
                      // border:'1px solid'
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        lineHeight: "18px",
                        color: "#000000",
                        fontFamily: "Manrope",
                        // border:'1px solid'
                      }}
                    >
                      {item.id}
                      {/* {formatDate(item.date)} */}
                    </span>
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      width: "230px",
                      display: "flex",
                      justifyContent: "start",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        lineHeight: "18px",
                        color: "#1F1F1F",
                        fontFamily: "Manrope",
                      }}
                    >
                      {item.student_name}
                    </span>
                  </div>
                </td>
                
                <td>
                  <div
                    style={{
                      width: "120px",
                      display: "flex",
                      justifyContent: "start",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        width: "100%",
                        textAlign: "center",
                        borderRadius: "5px",
                        padding: "5px",
                        marginTop: "-8px",
                        fontWeight: "500",
                        lineHeight: "18px",
                        fontFamily: "Manrope",
                        color:
                          item.status === "active"
                            ? "#4BCD60"
                            : item.status === "lost"
                            ? "#000000"
                            : "#ED5578",
                        backgroundColor:
                          item.status === "active"
                            ? "#E7FFEA"
                            : item.status === "lost"
                            ? "#FF8B20"
                            : "#FFE7E1",
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      width: "140px",
                      display: "flex",
                      justifyContent: "space-around ",
                      flexDirection: "row",
                      gap: "6px",
                      marginTop: "-8px",
                      // border:'1px solid'
                    }}
                  >
                    <button
                      type="button"
                      className="btn"
                      style={{
                        border: "1px solid #1F3259",
                        fontFamily: "Manrope",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#1F3259",
                      }}
                      onClick={() => handleActionModal(fee_group_id)}
                    >
                      Collect Fees
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        border: "1px solid #1F3259",
                        fontFamily: "Manrope",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#1F3259",
                      }}
                      // onClick={() => handleActionModal(fee_group_id)}
                    >
                      Send Payment Link
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </div>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateFeeCollectExist };
