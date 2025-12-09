import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Modal, Button } from "react-bootstrap";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

type Props = {
  show: boolean;
  handleClose: () => void;
  classId: number | null;
  groupId: number | null;
  setRefresh: boolean | null;
  admissionEnquiryId: string | null;
  setTransactionId: string;
};

interface ApplicationData {
  newAdjustment: string;
  currentlyPaying: string | null;
  amount_paid: number;
  student_fees_master_id: number;
  fee_group_id: number | null;
  fee_type_name: string | null;
  amount: string;
  due_date: string | null;
  status: string | null;
  adjustment: string | null;
  total_amount: number | null;
  amount_pending: number;
}

const modalsRoot = document.getElementById("root-modals") || document.body;

const CollectOfflineAdmissionFees: React.FC<Props> = ({
  show,
  handleClose,
  groupId,
  classId,
  admissionEnquiryId,
  setRefresh,
  setTransactionId,
}) => {
  const { currentUser } = useAuth();
  const [data, setData] = useState<ApplicationData[]>([]);
  const [modifiedData, setModifiedData] = useState<ApplicationData[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [refreshData, setRefreshData] = useState(false);
  const [totalCurrentlyPaying, setTotalCurrentlyPaying] = useState(0);
  const [totalAdjustment, setTotalAdjustment] = useState(0);
  const [transcationLoading, setTranscationLoading] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({
    transaction_ref: "",
    check_no: "",
    account_holder_name: "",
    bank_name: "",
    branch_name: "",
    ifsc_code: "",
    transfer_date: "",
  });

  const schoolId = currentUser?.school_id;
  const sessionId = currentUser?.session_id;

  const fetchFeeDetails = async () => {
    if (!schoolId || !classId || !sessionId) return;
    setData([]);
    setModifiedData([]);
    try {
      const url = `${DOMAIN}/api/school/get-classwisefeegrouptype/${schoolId}/${sessionId}/${groupId}/${admissionEnquiryId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch fee details");

      const result: ApplicationData[] = await response.json();

      setData(result);
    } catch (error) {
      console.error("Error fetching fee details:", error);
      toast.error("Error fetching fee details.");
    }
  };

  useEffect(() => {
    if (show) {
      fetchFeeDetails();
      setRefreshData(false);
    }
  }, [show, groupId, classId, refreshData]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    // Clear out previous transaction details when payment method changes
    setTransactionDetails({
      transaction_ref: "",
      check_no: "",
      account_holder_name: "",
      bank_name: "",
      branch_name: "",
      ifsc_code: "",
      transfer_date: "",
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleModalClose = () => {
    setRefresh(true);
    handleClose();
  };

  const handleInputChange = (index, field, value) => {
    const updatedData = [...data];

    if (field === "newAdjustment") {
      updatedData[index] = { ...updatedData[index], newAdjustment: value };
      const newTotalAdjustment = updatedData.reduce(
        (acc, item) => acc + parseFloat(item.newAdjustment || "0"),
        0
      );
      setTotalAdjustment(newTotalAdjustment);
    } else if (field === "currentlyPaying") {
      updatedData[index] = { ...updatedData[index], currentlyPaying: value };
      const newTotalCurrentlyPaying = updatedData.reduce(
        (acc, item) => acc + parseFloat(item.currentlyPaying || "0"),
        0
      );
      setTotalCurrentlyPaying(newTotalCurrentlyPaying);
    } else {
      updatedData[index] = { ...updatedData[index], [field]: value };
    }

    setData(updatedData);

    // Track updates based on `feetype_id` and index to prevent overwriting
    const modifiedRow = { ...updatedData[index] };
    const modifiedRowIndex = modifiedData.findIndex(
      (item) =>
        item.feetype_id === modifiedRow.feetype_id &&
        item.student_fees_master_id === modifiedRow.student_fees_master_id
    );
    if (modifiedRowIndex > -1) {
      modifiedData[modifiedRowIndex] = modifiedRow;
    } else {
      setModifiedData([...modifiedData, modifiedRow]);
    }
  };

  const handleSave = async () => {
    setTranscationLoading(true);
    if (totalCurrentlyPaying > 0 && !paymentMethod) {
      toast.error("Please select a payment method before saving.");
      return;
    }

    const adjustmentsOnly = [];
    const transactions = [];

    // Validation loop: Check if currentlyPaying exceeds pendingAmount
    modifiedData.forEach((item) => {
      const previousAdjustment = parseFloat(item.adjustment || 0);
      const newAdjustment = parseFloat(item.newAdjustment || 0);
      const totalAdjustment = previousAdjustment + newAdjustment;

      const newAmountPaid =
        parseFloat(item.amount_paid) + parseFloat(item.currentlyPaying || 0);

      const totalAmount = parseFloat(item.amount || "0") + totalAdjustment;
      const pendingAmount = totalAmount - newAmountPaid;

      // Check if the currentlyPaying amount is greater than pendingAmount
      if (newAmountPaid > totalAmount) {
        toast.error("The payment amount cannot exceed the total amount.");
        return; // Exit the function if validation fails
      }

      if (newAdjustment > 0 && newAmountPaid + newAdjustment > totalAmount) {
        toast.error(
          "The payment amount, including adjustment, cannot exceed the total amount."
        );
        return; // Exit the function if validation fails
      }

      const status = pendingAmount <= 0 ? "paid" : "partial";

      const isAdjustmentOnly =
        !item.currentlyPaying || parseFloat(item.currentlyPaying) === 0;

      if (isAdjustmentOnly && totalAdjustment !== 0) {
        adjustmentsOnly.push({
          student_fees_master_id: item.student_fees_master_id,
          adjustment: totalAdjustment,
          total_amount: totalAmount,
          status,
          feetype_id: item.feetype_id,
        });
      } else if (!isAdjustmentOnly) {
        transactions.push({
          student_fees_master_id: item.student_fees_master_id,
          amount_paid: newAmountPaid,
          adjustment: totalAdjustment,
          status,
          feetype_id: item.feetype_id,
          transaction: {
            amount: item.currentlyPaying,
            payment_method: paymentMethod,
            transaction_ref: transactionDetails.transaction_ref || null,
            check_no: transactionDetails.check_no || null,
            account_holder_name: transactionDetails.account_holder_name || null,
            bank_name: transactionDetails.bank_name || null,
            branch_name: transactionDetails.branch_name || null,
            ifsc_code: transactionDetails.ifsc_code || null,
            transfer_date: transactionDetails.transfer_date || null,
            user_id: currentUser.id,
            school_id: currentUser.school_id,
          },
        });
      }
    });

    const saveData = {
      admissionDetails: {
        admissionEnquiryId,
        classId,
        groupId,
        schoolId: currentUser?.school_id,
        sessionId: currentUser?.session_id,
        userId: currentUser?.id,
      },
      studentFeesUpdates: adjustmentsOnly.concat(
        transactions.map((t) => {
          const relatedItem = modifiedData.find(
            (item) => item.student_fees_master_id === t.student_fees_master_id
          );

          // Calculate totalAdjustment and pendingAmount for the related item
          const previousAdjustment = parseFloat(relatedItem.adjustment || 0);
          const newAdjustment = parseFloat(relatedItem.newAdjustment || 0);
          const totalAdjustment = previousAdjustment + newAdjustment;

          const totalAmount =
            parseFloat(relatedItem.amount || 0) + totalAdjustment;
          const newAmountPaid =
            parseFloat(relatedItem.amount_paid) +
            parseFloat(relatedItem.currentlyPaying || 0);
          const pendingAmount = totalAmount - newAmountPaid;

          return {
            student_fees_master_id: t.student_fees_master_id,
            amount_paid: t.amount_paid,
            adjustment: t.adjustment,
            status: t.status,
            total_amount: pendingAmount, // Use the calculated pendingAmount here
            feetype_id: t.feetype_id,
          };
        })
      ),
      feeTransactions: transactions.map((t) => ({
        student_fees_master_id: t.student_fees_master_id,
        amount: t.transaction.amount,
        payment_method: t.transaction.payment_method,
        transaction_ref: t.transaction.transaction_ref,
        check_no: t.transaction.check_no,
        account_holder_name: t.transaction.account_holder_name,
        bank_name: t.transaction.bank_name,
        branch_name: t.transaction.branch_name,
        ifsc_code: t.transaction.ifsc_code,
        transfer_date: t.transaction.transfer_date,
        user_id: t.transaction.user_id,
        school_id: t.transaction.school_id,
        feetype_id: t.feetype_id,
        session_id: sessionId
      })),
    };

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/store-offlineadmissionfee-transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(saveData),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setTimeout(() => {
          setRefreshData(true);
          setModifiedData([]);
          setTotalCurrentlyPaying(0);
          setPaymentMethod("");
          setTransactionDetails({
            transaction_ref: "",
            check_no: "",
            account_holder_name: "",
            bank_name: "",
            branch_name: "",
            ifsc_code: "",
            transfer_date: "",
          });
          toast.success("Data saved successfully!");
          console.log("Data saved successfully:", responseData);

          const transactionId = responseData?.transaction_id;
          setTransactionId(transactionId);
          setTranscationLoading(false);
          handleClose();
        }, 3000);
      } else {
        setTimeout(() => {
          const errorData = response.json();
          console.error("Failed to save data:", errorData);
          setTranscationLoading(false);
        }, 3000);
      }
    } catch (error) {
      setTimeout(() => {
        console.error("Error while saving data:", error);
        toast.error("Failed to save data. Please try again.");
        setTranscationLoading(false);
      }, 3000);
    }
  };

  const renderAdditionalFields = () => {
    switch (paymentMethod) {
      case "cheque":
        return (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Check No"
              value={transactionDetails.check_no}
              onChange={(e) =>
                setTransactionDetails({
                  ...transactionDetails,
                  check_no: e.target.value,
                })
              }
              className="form-control mb-2"
            />
            <input
              type="text"
              placeholder="Account Holder Name"
              value={transactionDetails.account_holder_name}
              onChange={(e) =>
                setTransactionDetails({
                  ...transactionDetails,
                  account_holder_name: e.target.value,
                })
              }
              className="form-control mb-2"
            />
            <input
              type="text"
              placeholder="Bank Name"
              value={transactionDetails.bank_name}
              onChange={(e) =>
                setTransactionDetails({
                  ...transactionDetails,
                  bank_name: e.target.value,
                })
              }
              className="form-control mb-2"
            />
            <input
              type="text"
              placeholder="Branch Name"
              value={transactionDetails.branch_name}
              onChange={(e) =>
                setTransactionDetails({
                  ...transactionDetails,
                  branch_name: e.target.value,
                })
              }
              className="form-control mb-2"
            />
            <input
              type="text"
              placeholder="IFSC Code"
              value={transactionDetails.ifsc_code}
              onChange={(e) =>
                setTransactionDetails({
                  ...transactionDetails,
                  ifsc_code: e.target.value,
                })
              }
              className="form-control mb-2"
            />
          </div>
        );
      case "bank_transfer":
        return (
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="date"
              placeholder="Transfer Date"
              value={transactionDetails.transfer_date}
              onChange={(e) =>
                setTransactionDetails({
                  ...transactionDetails,
                  transfer_date: e.target.value,
                })
              }
              className="form-control mb-2"
            />
            <input
              type="text"
              placeholder="Transaction Reference"
              value={transactionDetails.transaction_ref}
              onChange={(e) =>
                setTransactionDetails({
                  ...transactionDetails,
                  transaction_ref: e.target.value,
                })
              }
              className="form-control mb-2"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return createPortal(
    <Modal
      show={show}
      onHide={transcationLoading ? null : handleModalClose}
      size="xl"
      centered
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-dialog modal-dialog-centered"
      style={{ pointerEvents: transcationLoading ? "none" : "auto" }}
    >
      {transcationLoading && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="loader"></div>
            <p className="loading-text">
              Processing Transaction, Please Wait...
            </p>
          </div>
        </div>
      )}
      <div
        className="modal-header"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
          fontFamily: "Manrope",
        }}
      >
        <h2>Detailed Fee Collect View</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleModalClose}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>

      <div
        className="modal-body py-lg-5 px-lg-5"
        style={{ backgroundColor: "#F2F6FF", fontFamily: "Manrope" }}
      >
        <div style={{ height: "auto", overflowY: "auto" }}>
          <table
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
                <th>Fee Type</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Adjusted Amount</th>
                <th>Amount Paid</th>
                <th>Pending Amount</th>
                <th>New Adjustment</th>
                <th>Total Amount</th>
                <th>Currently Paying</th>
                <th>Transaction History</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const isPaid = item.status === "paid";

                // Updated pending amount calculation
                const calculatedPendingAmount =
                  parseFloat(item.amount) +
                  (parseFloat(item.adjustment || "0") -
                    parseFloat(item.amount_paid));

                // Calculate the total amount including any new adjustment
                const calculateTotalAmount =
                  calculatedPendingAmount +
                  parseFloat(item.newAdjustment || "0");

                return (
                  <tr
                    key={item.student_fees_master_id}
                    style={{
                      backgroundColor:
                        item.student_fees_master_id % 2 === 0
                          ? "rgb(242, 246, 255)"
                          : "#FFFFFF",
                      color: "#1C335C",
                      fontSize: "14px",
                      opacity: isPaid ? 0.8 : 1,
                      pointerEvents: isPaid ? "none" : "auto",
                    }}
                  >
                    <td>{item.fee_type_name}</td>
                    <td>{formatDate(item.due_date)}</td>
                    <td>{currentUser?.currency_symbol + "" + item.amount}</td>
                    <td>{item.status}</td>
                    <td>
                      {currentUser?.currency_symbol + "" + item.adjustment}
                    </td>
                    <td>
                      {currentUser?.currency_symbol + "" + item.amount_paid}
                    </td>
                    <td>
                      {currentUser?.currency_symbol +
                        "" +
                        calculatedPendingAmount.toFixed(2)}
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder={"0"}
                        value={item.newAdjustment || ""}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "newAdjustment",
                            e.target.value
                          )
                        }
                        style={{ width: "80px" }}
                        disabled={isPaid}
                      />
                    </td>
                    <td>
                      {currentUser?.currency_symbol +
                        "" +
                        calculateTotalAmount.toFixed(2)}
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.currentlyPaying || ""}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "currentlyPaying",
                            e.target.value
                          )
                        }
                        style={{ width: "80px" }}
                        disabled={isPaid}
                      />
                    </td>
                    <td>
                      <Button
                        variant="link"
                        onClick={() =>
                          console.log(
                            "Transaction history for:",
                            item.student_fees_master_id
                          )
                        }
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "10px", fontWeight: "bold" }}>
          Total Adjustment:{" "}
          {currentUser?.currency_symbol + "" + totalAdjustment.toFixed(2)}
        </div>
        <div style={{ marginTop: "10px", fontWeight: "bold" }}>
          Total Currently Paying:{" "}
          {currentUser?.currency_symbol + "" + totalCurrentlyPaying.toFixed(2)}
        </div>

        {/* Footer Actions */}
        <div className="modal-footer border-0 d-flex justify-content-between">
          <div className="form-group d-flex flex-column mb-0">
            <select
              className="form-select me-3"
              value={paymentMethod}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
              style={{ width: "200px" }}
            >
              <option value="">Select Payment Method</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
            {renderAdditionalFields()}
          </div>
          <Button onClick={handleSave} disabled={!paymentMethod}>
            Save and Generate Receipt
          </Button>
        </div>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CollectOfflineAdmissionFees };
