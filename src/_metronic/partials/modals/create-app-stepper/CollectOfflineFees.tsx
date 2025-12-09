import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Modal, Button } from "react-bootstrap";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { GenerateReciept } from "../../../../app/pages/StaffPages/FinancialManagement/GenerateReciept";
import { GenerateChallan } from "../../../../app/pages/StaffPages/FinancialManagement/GenerateChallan";

type Props = {
  show: boolean;
  handleClose: () => void;
  studentId: number | null;
  groupId: number | null;
  setRefresh: boolean;
};

interface ApplicationData {
  fine_amount: number;
  invoice_number: any;
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

const CollectOfflineFees: React.FC<Props> = ({
  show,
  handleClose,
  groupId,
  studentId,
  setRefresh,
}) => {
  const { currentUser } = useAuth();
  const [data, setData] = useState<ApplicationData[]>([]);
  const [fineData, setFineData] = useState({});
  const [modifiedData, setModifiedData] = useState<ApplicationData[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [refreshData, setRefreshData] = useState(false);
  const [totalCurrentlyPaying, setTotalCurrentlyPaying] = useState(0);
  const [totalNetPaying, setTotalNetPaying] = useState(0);
  const [totalAdjustment, setTotalAdjustment] = useState(0);
  const [fineAmount, setFineAmount] = useState(0);
  const [transcationLoading, setTranscationLoading] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({
    transaction_ref: "",
    check_no: "",
    account_holder_name: "",
    bank_name: "",
    branch_name: "",
    ifsc_code: "",
    ref_transaction_id: "",
    transaction_amount: "",
    pay_instrument: "",
    pg_transaction_id: "",
    pg_receipt_number: "",
    settlement_id: "",
    statement_id: "",
    settlement_amount: "",
    settlement_status: "pending",
    settlement_date: "",
    transaction_date: "",
  });
  const schoolId = currentUser?.school_id;
  const sessionId = currentUser?.session_id;
  const voucher_type = currentUser?.voucher_type;
  const secretKey = import.meta.env.VITE_SYSTEM_KEY;
  const domain = window.location.origin + "/";

  const fetchFeeDetails = async () => {
    if (!schoolId || !studentId || !sessionId) return;
    try {
      const url = `${DOMAIN}/api/school/get-groupwisestudentfeegrouptype/${schoolId}/${groupId}/${studentId}/${sessionId}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Failed to fetch fee details");

      const result: ApplicationData[] = await response.json();

      setData(result?.feeDetails);
      setFineData(result?.fineDetails);
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
  }, [show, groupId, studentId, refreshData]);

  useEffect(() => {
    if (totalCurrentlyPaying > 0 && data.length > 0) {
      setFineAmount(fineData?.fine_amount); // ✅ Save fine amount separately
      setTotalNetPaying(
        Number(totalCurrentlyPaying) +
          Number(fineData?.fine_amount) -
          Number(fineData?.rebate_amount)
      );
    } else {
      setFineAmount(0); // Reset fine amount when totalCurrentlyPaying is cleared
      setTotalNetPaying(0); // Reset totalNetPaying when totalCurrentlyPaying is cleared
    }
  }, [totalCurrentlyPaying, data, fineData]);

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
      // Reset direct_link fields too
      ref_transaction_id: "",
      transaction_amount: "",
      pay_instrument: "",
      pg_transaction_id: "",
      pg_receipt_number: "",
      settlement_id: "",
      settlement_amount: "",
      settlement_status: "pending",
      settlement_date: "",
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleModalClose = () => {
    setRefresh(true);
    setRefreshData(true);
    setTotalCurrentlyPaying(0);
    setTotalNetPaying(0);
    setTotalAdjustment(0);
    setTransactionDetails({
      transaction_ref: "",
      check_no: "",
      account_holder_name: "",
      bank_name: "",
      branch_name: "",
      ifsc_code: "",
      // Reset direct_link fields too
      ref_transaction_id: "",
      transaction_amount: "",
      pay_instrument: "",
      pg_transaction_id: "",
      pg_receipt_number: "",
      settlement_id: "",
      settlement_amount: "",
      settlement_status: "pending",
      settlement_date: "",
    });
    setModifiedData([]);
    setData([]);
    handleClose();
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedData = [...data];

    if (field === "newAdjustment") {
      updatedData[index] = { ...updatedData[index], newAdjustment: value };

      // Calculate the total of only new adjustments
      const newTotalAdjustment = updatedData.reduce(
        (acc, item) => acc + parseFloat(item.newAdjustment || "0"),
        0
      );
      setTotalAdjustment(newTotalAdjustment);
    } else if (field === "currentlyPaying") {
      updatedData[index] = { ...updatedData[index], currentlyPaying: value };

      // Recalculate the total of currentlyPaying
      const newTotalCurrentlyPaying = updatedData.reduce(
        (acc, item) => acc + parseFloat(item.currentlyPaying || "0"),
        0
      );
      setTotalCurrentlyPaying(newTotalCurrentlyPaying);
    } else {
      updatedData[index] = { ...updatedData[index], [field]: value };
    }

    setData(updatedData);

    const modifiedRowIndex = modifiedData.findIndex(
      (item) =>
        item.student_fees_master_id ===
        updatedData[index].student_fees_master_id
    );
    if (modifiedRowIndex > -1) {
      modifiedData[modifiedRowIndex] = updatedData[index];
    } else {
      setModifiedData([...modifiedData, updatedData[index]]);
    }
  };
  const handleSave = async () => {
    setTranscationLoading(true);
    if (paymentMethod === "direct_link") {
      const requiredDirectLinkFields = [
        "ref_transaction_id",
        "transaction_amount",
        "pay_instrument",
        "pg_transaction_id",
        "pg_receipt_number",
        "settlement_id",
        "statement_id",
        "settlement_amount",
        "settlement_status",
        "settlement_date",
      ];

      const missingFields = requiredDirectLinkFields.filter(
        (field) => !transactionDetails[field]
      );

      if (missingFields.length > 0) {
        toast.error(
          `Missing required fields for direct link: ${missingFields.join(", ")}`
        );
        setTranscationLoading(false);
        return;
      }
    }
    if (totalCurrentlyPaying > 0 && !paymentMethod) {
      toast.error("Please select a payment method before saving.");
      return;
    }

    const adjustmentsOnly: {
      student_fees_master_id: number;
      adjustment: number;
      total_amount: number;
      status: string;
    }[] = [];
    const transactions: {
      invoice_number: any;
      feetype_id: any;
      student_fees_master_id: number;
      amount_paid: number;
      adjustment: number;
      status: string;
      transaction: {
        transaction_amount: string | null;
        pay_instrument: string | null;
        pg_transaction_id: string | null;
        pg_receipt_number: string | null;
        settlement_id: string | null;
        statement_id: string | null;
        settlement_amount: string | null;
        settlement_status: string | null;
        settlement_date: string | null;
        ref_transaction_id: string | null;
        amount: string | null;
        payment_method: string;
        transaction_ref: string | null;
        check_no: string | null;
        account_holder_name: string | null;
        bank_name: string | null;
        branch_name: string | null;
        ifsc_code: string | null;
        transaction_date: string | null;
        user_id: string;
        school_id: string | undefined;
      };
    }[] = [];

    modifiedData.forEach((item) => {
      const previousAdjustment = parseFloat(item.adjustment || 0);
      const newAdjustment = parseFloat(item.newAdjustment || 0);
      const totalAdjustment = previousAdjustment + newAdjustment;

      const newAmountPaid =
        parseFloat(item.amount_paid) + parseFloat(item.currentlyPaying || 0);
      const totalAmount =
        parseFloat(item.amount || 0) +
        totalAdjustment +
        parseFloat(item.fine_amount || 0);

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
          invoice_number: item.invoice_number,
          adjustment: totalAdjustment,
          total_amount: totalAmount,
          status,
        });
      } else if (!isAdjustmentOnly) {
        transactions.push({
          student_fees_master_id: item.student_fees_master_id,
          invoice_number: item.invoice_number,
          amount_paid: newAmountPaid,
          adjustment: totalAdjustment,
          status,
          transaction: {
            amount: item.currentlyPaying,
            payment_method: paymentMethod,
            transaction_ref: transactionDetails.transaction_ref || null,
            check_no: transactionDetails.check_no || null,
            account_holder_name: transactionDetails.account_holder_name || null,
            bank_name: transactionDetails.bank_name || null,
            branch_name: transactionDetails.branch_name || null,
            ifsc_code: transactionDetails.ifsc_code || null,
            transaction_date: transactionDetails.transaction_date || null,
            ...(paymentMethod === "direct_link" && {
              ref_transaction_id: transactionDetails.ref_transaction_id || null,
              transaction_amount: transactionDetails.transaction_amount || null,
              pay_instrument: transactionDetails.pay_instrument || null,
              pg_transaction_id: transactionDetails.pg_transaction_id || null,
              pg_receipt_number: transactionDetails.pg_receipt_number || null,
              settlement_id: transactionDetails.settlement_id || null,
              statement_id: transactionDetails.statement_id || null,
              settlement_amount: transactionDetails.settlement_amount || null,
              settlement_status: transactionDetails.settlement_status || null,
              settlement_date: transactionDetails.settlement_date || null,
              transaction_date: transactionDetails.transaction_date || null,
            }),
            user_id: currentUser.id,
            school_id: currentUser.school_id,
          },
        });
      }
    });

    const saveData = {
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
          };
        })
      ),
      feeTransactions: transactions.map((t) => {
        const relatedItem = modifiedData.find(
          (item) => item.student_fees_master_id === t.student_fees_master_id
        );

        const previousRebate = parseFloat(relatedItem?.rebate_amount || 0);
        const newRebate = parseFloat(fineData.rebate_amount || 0);
        const isRebateChanged =
          paymentMethod === "direct_link" && previousRebate !== newRebate;

        return {
          student_fees_master_id: t.student_fees_master_id,
          invoice_number: t.invoice_number,
          amount: t.transaction.amount,
          payment_method: t.transaction.payment_method,
          transaction_ref: t.transaction.transaction_ref,
          check_no: t.transaction.check_no,
          account_holder_name: t.transaction.account_holder_name,
          bank_name: t.transaction.bank_name,
          branch_name: t.transaction.branch_name,
          ifsc_code: t.transaction.ifsc_code,
          transaction_date: t.transaction.transaction_date,
          user_id: t.transaction.user_id,
          school_id: t.transaction.school_id,
          feetype_id: t.feetype_id,
          session_id: sessionId,
          fine_amount: fineAmount,

          // ✅ Conditionally include rebate_amount
          ...(isRebateChanged && { rebate_amount: newRebate }),

          // direct_link fields
          ref_transaction_id: t.transaction.ref_transaction_id || null,
          transaction_amount: t.transaction.transaction_amount || null,
          pay_instrument: t.transaction.pay_instrument || null,
          pg_transaction_id: t.transaction.pg_transaction_id || null,
          pg_receipt_number: t.transaction.pg_receipt_number || null,
          settlement_id: t.transaction.settlement_id || null,
          statement_id: t.transaction.statement_id || null,
          settlement_amount: t.transaction.settlement_amount || null,
          settlement_status: t.transaction.settlement_status || null,
          settlement_date: t.transaction.settlement_date || null,
        };
      }),
    };

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/store-offlinefeetransaction`,
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
          setRefresh(true); // Trigger data refresh
          setRefreshData(true); // Trigger data refresh
          setModifiedData([]); // Clear modified data
          setTotalCurrentlyPaying(0); // Reset total currently paying
          setPaymentMethod(""); // Reset payment method
          setTransactionDetails({
            transaction_ref: "",
            check_no: "",
            account_holder_name: "",
            bank_name: "",
            branch_name: "",
            ifsc_code: "",
            transaction_date: "",
            // Reset direct_link fields too
            ref_transaction_id: "",
            transaction_amount: "",
            pay_instrument: "",
            pg_transaction_id: "",
            pg_receipt_number: "",
            settlement_id: "",
            statement_id: "",
            settlement_amount: "",
            settlement_status: "",
            settlement_date: "",
          });
          toast.success("Data saved successfully!");
          console.log("Data saved successfully:", responseData);
          const transactionId = responseData.transaction_id;
          fetchTransactionDetails(transactionId);
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

  // const handleLedgerUpdate = async () => {
  //   // Filter adjustments where currentlyPaying is zero
  //   const adjustmentsOnly = modifiedData
  //     .filter(
  //       (item) => item.newAdjustment && parseFloat(item.newAdjustment) !== 0
  //     ) // Allow negative and positive adjustments
  //     .map((item) => {
  //       const currentTotalAmount = parseFloat(item.total_amount || 0);
  //       const adjustmentValue = parseFloat(item.newAdjustment || 0);

  //       return {
  //         student_fees_master_id: item.student_fees_master_id,
  //         adjustment: parseFloat(item.adjustment || 0) + adjustmentValue, // Update adjustment
  //         total_amount:
  //           parseFloat(item.amount || 0) -
  //           parseFloat(item.amount_paid || 0) +
  //           parseFloat(item.newAdjustment || 0), // Adjust total amount
  //       };
  //     });

  //   if (adjustmentsOnly.length === 0) {
  //     toast.error("No adjustments to update.");
  //     return;
  //   }

  //   const payload = {
  //     adjustments: adjustmentsOnly,
  //     school_id: currentUser?.school_id,
  //     session_id: currentUser?.session_id,
  //   };

  //   try {
  //     const response = await fetch(
  //       `${DOMAIN}/api/school/update-student-fee-adjustment`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     if (response.ok) {
  //       const responseData = await response.json();
  //       toast.success("Ledger updated successfully!");
  //       setRefreshData(true); // Trigger data refresh
  //       setModifiedData([]); // Clear modified data
  //     } else {
  //       const errorData = await response.json();
  //       toast.error(`Failed to update ledger: ${errorData.error}`);
  //     }
  //   } catch (error) {
  //     console.error("Error updating ledger:", error);
  //     toast.error("Failed to update ledger. Please try again.");
  //   }
  // };

  useEffect(() => {
    if (paymentMethod === "direct_link") {
      setFineData((prev) => ({ ...prev, fine_amount: 0 }));
      setFineData((prev) => ({ ...prev, rebate_amount: 0 }));
    }
  }, [paymentMethod]);

  const renderAdditionalFields = () => {
    switch (paymentMethod) {
      // case "cheque":
      case "direct_link":
        // setFineData((prev) => ({
        //   ...prev,
        //   fineamount: 0,
        // }));
        return (
          <div
            style={{
              marginTop: "16px",
              padding: "24px",
              background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
              borderRadius: "12px",
              border: "1px solid #BFDBFE",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#3B82F6",
                  borderRadius: "4px",
                  marginRight: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="fas fa-file-alt"
                  style={{ color: "white", fontSize: "12px" }}
                ></i>
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#1E40AF",
                  margin: 0,
                  fontFamily: "Manrope",
                }}
              >
                Direct Link Payment Details
              </h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                    fontFamily: "Manrope",
                  }}
                >
                  <span
                    style={{
                      marginRight: "6px",
                      fontSize: "12px",
                    }}
                  >
                    🔗
                  </span>
                  Ref Transcation Id
                </label>
                <input
                  type="text"
                  placeholder="Enter Ref Transcation Id"
                  value={transactionDetails.ref_transaction_id}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      ref_transaction_id: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Manrope",
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3B82F6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                    fontFamily: "Manrope",
                  }}
                >
                  <span
                    style={{
                      marginRight: "6px",
                      fontSize: "12px",
                    }}
                  >
                    👤
                  </span>
                  Transaction Amount
                </label>
                <input
                  type="text"
                  placeholder="Enter Transaction Amount"
                  value={transactionDetails.transaction_amount}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      transaction_amount: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Manrope",
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3B82F6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                    fontFamily: "Manrope",
                  }}
                >
                  <span
                    style={{
                      marginRight: "6px",
                      fontSize: "12px",
                    }}
                  >
                    💳
                  </span>
                  Transaction Date
                </label>
                <input
                  type="date"
                  value={transactionDetails.transaction_date}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      transaction_date: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Manrope",
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                    fontFamily: "Manrope",
                  }}
                >
                  <span
                    style={{
                      marginRight: "6px",
                      fontSize: "12px",
                    }}
                  >
                    🏦
                  </span>
                  Pay Instrument
                </label>
                <input
                  type="text"
                  placeholder="Enter Pay Instrument"
                  value={transactionDetails.pay_instrument}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      pay_instrument: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Manrope",
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3B82F6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                    fontFamily: "Manrope",
                  }}
                >
                  <span
                    style={{
                      marginRight: "6px",
                      fontSize: "12px",
                    }}
                  >
                    📍
                  </span>
                  PG Transaction Id
                </label>
                <input
                  type="text"
                  placeholder="Enter PG Transaction Id"
                  value={transactionDetails.pg_transaction_id}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      pg_transaction_id: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Manrope",
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3B82F6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                    fontFamily: "Manrope",
                  }}
                >
                  <span
                    style={{
                      marginRight: "6px",
                      fontSize: "12px",
                    }}
                  >
                    📍
                  </span>
                  PG Receipt No.
                </label>
                <input
                  type="text"
                  placeholder="Enter PG Receipt No."
                  value={transactionDetails.pg_receipt_number}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      pg_receipt_number: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Manrope",
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3B82F6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                    fontFamily: "Manrope",
                  }}
                >
                  <span
                    style={{
                      marginRight: "6px",
                      fontSize: "12px",
                    }}
                  >
                    💰
                  </span>
                  Fine Amount
                </label>
                <input
                  type="text"
                  placeholder="Enter Settlement Id"
                  value={fineData?.fine_amount || ""}
                  onChange={(e) =>
                    setFineData((prev) => ({
                      ...prev,
                      fine_amount: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Manrope",
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3B82F6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                    fontFamily: "Manrope",
                  }}
                >
                  <span
                    style={{
                      marginRight: "6px",
                      fontSize: "12px",
                    }}
                  >
                    💳
                  </span>
                  Rebate Amount
                </label>
                <input
                  type="text"
                  placeholder="Enter Settlement Id"
                  value={fineData?.rebate_amount || ""}
                  onChange={(e) =>
                    setFineData((prev) => ({
                      ...prev,
                      rebate_amount: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Manrope",
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3B82F6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                    fontFamily: "Manrope",
                  }}
                >
                  <span
                    style={{
                      marginRight: "6px",
                      fontSize: "12px",
                    }}
                  >
                    💳
                  </span>
                  Settlement Id
                </label>
                <input
                  type="text"
                  placeholder="Enter Settlement Id"
                  value={transactionDetails.settlement_id}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      settlement_id: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Manrope",
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3B82F6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                    fontFamily: "Manrope",
                  }}
                >
                  <span
                    style={{
                      marginRight: "6px",
                      fontSize: "12px",
                    }}
                  >
                    💳
                  </span>
                  Statement Id
                </label>
                <input
                  type="text"
                  placeholder="Enter Statement Id"
                  value={transactionDetails.statement_id}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      statement_id: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Manrope",
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3B82F6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                    fontFamily: "Manrope",
                  }}
                >
                  <span
                    style={{
                      marginRight: "6px",
                      fontSize: "12px",
                    }}
                  >
                    ⏳
                  </span>
                  Payment Status
                </label>
                <select
                  value={transactionDetails.settlement_status}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      settlement_status: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Manrope",
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3B82F6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="success">Success</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                    fontFamily: "Manrope",
                  }}
                >
                  <span
                    style={{
                      marginRight: "6px",
                      fontSize: "12px",
                    }}
                  >
                    💳
                  </span>
                  Settlement Amount
                </label>
                <input
                  type="text"
                  placeholder="Enter Settlement Amount"
                  value={transactionDetails.settlement_amount}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      settlement_amount: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Manrope",
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3B82F6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                    fontFamily: "Manrope",
                  }}
                >
                  <span
                    style={{
                      marginRight: "6px",
                      fontSize: "12px",
                    }}
                  >
                    💳
                  </span>
                  Settlement Date
                </label>
                <input
                  type="date"
                  value={transactionDetails.settlement_date}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      settlement_date: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Manrope",
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                />
              </div>
            </div>
          </div>
        );

      case "neft":
        return (
          <div
            style={{
              marginTop: "16px",
              padding: "24px",
              background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
              borderRadius: "12px",
              border: "1px solid #A7F3D0",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#059669",
                  borderRadius: "4px",
                  marginRight: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="fas fa-university"
                  style={{ color: "white", fontSize: "12px" }}
                ></i>
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#065F46",
                  margin: 0,
                  fontFamily: "Manrope",
                }}
              >
                Transfer NEFT Details
              </h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                    fontFamily: "Manrope",
                  }}
                >
                  <span
                    style={{
                      marginRight: "6px",
                      fontSize: "12px",
                    }}
                  >
                    📅
                  </span>
                  NEFT Date
                </label>
                <input
                  type="date"
                  value={transactionDetails.transaction_date}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      transaction_date: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Manrope",
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#059669";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(5, 150, 105, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                    fontFamily: "Manrope",
                  }}
                >
                  <span
                    style={{
                      marginRight: "6px",
                      fontSize: "12px",
                    }}
                  >
                    🔢
                  </span>
                  NEFT ID
                </label>
                <input
                  type="text"
                  placeholder="Enter NEFT ID"  
                  value={transactionDetails.transaction_ref}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      transaction_ref: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Manrope",
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#059669";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(5, 150, 105, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                  }}
                />
              </div>
            </div>

            <div
              style={{
                marginTop: "16px",
                padding: "12px 16px",
                backgroundColor: "#D1FAE5",
                borderRadius: "8px",
                border: "1px solid #A7F3D0",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <span
                  style={{
                    marginRight: "8px",
                    fontSize: "14px",
                    marginTop: "2px",
                  }}
                >
                  ℹ️
                </span>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#065F46",
                    margin: 0,
                    fontFamily: "Manrope",
                    lineHeight: "1.4",
                  }}
                >
                  Please ensure the transaction reference number is accurate for
                  faster processing.
                </p>
              </div>
            </div>
          </div>
        );

      case "cash":
        return (
          <div
            style={{
              marginTop: "16px",
              padding: "24px",
              background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
              borderRadius: "12px",
              border: "1px solid #FDE68A",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
               <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "8px",
                    fontFamily: "Manrope",
                  }}
                >
                  <span
                    style={{
                      marginRight: "6px",
                      fontSize: "12px",
                    }}
                  >
                    📅
                  </span>
                  When was cash collected ?
                </label>
                <input
                  type="date"
                  value={transactionDetails.transaction_date}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      transaction_date: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "Manrope",
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#059669";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(5, 150, 105, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                  }}
                />
              </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
                marginTop: "16px",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#FEF3C7",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #F59E0B",
                }}
              >
                <span style={{ fontSize: "24px" }}>💵</span>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#92400E",
                  margin: "0 0 8px 0",
                  fontFamily: "Manrope",
                }}
              >
                Cash Payment
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#92400E",
                  margin: "0 0 16px 0",
                  fontFamily: "Manrope",
                }}
              >
                You have selected cash as your payment method.
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 16px",
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  border: "1px solid #F59E0B",
                }}
              >
                <span
                  style={{
                    marginRight: "8px",
                    fontSize: "16px",
                  }}
                >
                  ✅
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#92400E",
                    fontFamily: "Manrope",
                  }}
                >
                  No additional details required
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const fetchTransactionDetails = async (transactionId) => {
    try {
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(transactionId),
        secretKey
      ).toString();
      const receiptUrl = `${domain}fee-reciept?schoolId=${schoolId}&data=${encodeURIComponent(
        encryptedData
      )}`;
      window.open(receiptUrl, "_blank");

      // const response = await fetch(
      //   `${DOMAIN}/api/school/transaction-details-by-id/${transactionId}/${schoolId}/${sessionId}`
      // );

      // if (response.ok) {
      //   const transactionData = await response.json();
      //   console.log(transactionData);

      //   // if (
      //   //   transactionData &&
      //   //   transactionData.commonDetails &&
      //   //   transactionData.transactionDetails.length > 0 &&
      //   //   voucher_type === "challan" &&
      //   //   transactionData.commonDetails.payment_method === "cash"
      //   // ) {
      //   //   // Generate PDF for the specific transaction
      //   //   GenerateChallan({
      //   //     commonDetails: transactionData.commonDetails,
      //   //     transactionDetails: transactionData.transactionDetails,
      //   //   });
      //   // } else if (
      //   //   transactionData &&
      //   //   transactionData.commonDetails &&
      //   //   transactionData.transactionDetails.length > 0
      //   // ) {
      //   //   GenerateReciept({
      //   //     commonDetails: transactionData.commonDetails,
      //   //     transactionDetails: transactionData.transactionDetails,
      //   //   });
      //   // } else {
      //   //   console.error(
      //   //     "No transaction details found for transaction ID:",
      //   //     transactionId
      //   //   );
      //   // }

      // } else {
      //   console.error(
      //     "Failed to fetch transaction details for receipt with ID:",
      //     transactionId
      //   );
      // }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  };

  // const generatePdf = async ({ commonDetails, transactionDetails }) => {
  //   try {
  //     const totalAmount = transactionDetails.reduce(
  //       (sum, detail) => sum + parseInt(detail.fee_amount),
  //       0
  //     );

  //     const pdfBlob = await pdf(
  //       <Document>
  //         <Page style={styles.page}>
  //           {/* Container with blue border */}
  //           <View
  //             style={{
  //               border: "2px solid rgb(41, 114, 187)",
  //               padding: 20,
  //               borderRadius: 5,
  //               // fontFamily:'Manrope, sans-serif',
  //             }}
  //           >
  //             {/* Header Section */}
  //             {commonDetails && (
  //               <View style={styles.header}>
  //                 {/* Left: School Logo */}
  //                 {commonDetails.school_logo && (
  //                   <Image
  //                     style={styles.logo}
  //                     src={commonDetails.school_logo}
  //                   />
  //                 )}

  //                 {/* Center: School Details */}
  //                 <View style={styles.schoolDetails}>
  //                   <Text style={styles.schoolName}>
  //                     {commonDetails.school_name}
  //                   </Text>
  //                   <Text style={styles.tagline}>
  //                     {commonDetails.school_tagline}
  //                   </Text>
  //                   <Text style={styles.address}>
  //                     {commonDetails.school_address}
  //                   </Text>
  //                   <Text style={styles.address}>
  //                     {commonDetails.school_email}
  //                   </Text>
  //                   <Text style={styles.address}>
  //                     {commonDetails.school_phone}
  //                   </Text>
  //                 </View>

  //                 {/* Right: Receipt Text */}
  //                 <Text style={styles.receiptText}>RECEIPT</Text>
  //               </View>
  //             )}

  //             {/* Receipt Details */}
  //             {commonDetails && (
  //               <View style={[styles.section, styles.row]}>
  //                 {/* Receipt To Section */}
  //                 <View style={styles.receiptTo}>
  //                   <Text style={styles.sectionTitle}>Receipt To:</Text>
  //                   <Text>{`${commonDetails.student_first_name} ${commonDetails.student_last_name}`}</Text>
  //                   <Text>Email: {commonDetails.student_email}</Text>
  //                   <Text>Contact: {commonDetails.student_contact}</Text>
  //                 </View>

  //                 {/* Receipt Details Section */}
  //                 <View style={styles.receiptDetails}>
  //                   <Text style={styles.sectionTitle}>Receipt Details:</Text>
  //                   <Text>Transaction ID: {commonDetails.transaction_id}</Text>
  //                   <Text>
  //                     Invoice Number: {transactionDetails[0].invoice_number}
  //                   </Text>
  //                   <Text>
  //                     Receipt Number: {transactionDetails[0].invoice_number}
  //                   </Text>
  //                   <Text>Payment Method: {commonDetails.payment_method}</Text>
  //                   <Text>
  //                     Transfer Date:{" "}
  //                     {formatDate(commonDetails.transfer_date || "N/A")}
  //                   </Text>
  //                 </View>
  //               </View>
  //             )}
  //             <View style={styles.installmentHeading}>
  //               <Text style={styles.installmentTitle}>
  //                 {" "}
  //                 {transactionDetails[0].fee_group_name}
  //               </Text>
  //             </View>
  //             {/* Fee Details Table */}
  //             <View style={styles.table}>
  //               <View style={[styles.tableRow, styles.tableHeader]}>
  //                 <Text style={styles.tableCell}>Fee Type</Text>
  //                 <Text style={styles.tableCell}>Amount</Text>
  //                 <Text style={styles.tableCell}>Status</Text>
  //               </View>

  //               {/* Loop through transaction details */}
  //               {transactionDetails.map((detail, index) => (
  //                 <View key={index} style={styles.tableRow}>
  //                   <Text style={styles.tableCell}>{detail.fee_type_name}</Text>
  //                   <Text style={styles.tableCell}>₹{detail.fee_amount}</Text>
  //                   <Text style={styles.tableCell}>
  //                     {detail.fee_status || "N/A"}
  //                   </Text>
  //                 </View>
  //               ))}
  //             </View>

  //             {/* Total Paid Amount and Contact Details Section */}
  //             <View style={[styles.section, styles.row]}>
  //               {/* Total Paid Amount */}
  //               <View style={{ flex: 1, alignItems: "flex-end" }}>
  //                 <Text>Total Amount Paid: ₹{totalAmount}</Text>
  //                 <Text>
  //                   Rupees in Words: {commonDetails.amount_in_words || "N/A"}
  //                 </Text>
  //                 <Text>Remarks: --</Text>
  //               </View>
  //             </View>

  //             {/* Divider Line */}
  //             <View style={{ marginVertical: 10 }}>
  //               <Text style={styles.hrLine}></Text>
  //             </View>

  //             {/* Contact Details */}
  //             <View style={[styles.section, styles.row]}>
  //               <View style={{ flex: 1, alignItems: "flex-start" }}>
  //                 <Text>Contact: {commonDetails.school_phone}</Text>
  //                 <Text>Email: {commonDetails.school_email}</Text>
  //               </View>
  //             </View>

  //             {/* System-Generated Receipt Line */}
  //             <View style={{ marginTop: 20, textAlign: "center" }}>
  //               <Text style={styles.boldLine}>
  //                 This is a system-generated receipt. No need for a signature.
  //               </Text>
  //             </View>
  //           </View>
  //         </Page>
  //       </Document>
  //     ).toBlob();

  //     // Open the PDF in a new window
  //     const url = URL.createObjectURL(pdfBlob);
  //     const windowFeatures =
  //       "width=800,height=600,left=200,top=100,scrollbars=yes,resizable=yes";
  //     window.open(url, "_blank", windowFeatures);
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //   }
  // };

  return createPortal(
    <Modal
      show={show}
      onHide={transcationLoading ? null : handleModalClose}
      size="xl"
      centered
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-dialog"
      style={{ pointerEvents: transcationLoading ? "none" : "auto" }}
    >
      {/* Enhanced Loading Overlay */}
      {transcationLoading && (
        <div
          className="loading-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            borderRadius: "12px",
          }}
        >
          <div
            className="loading-box"
            style={{
              textAlign: "center",
              padding: "40px",
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
              border: "1px solid #E5E7EB",
            }}
          >
            <div
              className="loader"
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #F3F4F6",
                borderTop: "4px solid #3B82F6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px",
              }}
            ></div>
            <p
              className="loading-text"
              style={{
                margin: 0,
                color: "#374151",
                fontSize: "16px",
                fontWeight: "500",
                fontFamily: "Manrope",
              }}
            >
              Processing Transaction, Please Wait...
            </p>
          </div>
        </div>
      )}

      {/* Modern Header */}
      <div
        className="modal-header"
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #E5E7EB",
          padding: "24px 32px",
          borderRadius: "12px 12px 0 0",
          fontFamily: "Manrope",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "8px",
              height: "32px",
              backgroundColor: "#3B82F6",
              borderRadius: "4px",
            }}
          ></div>
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "700",
              color: "#1F2937",
              letterSpacing: "-0.025em",
            }}
          >
            Fee Collection Details
          </h2>
        </div>
        <button
          className="btn-close"
          onClick={handleModalClose}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontSize: "18px",
            color: "#6B7280",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#F9FAFB";
            e.target.style.borderColor = "#D1D5DB";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "white";
            e.target.style.borderColor = "#E5E7EB";
          }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Enhanced Modal Body */}
      <div
        className="modal-body"
        style={{
          backgroundColor: "#F8FAFC",
          padding: "32px",
          fontFamily: "Manrope",
          minHeight: "500px",
        }}
      >
        {/* Table Container with Modern Design */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden",
            marginBottom: "24px",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              className="table table-striped"
              style={{
                width: "100%",
                margin: 0,
                borderCollapse: "separate",
                borderSpacing: 0,
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#F8FAFC",
                    borderBottom: "2px solid #E5E7EB",
                    fontFamily: "Manrope",
                    fontWeight: "600",
                    color: "#374151",
                    fontSize: "14px",
                  }}
                >
                  <th
                    style={{
                      padding: "16px 20px",
                      borderRight: "1px solid #E5E7EB",
                    }}
                  >
                    Fee Type
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      borderRight: "1px solid #E5E7EB",
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      borderRight: "1px solid #E5E7EB",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      borderRight: "1px solid #E5E7EB",
                    }}
                  >
                    Rebate
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      borderRight: "1px solid #E5E7EB",
                    }}
                  >
                    Already Paid
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      borderRight: "1px solid #E5E7EB",
                    }}
                  >
                    Pending Amount
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      borderRight: "1px solid #E5E7EB",
                    }}
                  >
                    Total Amount
                  </th>
                  <th style={{ padding: "16px 20px" }}>Currently Paying</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  const isPaid = item.status === "paid";

                  const calculatedPendingAmount =
                    parseFloat(item.amount) +
                    (parseFloat(item.adjustment || "0") -
                      parseFloat(item.amount_paid));

                  const calculateTotalAmount =
                    calculatedPendingAmount +
                    parseFloat(item.newAdjustment || "0");

                  return (
                    <tr
                      key={item.student_fees_master_id}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#FAFBFC" : "white",
                        color: "#374151",
                        fontSize: "14px",
                        opacity: isPaid ? 0.6 : 1,
                        pointerEvents: isPaid ? "none" : "auto",
                        borderBottom: "1px solid #F3F4F6",
                        transition: "all 0.2s ease",
                      }}
                      onMouseOver={(e) => {
                        if (!isPaid) {
                          e.currentTarget.style.backgroundColor = "#EFF6FF";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isPaid) {
                          e.currentTarget.style.backgroundColor =
                            index % 2 === 0 ? "#FAFBFC" : "white";
                        }
                      }}
                    >
                      <td
                        style={{
                          padding: "16px 20px",
                          borderRight: "1px solid #F3F4F6",
                          fontWeight: "500",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {isPaid && (
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                backgroundColor: "#10B981",
                                borderRadius: "50%",
                              }}
                            ></span>
                          )}
                          {item.fee_type_name}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          borderRight: "1px solid #F3F4F6",
                          fontWeight: "600",
                        }}
                      >
                        {currentUser?.currency_symbol + "" + item.amount}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          borderRight: "1px solid #F3F4F6",
                        }}
                      >
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "500",
                            backgroundColor: isPaid ? "#D1FAE5" : "#FEF3C7",
                            color: isPaid ? "#065F46" : "#92400E",
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          borderRight: "1px solid #F3F4F6",
                          color: "#059669",
                        }}
                      >
                        {currentUser?.currency_symbol + "" + item.adjustment}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          borderRight: "1px solid #F3F4F6",
                          color: "#6B7280",
                        }}
                      >
                        {currentUser?.currency_symbol + "" + item.amount_paid}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          borderRight: "1px solid #F3F4F6",
                          fontWeight: "600",
                        }}
                      >
                        {currentUser?.currency_symbol +
                          Number(calculatedPendingAmount)}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          borderRight: "1px solid #F3F4F6",
                          fontWeight: "600",
                        }}
                      >
                        {currentUser?.currency_symbol +
                          Number(calculateTotalAmount)}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
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
                          style={{
                            width: "100px",
                            padding: "8px 12px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontFamily: "Manrope",
                            backgroundColor: isPaid ? "#F9FAFB" : "white",
                            transition: "all 0.2s ease",
                          }}
                          disabled={isPaid || transcationLoading}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#3B82F6";
                            e.target.style.boxShadow =
                              "0 0 0 3px rgba(59, 130, 246, 0.1)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#D1D5DB";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Summary Section */}

        {/* Enhanced Payment Method Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            border: "1px solid #E5E7EB",
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1F2937",
              marginBottom: "20px",
              fontFamily: "Manrope",
            }}
          >
            Payment Method
          </h3>

          <div className="form-group mb-3">
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "300px",
                padding: "12px 16px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "Manrope",
                backgroundColor: "white",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3B82F6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D1D5DB";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">Select Payment Method</option>
              <option value="cash">💵 Cash</option>
              <option value="cheque">📝 Cheque</option>
              <option value="direct_link">🔗 Direct Link</option>
              <option value="neft">🏦 NEFT</option>
            </select>
            <div style={{ marginTop: "16px" }}>{renderAdditionalFields()}</div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            border: "1px solid #E5E7EB",
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1F2937",
              marginBottom: "20px",
              fontFamily: "Manrope",
            }}
          >
            Payment Summary
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                backgroundColor: "#F8FAFC",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#6B7280",
                }}
              >
                Gross Amount
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1F2937",
                }}
              >
                {totalCurrentlyPaying > 0
                  ? currentUser?.currency_symbol +
                    totalCurrentlyPaying.toFixed(2)
                  : currentUser?.currency_symbol + "0.00"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                backgroundColor: "#F0FDF4",
                borderRadius: "8px",
                border: "1px solid #D1FAE5",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#059669",
                }}
              >
                Total Rebate
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#059669",
                }}
              >
                -{" "}
                {currentUser?.currency_symbol +
                  "" +
                  (fineData?.rebate_amount || 0)}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                backgroundColor: "#FEF3C7",
                borderRadius: "8px",
                border: "1px solid #FDE68A",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#92400E",
                }}
              >
                {schoolId?.slice(0, 3) === "INN"
                  ? "Administrative Charges"
                  : "Fine Amount"}
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#92400E",
                }}
              >
                +{" "}
                {currentUser?.currency_symbol +
                  "" +
                  (fineData?.fine_amount || "0.00")}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                backgroundColor: "#EFF6FF",
                borderRadius: "8px",
                border: "2px solid #3B82F6",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#1E40AF",
                }}
              >
                Total Currently Paying
              </span>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1E40AF",
                }}
              >
                {currentUser?.currency_symbol +
                  Number(totalNetPaying ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        {/* Enhanced Footer */}
        <div
          className="modal-footer"
          style={{
            borderTop: "1px solid #E5E7EB",
            padding: "24px 0 0 0",
            backgroundColor: "transparent",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            className="btn"
            onClick={handleModalClose}
            style={{
              padding: "12px 24px",
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              backgroundColor: "white",
              color: "#374151",
              fontSize: "14px",
              fontWeight: "500",
              fontFamily: "Manrope",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#F9FAFB";
              e.target.style.borderColor = "#9CA3AF";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.borderColor = "#D1D5DB";
            }}
          >
            Cancel
          </button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!paymentMethod && totalCurrentlyPaying > 0}
            style={{
              padding: "12px 32px",
              borderRadius: "8px",
              backgroundColor:
                !paymentMethod && totalCurrentlyPaying > 0
                  ? "#9CA3AF"
                  : "#3B82F6",
              border: "none",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              fontFamily: "Manrope",
              cursor:
                !paymentMethod && totalCurrentlyPaying > 0
                  ? "not-allowed"
                  : "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
            onMouseOver={(e) => {
              if (!e.target.disabled) {
                e.target.style.backgroundColor = "#2563EB";
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
              }
            }}
            onMouseOut={(e) => {
              if (!e.target.disabled) {
                e.target.style.backgroundColor = "#3B82F6";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
              }
            }}
          >
            💾 Save & Generate Receipt
          </Button>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .table-striped tbody tr:nth-of-type(odd) {
          background-color: transparent !important;
        }

        .modal-dialog {
          max-width: 95vw !important;
        }

        @media (max-width: 768px) {
          .modal-dialog {
            margin: 10px;
          }
        }
      `}</style>
    </Modal>,
    modalsRoot
  );
};

export { CollectOfflineFees };
