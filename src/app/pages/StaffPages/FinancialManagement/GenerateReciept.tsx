import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
} from "@react-pdf/renderer";
import { toWords } from "number-to-words";

// Define TypeScript interfaces for props
interface CommonDetails {
  school_email: ReactNode;
  school_logo?: string;
  school_name: string;
  school_tagline?: string;
  school_address: string;
  school_phone: string;
  school_website: string;
  student_first_name: string;
  student_last_name: string;
  student_email: string;
  student_contact: string;
  transaction_id: string;
  payment_method: string;
  transfer_date?: string;
  amount_in_words?: string;
  receipt_number?: string;
  course_name?: string;
  course_duration?: string;
}

interface TransactionDetail {
  receipt_number: ReactNode;
  invoice_number: ReactNode;
  fee_group_name: string;
  fee_type_name: string;
  fee_amount: number;
  fee_status?: string;
}

interface PdfProps {
  commonDetails: CommonDetails;
  transactionDetails: TransactionDetail[];
}

// Define PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
    padding: 20,
  },
  receiptNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "red",
    textAlign: "right",
    marginBottom: 10, // Added extra spacing after receipt number
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 15, // Increased spacing after school details
  },
  schoolName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  address: {
    fontSize: 10,
    color: "gray",
    textAlign: "center",
  },
  receiptTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E3B55",
    textAlign: "center",
    marginBottom: 15, // Increased spacing before content starts
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailsBlock: {
    flex: 1,
  },
  boldLabel: {
    fontSize: 10,
    fontWeight: "demibold",
  },
  normalText: {
    fontSize: 10,
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
    padding: 8,
  },
  tableHeader: {
    backgroundColor: "#2E3B55",
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    textAlign: "center",
    borderRight: "1px solid #ccc",
    paddingVertical: 4,
  },
  lastTableCell: {
    borderRight: "none",
  },
  totalTableRow: {
    backgroundColor: "#E6E6E6",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
  },
  remarksRow: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 2,
  },
  systemGenerated: {
    fontSize: 8,
    color: "gray",
    textAlign: "center",
    marginTop: 10,
  },
});
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Generate PDF Function
export const GenerateReciept = async ({
  commonDetails,
  transactionDetails,
}: PdfProps) => {
  try {
    const totalAmount = transactionDetails.reduce(
      (sum, item) => sum + parseFloat(item.fee_amount),
      0
    );

    const capitalizeWords = (str: string) => {
      return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const amountInWords =
      capitalizeWords(toWords(totalAmount)) + " Rupees Only";

    const receipt_number = transactionDetails[0].receipt_number;
    const invoice_number = transactionDetails[0].invoice_number;

    const pdfBlob = await pdf(
      <Document>
        <Page style={styles.page}>
          {/* Container with border */}
          <View
            style={{
              border: "2px solid rgb(41, 114, 187)",
              padding: 20,
              borderRadius: 5,
            }}
          >
            {/* Receipt Number above school details */}
            <Text style={styles.receiptNumber}>{receipt_number || "N/A"}</Text>

            {/* Header Section */}
            <View style={styles.header}>
              {/* {commonDetails.school_logo && <Image style={styles.logo} src={commonDetails.school_logo} />} */}
              <Text style={styles.schoolName}>{commonDetails.school_name}</Text>
              <Text style={styles.address}>{commonDetails.school_address}</Text>
              <Text style={styles.address}>{commonDetails.school_email}</Text>
              <Text style={styles.address}>{commonDetails.school_phone}</Text>
            </View>

            {/* Centered Receipt Title */}
            <Text style={styles.receiptTitle}>RECEIPT</Text>

            {/* Receipt Details */}
            <View style={styles.detailsRow}>
              {/* Left: Receipt To */}
              <View style={styles.detailsBlock}>
                <Text style={styles.boldLabel}>Receipt To:</Text>
                <Text style={styles.normalText}>
                  {commonDetails.student_first_name}{" "}
                  {commonDetails.student_last_name}
                </Text>
                <Text style={styles.boldLabel}>
                  Email:{" "}
                  <Text style={styles.normalText}>
                    {commonDetails.student_email}
                  </Text>
                </Text>
                <Text style={styles.boldLabel}>
                  Contact:{" "}
                  <Text style={styles.normalText}>
                    {commonDetails.student_contact}
                  </Text>
                </Text>
              </View>

              {/* Right: Transaction Details */}
              <View style={styles.detailsBlock}>
                <Text style={styles.boldLabel}>
                  Transaction ID:{" "}
                  <Text style={styles.normalText}>
                    {commonDetails.transaction_id}
                  </Text>
                </Text>
                <Text style={styles.boldLabel}>
                  Invoice Number:{" "}
                  <Text style={styles.normalText}>
                    {invoice_number || "N/A"}
                  </Text>
                </Text>
                <Text style={styles.boldLabel}>
                  Payment Method:{" "}
                  <Text style={styles.normalText}>
                    {commonDetails.payment_method}
                  </Text>
                </Text>
                <Text style={styles.boldLabel}>
                  Transfer Date:{" "}
                  <Text style={styles.normalText}>
                    {formatDate(commonDetails.transfer_date) || "N/A"}
                  </Text>
                </Text>
              </View>
            </View>

            {/* Fee Details Table */}
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Description</Text>
                <Text style={styles.tableCell}>Amount</Text>
                <Text style={[styles.tableCell, styles.lastTableCell]}>
                  Status
                </Text>
              </View>

              {transactionDetails.map((detail, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{detail.fee_type_name}</Text>
                  <Text style={styles.tableCell}>Rs.{detail.fee_amount}</Text>
                  <Text style={[styles.tableCell, styles.lastTableCell]}>
                    {detail.fee_status || "N/A"}
                  </Text>
                </View>
              ))}

              {/* Total Row in Table */}
              <View style={[styles.tableRow, styles.totalTableRow]}>
                <Text style={styles.tableCell}>Total</Text>
                <Text style={styles.tableCell}>Rs.{totalAmount}</Text>
                <Text style={[styles.tableCell, styles.lastTableCell]}></Text>
              </View>
            </View>

            {/* Rupees in Words & Remarks */}
            <Text style={styles.remarksRow}>
              Rupees in Words: {amountInWords}
            </Text>
            <Text style={styles.remarksRow}>Remarks: --</Text>

            {/* System Generated Note */}
            <Text style={styles.systemGenerated}>
              This is a system-generated receipt. No need for a signature.
            </Text>
          </View>
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
