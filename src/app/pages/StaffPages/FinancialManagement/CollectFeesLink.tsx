import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";
import axios from "axios";
import "./CollectFeesLink.css";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import { EncryptDecrypt } from "./EncryptDecrypt";

const CollectFeesLink: React.FC = () => {
  const location = useLocation();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );

  const [studentDetails, setStudentDetails] =
    React.useState<StudentDetails | null>(null);

  const [schoolDetails, setSchoolDetails] =
    React.useState<SchoolDetails | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [feesDetails, setFeesDetails] = useState<any>(null);
  const [hasPendingTransaction, setPendingTransaction] = useState<any>(null);
  const [currentlyPayingAmount, setCurrentlyPayingAmount] = useState<number>(0);
  const [fineAmount, setFineAmount] = useState<number>(0);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [rebateAmount, setRebateAmount] = useState<number>(0);
  const [class_id, setClass_id] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<string>("full");
  const [loading, setLoading] = useState<boolean>(true);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [paymentGatewayDetails, setPaymentGatewayDetails] = useState(null);

  // Fetch environment variables for encryption
  const RouterDomain = paymentGatewayDetails?.router_domain || "";
  const username = paymentGatewayDetails?.username || "";
  const password = paymentGatewayDetails?.password || "";
  const merchant_code = paymentGatewayDetails?.merchant_code || "";
  const privateKey = paymentGatewayDetails?.private_key || "";
  const privateValue = paymentGatewayDetails?.private_value || "";
  // const secretKey = paymentGatewayDetails?.secret_key || "";
  const secretKey = import.meta.env.VITE_SYSTEM_KEY;
  const queryParams = new URLSearchParams(location.search);
  const encryptedData = queryParams.get("data");
  const schoolId = queryParams.get("school_id");
  const unsanitizedClassName = queryParams.get("class_name"); // Fetching the class name from the URL
  const [isMaintenance, setIsMaintenance] = useState(false);
  const toggleMaintenance = () => setIsMaintenance((prev) => !prev);

  const className = unsanitizedClassName
    ? decodeURIComponent(unsanitizedClassName).toLowerCase().replace(/\s+/g, "")
    : ""; // Return empty string if class_name is null or undefined

  useEffect(() => {
    const fetchPaymentGateway = async () => {
      try {
        setLoading(true);
        let response;
        if (schoolId?.slice(0, 3) === "INN") {
          response = await fetch(
            `${DOMAIN}/api/school/get-checkout-gateway/${schoolId}/${className}`
          );
        } else {
          response = await fetch(
            `${DOMAIN}/api/school/get-active-payment-gateway/${schoolId}`
          );
        }
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
      setError("School ID is required.");
      setLoading(false);
    }
  }, [schoolId, paymentDetails]);

  useEffect(() => {
    if (encryptedData && secretKey) {
      try {
        const bytes = CryptoJS.AES.decrypt(
          decodeURIComponent(encryptedData),
          secretKey
        );
        const decryptedData = JSON.parse(
          bytes.toString(CryptoJS.enc.Utf8)
        ) as PaymentDetails;
        setPaymentDetails(decryptedData);
      } catch (error) {
        console.error("Error decrypting data:", error);
      }
    }
  }, [location.search, secretKey]);

  useEffect(() => {
    if (paymentDetails) {
      const fetchSchoolsDetails = async () => {
        const school_id = paymentDetails.school_id;
        try {
          setLoading(true);
          const response = await axios.get<SchoolDetails>(
            `${DOMAIN}/get-schooldetails/${school_id}`
          );

          if (response.status === 200 && response.statusText === "OK") {
            setSchoolDetails(response.data);

            const logoResponse = await fetch(
              `${DOMAIN}/api/school/get_school_logo`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  school_logo: response.data.school_logo,
                }),
              }
            );

            if (!logoResponse.ok) {
              throw new Error("Failed to fetch logo");
            }

            const blob = await logoResponse.blob();
            const imageObjectURL = URL.createObjectURL(blob);
            setLogo(imageObjectURL);
          } else {
            throw new Error(
              `Unexpected response status: ${response.status} ${response.statusText}`
            );
          }
        } catch (error) {
          setError(error as Error);
          console.error("Error fetching school details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchSchoolsDetails();

      const fetchStudentDetails = async () => {
        try {
          setLoading(true);
          const { student_id, admissionEnquiryId } = paymentDetails;

          let url = "";
          if (student_id) {
            url = `${DOMAIN}/get-studentdetails/${student_id}`;
          } else if (admissionEnquiryId) {
            url = `${DOMAIN}/api/school/get-admission-enquiry-details/${admissionEnquiryId}`;
          } else {
            throw new Error(
              "Neither student_id nor admissionEnquiryId provided."
            );
          }

          const response = await axios.get(url);

          if (response.status === 200 && response.statusText === "OK") {
            setStudentDetails(response.data);
            if (admissionEnquiryId) {
              setClass_id(response?.data.data.class_id);
              setStudentDetails(response?.data?.data);
            }
          } else {
            throw new Error(
              `Unexpected response status: ${response.status} ${response.statusText}`
            );
          }
        } catch (error) {
          setError(error as Error);
          console.error("Error fetching student details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchStudentDetails();

      const fetchPaymentDetails = async () => {
        try {
          setLoading(true);
          const {
            school_id,
            session_id,
            student_id,
            group_id,
            admissionEnquiryId,
          } = paymentDetails;

          let url = "";
          if (student_id) {
            url = `${DOMAIN}/get-feestransactions/${school_id}/${session_id}/${student_id}/${group_id}`;
          } else if (admissionEnquiryId) {
            url = `${DOMAIN}/get-admission-enquiry-fees/${school_id}/${session_id}/${class_id}/${group_id}`;
          } else {
            throw new Error(
              "Neither student_id nor admissionEnquiryId provided."
            );
          }

          const response = await axios.get(url);

          setFeesDetails(response.data);
          setRebateAmount(response.data.total_rebate_amount || 0);
          setFineAmount(response.data.fine_amount || 0);
          setInvoiceNumber(response.data.invoice_number || 0);
          setCurrentlyPayingAmount(
            Number(response.data.total_pending_amount) +
              Number(response.data.fine_amount || 0) -
              Number(response.data.total_rebate_amount || 0)
          );
          setPendingTransaction(response.data.has_pending_transaction);
        } catch (error) {
          setError(error as Error);
          console.error("Error fetching payment details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPaymentDetails();
    }
  }, [paymentDetails, class_id]);

  const handlePaymentTypeChange = (type: string) => {
    setPaymentType(type);
    if (type === "partial") {
      setCurrentlyPayingAmount(feesDetails.total_pending_amount * 0.6); // Set 60% for partial payment
    } else {
      setCurrentlyPayingAmount(feesDetails.total_pending_amount); // Set full amount
    }
  };

  if (loading) {
    return (
      <div className="message-container">
        <div className="message-box">
          <h4>Loading...</h4>
          <p>Please wait while we fetch your payment details.</p>
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="message-container">
  //       <div className="message-box">
  //         <h4>Error</h4>
  //         <p>
  //           There was an error fetching payment details. Please try again later.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  if (!paymentDetails) {
    return (
      <div className="message-container">
        <div className="message-box">
          <h4>No Details</h4>
          <p>No payment details are available at this time.</p>
        </div>
      </div>
    );
  }

  const handleOnlineTransactions = async () => {
    if (!paymentDetails || !studentDetails) return;
    setButtonLoading(true);

    const { student_id, admissionEnquiryId, school_id, session_id, group_id } =
      paymentDetails;
    try {
      // Determine the URL based on the presence of admissionEnquiryId or student_id
      const url = admissionEnquiryId
        ? `${DOMAIN}/api/school/initiate-admission-transaction`
        : `${DOMAIN}/api/school/initiate-transaction`;

      // Prepare the request body
      const requestBody = {
        school_id,
        session_id,
        fee_group_id: group_id,
        payment_type: paymentType,
        total_amount: currentlyPayingAmount,
        fineAmount: fineAmount,
        rebateAmount: rebateAmount,
        invoice_number: invoiceNumber,
      };

      // Add the appropriate ID to the request body
      if (admissionEnquiryId) {
        requestBody.admissionEnquiryId = admissionEnquiryId;
      } else if (student_id) {
        requestBody.student_id = student_id;
      }

      // Use await to handle the async fetch call
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Check if the response is not ok
      if (!response.ok) {
        throw new Error("Failed to initiate transaction");
      }

      // Parse the JSON response body
      const data = await response.json();

      // Check if the transaction_id exists in the response
      if (data.transaction_id) {
        const transactionId = data.transaction_id;

        // Proceed to payment gateway
        handleProceedToPayment(transactionId);
      } else {
        throw new Error("Transaction ID not found in response");
      }
    } catch (error) {
      console.error("Error initiating transaction:", error);
      // setError(error);
    }
  };

  // const URLS = {
  //   full: {
  //     existing: {
  //       success: paymentGatewayDetails?.url_success+`_full_exist_${schoolId}`,
  //       fail: paymentGatewayDetails?.url_fail+`_full_exist_${schoolId}`,
  //     },
  //     new: {
  //       success: paymentGatewayDetails?.url_success+`_full_new_${schoolId}`, // Full but new treated as half success
  //       fail: paymentGatewayDetails?.url_fail+`_full_new_${schoolId}`,
  //     },
  //   },
  //   partial: {
  //     existing: {
  //       success: paymentGatewayDetails?.url_success+`_half_exist_${schoolId}`,
  //       fail: paymentGatewayDetails?.url_fail+`_half_exist_${schoolId}`,
  //     },
  //     new: {
  //       success: paymentGatewayDetails?.url_success+`_half_new_${schoolId}`,
  //       fail: paymentGatewayDetails?.url_fail+`_half_new_${schoolId}`,
  //     },
  //   },
  // };

  const URLS = {
    full: {
      existing: {
        normal: {
          success:
            paymentGatewayDetails?.url_success + `_full_exist_${schoolId}`,
          fail: paymentGatewayDetails?.url_fail + `_full_exist_${schoolId}`,
        },
        promote: {
          success:
            paymentGatewayDetails?.url_success +
            `_full_exist_promote_${schoolId}`,
          fail:
            paymentGatewayDetails?.url_fail + `_full_exist_promote_${schoolId}`,
        },
      },
      new: {
        normal: {
          success: paymentGatewayDetails?.url_success + `_full_new_${schoolId}`,
          fail: paymentGatewayDetails?.url_fail + `_full_new_${schoolId}`,
        },
        promote: {
          success:
            paymentGatewayDetails?.url_success +
            `_full_new_promote_${schoolId}`,
          fail:
            paymentGatewayDetails?.url_fail + `_full_new_promote_${schoolId}`,
        },
      },
    },
    partial: {
      existing: {
        normal: {
          success:
            paymentGatewayDetails?.url_success + `_half_exist_${schoolId}`,
          fail: paymentGatewayDetails?.url_fail + `_half_exist_${schoolId}`,
        },
        promote: {
          success:
            paymentGatewayDetails?.url_success +
            `_half_exist_promote_${schoolId}`,
          fail:
            paymentGatewayDetails?.url_fail + `_half_exist_promote_${schoolId}`,
        },
      },
      new: {
        normal: {
          success: paymentGatewayDetails?.url_success + `_half_new_${schoolId}`,
          fail: paymentGatewayDetails?.url_fail + `_half_new_${schoolId}`,
        },
        promote: {
          success:
            paymentGatewayDetails?.url_success +
            `_half_new_promote_${schoolId}`,
          fail:
            paymentGatewayDetails?.url_fail + `_half_new_promote_${schoolId}`,
        },
      },
    },
  };

  const handleProceedToPayment = (transactionId: string) => {
    const customerName = studentDetails?.student_name || "Unknown";
    const txnId = transactionId;
    const txnAmt = currentlyPayingAmount || "0.00";
    const pmno = studentDetails?.mobileno || "0000000000";
    const pemail = studentDetails?.email || "unknown@example.com";
    const settlementSplit = `online_${txnAmt}~`;

    // const processType = paymentDetails?.process_type;

    // const payment_type = paymentType;

    // // Access URLS based on conditions
    // const successURL = URLS[payment_type][processType]?.success;
    // const failURL = URLS[payment_type][processType]?.fail;

    const processType = paymentDetails?.process_type; // "full" or "partial"
    const paymentType = paymentDetails?.payment_type; // "existing" or "new"

    // Check if "promote" exists in paymentDetails; if not, default to "normal"
    const promoteType =
      paymentDetails?.promote === "yes" ? "promote" : "normal";

    const successURL =
      URLS[paymentType]?.[processType]?.[promoteType]?.success ||
      URLS[paymentType]?.[processType]?.normal?.success;
    const failURL =
      URLS[paymentType]?.[processType]?.[promoteType]?.fail ||
      URLS[paymentType]?.[processType]?.normal?.fail;

    // Construct URL for the payment gateway
    const RouterUrl = `?mcode=${merchant_code}&uname=${username}&psw=${password}&amount=${txnAmt}&settlement_split=${settlementSplit}&mtxnId=${txnId}&pfname=${customerName}&plname=&pmno=${pmno}&pemail=${pemail}&padd=&surl=${successURL}&furl=${failURL}&udf6=`; // Encrypt the URL
    const encryptedRouterUrl = EncryptDecrypt.encrypt(
      RouterUrl,
      privateValue,
      privateKey
    );
    // Final URL to redirect to the payment gateway
    const finalRouterUrl = `${RouterDomain}?query=${encodeURIComponent(
      encryptedRouterUrl
    )}&mcode=${merchant_code}`;

    window.location.href = finalRouterUrl;
  };

  return (
    <div
      className="checkout-page"
      style={{
        fontFamily: "Manrope",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Center the card vertically and horizontally
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {isMaintenance ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            maxWidth: "600px",
            width: "100%",
          }}
        >
          <h2 style={{ color: "#ff4444", marginBottom: "20px" }}>
            🚧 Site Under Maintenance
          </h2>
          <p style={{ fontSize: "18px", color: "#555" }}>
            We're currently performing scheduled maintenance. Please try again
            later.
          </p>
          {/* <button
            onClick={toggleMaintenance}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Disable Maintenance Mode (Admin)
          </button> */}
        </div>
      ) : (
        <>
          <style>
            {`
        .checkout-card {
          width: 100%;
          max-width: 600px; /* Limit the max width for larger screens */
          border-radius: 16px;
          background-color: #fff;
          padding: 20px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }
  
        .student-info {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
  
        .student-info p {
          flex: 1 1 45%; /* Allow two items per row on small screens */
          margin-bottom: 10px;
          word-wrap: break-word;
        }
  
        .payment-summary {
          display: flex;
          justify-content: space-between; /* Align content in one line */
          align-items: center;
        }
  
        .payment-options {
          display: flex;
          flex-direction: row; /* Default row layout for larger screens */
          gap: 20px;
          align-items: flex-start;
        }
  
        @media (max-width: 768px) {
          .payment-options {
            flex-direction: column; /* Switch to column layout for smaller screens */
          }
  
          .checkout-card {
            padding: 15px; /* Reduce padding for smaller screens */
          }
  
          .btn-primary {
            font-size: 14px;
            padding: 10px;
          }
  
          h4 {
            font-size: 18px; /* Adjust header font size */
          }
        }
        

    @media (max-width: 768px) {
      .payment-summary {
        flex-wrap: wrap; /* Allow wrapping for smaller screens */
        justify-content: flex-start; /* Align items to the start */
        gap: 10px; /* Add spacing between lines */
      }

      .payment-summary p {
        flex: 1 1 100%; /* Each line takes full width on small screens */
        margin-bottom: 5px; /* Add some margin for spacing */
      }
    }
      `}
          </style>
          <div className="checkout-card">
            <header className="text-center mb-4">
              {logo ? (
                <img
                  src={logo}
                  alt="School Logo"
                  style={{
                    width: "100px",
                    height: "auto",
                    marginBottom: "10px",
                  }}
                />
              ) : (
                <p>No logo available</p>
              )}
              <h2 className="mt-3">
                {schoolDetails ? schoolDetails.name : ""}
              </h2>
              <p className="text-muted">
                {schoolDetails ? schoolDetails.tagline : ""}
              </p>

              {schoolDetails && schoolDetails.address && (
                <p className="mt-2">
                  <strong>Address:</strong> {schoolDetails.address}
                </p>
              )}
              {schoolDetails && schoolDetails.email && (
                <p className="mt-1">
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${schoolDetails.email}`}>
                    {schoolDetails.email}
                  </a>
                </p>
              )}
            </header>

            <div>
              <h4 className="text-center mt-6 mb-4">
                Checkout - Payment Details
              </h4>
              <div>
                <h5 className="mb-3">Student Information</h5>
                <div className="student-info">
                  <div>
                    <p>
                      <strong>Admission No.:</strong>{" "}
                      {studentDetails?.admission_no}
                    </p>
                    <p>
                      <strong>Name:</strong> {studentDetails?.student_name}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Email:</strong> {studentDetails?.email}
                    </p>
                    <p>
                      <strong>Number:</strong> {studentDetails?.mobileno}
                    </p>
                  </div>
                </div>

                <div
                  className="divider my-4"
                  style={{ borderBottom: "1px solid #ddd" }}
                ></div>

                <h5 className="mb-3">Payment Summary</h5>
                <div
                  className="payment-summary"
                  style={{ display: "flex", alignItems: "start" }}
                >
                  <p>
                    <strong>Fee Name:</strong> {feesDetails?.fee_group_name}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>
                      <strong>Amount:</strong> ₹
                      {feesDetails?.total_pending_amount}
                    </p>
                    <p>
                      <strong>
                        {" "}
                        {paymentDetails?.school_id?.slice(0, 3) === "INN"
                          ? "Administrative Charges"
                          : "Fine Amount"}
                        :
                      </strong>
                      + ₹
                      {paymentDetails.process_type === "new"
                        ? 0
                        : feesDetails?.fine_amount}
                    </p>
                    <p>
                      <strong>Rebate Amount:</strong>- ₹
                      {paymentDetails.process_type === "new"
                        ? 0
                        : feesDetails?.total_rebate_amount || 0}
                    </p>
                    <p>
                      <strong>Total Amount:</strong> ₹{currentlyPayingAmount}
                    </p>
                  </div>
                </div>
                <div></div>

                {paymentDetails?.payment_type === "partial" && (
                  <div className="mb-3 mt-3">
                    <h5>Payment Options</h5>
                    <div className="payment-options">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          fontFamily: "Manrope",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        <input
                          type="radio"
                          id="full"
                          name="paymentType"
                          value="full"
                          checked={paymentType === "full"}
                          onChange={() => handlePaymentTypeChange("full")}
                          defaultChecked
                        />
                        <label htmlFor="full">Full Payment</label>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          fontFamily: "Manrope",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        <input
                          type="radio"
                          id="partial"
                          name="paymentType"
                          value="partial"
                          checked={paymentType === "partial"}
                          onChange={() => handlePaymentTypeChange("partial")}
                        />
                        <label htmlFor="partial">Partial Payment (60%)</label>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className="mb-3"
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  <label className="mb-3">Currently Paying Amount:</label>
                  <input
                    type="text"
                    className="form-control"
                    // value={`₹${currentlyPayingAmount.toFixed(2)}`}
                    value={`₹${currentlyPayingAmount}`}
                    disabled
                    style={{ opacity: 0.8, color: "#505050" }}
                  />
                </div>

                {hasPendingTransaction === 1 ? (
                  <div
                    className="alert alert-info text-center"
                    style={{ fontSize: "16px" }}
                  >
                    ✅ You have already done the transaction for this.
                  </div>
                ) : (
                  <button
                    onClick={handleOnlineTransactions}
                    className="btn btn-primary w-100"
                    disabled={buttonLoading || currentlyPayingAmount <= 0}
                    style={{
                      fontSize: "16px",
                      padding: "12px",
                      borderRadius: "8px",
                    }}
                  >
                    {buttonLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Redirecting you to the payment gateway...
                      </>
                    ) : (
                      "Proceed to Payment"
                    )}
                  </button>
                )}

                {/* <div
                  className="alert alert-warning text-center mt-5"
                  style={{
                    fontSize: "16px",
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#fff3cd",
                    color: "#856404",
                    border: "1px solid #ffeeba",
                  }}
                >
                  <strong>Notice:</strong> Online payments are temporarily
                  unavailable due to scheduled updates. We apologize for the
                  inconvenience. Payment services will resume at{" "}
                  <strong>6:00 AM Tomorrow</strong>.
                </div> */}
                {hasPendingTransaction === 1 && (
                  <div
                    className="alert alert-warning text-center mt-5"
                    style={{
                      fontSize: "16px",
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "#F68537",
                      color: "#fff",
                      border: "1px solid #ffeeba",
                    }}
                  >
                    <strong>Note:</strong> You have already attempted two
                    payments, and both are currently pending. Please wait up to
                    4 hours for the system to automatically update your payment
                    status. This message will disappear once the payment is
                    confirmed or updated. If the issue continues beyond 4 hours,
                    please contact your school administration before retrying.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CollectFeesLink;
