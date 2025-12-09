import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Container, Card, Button, Row, Col, Table } from "react-bootstrap";
import { EncryptDecrypt } from "./EncryptDecrypt";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
} from "@react-pdf/renderer";
import { GenerateChallan } from "./GenerateChallan";
import { GenerateReciept } from "./GenerateReciept";
import "./style-sheet.css";
import html2pdf from "html2pdf.js";
import axios from "axios";
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "1px solid rgb(41, 114, 187)",
  },
  logo: {
    width: 80,
    height: 80,
  },
  schoolDetails: {
    textAlign: "center",
    flex: 1,
    marginHorizontal: 20,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 12,
    color: "gray",
  },
  address: {
    fontSize: 10,
    color: "gray",
  },
  receiptText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgb(41, 114, 187)",
  },
  section: {
    marginBottom: 20,
    padding: 10,
    fontSize: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  receiptTo: {
    flex: 1,
    marginRight: 10,
  },
  receiptDetails: {
    flex: 1,
    marginLeft: 10,
  },
  installmentHeading: {
    padding: 10,
    fontSize: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
    color: "rgb(41, 114, 187)",
  },
  installmentTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
    color: "rgb(41, 114, 187)",
  },
  table: {
    display: "flex",
    flexDirection: "column",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    border: "1px solid #ccc",
    padding: 6,
  },
  tableHeader: {
    fontWeight: "bold",
    fontSize: 10,
    backgroundColor: "rgb(41, 114, 187)",
    color: "white",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
  },
  boldLine: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  hrLine: {
    borderTop: "1px solid rgb(41, 114, 187)",
    marginTop: 10,
    marginBottom: 10,
  },
});

const TranscationReceipt: React.FC = () => {
  const location = useLocation();

  // Extract the `status` query parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const encryptedQuery = queryParams.get("transcation_id"); // Get encrypted query data

  // States
 

  const [hasRun, setHasRun] = useState(false);
  const [paymentGatewayDetails, setPaymentGateway] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commonDetails, setCommonDetails] = useState([]);

  const [trnascationDetails, setTranscationDetails] = useState([]);
  
  const [transcationId, setTranscationId] = useState<string | null>(null);
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [logo, setLogo] = useState<string | null>(null);

  const privateKey = paymentGatewayDetails?.private_key || "";
  const privateValue = paymentGatewayDetails?.private_value || "";

  useEffect(() => {
    const fetchPaymentGateway = async () => {
      if (!schoolId) {
        setError("School ID is required.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
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
        setError(err.message || "Failed to fetch payment gateway details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentGateway();
  }, [schoolId]);

  useEffect(() => {
    if (schoolId) {
      const fetchSchoolsDetails = async () => {
        try {
          const school_id = schoolId;
          setLoading(true);
          const response = await axios.get(
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
    }
  }, [schoolId]);

  

  useEffect(() => {
    const postTransactionData = async () => {
      if (hasRun || !decryptedData || !payment) {
        return;
      }

      setHasRun(true); // Prevent re-running

      const processType = process_type;
      const isPromoted = promote === "promote";

      const endpoint =
        processType === "new"
          ? "/api/school/process-admission-transaction-online"
          : isPromoted
          ? "/api/school/process-promote-transaction-online" // ✅ New API for existing but promoted
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
            status: decryptedData.status,
            pg_transaction_id: decryptedData.pgTransId,
            ref_transaction_id: decryptedData.transId,
            pay_instrument: decryptedData.payInstrument,
            pg_receiptNumber: decryptedData.receiptNumber,
            transaction_date: decryptedData.txnDate,
            school_id: schoolId,
          }),
        });

        const result = await response.json();

        if (
          result.message?.toLowerCase().includes("online fee payment processed successfully")
        ) {
          toast.success("Transaction processed successfully!");
          setTranscationId(decryptedData?.mtxnId);
        } else if (
          result.message?.toLowerCase().includes("already marked as") ||
          result.message?.toLowerCase().includes("already updated") ||
          result.message?.toLowerCase().includes("already been processed")
        ) {
          toast.warning(result.message || "Transaction already processed.", {
            autoClose: false,
          });
          setTranscationId(decryptedData?.mtxnId);
        } else {
          throw new Error(result.message || "Failed to process the transaction");
        }        
      } catch (err) {
        console.error("Error processing transaction:", err);
        toast.error("Transaction failed. Please try again.");
      }
    };

    if (!hasRun) {
      postTransactionData();
    }

    const preventReload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // Prevent reload
    };

    window.addEventListener("beforeunload", preventReload);
    return () => {
      window.removeEventListener("beforeunload", preventReload);
    };
  }, [decryptedData, payment, hasRun]);

  // Determine message and styles based on the status
  const isSuccess = status === "success";

  const title = isSuccess ? "Payment Successful" : "Payment Failed";
  const message = isSuccess
    ? "Your payment was processed successfully. Thank you for your transaction."
    : "Unfortunately, your payment could not be processed. Please try again.";
  const buttonLabel = isSuccess ? "Close Page" : "Try Again";
  const buttonVariant = isSuccess ? "success" : "danger";

  const handleButtonClick = () => {
    if (isSuccess) {
      if (window.opener) {
        window.opener.postMessage("transactionComplete", "*"); // Notify parent window if needed
        window.close();
      } else {
        // Redirect if window cannot close
        window.location.href = "/";
      }
    } else {
      window.location.href = "/payment";
    }
  };

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!schoolId || !transcationId) {
        setError("School ID or Transaction ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${DOMAIN}/api/school/transaction-details/${transcationId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const transactionData = await response.json();

        if (
          !transactionData?.commonDetails ||
          !transactionData?.transactionDetails
        ) {
          throw new Error("Incomplete transaction data received.");
        }

        setCommonDetails(transactionData.commonDetails);
        setTranscationDetails(transactionData.transactionDetails);
      } catch (err) {
        console.error("Error fetching transaction details:", err);
        setError(err.message || "Failed to fetch transaction details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [transcationId, decryptedData, schoolId]);

  // const fetchReceiptDetails = async (transactionId) => {
  //   try {
  //     const response = await fetch(
  //      `${DOMAIN}/api/school/transaction-details/${transactionId}`
  //     );
  //     if (response.ok) {
  //       const transactionData = await response.json();
  //       if (
  //         transactionData &&
  //         transactionData.commonDetails &&
  //         transactionData.transactionDetails.length > 0 &&
  //         transactionData.commonDetails.voucher_type === "challan" &&
  //         transactionData.commonDetails.payment_method === "cash"
  //       ) {
  //         // Generate PDF for the specific transaction
  //         GenerateChallan({
  //           commonDetails: transactionData.commonDetails,
  //           transactionDetails: transactionData.transactionDetails,
  //         });
  //       } else if (
  //         transactionData &&
  //         transactionData.commonDetails &&
  //         transactionData.transactionDetails.length > 0
  //       ) {
  //         GenerateReciept({
  //           commonDetails: transactionData.commonDetails,
  //           transactionDetails: transactionData.transactionDetails,
  //         });
  //       } else {
  //         console.error(
  //           "No transaction details found for transaction ID:",
  //           transactionId
  //         );
  //       }
  //     } else {
  //       console.error(
  //         "Failed to fetch transaction details for receipt with ID:",
  //         transactionId
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error fetching transaction details:", error);
  //   }
  // };

  const handleDownloadPDF = () => {
    const element = document.getElementById("receipt-to-print");
    if (!element) return;

    html2pdf()
      .from(element)
      .set({
        filename: `Receipt-${commonDetails?.student_id || "Student"}.pdf`,
        margin: 0.5,
        html2canvas: { scale: 2 },
        jsPDF: { format: "a4", orientation: "portrait" },
      })
      .save();
  };

  return (
    <Container
      fluid
      className="d-flex flex-column align-items-center justify-content-start p-10"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      {isSuccess ? (
        <>
          <div className="text-center mb-3 w-100 d-flex flex-column flex-sm-row justify-content-center gap-2">
            <Button
              variant="success"
              className="w-100 w-sm-auto"
              onClick={() => window.print()}
            >
              Print Receipt
            </Button>

            <Button
              variant="primary"
              className="w-100 w-sm-auto"
              onClick={handleDownloadPDF}
            >
              Download Receipt
            </Button>
          </div>

          <div id="receipt-to-print">
            <Card className="receipt-card w-100 shadow-sm">
              <Card.Body className="p-3 p-md-4">
                <div className="text-center mb-3">
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
                  <h5 className="mt-2 fw-bold receipt-heading">
                    {schoolDetails?.name}
                  </h5>
                </div>

                <div className="table-responsive">
                  <Table bordered className="mb-0 small-table">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Institute Name</strong>
                        </td>
                        <td>
                          {schoolDetails?.name}
                          <br />
                          {schoolDetails?.address}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Transaction Status</strong>
                        </td>
                        <td>{decryptedData?.status || "Success"}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Transaction Id</strong>
                        </td>
                        <td>{decryptedData?.mtxnId}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Transaction Date & Time</strong>
                        </td>
                        <td>{decryptedData?.txnDate}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Student Id</strong>
                        </td>
                        <td>{commonDetails?.student_id} </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Student Name</strong>
                        </td>
                        <td>
                          {commonDetails?.student_first_name}{" "}
                          {commonDetails?.student_last_name}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Father Name</strong>
                        </td>
                        <td>{commonDetails?.father_name}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Mother Name</strong>
                        </td>
                        <td>{commonDetails?.mother_name}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Class</strong>
                        </td>
                        <td>{commonDetails?.class}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Division</strong>
                        </td>
                        <td>{commonDetails?.section}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Academic Year</strong>
                        </td>
                        <td>{commonDetails?.session}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>

                <div className="table-responsive mt-4">
                  <Table bordered className="small-table">
                    <thead className="table-primary text-center">
                      <tr>
                        <th>Fees Type</th>
                        <th>Amount (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trnascationDetails?.map((installment, i) => (
                        <React.Fragment key={i}>
                          <tr>
                            <td>
                              <strong>{installment.installment_name}</strong>
                            </td>
                            <td>
                              <strong>
                              ₹ {(installment.total_amount || 0).toFixed(2)}
                              </strong>
                            </td>
                          </tr>
                          {installment.components.map((component, j) => (
                            <tr key={`${i}-${j}`}>
                              <td>{component.fee_type}</td>
                              <td>₹ {component.type_amount.toFixed(2)}</td>
                            </tr>
                          ))}

                          {/* Total row for this installment */}
                        </React.Fragment>
                      ))}
                      <tr>
                        <td>Less: Rebate in Installment</td>
                        <td>₹ {commonDetails?.rebate_amount}</td>
                      </tr>
                      <tr>
                        <td>Add: Administrative Charges</td>
                        <td>₹ {commonDetails?.fine_amount}</td>
                      </tr>
                      <tr>
                        <td>Total Amount</td>
                        <td>₹ {commonDetails?.transaction_amount}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Fees Paid</strong>
                        </td>
                        <td>
                          <strong>₹ {commonDetails?.transaction_amount}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>

                <div className="mt-3 text-center text-sm-start">
                  <p className="text-muted small mb-0">
                    (Note: This is a System generated receipt and does not
                    require any signature/stamp)
                  </p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </>
      ) : (
        <Card className="text-center shadow-lg p-4" style={{ maxWidth: 500 }}>
          <Card.Body>
            <i
              className="fas fa-times-circle mb-3"
              style={{ fontSize: "60px", color: "red" }}
            ></i>
            <h4 className="mb-3 text-danger">Transaction Failed</h4>
            <p className="text-muted">
              Unfortunately, your payment could not be processed. Please try
              again later or contact support.
            </p>
            <Button
              variant="danger"
              onClick={handleButtonClick}
              className="mt-3"
            >
              Try Again
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default TranscationReceipt;
