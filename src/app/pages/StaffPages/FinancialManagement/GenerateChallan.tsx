import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { toWords } from "number-to-words";

interface CommonDetails {
  transfer_date(transfer_date: any): import("react").ReactNode;
  student_id: ReactNode;
  bank_name?: string; // ✅ Optional now
  bank_address?: string;
  account_number?: string;
  date: string;
  student_name: string;
  gr_number: string;
  class_details: string;
  school_name: string;
  academic_year: string;
  fee_amount: number;
  cheque_number?: string;
  cheque_date?: string;
  bank_drawn?: string;
}

interface TransactionDetail {
  fee_type_name: string;
  fee_amount: number;
}

interface PdfProps {
  commonDetails: CommonDetails;
  transactionDetails: TransactionDetail[];
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    justifyContent: "space-between",
  },
  challanBox: {
    flex: 1,
    border: "1px solid black",
    padding: 10,
    margin: 5,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    borderBottom: "1px solid black",
    paddingBottom: 5,
    marginBottom: 5,
  },
  bankHeader: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  cashHeader: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "red",
    marginVertical: 5,
  },
  accountNumber: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 3,
  },
  dateText: {
    fontSize: 10,
    marginTop: 5,
    marginBottom: 8, // ✅ Increased spacing
  },
  receivedText: {
    fontSize: 10,
    marginTop: 5,
    textAlign: "justify",
    fontWeight: "bold",
    marginBottom: 5, // ✅ Added spacing below
  },
  studentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8, // ✅ Increased spacing
    marginBottom: 5, // ✅ Added spacing
  },
  studentDetails: {
    fontSize: 10,
    fontWeight: "bold",
  },
  feesRemark: {
    fontSize: 10,
    marginTop: 3,
    marginBottom: 5, // ✅ Added spacing
  },

  academicYear: {
    fontSize: 10,
    fontWeight: "bold",
    backgroundColor: "yellow",
    textAlign: "center",
    padding: 3,
    marginTop: 5,
  },
  table: {
    marginTop: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid black",
    padding: 3,
  },
  tableHeader: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "black",
    color: "white",
    padding: 3,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    textAlign: "center",
  },
  totalRow: {
    flexDirection: "row",
    backgroundColor: "lightgray",
    fontWeight: "bold",
    padding: 3,
  },
  chequeDetails: {
    fontSize: 10,
    marginTop: 5,
    fontWeight: "bold",
  },
  bankFooter: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 5,
  },
  note: {
    fontSize: 8,
    textAlign: "center",
    marginTop: 5,
  },
  classSectionRow: {
    marginBottom: 5, // ✅ Space before school details
  },
  schoolDetails: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5, // ✅ Adds space before Academic Year
  },
      
});

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const GenerateChallan = async ({
  commonDetails,
  transactionDetails,
}: PdfProps) => {
  try {
    const totalAmount = transactionDetails.reduce(
      (sum, item) => sum + item.fee_amount,
      0
    );
    const amountInWords = toWords(totalAmount) + " Rupees Only";

    const pdfBlob = await pdf(
      <Document>
        {/* ✅ Set the Page to Landscape */}
        <Page size="A4" orientation="landscape" style={styles.page}>
          {["Bank Copy", "Office Copy", "Student Copy"].map(
            (copyType, index) => (
              <View key={index} style={styles.challanBox}>
                <Text style={styles.title}>{copyType}</Text>

                {/* ✅ Show "CASH" if no bank details, otherwise show bank details */}
                {commonDetails.bank_name ? (
                  <>
                    <Text style={styles.bankHeader}>
                      {commonDetails.bank_name}
                    </Text>
                    <Text style={styles.bankHeader}>
                      {commonDetails.bank_address}
                    </Text>
                    <Text style={styles.accountNumber}>
                      A/c No. {commonDetails.account_number}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.cashHeader}>CASH</Text>
                )}

                <Text style={styles.dateText}>
                  Date: {formatDate(commonDetails.transfer_date)}
                </Text>

                {/* ✅ Bolder "Received a sum of Rs." */}
                <Text style={styles.receivedText}>
                  Received a sum of Rs. {amountInWords} Only
                </Text>

                {/* ✅ Student Name & GR No in one row */}
                <Text style={styles.feesRemark}>
                  only on a/c of fees in respect of (Students Name)
                </Text>
                <View style={styles.studentRow}>
                  <Text style={styles.studentDetails}>
                    {commonDetails.student_name}
                  </Text>
                  <Text style={styles.studentDetails}>
                    GR No. {commonDetails.student_id}
                  </Text>
                </View>
                <View style={styles.classSectionRow}>
                  <Text style={styles.studentDetails}>
                    {commonDetails.class_details}
                  </Text>
                </View>

                {/* ✅ Added "only on a/c of fees in respect of..." */}
                <Text style={styles.schoolDetails}>
                  {commonDetails.school_name}, {commonDetails.bank_address}
                </Text>

                <Text style={styles.academicYear}>
                  Academic Year : {commonDetails.academic_year}
                </Text>

                <View style={styles.table}>
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={styles.tableCell}>Particular</Text>
                    <Text style={styles.tableCell}>Amount</Text>
                  </View>

                  {transactionDetails.map((detail, i) => (
                    <View key={i} style={styles.tableRow}>
                      <Text style={styles.tableCell}>
                        {detail.fee_type_name}
                      </Text>
                      <Text style={styles.tableCell}>{detail.fee_amount}</Text>
                    </View>
                  ))}

                  <View style={styles.totalRow}>
                    <Text style={styles.tableCell}>Total :-</Text>
                    <Text style={styles.tableCell}>
                      {commonDetails.fee_amount}
                    </Text>
                  </View>
                </View>

                {commonDetails.bank_name && (
                  <>
                    <Text style={styles.chequeDetails}>
                      Chq. No. {commonDetails.cheque_number || "N/A"} - dated{" "}
                      {commonDetails.cheque_date || "N/A"} - drawn on{" "}
                      {commonDetails.bank_drawn || "N/A"}
                    </Text>
                    <Text style={styles.chequeDetails}>
                      Cheque subject to realisation.....
                    </Text>
                  </>
                )}

                <Text style={styles.bankFooter}>
                  {commonDetails.bank_name
                    ? `For ${commonDetails.bank_name}`
                    : "For Payment Confirmation"}
                </Text>
                <Text style={styles.bankFooter}>
                  {commonDetails.bank_address || "Cash Payment"}
                </Text>

                <Text style={styles.note}>
                  Fees to be paid in the East Street Branch, Camp Only
                </Text>
              </View>
            )
          )}
        </Page>
      </Document>
    ).toBlob();

    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");
  } catch (error) {
    console.error("Error generating Challan PDF:", error);
  }
};
