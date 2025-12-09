import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { ShowTransactions } from "../../modals/create-app-stepper/ShowTransactions";
import { useNavigate } from "react-router-dom";
import { CollectOfflineAdmissionFees } from "../../modals/create-app-stepper/CollectOfflineAdmissionFees";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
} from "@react-pdf/renderer";
import CryptoJS from "crypto-js";

type Props = {
  classId: number | null;
  admissionEnquiryId: string | null;
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#F2F6FF",
    padding: 20,
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "2px solid #ccc",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  schoolName: {
    fontSize: 16,
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
  contact: {
    fontSize: 10,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 4,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
    padding: 6,
  },
  tableHeader: {
    fontWeight: "bold",
    fontSize: 10,
    backgroundColor: "#E0E4F0",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
  },
  totalAmount: {
    marginTop: 20,
    fontSize: 12,
    fontWeight: "bold",
  },
  note: {
    marginTop: 10,
    fontSize: 10,
    color: "gray",
  },
});

interface ApplicationData {
  group_name: string;
  pending_amount: number;
  student_fees_master_id: number;
  fee_group_id: number;
  fee_group_name: string;
  fee_session_group_id: string;
  total_amount: number;
  due_date: string;
  status: string;
}

interface StudentDetails {
  academic_year: string;
  class_name: string;
  father_name: string;
  student_email: string;
  student_name: string;
  name: string;
  class: string;
  section: string;
  roll_no: number;
}

const TablesWidget70 = ({ classId, admissionEnquiryId }: Props) => {
  const [data, setData] = useState<ApplicationData[]>([]);

  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(
    null
  );

  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const sessionId = currentUser?.session_id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isCollectOfflineModalOpen, setIsCollectOfflineModalOpen] =
    useState(false);
  const [refresh, setRefresh] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [paymentGatewayDetails, setPaymentGatewayDetails] = useState(null);
  const [loading, setLoading] = useState(true);


  const Navigate = useNavigate();

  
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentUrl = `${DOMAIN}/api/school/get-applicantdetails/${admissionEnquiryId}`;
        const response = await fetch(studentUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch student details");
        }

        const result = await response.json();
        setStudentDetails(result.data);
      } catch (error) {
        console.error("Error fetching student details:", error);
        toast.error("Error fetching student details.");
      }
    };

    const fetchFeeGroupType = async () => {
      try {
        const url = `${DOMAIN}/api/school/get-admissionfeesgroup/${schoolId}/${classId}/${sessionId}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Network response was not ok for URL: ${url}`);
        }

        const result = await response.json();

        if (result && result.data) {
          setData(result.data);
          setSelectedGroupId(result.data[0].fee_group_id);
        } else {
          console.error("Unexpected response structure:", result);
          toast.error("Unexpected response structure received.");
        }
      } catch (error) {
        console.error("Error fetching fee group/type data:", error);
        toast.error("Error fetching fee group/type data.");
      }
    };

    if (classId) {
      fetchStudentData();
      fetchFeeGroupType();
    }
  }, [schoolId, sessionId, classId, refresh, studentId]);

  useEffect(() => {
    const fetchStudentIds = async () => {
      if (!transactionId || !schoolId) {
        console.warn(
          "Missing class, section, or session ID. Cannot fetch student IDs."
        );
        return;
      }

      try {
        // Fetch student IDs based on selected class, section, and session
        const response = await fetch(
          `${DOMAIN}/api/school/get-student-id-by-transcation-id/${transactionId}/${schoolId}/${sessionId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch student IDs");
        }

        const data = await response.json();

        // Extract only student IDs from the response
        const ids = data.student_id;
        setStudentId(ids);
      } catch (error) {
        console.error("Error fetching student IDs:", error);
      }
    };

    fetchStudentIds();
  }, [transactionId, schoolId, refresh, sessionId]);


  useEffect(() => {
    const fetchStudentIdsforOnline = async () => {
      try {
        // Fetch student IDs based on selected class, section, and session
        const response = await fetch(
          `${DOMAIN}/api/school/get-student-id-by-admissionEnquiryId/${admissionEnquiryId}/${schoolId}/${sessionId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch student IDs");
        }

        const data = await response.json();
        // Extract only student IDs from the response
        const ids = data.student_id;
        setStudentId(ids);
      } catch (error) {
        console.error("Error fetching student IDs:", error);
      }
    };

    fetchStudentIdsforOnline();
  }, [admissionEnquiryId]);




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
      setError("School ID is required.");
      setLoading(false);
    }
  }, [schoolId]);





  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openCollectOfflineModal = (groupId: number) => {
    setSelectedGroupId(groupId);
    setIsCollectOfflineModalOpen(true);
  };

  const closeCollectOfflineModal = () => {
    setSelectedGroupId(null);
    setIsCollectOfflineModalOpen(false);
  };

  const handleBack = () => {
    Navigate(-1);
  };

  const handleGroupClick = (groupName: string) => {
    toast.info(`Collecting fees for ${groupName}`);
  };

  useEffect(() => {
    if (transactionId) {
      fetchTransactionDetails(transactionId); // Call the function
    }
  }, [transactionId]);

  const fetchTransactionDetails = async (transactionId) => {
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/transaction-details-by-id/${transactionId}/${schoolId}/${sessionId}`
      );

      if (response.ok) {
        const transactionData = await response.json(); // Expecting an object with commonDetails and transactionDetails

        if (
          transactionData &&
          transactionData.commonDetails &&
          transactionData.transactionDetails.length > 0
        ) {
          // Pass structured data to generatePdf
          generatePdf(transactionData);
        } else {
          console.error("No transaction details found.");
        }
      } else {
        console.error("Failed to fetch transaction details");
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  };
  useEffect(() => {
    if (schoolId) {
      fetchPaymentGateWayDetails(schoolId); // Call the function
    }
  }, [schoolId]);

  const fetchPaymentGateWayDetails = async (schoolId) => {

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/get-active-payment-gateway/${schoolId}`
      );

      if (response.ok) {
        const PaymentGateWayData = await response.json();
        setPaymentgateway(PaymentGateWayData.paymentGateways[0]);
      } else {
        console.error("Failed to fetch transaction details");
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  };

  const generatePdf = async ({ commonDetails, transactionDetails }) => {
    try {
      const pdfBlob = await pdf(
        <Document>
          <Page style={styles.page}>
            {/* Header Section */}
            {commonDetails && (
              <View style={styles.header}>
                {commonDetails.school_logo && (
                  <Image style={styles.logo} src={commonDetails.school_logo} />
                )}
                <Text style={styles.schoolName}>
                  {commonDetails.school_name}
                </Text>
                <Text style={styles.tagline}>
                  {commonDetails.school_tagline}
                </Text>
                <Text style={styles.address}>
                  {commonDetails.school_address}
                </Text>
                <Text style={styles.contact}>
                  Contact: {commonDetails.school_phone} |{" "}
                  {commonDetails.school_website}
                </Text>
              </View>
            )}

            {/* Receipt Details */}
            {commonDetails && (
              <View style={styles.section}>
                <Text>
                  Receipt To:{" "}
                  {`${commonDetails.student_first_name} ${commonDetails.student_last_name}`}
                </Text>
                <Text>Email: {commonDetails.student_email}</Text>
                <Text>Contact: {commonDetails.student_contact}</Text>
                <Text>Transaction ID: {commonDetails.transaction_id}</Text>
                <Text>Payment Method: {commonDetails.payment_method}</Text>
                <Text>
                  Transfer Date: {commonDetails.transfer_date || "N/A"}
                </Text>
              </View>
            )}

            {/* Fee Details Table */}
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Fee Group</Text>
                <Text style={styles.tableCell}>Fee Type</Text>
                <Text style={styles.tableCell}>Amount</Text>
                <Text style={styles.tableCell}>Status</Text>
              </View>

              {/* Loop through transaction details */}
              {transactionDetails.map((detail, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{detail.fee_group_name}</Text>
                  <Text style={styles.tableCell}>{detail.fee_type_name}</Text>
                  <Text style={styles.tableCell}>₹{detail.fee_amount}</Text>
                  <Text style={styles.tableCell}>
                    {detail.fee_status || "N/A"}
                  </Text>
                </View>
              ))}
            </View>

            {/* Notes Section */}
            {commonDetails && (
              <View style={styles.note}>
                <Text>
                  Rupees in words: {commonDetails.amount_in_words || "N/A"}
                </Text>
                <Text>
                  This is a system-generated receipt. No need for a signature.
                </Text>
              </View>
            )}
          </Page>
        </Document>
      ).toBlob();

      // Open the PDF in a new window
      const url = URL.createObjectURL(pdfBlob);
      const windowFeatures =
        "width=800,height=600,left=200,top=100,scrollbars=yes,resizable=yes";
      window.open(url, "_blank", windowFeatures);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // const secretKey = "V3rY$eCur3!Key#2024!@G7P8$9ZQw";
  const secretKey = paymentGatewayDetails?.secret_key;
  const FrontDomain = paymentGatewayDetails?.front_domain;

  const createPaymentLink = (groupId: number) => {
    const dataToEncrypt = {
      admissionEnquiryId: admissionEnquiryId,
      group_id: groupId,
      session_id: sessionId,
      school_id: schoolId,
      process_type: "new",
      payment_type: "full",
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt),
      secretKey
    ).toString();

    // console.log(dataToEncrypt)
    // console.log(encryptedData)

    const paymentUrl = `${FrontDomain}fee-payment/?school_id=${schoolId}&data=${encodeURIComponent(
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
        <h2>Collect Admission Fees</h2>
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
                <strong>Addmission ID:</strong>{" "}
                {studentDetails.student_id || "N/A"}
              </div>
              <div style={{ flex: "1 1 30%", marginBottom: "10px" }}>
                <strong>Name:</strong> {studentDetails.student_name || "N/A"}
              </div>
              <div style={{ flex: "1 1 30%", marginBottom: "10px" }}>
                <strong>Email Id:</strong>{" "}
                {studentDetails.student_email || "N/A"}
              </div>
              <div style={{ flex: "1 1 30%", marginBottom: "10px" }}>
                <strong>Mobile No.:</strong>{" "}
                {studentDetails.student_name || "N/A"}
              </div>
              <div style={{ flex: "1 1 30%", marginBottom: "10px" }}>
                <strong>Class:</strong> {studentDetails.class_name || "N/A"}
              </div>
              <div style={{ flex: "1 1 30%", marginBottom: "10px" }}>
                <strong>Father Name:</strong>{" "}
                {studentDetails.father_name || "N/A"}
              </div>
              <div style={{ flex: "1 1 30%", marginBottom: "10px" }}>
                <strong>Academic Year:</strong>{" "}
                {studentDetails.academic_year || "N/A"}
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
                <th style={{ padding: "12px 20px", textAlign: "left" }}>
                  Fee Group
                </th>
                <th style={{ padding: "12px 20px", textAlign: "left" }}>
                  Due Date
                </th>
                <th style={{ padding: "12px 20px", textAlign: "center" }}>
                  Pending Amount
                </th>

                {/* <th style={{ padding: "12px 20px", textAlign: "center" }}>
                  View Transactions History
                </th> */}
                <th style={{ padding: "12px 20px", textAlign: "right" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.fee_group_id}
                  style={{
                    backgroundColor:
                      item.fee_group_id % 2 === 0
                        ? "rgb(242, 246, 255)"
                        : "#FFFFFF",
                    borderBottom: "1px solid #E0E4F0",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    color: "#1C335C",
                  }}
                >
                  <td style={{ padding: "12px 20px" }}>
                    {item.fee_group_name || "N/A"}
                  </td>
                  <td style={{ padding: "12px 20px" }}>
                    {item.due_date
                      ? new Date(item.earliest_due_date).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td style={{ padding: "12px 20px", textAlign: "center" }}>
                    {studentId
                      ? currentUser?.currency_symbol + "" + 0
                      : currentUser?.currency_symbol + "" + item.pending_amount}
                  </td>
                  {/* <td style={{ textAlign: "center" }}>
                    <i
                      className="fas fa-eye"
                      style={{ cursor: "pointer" }}
                      onClick={openModal}
                    ></i>
                  </td> */}
                  <td
                    style={{
                      display: "flex",
                      gap: "10px", // Adds space between the buttons
                      justifyContent: "right", // Aligns buttons horizontally in the center
                      alignItems: "center", // Vertically centers the buttons
                      padding: "12px 20px",
                    }}
                  >
                    <div
                      onClick={() =>
                        !studentId && openCollectOfflineModal(item.fee_group_id)
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px",
                        backgroundColor: studentId ? "#A9A9A9" : "#1C335C", // Disable button with grey color if transactionId exists
                        borderRadius: "8px",
                        cursor: studentId ? "not-allowed" : "pointer", // Disable pointer if transactionId exists
                        transition: "background-color 0.3s",
                        position: "relative", // For tooltip positioning
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "700",
                          fontFamily: "Manrope",
                        }}
                      >
                        Collect Offline
                      </span>

                      {/* Tooltip for hover message */}
                    </div>
                    <div
                      onClick={() =>
                        !studentId &&
                        paymentGatewayDetails &&
                        createPaymentLink(item.fee_group_id)
                      }
                      // onClick={() => createPaymentLink(item.fee_group_id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px",
                        backgroundColor: studentId ? "#A9A9A9" : "#4CAF50",
                        borderRadius: "8px",
                        cursor:
                          item.status === "paid" ? "not-allowed" : "pointer",
                        transition: "background-color 0.3s",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "700",
                          fontFamily: "Manrope",
                        }}
                      >
                        Create Link
                      </span>
                    </div>
                    {studentId && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-30px", // Position the tooltip above the button
                          right: "0",
                          backgroundColor: "#1C335C",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "500",
                          fontFamily: "Manrope",
                          padding: "6px 8px",
                          borderRadius: "4px",
                          whiteSpace: "nowrap", // Prevent text wrapping
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          zIndex: "10", // Ensure tooltip is above other elements
                        }}
                      >
                        Admission fees is taken, and the student is onboarded
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ShowTransactions
            // studentFeesMasterId={studentFeesMasterId}
            show={isModalOpen}
            onHide={closeModal}
            groupId={selectedGroupId}
            studentId={studentId}
          />
          <CollectOfflineAdmissionFees
            show={isCollectOfflineModalOpen}
            handleClose={closeCollectOfflineModal}
            classId={classId}
            groupId={selectedGroupId}
            setRefresh={setRefresh}
            admissionEnquiryId={admissionEnquiryId}
            setTransactionId={setTransactionId}
          />
        </div>
      </div>
    </div>
  );
};

export { TablesWidget70 };
