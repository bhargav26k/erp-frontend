import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import { EncryptDecrypt } from "./EncryptDecrypt";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import "react-toastify/dist/ReactToastify.css";

import "./style-sheet.css";
import CryptoJS from "crypto-js";

const TransactionPage: React.FC = () => {
  const location = useLocation();

  // Extract the `status` query parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const combinedStatus = queryParams.get("status"); // status can be 'success' or 'fail'
  const parts = combinedStatus ? combinedStatus.split("_") : [];
  const [status, payment, process_type, schoolId, promote] = [
    parts[0] || null, // status (success/fail)
    parts[1] || null, // payment (full/partial)
    parts[2] || null, // process_type (existing/new)
    parts.length === 5 ? parts[4] : parts[3] || null, // schoolId
    parts.length === 5 ? parts[3] : "normal", // promote (defaults to "normal" if missing)
  ];
  const encryptedQuery = queryParams.get("query"); // Get encrypted query data

  // States
  const [decryptedData, setDecryptedData] = useState<any>(null);
  console.log(decryptedData);
  

  const [paymentGatewayDetails, setPaymentGateway] = useState(null);
  const [loadingGateway, setLoadingGateway] = useState<boolean>(true);
  const [loadingDb, setLoadingDb] = useState<boolean>(false);
  const [transactionResult, setTransactionResult] = useState<any>(null);

  const privateKey = paymentGatewayDetails?.private_key || "";
  const privateValue = paymentGatewayDetails?.private_value || "";

  useEffect(() => {
    const fetchPaymentGateway = async () => {
      if (!schoolId) {
        setLoadingGateway(false);
        return;
      }

      try {
        setLoadingGateway(true);
        const response = await fetch(
          `${DOMAIN}/api/school/get-active-payment-gateway/${schoolId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setPaymentGateway(data.paymentGateways[0]);
      } catch (err) {
        console.error("Error fetching payment gateway:", err);
      } finally {
        setLoadingGateway(false);
      }
    };

    fetchPaymentGateway();
  }, [schoolId]);

  useEffect(() => {
    if (encryptedQuery && privateKey && privateValue) {
      // Decrypt the data using the EncryptDecrypt class
      const decryptedText = EncryptDecrypt.decrypt(
        encryptedQuery,
        privateValue,
        privateKey
      );

      // Parse the decrypted data
      const decryptedValues = decryptedText
        .split("&")
        .reduce((acc: any, item: string) => {
          const [key, value] = item.split("=");
          acc[key] = value;
          return acc;
        }, {});

      setDecryptedData(decryptedValues);
    }
  }, [encryptedQuery, privateKey, privateValue]);

  useEffect(() => {
    const postTransactionData = async () => {
      if (!decryptedData || !payment || loadingGateway) return;

      setLoadingDb(true);

      const processType = process_type;
      const isPromoted = promote === "promote";

      const endpoint =
        processType === "new"
          ? "/api/school/process-admission-transaction-online"
          : isPromoted
          ? "/api/school/process-promote-transaction-online"
          : "/api/school/process-normal-transaction-online";

      try {
        const response = await fetch(`${DOMAIN}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transaction_id: decryptedData.mtxnId,
            payment,
            amount: decryptedData.amount,
            status: status === "fail" ? "cancelled" : decryptedData.status,
            pg_transaction_id: decryptedData.pgTransId,
            ref_transaction_id: decryptedData.transId,
            pay_instrument: decryptedData.payInstrument,
            pg_receiptNumber: decryptedData.receiptNumber,
            transaction_date: decryptedData.txnDate,
            school_id: schoolId,
          }),
        });

        const result = await response.json();
        console.log("DB update response:", result);
        setTransactionResult(result.transaction); // Store result for display
      } catch (err) {
        console.error("Error updating transaction:", err);
      } finally {
        setLoadingDb(false);
      }
    };

    postTransactionData();
  }, [decryptedData, payment, status, loadingGateway]);

  const domain = window.location.origin + "/";
  const secretKey = import.meta.env.VITE_SYSTEM_KEY;

  const fetchReceiptDetails = async (transactionId: any) => {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(transactionId),
      secretKey
    ).toString();
    const receiptUrl = `${domain}fee-reciept?schoolId=${schoolId}&data=${encodeURIComponent(
      encryptedData
    )}`;
    window.open(receiptUrl, "_blank");
  };

  return (
    <Container
      fluid
      className="d-flex flex-column align-items-center justify-content-start p-10"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      {loadingDb && transactionResult ? (
        // 1) Loader
        <div className="loader-overlay">
          <Spinner animation="border" role="status" />
          <div className="loader-text">
            "We're updating your transaction. This will only take a moment..."
          </div>
        </div>
      ) : status === "success" && transactionResult?.status === "success" ? (
        <>
          <div
            style={{ maxWidth: "28rem", margin: "2rem auto", marginTop: "5%" }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "1rem",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                border: "1px solid #dcfce7",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
                  padding: "2rem 1.5rem",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "5rem",
                    height: "5rem",
                    backgroundColor: "#22c55e",
                    borderRadius: "50%",
                    marginBottom: "1rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <i
                    className="fas fa-check-circle"
                    style={{ fontSize: "2.5rem", color: "white" }}
                  ></i>
                </div>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginBottom: "0.5rem",
                  }}
                >
                  Payment Successful! 🎉
                </h2>
                <div
                  style={{
                    width: "4rem",
                    height: "0.25rem",
                    backgroundColor: "#22c55e",
                    borderRadius: "9999px",
                    margin: "0 auto",
                  }}
                ></div>
              </div>

              {/* Content */}
              <div style={{ padding: "1.5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  <p
                    style={{
                      color: "#6b7280",
                      marginBottom: "1rem",
                      lineHeight: "1.625",
                    }}
                  >
                    Your transaction has been processed successfully.
                  </p>

                  {/* Amount */}
                  <div
                    style={{
                      backgroundColor: "#f9fafb",
                      borderRadius: "0.75rem",
                      padding: "1rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Amount Paid
                    </p>
                    <p
                      style={{
                        fontSize: "1.875rem",
                        fontWeight: "bold",
                        color: "#1f2937",
                        margin: 0,
                      }}
                    >
                      ₹{transactionResult?.amount}
                    </p>
                  </div>

                  {/* Transaction ID */}
                  <div
                    style={{
                      backgroundColor: "#eff6ff",
                      borderRadius: "0.75rem",
                      padding: "1rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "0.875rem",
                      }}
                    >
                      <span style={{ color: "#6b7280" }}>Transaction ID:</span>
                      <span
                        style={{
                          fontFamily: "monospace",
                          color: "#1f2937",
                          fontSize: "0.75rem",
                        }}
                      >
                        {transactionResult?.transaction_id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <button
                    style={{
                      width: "100%",
                      backgroundColor: "#2563eb",
                      color: "white",
                      fontWeight: 600,
                      padding: "0.75rem 1.5rem",
                      borderRadius: "0.75rem",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.2s",
                      cursor: "pointer",
                    }}
                    onClick={() => fetchReceiptDetails(transactionResult?.transaction_id)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#1d4ed8";
                      e.currentTarget.style.boxShadow =
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#2563eb";
                      e.currentTarget.style.boxShadow =
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    <i
                      className="fas fa-receipt"
                      style={{ width: "1.25rem", height: "1.25rem" }}
                    ></i>
                    View Receipt
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "1rem 1.5rem",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
                  For any confusion, please contact your school. To download the
                  receipt, click the button above to view it.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : status === "success" && transactionResult === 'pending' ? (
        // ⚠️ PENDING UI
        <div
          style={{ maxWidth: "28rem", margin: "2rem auto", marginTop: "5%" }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "1rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid #fef3c7",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                padding: "2rem 1.5rem",
                textAlign: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "5rem",
                  height: "5rem",
                  backgroundColor: "#f59e0b",
                  borderRadius: "50%",
                  marginBottom: "1rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <i
                  className="fas fa-clock"
                  style={{ fontSize: "2.5rem", color: "white" }}
                ></i>
              </div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#1f2937",
                  marginBottom: "0.5rem",
                }}
              >
                Payment Pending ⏳
              </h2>
              <div
                style={{
                  width: "4rem",
                  height: "0.25rem",
                  backgroundColor: "#f59e0b",
                  borderRadius: "9999px",
                  margin: "0 auto",
                }}
              ></div>
            </div>

            {/* Content */}
            <div style={{ padding: "1.5rem" }}>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <p
                  style={{
                    color: "#6b7280",
                    marginBottom: "1rem",
                    lineHeight: "1.625",
                  }}
                >
                  Your transaction is being processed. Please wait while we
                  confirm the payment status.
                </p>

                {/* Amount */}
                <div
                  style={{
                    backgroundColor: "#f9fafb",
                    borderRadius: "0.75rem",
                    padding: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Pending Amount
                  </p>
                  <p
                    style={{
                      fontSize: "1.875rem",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    ₹{transactionResult?.amount}
                  </p>
                </div>

                {/* Transaction ID */}
                <div
                  style={{
                    backgroundColor: "#fef9c3",
                    borderRadius: "0.75rem",
                    padding: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>Transaction ID:</span>
                    <span
                      style={{
                        fontFamily: "monospace",
                        color: "#1f2937",
                        fontSize: "0.75rem",
                      }}
                    >
                      {transactionResult?.transId}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                backgroundColor: "#f9fafb",
                padding: "1rem 1.5rem",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
                This payment is still pending. If it remains unresolved for
                long, please contact your school or payment provider.
              </p>
            </div>
          </div>
        </div>
      ) : status === "fail" && transactionResult === 'cancelled' ? (
        // ❌ FAILURE UI
        <div
          style={{ maxWidth: "28rem", margin: "2rem auto", marginTop: "5%" }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "1rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid #fee2e2",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
                padding: "2rem 1.5rem",
                textAlign: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "5rem",
                  height: "5rem",
                  backgroundColor: "#dc2626",
                  borderRadius: "50%",
                  marginBottom: "1rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <i
                  className="fas fa-times-circle"
                  style={{ fontSize: "2.5rem", color: "white" }}
                ></i>
              </div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#1f2937",
                  marginBottom: "0.5rem",
                }}
              >
                Payment Cancelled ❌
              </h2>
              <div
                style={{
                  width: "4rem",
                  height: "0.25rem",
                  backgroundColor: "#dc2626",
                  borderRadius: "9999px",
                  margin: "0 auto",
                }}
              ></div>
            </div>

            {/* Content */}
            <div style={{ padding: "1.5rem" }}>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <p
                  style={{
                    color: "#6b7280",
                    marginBottom: "1rem",
                    lineHeight: "1.625",
                  }}
                >
                  Your transaction could not be completed and has been
                  cancelled.
                </p>

                {/* Amount */}
                <div
                  style={{
                    backgroundColor: "#f9fafb",
                    borderRadius: "0.75rem",
                    padding: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Attempted Amount
                  </p>
                  <p
                    style={{
                      fontSize: "1.875rem",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    ₹{transactionResult?.amount}
                  </p>
                </div>

                {/* Transaction ID */}
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    borderRadius: "0.75rem",
                    padding: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>Transaction ID:</span>
                    <span
                      style={{
                        fontFamily: "monospace",
                        color: "#1f2937",
                        fontSize: "0.75rem",
                      }}
                    >
                      {transactionResult?.transaction_id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                backgroundColor: "#f9fafb",
                padding: "1rem 1.5rem",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
                If money has been deducted, please contact your school or
                payment provider for confirmation.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </Container>
  );
};

export default TransactionPage;

//  const endpoint =
//         processType === "new"
//           ? "/api/school/process-admission-transaction-online"
//           : isPromoted
//           ? "/api/school/process-promote-transaction-online" // ✅ New API for existing but promoted
//           : "/api/school/process-normal-transaction-online";
