import React, { useState, useEffect } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { GenerateReciept } from "../../../../app/pages/StaffPages/FinancialManagement/GenerateReciept";
import { GenerateChallan } from "../../../../app/pages/StaffPages/FinancialManagement/GenerateChallan";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

interface TransactionDetail {
  account_holder_name: string | null;
  amount_paid: number;
  bank_name: string | null;
  branch_name: string | null;
  check_no: string | null;
  fee_amount: string;
  fee_group_id: number;
  payment_method: string;
  transaction_amount: string;
  transaction_date: string;
  transaction_status: string;
  type: string; // Transaction type, like "Tuition fees"
}

interface TransactionGroup {
  transaction_id: string;
  transactions: TransactionDetail[];
}

interface ShowTransactionsProps {
  selectedInoviceNo: string | null;
  show: boolean;
  onHide: () => void;
}

const ShowTransactions: React.FC<ShowTransactionsProps> = ({
  selectedInoviceNo,
  show,
  onHide,
}) => {
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const sessionId = currentUser?.session_id;
  const [transactionDetails, setTransactionDetails] = useState<
    TransactionGroup[]
  >([]);
  const voucher_type = currentUser?.voucher_type;
    const Navigate = useNavigate();
    const secretKey = import.meta.env.VITE_SYSTEM_KEY;

  // Styles for PDF

  const fetchTransactionDetails = async () => {
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/transaction-history/${selectedInoviceNo}/${schoolId}/${sessionId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transaction history");
      }

      const result = await response.json();
      console.log(result);
      

      if (Array.isArray(result)) {
        setTransactionDetails(result);
      } else {
        console.warn("Unexpected data format received:", result);
        setTransactionDetails([]);
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      toast.error("Error fetching transaction details.");
    }
  };

  const handleDownloadReceipt = async (transactionId: string) => {
    // try {
    //   const response = await fetch(
    //     `${DOMAIN}/api/school/transaction-details-by-id/${transactionId}/${schoolId}/${sessionId}`
    //   );

    //   if (response.ok) {
    //     const transactionData = await response.json();
    //     if (
    //       transactionData &&
    //       transactionData.commonDetails &&
    //       transactionData.transactionDetails.length > 0 &&
    //       voucher_type === "challan" && transactionData.commonDetails.payment_method === 'cash'
    //     ) {
          
    //       // Generate PDF for the specific transaction
    //       GenerateChallan({
    //         commonDetails: transactionData.commonDetails,
    //         transactionDetails: transactionData.transactionDetails,
    //       });
    //     } else if (
    //       transactionData &&
    //       transactionData.commonDetails &&
    //       transactionData.transactionDetails.length > 0
    //     ) {
    //       GenerateReciept({
    //         commonDetails: transactionData.commonDetails,
    //         transactionDetails: transactionData.transactionDetails,
    //       });
    //     } else {
    //       console.error(
    //         "No transaction details found for transaction ID:",
    //         transactionId
    //       );
    //     }
    //   } else {
    //     console.error(
    //       "Failed to fetch transaction details for receipt with ID:",
    //       transactionId
    //     );
    //   }
    // } catch (error) {
    //   console.error("Error generating PDF for transaction:", error);
    // }
     
        if(transactionId === null){
           toast.error("no Transcation performed yet");
        }
        const transaction_id = transactionId;
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(transaction_id),
          secretKey
        ).toString();
    
        const relativePath = `/fee-reciept`
    + `?schoolId=${schoolId}`
    + `&data=${encodeURIComponent(encryptedData)}`;

  // 3) prepend your current domain/origin
  const fullUrl = `${window.location.origin}${relativePath}`;
  console.log("Opening receipt at:", fullUrl);

  // 4) open in a new tab
  window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (show) {
      fetchTransactionDetails();
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      centered
    >
      <Modal.Header
        closeButton
        className="modal-header"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
          fontFamily: "Manrope",
        }}
      >
        <Modal.Title style={{ fontFamily: "Manrope", fontSize: "18px" }}>
          Transaction History
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          height: "auto",
          overflowY: "auto",
          fontFamily: "Manrope",
        }}
      >
        {transactionDetails.length > 0 ? (
          <Table
            bordered
            hover
            className="table"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead
              style={{
                backgroundColor: "#f2f4f8",
                color: "#1C335C",
                textAlign: "center",
                fontWeight: "bold",
                fontFamily: "Manrope",
                fontSize: "14px",
              }}
            >
              <tr>
                <th style={{fontFamily:'Manrope', fontSize:'14px',textAlign:'center', fontWeight:'600'}}>Transaction ID</th>
                <th style={{fontFamily:'Manrope', fontSize:'14px',textAlign:'center', fontWeight:'600'}}>Receipt No</th>
                <th style={{fontFamily:'Manrope', fontSize:'14px',textAlign:'center', fontWeight:'600'}}>Transaction Date</th>
                <th style={{fontFamily:'Manrope', fontSize:'14px',textAlign:'center', fontWeight:'600'}}>Amount</th>
                <th style={{fontFamily:'Manrope', fontSize:'14px',textAlign:'center', fontWeight:'600'}}>Payment Method</th>
                <th style={{fontFamily:'Manrope', fontSize:'14px',textAlign:'center', fontWeight:'600'}}>Status</th>
                <th style={{fontFamily:'Manrope', fontSize:'14px',textAlign:'center', fontWeight:'600'}}>Download Receipt</th>
              </tr>
            </thead>
            <tbody>
              {transactionDetails.length > 0 ? (
                transactionDetails.map((group, groupIndex) => (
                  <React.Fragment key={groupIndex}>
                    {/* Group Header Row */}
                    <tr
                      style={{
                        backgroundColor: "#e9edf5",
                        fontWeight: "600",
                        color: "#1C335C",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "left",
                          fontFamily: "Manrope",
                          fontWeight: '500',
                          fontSize: "14px",
                        }}
                      >
                        {group.transaction_id}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "left",
                          fontFamily: "Manrope",
                          fontWeight: '500',
                          fontSize: "14px",
                        }}
                      >
                        {group.receipt_number}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "left",
                          fontFamily: "Manrope",
                          fontWeight: '500',
                          fontSize: "14px",
                        }}
                      >
                        {group.transaction_date}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "left",
                          fontFamily: "Manrope",
                          fontWeight: '500',
                          fontSize: "14px",
                        }}
                      >
                        {group.transaction_amount}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "left",
                          fontFamily: "Manrope",
                          fontWeight: '500',
                          fontSize: "14px",
                        }}
                      >
                        {group.payment_method}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "left",
                          fontFamily: "Manrope",
                          fontWeight: '500',
                          fontSize: "14px",
                        }}
                      >
                        {group.transaction_status}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Button
                          variant="button"
                          onClick={() =>
                            handleDownloadReceipt(group.transaction_id)
                          }
                          style={{
                            height: "30px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: "50px",
                            fontSize: "14px",
                            backgroundColor: "#1F4061",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#162d49")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "#1F4061")
                          }
                        >
                          <i
                            className="fa fa-download"
                            aria-hidden="true"
                            style={{ color: "#fff" }}
                          ></i>
                        </Button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No transactions available.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        ) : (
          <p style={{ textAlign: "center", color: "#1C335C" }}>
            No transaction history available
          </p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export { ShowTransactions };
