import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import React from "react";
import { ShowTransactions } from "../../modals/create-app-stepper/ShowTransactions";
import { useNavigate } from "react-router-dom";
import { CollectOfflineFees } from "../../modals/create-app-stepper/CollectOfflineFees";
import CryptoJS from "crypto-js";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { AddRebate } from "../../modals/create-app-stepper/AddRebate";

type Props = {
  studentId: string | null;
};

interface ApplicationData {
  id: any;
  student_id: any;
  part_payment: any;
  has_transactions: boolean | undefined;
  group_name: string;
  pending_amount: number;
  student_fees_master_id: number;
  fee_group_id: number;
  invoice_number: string;
  fee_group_name: string;
  fee_session_group_id: string;
  total_amount: number;
  due_date: string;
  status: string;
  fine_amount: number;
  fine_type: string;
}

interface StudentDetails {
  name: string;
  class: string;
  section: string;
  roll_no: number;
}

const TablesWidget69 = ({ studentId }: Props) => {
  const [data, setData] = useState<ApplicationData[]>([]);
  const [selectedGroupData, setSelectedGroupData] =
    useState<ApplicationData | null>(null);

  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(
    null
  );

  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const sessionId = currentUser?.session_id;
  const role = currentUser?.role_name;
  const userId = currentUser?.id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedInoviceNo, setSelectedInoviceNo] = useState<string | null>("");
  const [isCollectOfflineModalOpen, setIsCollectOfflineModalOpen] =
    useState(false);
  const [rebateModalOpen, setRebateModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [checkedPartPayment, setCheckedPartPayment] = useState({});
  const [changedPartPayment, setChangedPartPayment] = useState({});
  const [paymentGatewayDetails, setPaymentGatewayDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const Navigate = useNavigate();
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentUrl = `${DOMAIN}/api/school/get-studentdetails/${studentId}`;
        const response = await fetch(studentUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch student details");
        }

        const result = await response.json();
        setStudentDetails(result);
      } catch (error) {
        console.error("Error fetching student details:", error);
        toast.error("Error fetching student details.");
      }
    };

    const fetchFeeGroupType = async () => {
      try {
        const url = `${DOMAIN}/api/school/get-feesgroup/${schoolId}/${studentId}/${sessionId}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Network response was not ok for URL: ${url}`);
        }

        const result = await response.json();

        if (result && result.data) {
          // console.log(result.data);
          setData(result.data);
          const initialPartialChecked = result.data.reduce(
            (acc: { [key: string]: boolean }, student: ApplicationData) => {
              acc[student.fee_group_id] = !!student.part_payment;
              return acc;
            },
            {}
          );
          setCheckedPartPayment(initialPartialChecked);
          setRefresh(false);
        } else {
          console.error("Unexpected response structure:", result);
          toast.error("Unexpected response structure received.");
        }
      } catch (error) {
        console.error("Error fetching fee group/type data:", error);
        toast.error("Error fetching fee group/type data.");
      }
    };

    if (studentId) {
      fetchStudentData();
      fetchFeeGroupType();
    }
  }, [schoolId, sessionId, studentId, refresh, changedPartPayment]);

  useEffect(() => {
    const fetchPaymentGateway = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${DOMAIN}/api/school/get-active-payment-gateway/${schoolId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPaymentGatewayDetails(data.paymentGateways[0]);
      } catch (err) {
        setError(err.message || "Failed to fetch payment gateway details.");
      } finally {
        setLoading(false);
      }
    };

    if (schoolId) {
      fetchPaymentGateway();
    } else {
      console.error("School ID is required.");
      setLoading(false);
    }
  }, [schoolId]);

  const openModal = (invoice_number: string) => {
    setSelectedInoviceNo(invoice_number);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInoviceNo(null);
  };

  const openCollectOfflineModal = (groupId: number) => {
    setSelectedGroupId(groupId);
    setIsCollectOfflineModalOpen(true);
  };

  const closeCollectOfflineModal = () => {
    setIsCollectOfflineModalOpen(false);
    setSelectedGroupId(null);
  };
  const openRebateModal = (groupId: number) => {
    setSelectedGroupId(groupId);
    const groupDetails =
      data.find((group) => group.fee_group_id === groupId) || null;
    setSelectedGroupData(groupDetails);

    setRebateModalOpen(true);
  };

  const closeRebateModal = () => {
    setRebateModalOpen(false);
    setSelectedGroupId(null);
  };

  const handleBack = () => {
    Navigate(-1);
  };

  const secretKey = import.meta.env.VITE_SYSTEM_KEY;
  const FrontDomain = paymentGatewayDetails?.front_domain;

  const createPaymentLink = (groupId: number, part_payment: any) => {
    const dataToEncrypt = {
      student_id: studentId,
      school_id: schoolId,
      group_id: groupId,
      session_id: sessionId,
      process_type: "existing",
      payment_type: part_payment === 0 ? "full" : "partial",
    };
    const className = studentDetails?.class_name

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      secretKey
    ).toString();

    const paymentUrl = `${FrontDomain}fee-payment?school_id=${schoolId}&session_id=${sessionId}&class_name=${className}&data=${encodeURIComponent(
      encryptedData
    )}`;

    navigator.clipboard
      .writeText(paymentUrl)
      .then(() => {
        toast.success("Payment link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy the payment link: ", err);
        toast.error("Failed to copy the payment link.");
      });
  };

  // const sendPaymentReminder = async (studentId: number) => {`
  //   // Get the current date
  //   const startDate = new Date();

  //   // Calculate the end date (3 days from the start date)
  //   const endDate = new Date();
  //   endDate.setDate(startDate.getDate() + 3);

  //   // Format the dates as ISO strings (or any required format)
  //   const formattedStartDate = startDate.toISOString();
  //   const formattedEndDate = endDate.toISOString();

  //   // Define the payload to send to the server
  //   const payload = {
  //     title: "Fee Reminder",
  //     message: "Kindly pay your fees.",
  //     studentId: studentId,
  //     sessionId: sessionId,
  //     schoolId: schoolId,
  //     startDate: formattedStartDate,
  //     endDate: formattedEndDate,
  //     userId: userId,
  //     role: role,
  //   };

  //   try {
  //     // Send the fee reminder data to the specified URL
  //     const response = await fetch(
  //       `${DOMAIN}/api/student/fee-reminder-for-student`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     if (response.ok) {
  //       const result = await response.json();
  //       toast.success("Fee reminder successfully sent!");
  //     } else {
  //       console.error("Failed to send the fee reminder: ", response.statusText);
  //       toast.error("Failed to send the fee reminder.");
  //     }
  //   } catch (error) {
  //     console.error("Error while sending the fee reminder: ", error);
  //     toast.error("Error while sending the fee reminder.");
  //   }
  // };

  // const handlePartialCheck = async (student: ApplicationData) => {
  //   if (student.has_transactions) return;

  //   // Toggle the checked state of the student (part_payment)
  //   const updatedCheckedState = {
  //     ...checkedPartPayment,
  //     [student.fee_group_id]: !checkedPartPayment[student.fee_group_id],
  //   };

  //   setCheckedPartPayment(updatedCheckedState);

  //   setChangedPartPayment((prev) => {
  //     const newState = { ...prev };

  //     if (newState.hasOwnProperty(student.fee_group_id)) {
  //       // If the fee_group_id already exists, remove it (uncheck the box)
  //       delete newState[student.fee_group_id];
  //     } else {
  //       // If the fee_group_id doesn't exist, toggle it based on the previous value
  //       const previousPartPayment = updatedCheckedState[student.fee_group_id]
  //         ? false
  //         : true;  // Toggle part_payment (if checked is true, set to false and vice versa)
  //       newState[student.fee_group_id] = previousPartPayment;
  //     }

  //     return newState;
  //   });

  //   // Ensure that the part_payment is correctly obtained from the updated state
  //   const part_payment = changedPartPayment[student.fee_group_id]; // This should now reflect the updated state
  // console.log(part_payment);

  //   const partPaymentUpdates = [{
  //     studentId: student.student_id,  // Make sure to use the student.id here
  //     part_payment: part_payment,  // Ensure part_payment is a boolean
  //     schoolId: schoolId,
  //     feeGroupId: student.fee_group_id,
  //   }];

  //   return;
  //   try {
  //     const response = await fetch(`${DOMAIN}/api/school/update-partpayment`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(partPaymentUpdates),
  //     });

  //     const data = await response.json();

  //     if (data.message !== "Part payment updated successfully") {
  //       toast.error("Failed to update part payment status");
  //     }
  //     setChangedPartPayment(false);
  //   } catch (error) {
  //     console.error("Error updating part payment:", error);
  //     toast.error("An error occurred while updating part payment");
  //   }
  // };

  // console.log(changedPartPayment);

  const handlePartialCheck = async (student: ApplicationData) => {
    if (student.has_transactions) return;

    // Check if the fee group ID is already in changedPartPayment
    setChangedPartPayment((prev) => {
      const newState = { ...prev };
      const feeGroupId = student.fee_group_id;

      if (newState[feeGroupId]) {
        // If the fee group ID is already in changedPartPayment, remove it
        delete newState[feeGroupId];
      } else {
        // If it's not in changedPartPayment, add it with the opposite of the checked state
        newState[feeGroupId] = !checkedPartPayment[feeGroupId];
      }

      // Call the API with the updated state
      const part_payment = newState[feeGroupId];
      // Make the API call only if the status has changed
      fetch(`${DOMAIN}/api/school/update-partpayment-single`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.student_id,
          part_payment: part_payment,
          feeGroupId: student.fee_group_id,
          schoolId: schoolId,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            // If the response is not OK, throw an error
            throw new Error("Failed to update part payment");
          }
          return response.json();
        })
        .then((data) => {
          if (data.message === "Part payment updated successfully") {
            // Success: Show success toast
            toast.success("Part payment updated successfully.");
          } else {
            // Error: Show an error toast
            toast.error("Failed to update part payment status.");
          }
          setChangedPartPayment({}); // Reset state after success
        })
        .catch((error) => {
          // Handle errors, both network and API errors
          setChangedPartPayment({}); // Reset state on error
          console.error("Error updating part payment:", error);
          toast.error("An error occurred while updating part payment.");
        });

      return newState;
    });
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
        <h2>Fees Details</h2>
      </div>

      {/* Student Details Section */}
      <div
        className="student-details"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          marginTop: "20px",
          fontFamily: "Manrope",
          color: "#1C335C",
        }}
      >
        {studentDetails ? (
          <>
            <h3
              style={{
                fontWeight: "600",
                color: "#1C335C",
                fontSize: "18px",
                marginBottom: "10px",
              }}
            >
              Student Details
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                fontSize: "14px",
              }}
            >
              <div style={{ flex: "1 1 30%", marginBottom: "10px" }}>
                <strong>Student Id:</strong>{" "}
                {studentDetails.student_id || "N/A"}
              </div>
              <div style={{ flex: "1 1 30%", marginBottom: "10px" }}>
                <strong>Name:</strong>{" "}
                {studentDetails.firstname + " " + studentDetails.lastname ||
                  "N/A"}
              </div>
              <div style={{ flex: "1 1 30%", marginBottom: "10px" }}>
                <strong>Email Id:</strong> {studentDetails.email || "N/A"}
              </div>
              <div style={{ flex: "1 1 30%", marginBottom: "10px" }}>
                <strong>Mobile No.:</strong> {studentDetails.mobileno || "N/A"}
              </div>
              <div style={{ flex: "1 1 30%", marginBottom: "10px" }}>
                <strong>{schoolId === "AMO-2509097151" ? "Group :" : "Class :"}</strong> {studentDetails.class_name || "N/A"}
              </div>
              <div style={{ flex: "1 1 30%", marginBottom: "10px" }}>
                <strong>{schoolId === "AMO-2509097151" ? "Batch :" : "Section :"} </strong> {studentDetails.section_name || "N/A"}
              </div>
              <div style={{ flex: "1 1 30%", marginBottom: "10px" }}>
                <strong>Academic Year:</strong>{" "}
                {studentDetails.session_name || "N/A"}
              </div>
            </div>
          </>
        ) : (
          <p>Loading student details...</p>
        )}
      </div>

      {/* Fee Collection Table */}
      <div
        className="modal-body py-lg-5 px-lg-5"
        style={{ backgroundColor: "#F2F6FF", fontFamily: "Manrope" }}
      >
        <div style={{ overflowX: "auto", position: "relative" }}>
          <table
            className="table table-striped"
            style={{ minWidth: "2000px" }}
            // style={{
            //   width: "100%",
            //   borderCollapse: "collapse",
            //   marginTop: "10px",
            //   backgroundColor: "#FFFFFF",
            //   borderRadius: "12px",
            //   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
            // }}
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
                    padding: "12px 20px",
                    textAlign: "left",
                    position: "sticky",
                    left: 0, // First column sticks at left: 0
                    background: "#fff",
                    zIndex: 99,
                  }}
                >
                  Invoice No
                </th>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                    position: "sticky",
                    left: "150px", // Second column sticks next to the first
                    background: "#fff",
                    zIndex: 99,
                  }}
                >
                  Fee Group
                </th>
                <th style={{ padding: "12px 20px", textAlign: "center" }}>
                  Fee Amount
                </th>
                <th style={{ padding: "12px 20px", textAlign: "center" }}>
                  Paid Amount
                </th>
                <th style={{ padding: "12px 20px", textAlign: "left" }}>
                  Due Date
                </th>
                <th style={{ padding: "12px 20px", textAlign: "left" }}>
                  Due Type
                </th>
                <th style={{ padding: "12px 20px", textAlign: "center" }}>
                  Status
                </th>
                <th style={{ padding: "12px 20px", textAlign: "center" }}>
                {schoolId?.slice(0, 3) === "INN" ? "Administrative Charges" : "Fine Amount"}
                </th>
                <th style={{ padding: "12px 20px", textAlign: "center" }}>
                  Rebate Amount
                </th>
                <th style={{ padding: "12px 20px", textAlign: "center" }}>
                  Pending Amount
                </th>

                <th style={{ padding: "12px 20px", textAlign: "center" }}>
                  View Transactions
                </th>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                  }}
                >
                  Allow 60%
                </th>
                <th style={{ padding: "12px 20px", textAlign: "center" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                const currentDate = new Date();
                const dueDate = item.due_date ? new Date(item.due_date) : null;
                const isOverdue =
                  dueDate && currentDate > dueDate && item.status !== "paid"; // Only mark overdue if not paid

                // Row Background Color Logic
                const rowBackgroundColor =
                  item.status === "paid"
                    ? "rgba(200, 200, 200, 0.3)" // Light Gray for Paid
                    : isOverdue
                    ? "rgba(255, 204, 204, 0.6)" // Light Red for Overdue
                    : item.fee_group_id % 2 === 0
                    ? "rgb(242, 246, 255)" // Alternate light blue
                    : "#FFFFFF"; // Default white

                // Status Badge Styles
                const statusStyles = {
                  paid: { backgroundColor: "#4CAF50", color: "white" }, // Green for Paid
                  partial: { backgroundColor: "#FFC107", color: "black" }, // Yellow for Partial
                  pending: { backgroundColor: "#F44336", color: "white" }, // Red for Pending
                };

                return (
                  <tr
                    key={item.fee_group_id}
                    style={{
                      backgroundColor: rowBackgroundColor,
                      borderBottom: "1px solid #E0E4F0",
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      color: "#1C335C",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 20px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                        position: "sticky",
                        left: 0, // Same as the header
                        background: "#fff",
                        zIndex: 99,
                      }}
                    >
                      {item.invoice_number || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                        position: "sticky",
                        left: "150px", // Same as the header
                        background: "#fff",
                        zIndex: 99,
                      }}
                    >
                      {item.group_name || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                        textAlign: "center",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {currentUser?.currency_symbol + " " + item.total_amount}
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                        textAlign: "center",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {currentUser?.currency_symbol +
                        " " +
                        Number(item.amount_paid).toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {dueDate ? dueDate.toLocaleDateString() : "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.due_type || "N/A"}
                    </td>

                    {/* Status with Background Color */}
                    <td
                      style={{
                        padding: "12px 20px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "Manrope",
                          ...statusStyles[item.status.toLowerCase()],
                        }}
                      >
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}{" "}
                        {/* Capitalizing first letter */}
                      </span>
                    </td>

                    {/* Fine Amount & Days Overdue */}
                    <td
                      style={{
                        padding: "12px 20px",
                        textAlign: "center",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      <div>
                        +{" "}
                        {currentUser?.currency_symbol +
                          " " +
                          (item.status === "paid" ? 0 : item.fine_amount || 0)}
                      </div>

                      {isOverdue && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#FF0000",
                            fontFamily: "Manrope",
                            fontWeight: "500",
                          }}
                        >
                          {item.days_late} days overdue
                        </div>
                      )}
                    </td>

                    <td
                      style={{
                        padding: "12px 20px",
                        textAlign: "center",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      -{" "}
                      {currentUser?.currency_symbol +
                        " " +
                        Number(item.status === "paid" ? 0 : item.rebate_amount).toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                        textAlign: "center",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {currentUser?.currency_symbol +
                        " " +
                        Number(item.pending_amount).toFixed(2)}
                    </td>

                    <td
                      style={{
                        textAlign: "center",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      <i
                        className="fas fa-eye"
                        style={{ cursor: "pointer" }}
                        onClick={() => openModal(item.invoice_number)}
                      ></i>
                    </td>

                    <td
                      style={{
                        textAlign: "center",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      <Form.Check
                        type="switch"
                        checked={
                          changedPartPayment[item.fee_group_id] !== undefined
                            ? changedPartPayment[item.fee_group_id]
                            : checkedPartPayment[item.fee_group_id]
                        }
                        onChange={() => handlePartialCheck(item)}
                        disabled={item.has_transactions || item.status === 'paid'}
                        style={{ padding: "2px", textAlign: "center" }}
                      />
                    </td>

                    <td
                      style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "right",
                        alignItems: "center",
                        padding: "12px 10px",
                        border: "none",
                      }}
                    >
                      {/* Collect Offline Button */}
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip1`}>Manage Rebate</Tooltip>
                        }
                      >
                        <div
                          onClick={() =>
                            item.status !== "paid" &&
                            openRebateModal(item.fee_group_id)
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px",
                            backgroundColor:
                              item.status === "paid" ? "#A9A9A9" : "#1C335C",
                            borderRadius: "8px",
                            cursor:
                              item.status === "paid"
                                ? "not-allowed"
                                : "pointer",
                            transition: "background-color 0.3s",
                          }}
                        >
                          <i
                            className="fas fa-cash-register"
                            style={{ color: "white", padding: "5px 4px" }}
                          />
                        </div>
                      </OverlayTrigger>

                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip2`}>Collect Offline</Tooltip>
                        }
                      >
                        <div
                          onClick={() =>
                            item.status !== "paid" &&
                            openCollectOfflineModal(item.fee_group_id)
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px",
                            backgroundColor:
                              item.status === "paid" ? "#A9A9A9" : "#1C335C",
                            borderRadius: "8px",
                            cursor:
                              item.status === "paid"
                                ? "not-allowed"
                                : "pointer",
                            transition: "background-color 0.3s",
                          }}
                        >
                          <i
                            className="fas fa-coins"
                            style={{ color: "white", padding: "5px 4px" }}
                          />
                        </div>
                      </OverlayTrigger>

                      {/* Create Link Button */}
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip3`}>Create Link</Tooltip>}
                      >
                        <div
                          onClick={() =>
                            item.status !== "paid" &&
                            paymentGatewayDetails &&
                            createPaymentLink(
                              item.fee_group_id,
                              item.part_payment
                            )
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px",
                            backgroundColor:
                              item.status === "paid" || !paymentGatewayDetails
                                ? "#A9A9A9"
                                : "#4CAF50",
                            borderRadius: "8px",
                            cursor:
                              item.status === "paid" || !paymentGatewayDetails
                                ? "not-allowed"
                                : "pointer",
                            transition: "background-color 0.3s",
                          }}
                        >
                          <i
                            className="fas fa-link"
                            style={{ color: "white", padding: "5px 2px" }}
                          />
                        </div>
                      </OverlayTrigger>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr>
                <td
                  colSpan={16}
                  style={{
                    padding: "12px 20px",
                    textAlign: "right",
                    fontWeight: "600",
                    fontSize: "14px",
                    color: "#1C335C",
                  }}
                >
                  Total Items: {data.length}
                </td>
              </tr>
            </tfoot>
          </table>
          <ShowTransactions
            // studentFeesMasterId={studentFeesMasterId}
            show={isModalOpen}
            onHide={closeModal}
            selectedInoviceNo={selectedInoviceNo} />
          <CollectOfflineFees
            show={isCollectOfflineModalOpen}
            handleClose={closeCollectOfflineModal}
            studentId={studentId}
            groupId={selectedGroupId}
            setRefresh={setRefresh}
          />
          <AddRebate
            show={rebateModalOpen}
            handleClose={closeRebateModal}
            selectedGroupData={selectedGroupData}
            setRefresh={setRefresh}
          />
        </div>
      </div>
    </div>
  );
};

export { TablesWidget69 };
