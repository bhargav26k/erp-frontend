import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { useAuth } from "../../../../app/modules/auth/core/Auth";

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


interface ShowTransactionsProps {
  studentId: string | null;
  feeGroupId: string | null;
  show: boolean;
  handleClose: () => void;
}


const API_ICICI = "https://eazypay.icicibank.com/EazyPGVerify";



const CreateSettlementDetails: React.FC<ShowTransactionsProps> = ({
    show, handleClose, selectedDate 
}) => {
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    const schoolId = currentUser?.school_id;
    const sessionId = currentUser?.session_id;
    const [syncTimestamps, setSyncTimestamps] = useState({});

  useEffect(() => {
    if (show && selectedDate) {
      fetchTransactionDetails();
    }
  }, [show, selectedDate]);

  const fetchTransactionDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/get-fee-transaction-details/${schoolId}/${sessionId}?selectedDate=${selectedDate}`
      );
      const result = await response.json();
      
      setDetails(result.transactions || []);
    } catch (error) {
      console.error("Failed to fetch details:", error);
      toast.error("Failed to load transaction details.");
    } finally {
      setLoading(false);
    }
  };


  const syncTransactionStatuses = async (transactions) => {
    const currentTime = new Date().getTime();
    const updatedTransactions = [...transactions];

    for (let transaction of updatedTransactions) {
      const { transaction_id } = transaction;
      const lastSyncTime = syncTimestamps[transaction_id] || 0;

      if (currentTime - lastSyncTime > 10 * 60 * 1000) {
        // If last sync was more than 10 minutes ago, fetch latest status
        const newStatus = await fetchTransactionStatus(transaction_id);
        if (newStatus) {
          transaction.settlement_status = newStatus;
          setSyncTimestamps((prev) => ({
            ...prev,
            [transaction_id]: currentTime,
          }));
        }
      }
    }

    return updatedTransactions;
  };

  const fetchTransactionStatus = async (transaction_id) => {
    try {
      const response = await fetch(
        `${API_ICICI}?ezpaytranid=${transaction_id}&merchantid=381066`
      );
      const text = await response.text();

      return text.includes("SUCCESS") ? "Success" : "Pending"; // Modify based on actual API response
    } catch (error) {
      console.error("Failed to fetch PG status:", error);
      return null;
    }
  };

  

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header
        closeButton
        className="modal-header"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
          fontFamily: "Manrope",
        }}
      >
        <Modal.Title>Outstanding Payments</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          height: "auto",
          overflowY: "auto",
          fontFamily: "Manrope",
        }}
      >
        {details.length > 0 ? (
          <>
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
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <thead
                style={{
                  backgroundColor: "rgb(242, 246, 255)",
                  color: "#1C335C",
                }}
              >
                <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Fee Group</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {details.map((item, index) => (
                    <tr
                      style={{
                        backgroundColor:
                        index % 2 === 0
                            ? "rgb(242, 246, 255)"
                            : "#FFFFFF",
                        fontWeight: "bold",
                      }}
                    >
                        <td>{item.student_id}</td>
                    <td>{item.student_name}</td>
                    <td>{item.fee_group_name}</td>
                    <td>{item.transaction_id}</td>
                    <td>{currentUser?.currency_symbol} {item.amount}</td>
                    <td>{item.settlement_status}</td>
                      </tr>
                    ))}
              </tbody>
            </Table>
          </>
        ) : (
          <p style={{ textAlign: "center", color: "#1C335C" }}>
            No transaction history available
          </p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export { CreateSettlementDetails };
