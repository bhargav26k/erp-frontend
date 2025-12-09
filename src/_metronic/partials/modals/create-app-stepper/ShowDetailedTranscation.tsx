import React, { useState, useEffect } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import axios from "axios";

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
  selectedReceiptNumber: string | null;
  schoolId: string | null;
  show: boolean;
  onHide: () => void;
}

const ShowDetailedTranscation: React.FC<ShowTransactionsProps> = ({
  selectedReceiptNumber,
  schoolId,
  show,
  onHide,
}) => {

  const [transactionDetails, setTransactionDetails] = useState<
    TransactionGroup[]
  >([]);

  // Styles for PDF

  const fetchTransactionDetails = async () => {
    try {
      // Make the GET request with Axios
      const receiptId = encodeURIComponent(selectedReceiptNumber);

      // Construct the URL with query params
      const response = await axios.get(
        `${DOMAIN}/student-transaction-history?receiptId=${receiptId}&schoolId=${schoolId}`
      );


      // Axios attaches the parsed response data to response.data
      const result = response.data;

      if (Array.isArray(result)) {
        setTransactionDetails(result);
      } else {
        console.warn("Unexpected data format received:", result);
        setTransactionDetails([]);
      }
    } catch (error) {
      // Axios will throw for status != 2xx or network errors
      console.error("Error fetching transaction details:", error);
      toast.error("Error fetching transaction details.");
    }
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
                <th>Transaction ID</th>
                <th>Transaction Date</th>
                <th>Type</th>
                <th>Total Amount</th>
                <th>Paid Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
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
                        colSpan={7}
                        style={{
                          padding: "12px",
                          textAlign: "left",
                          fontFamily: "Manrope",
                          fontSize: "14px",
                        }}
                      >
                        {group.transaction_id}
                      </td>
                    </tr>

                    {/* Group Transactions */}
                    {group.transactions.map((item, itemIndex) => (
                      <tr
                        key={itemIndex}
                        style={{
                          backgroundColor:
                            (groupIndex + itemIndex) % 2 === 0
                              ? "rgb(250, 251, 252)"
                              : "#FFFFFF",
                        }}
                      >
                        <td></td>
                        <td
                          style={{
                            textAlign: "center",
                            padding: "10px",
                            fontFamily: "Manrope",
                            fontSize: "14px",
                          }}
                        >
                          {new Date(item.transaction_date).toLocaleDateString()}
                        </td>
                        <td
                          style={{
                            textAlign: "left",
                            padding: "10px",
                            fontFamily: "Manrope",
                            fontSize: "14px",
                          }}
                        >
                          {item.fee_type}
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            padding: "10px",
                            fontFamily: "Manrope",
                            fontSize: "14px",
                          }}
                        >
                          {`Rs.${Number(item.total_amount).toFixed(2)}`}
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            padding: "10px",
                            fontFamily: "Manrope",
                            fontSize: "14px",
                          }}
                        >
                          {`Rs.${Number(item.transaction_amount).toFixed(2)}`}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            padding: "10px",
                            fontFamily: "Manrope",
                            fontSize: "14px",
                          }}
                        >
                          {item.payment_method}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            padding: "10px",
                            fontFamily: "Manrope",
                            fontSize: "14px",
                          }}
                        >
                          <span
                            className={`badge ${
                              item.status === "success"
                                ? "bg-success"
                                : item.status === "pending"
                                ? "bg-secondary"
                                : "bg-danger"
                            }`}
                            style={{
                              padding: "5px 10px",
                              borderRadius: "20px",
                              fontWeight: "500",
                              fontFamily: "Manrope",
                              fontSize: "14px",
                            }}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
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

export { ShowDetailedTranscation };
