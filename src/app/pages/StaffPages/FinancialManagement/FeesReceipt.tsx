import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Container, Card, Button, Row, Col, Table } from "react-bootstrap";
import { EncryptDecrypt } from "./EncryptDecrypt";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style-sheet.css";
import html2pdf from "html2pdf.js";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import "./CollectFeesLink.css";

const FeesReceipt: React.FC = () => {
  const location = useLocation();
  // Extract the `status` query parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const encryptedData = queryParams.get("data"); // Get encrypted query data
  const schoolId = queryParams.get("schoolId"); // Get encrypted query data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transcationId, setTranscationId] = useState<string | null>(null);
  const [commonDetails, setCommonDetails] = useState([]);
  const [trnascationDetails, setTranscationDetails] = useState([]);
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [paymentGatewayDetails, setPaymentGateway] = useState(null);

  const privateKey = import.meta.env.VITE_SYSTEM_KEY || "";
  useEffect(() => {
    const fetchPaymentGateway = async () => {
      setLoading(true);
      if (!schoolId) {
        setError("School ID is required.");
        setLoading(true);
        return;
      }

      try {
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
        setLoading(false); // ← stop loader
      }
    };

    fetchPaymentGateway();
  }, [schoolId]);

  useEffect(() => {
    if (!encryptedData || !privateKey) return;
    setLoading(true); // ← start loader
    try {
      const decryptedText = EncryptDecrypt.decryptWithKeyOnly(
        encryptedData,
        privateKey
      );
      // If backend sends only a transaction ID
      const transactionId = JSON.parse(decryptedText);
      setTranscationId(transactionId);
    } catch (e) {
      setError("Failed to decrypt transaction ID");
    } finally {
      setLoading(false); // ← stop loader
    }
  }, [encryptedData, privateKey]);

  useEffect(() => {
    if (schoolId) {
      const fetchSchoolsDetails = async () => {
        setLoading(true); 
        try {
          const school_id = schoolId;
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
        }finally {
          setLoading(false);               // ← stop loader
        }
      };

      fetchSchoolsDetails();
    }
  }, [schoolId]);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      setLoading(true);
      if (!schoolId || !transcationId) {
        setError("School ID or Transaction ID is missing.");
        return;
      }

      try {
        const response = await fetch(
          `${DOMAIN}/api/school/transaction-details/${transcationId}/${schoolId}`
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
        setLoading(false);
      } catch (err) {
        console.error("Error fetching transaction details:", err);
        setError(err.message || "Failed to fetch transaction details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [transcationId, schoolId]);

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

  const isReady =
    !loading && // no fetch is in-flight
    !!schoolDetails && // school info loaded
    !!paymentGatewayDetails && // payment gateway loaded
    !!transcationId && // we decrypted the ID
    trnascationDetails.length > 0; // transaction details loaded


      const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };


  return (
    <Container
      fluid
      className="d-flex flex-column align-items-center justify-content-start p-10 mb-10"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      {!isReady ? (
        // 1) Loader
        <div className="loader-overlay">
          <Spinner animation="border" role="status" />
          <div className="loader-text">
            Generating your transaction receipt…
          </div>
        </div>
      ) : trnascationDetails ? (
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
                        <td>{"Success"}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Transaction Id</strong>
                        </td>
                        <td>{commonDetails?.transaction_id}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Payment Mode</strong>
                        </td>
                        <td>{commonDetails?.pay_instrument}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Transaction Date</strong>
                        </td>
                        <td>{formatDate(commonDetails?.transaction_date)}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Student Id</strong>
                        </td>
                        <td>{commonDetails?.student_id} </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Gr Number</strong>
                        </td>
                        <td>{commonDetails?.gr_number} </td>
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

export default FeesReceipt;
