import React, { useState } from "react";
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

interface TransactionGroup {
  transaction_id: string;
  transactions: TransactionDetail[];
}

interface ShowTransactionsProps {
  studentId: string | null;
  feeGroupId: string | null;
  show: boolean;
  handleClose: () => void;
}

const CreateOutstandingDetails: React.FC<ShowTransactionsProps> = ({
  studentId,
  feeGroupId,
  show,
  handleClose,
}) => {
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const sessionId = currentUser?.session_id;
  const [transactionDetails, setTransactionDetails] = useState<
    TransactionGroup[]
  >([]);


  const fetchTransactionDetails = async () => {
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/get-outstanding-details/${feeGroupId}/${studentId}/${schoolId}/${sessionId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transaction history");
      }

      const result = await response.json();

      // Transform the result into the desired structured format
      const transformedData = result.reduce((acc, item) => {
        const {
          fee_group_name,
          fee_group_id,
          fee_type_id,
          fee_type_name,
          total_amount,
          pending_amount,
          student_name,
          fee_status,
          fee_due_date,
        } = item;

        // Check if the fee group already exists in the accumulator
        const existingGroup = acc.find(
          (group) => group.fee_group_id === fee_group_id
        );

        if (existingGroup) {
          // Add the fee type to the existing group
          existingGroup.fee_types.push({
            fee_type_id,
            fee_type_name,
            total_amount,
            pending_amount,
            fee_status,
            fee_due_date,
          });
        } else {
          // Create a new fee group
          acc.push({
            fee_group_id,
            fee_group_name,
            student_name,
            fee_types: [
              {
                fee_type_id,
                fee_type_name,
                total_amount,
                pending_amount,
                fee_status,
                fee_due_date,
              },
            ],
          });
        }

        return acc;
      }, []);

      setTransactionDetails(transformedData);
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      toast.error("Error fetching transaction details.");
    }
  };

  React.useEffect(() => {
    if (show) {
      fetchTransactionDetails();
    }
  }, [show]);

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
        {transactionDetails.length > 0 ? (
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
                  <th>Fee Group Name</th>
                  <th>Fee Type</th>
                  <th>Total Amount</th>
                  <th>Pending Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactionDetails.map((group, groupIndex) => (
                  <React.Fragment key={groupIndex}>
                    {/* Render the fee group name row */}
                    <tr
                      style={{
                        backgroundColor:
                          groupIndex % 2 === 0
                            ? "rgb(242, 246, 255)"
                            : "#FFFFFF",
                        fontWeight: "bold",
                      }}
                    >
                      <td colSpan={6}>
                        {group.fee_group_name} ({group.student_name})
                      </td>
                    </tr>
                    {/* Render each fee type detail row */}
                    {group.fee_types.map((feeType, feeTypeIndex) => (
                      <tr
                        key={feeTypeIndex}
                        style={{
                          backgroundColor:
                            (groupIndex + feeTypeIndex) % 2 === 0
                              ? "rgb(248, 249, 251)"
                              : "#FFFFFF",
                        }}
                      >
                        <td></td>{" "}
                        {/* Empty cell to align under the fee group */}
                        <td>{feeType.fee_type_name}</td>
                        <td>{`Rs.${Number(feeType.total_amount).toFixed(
                          2
                        )}`}</td>
                        <td>{`Rs.${Number(feeType.pending_amount).toFixed(
                          2
                        )}`}</td>
                        <td>
                          {feeType.fee_due_date
                            ? new Date(
                                feeType.fee_due_date
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              feeType.fee_status === "pending"
                                ? "bg-warning"
                                : "bg-success"
                            }`}
                            style={{ padding: "5px 10px", borderRadius: "8px" }}
                          >
                            {feeType.fee_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
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

export { CreateOutstandingDetails };
