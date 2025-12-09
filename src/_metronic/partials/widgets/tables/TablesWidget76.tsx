import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import Select from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { CreateSettlementDetails } from "../../modals/create-app-stepper/CreateSettlementDetails";

interface ApplicationData {
  group_name: string;
  pending_amount: number;
  student_fees_master_id: number;
  fee_group_id: number;
  fee_group_name: string;
  fee_session_group_id: string;
  total_amount: number;
  due_date: string;
  status: string;
}

const TablesWidget76 = () => {
  const [data, setData] = useState<ApplicationData[]>([]);



  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const sessionId = currentUser?.session_id;
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);


  const handleBack = () => {
    Navigate(-1);
  };

  const handleModalClose = () => {
    setSelectedDate(null);
    setShowModal(false)};

  // const fetchDetailedOutstanding = async (studentId, feeGroupId) => {
  //   try {
  //     setLoadingDetails(true);
  //     const response = await fetch(
  //       `${DOMAIN}/api/school/get-detailed-fee-outstanding?student_id=${studentId}&fee_group_id=${feeGroupId}&school_id=${schoolId}&session_id=${sessionId}`
  //     );
  //     const result = await response.json();
  //     setDetailedData(result);
  //   } catch (error) {
  //     console.error("Failed to fetch detailed data:", error);
  //     toast.error("Failed to load detailed outstanding fees.");
  //   } finally {
  //     setLoadingDetails(false);
  //   }
  // };


  useEffect(() => {
    const fetchFeeTransactionSummary = async () => {
      if (!schoolId || !sessionId) return;
      
      setLoading(true);
      
      try {
        const response = await fetch(`${DOMAIN}/api/school/get-fees-transcation-dates/${schoolId}/${sessionId}`);
        
        const result = await response.json();
  
        if (result.success) {
          setData(result.data); // Set fetched data
        } else {
          toast.error("Failed to fetch transaction summary.");
        }
      } catch (error) {
        console.error("Error fetching transaction summary:", error);
        toast.error("Error loading transactions.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchFeeTransactionSummary();
  }, [schoolId, sessionId]);



  // /get-fees-transcation-dates
  const handleViewDetails = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        backgroundColor: "#F2F6FF",
        borderRadius: "15px",
        padding: "10px",
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
        }}
      >
        <div
          className="btn btn-md btn-icon btn-active-color-primary"
          onClick={handleBack}
        >
          <i className="fas fa-arrow-left"></i>
        </div>
        <h2>Transcations Settlement</h2>
      </div>


      {/* Fee Collection Table */}
      <div
        className="modal-body py-lg-5 px-lg-5"
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
                  Sr.No.
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
                 Transcation Date
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
                 Total Amount
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "center",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Transcation Count
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="16"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    <div className="d-flex justify-content-center align-items-center">
                      <Spinner
                        animation="border"
                        role="status"
                        style={{ marginRight: "10px" }}
                      />
                      <span>
                        Fetching and formatting data...{" "}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  <tr
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
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "150px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                     {index + 1}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "150px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                      onClick={() =>
                        handleViewDetails(item.date)
                      }
                    >
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-${index}`}>
                            View in Detail
                          </Tooltip>
                        }
                      >
                      <a style={{color:'blue', cursor:'pointer'}}> <td>{item.date}</td>
                      </a>
                      </OverlayTrigger>
                    </td>

                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "150px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {currentUser?.currency_symbol} {item.total_amount.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "center",
                        minWidth: "150px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                     {item.total_transactions}
                    </td>
                   
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No data available. Please adjust your filters to get data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <CreateSettlementDetails
        show={showModal}
        handleClose={handleModalClose}
        selectedDate={selectedDate} 
      />
    </div>
  );
};

export { TablesWidget76 };
