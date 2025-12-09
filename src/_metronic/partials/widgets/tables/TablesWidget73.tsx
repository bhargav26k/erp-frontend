import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, Row, Spinner, Table } from "react-bootstrap";
import Select from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css
import "react-date-range/dist/theme/default.css"; // theme css
import axios from "axios";

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

<style>{`
  .react-datepicker-popper {
    z-index: 10000 !important;
  }
  .react-datepicker {
    font-family: 'Manrope', sans-serif;
    border: 1px solid #dee2e6;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
    .custom-datepicker-popup {
  position: absolute;
  z-index: 1050 !important; /* allowed in CSS file */
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 10px;
  margin-top: 5px;
  transform: scale(0.85);
  transform-origin: top left;
}
  .pagination-controls button {
  padding: 6px 12px;
  margin: 0 5px;
  font-weight: bold;
  cursor: pointer;
}
.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`}</style>;

const TablesWidget73 = () => {
  const [data, setData] = useState<ApplicationData[]>([]);

  const [classOptions, setClassOptions] = useState([]);

  const [installmentOptions, setInstallmentOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState({
    value: "all_classes",
    label: "All Classes",
  });
  const [selectedStatus, setSelectedStatus] = useState({
    value: "success",
    label: "Success",
  });

  const [selectedInstallment, setSelectedInstallment] = useState({
    value: "all",
    label: "All Installments",
  });

  const getStartOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getEndOfDay = (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  const today = new Date();

  const [dateRange, setDateRange] = useState([
    {
      startDate: getStartOfDay(today),
      endDate: getEndOfDay(today),
      key: "selection",
    },
  ]);

  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const sessionId = currentUser?.session_id;
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    class: selectedClass,
    status: selectedStatus,
    installment: selectedInstallment,
    dateRange: dateRange,
  });
  const [schoolDetails, setSchoolDetails] = useState(null);

  const Navigate = useNavigate();

  // Fetch Class Options
  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-classes?schoolId=${schoolId}&sessionId=${sessionId}`
        );

        if (!response.ok) throw new Error("Failed to fetch class options.");

        const result = await response.json();

        setClassOptions([
          { value: "all_classes", label: "All Classes" }, // Match value with check
          ...result.map((cls) => ({
            value: cls.id,
            label: cls.class,
            originalData: cls, // Preserve original data if needed
          })),
        ]);
      } catch (error) {
        console.error("Error fetching class options:", error);
        toast.error("Error fetching class options.");
      }
    };

    if (schoolId && sessionId) fetchClassOptions();
  }, [schoolId, sessionId]);

  const handleClassChange = async (selected) => {
    setSelectedClass(selected);
    setSelectedInstallment({
      value: "all",
      label: "All Installments",
    });
  };

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        if (!schoolId) return;
        setLoading(true);
        const response = await axios.get(
          `${DOMAIN}/get-schooldetails/${schoolId}`
        );

        if (response.status !== 200) {
          throw new Error(
            `Unexpected response status: ${response.status} ${response.statusText}`
          );
        }

        if (!response.data || Object.keys(response.data).length === 0) {
          throw new Error("❌ API returned an empty object.");
        }

        setSchoolDetails(response.data);
      } catch (error) {
        console.error("Error fetching school details:", error);
        toast.error("Error fetching school details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchool(); // ✅ call the function here
  }, [schoolId]);

  useEffect(() => {
    const fetchInstallments = async () => {
      try {
        const params = new URLSearchParams({
          schoolId: String(schoolId),
          sessionId: String(sessionId),
        });

        // Add class filter only when a specific class is selected
        if (selectedClass.value !== "all_classes") {
          params.append("class_id", selectedClass.value);
        }

        const res = await fetch(`${DOMAIN}/api/school/installments?${params}`);

        if (!res.ok) throw new Error("Failed to fetch installments");

        const data = await res.json();

        // Format installments for Select component
        const formattedInstallments = [
          { value: "all", label: "All Installments" },
          ...data.data.map((i: any) => ({
            value: i.id,
            label: i.name,
          })),
        ];

        setInstallmentOptions(formattedInstallments);
      } catch (err) {
        console.error("Error fetching installments", err);
        toast.error("Error loading installment options");
        setInstallmentOptions([]);
      }
    };

    if (schoolId && sessionId) {
      fetchInstallments();
    }
  }, [schoolId, sessionId, selectedClass]);

  // Handle Status Change
  const handleStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption);
  };

  const formatDateTime = (date, isEnd = false) => {
    const d = new Date(date);
    if (isEnd) {
      d.setHours(23, 59, 59, 999);
    } else {
      d.setHours(0, 0, 0, 0);
    }
    return d.toISOString().slice(0, 19).replace("T", " "); // 'YYYY-MM-DD HH:MM:SS'
  };

  const fetchReportData = async (filters = null) => {
    try {
      setLoading(true);

      const effectiveClass = filters?.class || selectedClass;
      const effectiveStatus = filters?.status || selectedStatus;
      const effectiveInstallment = filters?.installment || selectedInstallment;
      const effectiveDateRange = filters?.dateRange || dateRange;

      const fromDate = formatDateTime(effectiveDateRange[0].startDate);
      const toDate = formatDateTime(effectiveDateRange[0].endDate, true);

      const params = new URLSearchParams({
        school_id: currentUser?.school_id,
        session_id: currentUser?.session_id,
        class_id: effectiveClass?.value,
        status: effectiveStatus?.value,
        installment_type: effectiveInstallment?.value,
        from_date: fromDate,
        to_date: toDate,
      });

      const response = await fetch(
        `${DOMAIN}/api/school/get-fee-collection-report?${params.toString()}`
      );
      const result = await response.json();
      console.log(result);
      if (result.message === "No transactions found for the selected filters") {
        setData([]);
      } else {
        setData(result.data);
      }
    } catch (error) {
      toast.error("Error fetching report data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (schoolId && sessionId) {
      fetchReportData();
    }
  }, [schoolId, sessionId]);

  // Handle Apply Filters
  // const handleApplyFilters = async (e) => {
  //   e.preventDefault();
  //   fetchReportData();
  // };

// const exportToPDF = () => {
//   const doc = new jsPDF({ orientation: "landscape" });
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();

//   const schoolName = "BAI NAJAMAI NOSHERWAN DASTUR PRIMARY SCHOOL";
//   const reportTitle = "DAILY FEE COLLECTION REPORT FOR THE A.Y. 2025-26";

//   const tableColumnHeaders = [
//     "Student Name", "E-Mail", "Mobile", "Class", "Section",
//     "GR No", "Fee Group", "Due Date", "Total Amt",
//     "Status", "Paid Amt", "Pay Method", "Txn ID"
//   ];

//   const tableData = data.map((item) => [
//     item.student_name || "N/A",
//     item.email || "N/A",
//     item.mobile || "N/A",
//     item.class || "N/A",
//     item.section || "N/A",
//     item.gr_number || "N/A",
//     item.fee_group_name || "N/A",
//     item.due_date
//       ? new Date(item.due_date).toLocaleDateString("en-GB")
//       : "N/A",
//     item.total_amount ? `Rs ${parseFloat(item.total_amount).toLocaleString("en-IN")}` : "Rs 0",
//     item.payment_status || "N/A",
//     item.amount_paid ? `Rs ${parseFloat(item.amount_paid).toLocaleString("en-IN")}` : "Rs 0",
//     item.pay_instrument || item.payment_method || "N/A",
//     item.pg_transaction_id || "N/A",
//   ]);

//   let totalPaid = 0;

//   const rowsPage1 = 10;
//   const rowsPerPage = 12;
//   const firstPageRows = tableData.slice(0, rowsPage1);
//   const remainingData = tableData.slice(rowsPage1);

//   const pages = [firstPageRows];
//   for (let i = 0; i < remainingData.length; i += rowsPerPage) {
//     pages.push(remainingData.slice(i, i + rowsPerPage));
//   }

//   pages.forEach((chunk, i) => {
//     if (i > 0) doc.addPage();

//     totalPaid += chunk.reduce((sum, row) => {
//       const paid = parseFloat(row[10]?.replace(/[^\d.-]/g, "")) || 0;
//       return sum + paid;
//     }, 0);

//     if (i === 0) {
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(16);
//       doc.text(schoolName, pageWidth / 2, 15, { align: "center" });

//       doc.setFontSize(12);
//       doc.text(reportTitle, pageWidth / 2, 25, { align: "center" });

//       doc.setFont("helvetica", "italic");
//       doc.setFontSize(10);
//       doc.text(
//         `Generated on: ${new Date().toLocaleDateString("en-GB", {
//           day: "2-digit", month: "long", year: "numeric"
//         })}`,
//         pageWidth / 2, 32, { align: "center" }
//       );
//     }

//     doc.autoTable({
//       startY: i === 0 ? 40 : 20,
//       head: [tableColumnHeaders],
//       body: chunk,
//       theme: "grid",
//       styles: {
//         fontSize: 8,
//         cellPadding: 2.5,
//         overflow: "linebreak",
//         halign: "left",
//       },
//       headStyles: {
//         fillColor: [68, 114, 196],
//         textColor: 255,
//         fontStyle: "bold",
//         halign: "center",
//       },
//       margin: { left: 10, right: 10 },
//       tableWidth: pageWidth - 20,
//       columnStyles: {
//         0: { cellWidth: 28 },
//         1: { cellWidth: 35 },
//         2: { cellWidth: 18 },
//         3: { cellWidth: 15 },
//         4: { cellWidth: 15 },
//         5: { cellWidth: 18 },
//         6: { cellWidth: 36 },
//         7: { cellWidth: 20 },
//         8: { cellWidth: 22 },
//         9: { cellWidth: 18 },
//         10: { cellWidth: 22 },
//         11: { cellWidth: 25 },
//         12: { cellWidth: 28 },
//       },
//       didDrawPage: (dataArg) => {
//         const pageCount = doc.internal.getNumberOfPages();
//         const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
//         doc.setFontSize(9);
//         doc.setTextColor(100);
//         doc.text(`Page ${currentPage} of ${pageCount}`, pageWidth - 30, pageHeight - 10);
//       }
//     });
//   });

//   // Final summary page
//   doc.addPage();
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(14);
//   doc.text("Summary", 14, 20);

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(11);
//   doc.setTextColor(0);
//   doc.text(`Total Paid Amount: ₹ ${totalPaid.toLocaleString("en-IN")}`, 14, 35);

//   doc.text("Note: This report includes all fee payments processed up to the date above.", 14, 45);
//   doc.text("Prepared By: ____________________", 14, 60);
//   doc.text("Verified By: ____________________", pageWidth / 2, 60);
//   doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 14, 75);

//   doc.save(``);
// };




  const handleReset = (e) => {
    e.preventDefault();

    const today = new Date();
    const todayRange = [
      {
        startDate: getStartOfDay(today),
        endDate: getEndOfDay(today),
        key: "selection",
      },
    ];
    const defaultFilters = {
      class: { value: "all_classes", label: "All Classes" },
      status: { value: "success", label: "Success" },
      installment: { value: "all", label: "All Installments" },
      dateRange: todayRange,
    };

    // Update UI state
    setSelectedClass(defaultFilters.class);
    setSelectedStatus(defaultFilters.status);
    setSelectedInstallment(defaultFilters.installment);
    setDateRange(todayRange);
    setShowDatePicker(false);

    // Fetch with reset filters immediately
    fetchReportData(defaultFilters);
  };

const exportToExcel = () => {
  const formattedData = data.map((item) => ({
    "Student Name": item.student_name || "N/A",
    "E-Mail Address": item.email || "N/A",
    "Mobile Number": item.mobile || "N/A",
    "Standard/Course": item.class || "N/A",
    Division: item.section || "N/A",
    "GR Code / Reg. Code": item.gr_number || "N/A",
    "Fee Head": item.fee_group_name || "N/A",
    "Due Date": item.due_date
      ? new Date(item.due_date).toLocaleDateString("en-GB")
      : "N/A",
    "Total Amount": item.total_amount || "0",
    "Payment Status": item.payment_status || "N/A",
    "Paid Amount": `₹ ${item.amount_paid || "0"}`,
    "Fees Paid Date": item.transaction_date
      ? new Date(item.transaction_date).toLocaleDateString("en-GB")
      : "N/A",
    "Transaction ID": item.transaction_id || "N/A",
    "Receipt Number": item.receipt_number || "N/A",
    "Payment Option": item.payment_method || "N/A",
    "Payment Instrument": item.pay_instrument || "N/A",
  }));

  // Step 1: Create a worksheet with decorative title rows
  const worksheet = XLSX.utils.aoa_to_sheet([
    [`${schoolDetails?.name || ''}`],
    [`DAILY FEE COLLECTION REPORT FOR THE A.Y. 2025-26`],
    [`Generated on: ${new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    })}`],
    [], // Empty row before table
  ]);

  // Merge cells for proper alignment across more columns to cover the data
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 15 } }, // Merge A1:P1 for school name
    { s: { r: 1, c: 0 }, e: { r: 1, c: 15 } }, // Merge A2:P2 for report title
    { s: { r: 2, c: 0 }, e: { r: 2, c: 15 } }, // Merge A3:P3 for generation date
    { s: { r: 3, c: 0 }, e: { r: 3, c: 15 } }, // Merge A4:P4 for empty row
  ];

  // Define decorative styling for header rows
  const headerStyle = {
    alignment: {
      horizontal: 'center',
      vertical: 'center',
    },
    font: {
      bold: true,
      size: 12,
      color: { rgb: "333333" }
    },
    fill: {
      fgColor: { rgb: "E8E8E8" }, // Light gray background
      patternType: "solid"
    },
    border: {
      top: { style: "thin", color: { rgb: "CCCCCC" } },
      bottom: { style: "thin", color: { rgb: "CCCCCC" } },
      left: { style: "thin", color: { rgb: "CCCCCC" } },
      right: { style: "thin", color: { rgb: "CCCCCC" } }
    }
  };

  // Special style for generation date (slightly smaller font)
  const dateStyle = {
    ...headerStyle,
    font: {
      bold: true,
      size: 10,
      color: { rgb: "666666" },
      italic: true
    }
  };

  // Apply styles to header cells
  const headerCells = ['A1', 'A2', 'A3', 'A4'];
  headerCells.forEach((cell, index) => {
    if (!worksheet[cell]) return;
    
    // Apply appropriate style based on row
    if (index === 2) { // Generation date row
      worksheet[cell].s = dateStyle;
    } else {
      worksheet[cell].s = headerStyle;
    }
  });

  // Apply header style to table headers (row 5)
  const tableHeaderStyle = {
    alignment: {
      horizontal: 'center',
      vertical: 'center',
    },
    font: {
      bold: true,
      size: 11,
      color: { rgb: "FFFFFF" }
    },
    fill: {
      fgColor: { rgb: "4472C4" }, // Blue background
      patternType: "solid"
    },
    border: {
      top: { style: "thin", color: { rgb: "FFFFFF" } },
      bottom: { style: "thin", color: { rgb: "FFFFFF" } },
      left: { style: "thin", color: { rgb: "FFFFFF" } },
      right: { style: "thin", color: { rgb: "FFFFFF" } }
    }
  };

  // Apply table header styles after adding data
  const tableHeaders = Object.keys(formattedData[0] || {});
  tableHeaders.forEach((header, index) => {
    const cellRef = XLSX.utils.encode_cell({ r: 4, c: index });
    if (!worksheet[cellRef]) return;
    worksheet[cellRef].s = tableHeaderStyle;
  });

  // Set row heights for better appearance
  worksheet['!rows'] = [
    { hpt: 25 }, // Row 1 height
    { hpt: 20 }, // Row 2 height  
    { hpt: 18 }, // Row 3 height (date)
    { hpt: 15 }, // Row 4 height (empty row)
  ];

  // Optional: Add protection to make header rows "disabled" (read-only)
  // worksheet['!protect'] = {
  //   password: "",
  //   selectLockedCells: false,
  //   selectUnlockedCells: true,
  //   formatCells: false,
  //   formatColumns: false,
  //   formatRows: false,
  //   insertColumns: false,
  //   insertRows: false,
  //   insertHyperlinks: false,
  //   deleteColumns: false,
  //   deleteRows: false,
  //   sort: false,
  //   autoFilter: false,
  //   pivotTables: false
  // };

  // Mark header cells as locked (protected)
  headerCells.forEach(cell => {
    if (worksheet[cell]) {
      worksheet[cell].s = {
        ...worksheet[cell].s,
        protection: {
          locked: true
        }
      };
    }
  });

  // Step 2: Add table headers and data starting from row 5
  XLSX.utils.sheet_add_json(worksheet, formattedData, {
    origin: "A5",
    skipHeader: false,
  });

  // Step 3: Calculate summary rows
  const totalPaid = formattedData.reduce((sum, item) => {
    const num = Number((item["Paid Amount"] || "0").replace(/[₹, ]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const noteStartRow = formattedData.length + 7;

  // Step 4: Add notes, summary, and footer
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [
      [],
      [`Note: This report contains fee collection summary till date.`],
      [`Total Paid Amount: ₹ ${totalPaid.toLocaleString("en-IN")}`],
      [],
      [`Prepared By: ____________________`, `Verified By: ____________________`],
      [`Date: ${new Date().toLocaleDateString("en-GB")}`],
    ],
    { origin: `A${noteStartRow}` }
  );

  // Step 4.1: Style the footer section
  const footerStyle = {
    alignment: {
      horizontal: 'left',
      vertical: 'center',
    },
    font: {
      bold: true,
      size: 11,
      color: { rgb: "333333" }
    },
    fill: {
      fgColor: { rgb: "F5F5F5" }, // Very light gray background
      patternType: "solid"
    },
    border: {
      top: { style: "thin", color: { rgb: "CCCCCC" } },
      bottom: { style: "thin", color: { rgb: "CCCCCC" } },
      left: { style: "thin", color: { rgb: "CCCCCC" } },
      right: { style: "thin", color: { rgb: "CCCCCC" } }
    }
  };

  const totalAmountStyle = {
    ...footerStyle,
    font: {
      bold: true,
      size: 12,
      color: { rgb: "2E7D32" } // Green color for total amount
    }
  };

  // Apply styles to footer cells
  const footerCells = [
    `A${noteStartRow + 1}`, // Note row
    `A${noteStartRow + 2}`, // Total Paid Amount row
    `A${noteStartRow + 4}`, // Prepared By row
    `B${noteStartRow + 4}`, // Verified By row
    `A${noteStartRow + 5}`, // Date row
  ];

  footerCells.forEach((cell, index) => {
    if (!worksheet[cell]) return;
    
    // Apply special style for total amount
    if (index === 1) {
      worksheet[cell].s = totalAmountStyle;
    } else {
      worksheet[cell].s = footerStyle;
    }
  });

  // Merge cells for footer sections
  const footerMerges = [
    { s: { r: noteStartRow + 1, c: 0 }, e: { r: noteStartRow + 1, c: 6 } }, // Note row
    { s: { r: noteStartRow + 2, c: 0 }, e: { r: noteStartRow + 2, c: 6 } }, // Total amount row
    { s: { r: noteStartRow + 4, c: 0 }, e: { r: noteStartRow + 4, c: 3 } }, // Prepared By
    { s: { r: noteStartRow + 4, c: 4 }, e: { r: noteStartRow + 4, c: 7 } }, // Verified By
    { s: { r: noteStartRow + 5, c: 0 }, e: { r: noteStartRow + 5, c: 3 } }, // Date
  ];

  // Add footer merges to existing merges
  worksheet['!merges'] = [...(worksheet['!merges'] || []), ...footerMerges];

  // Set row heights for footer
  if (!worksheet['!rows']) worksheet['!rows'] = [];
  worksheet['!rows'][noteStartRow + 1] = { hpt: 20 }; // Note row
  worksheet['!rows'][noteStartRow + 2] = { hpt: 22 }; // Total amount row
  worksheet['!rows'][noteStartRow + 4] = { hpt: 20 }; // Prepared/Verified row
  worksheet['!rows'][noteStartRow + 5] = { hpt: 18 }; // Date row

  // Step 5: Set column widths for better layout
  worksheet['!cols'] = [
    { wch: 20 }, // Student Name
    { wch: 25 }, // E-Mail Address
    { wch: 15 }, // Mobile Number
    { wch: 15 }, // Standard/Course
    { wch: 10 }, // Division
    { wch: 15 }, // GR Code
    { wch: 20 }, // Fee Head
    { wch: 12 }, // Due Date
    { wch: 12 }, // Total Amount
    { wch: 15 }, // Payment Status
    { wch: 12 }, // Paid Amount
    { wch: 15 }, // Fees Paid Date
    { wch: 15 }, // Transaction ID
    { wch: 15 }, // Receipt Number
    { wch: 15 }, // Payment Option
    { wch: 15 }, // Payment Instrument
  ];

  // Step 6: Export
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Fees Collection Report");
  XLSX.writeFile(workbook, "Fees_Collection_Report.xlsx");
};

  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let timerInterval;

    if (loading) {
      const maxDuration = 5; // Set the maximum countdown duration in seconds
      setTimer(maxDuration); // Initialize timer with the maximum duration

      timerInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) {
            return prev - 1; // Decrement timer
          } else {
            clearInterval(timerInterval); // Stop countdown when it reaches 0
            return 0; // Ensure it doesn't go below 0
          }
        });
      }, 1000);
    } else {
      clearInterval(timerInterval); // Clear timer when loading stops
    }

    return () => clearInterval(timerInterval); // Cleanup on unmount
  }, [loading]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins > 0 ? `${mins}m ` : ""}${secs}s`;
  };

  const handleBack = () => {
    Navigate(-1);
  };

  // const handleReset = () => {
  //   setSelectedClass({ value: "all_classes", label: "All Classes" });
  //   setSelectedStatus(null);
  //   setSelectedInstallment(null);
  // };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showDatePicker]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = data?.filter(
    (student) =>
      (student?.student_name ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (student?.gr_number ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const recordsPerPage = 15;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        backgroundColor: "#F2F6FF",
        borderRadius: "15px",
        padding: "10px",
        height: "100%",
      }}
    >
      <div
        className="modal-header mx-5"
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
          className="btn btn-md btn-icon btn-active-color-primary p-0"
          onClick={handleBack}
        >
          <i className="fas fa-arrow-left"></i>
        </div>
        <h2> Fees Transcation Report </h2>
      </div>

      {/* Student Details Section */}
      <div
        className="student-details mx-5"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "5px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          fontFamily: "Manrope",
          color: "#1C335C",
          zIndex: "9",
        }}
      >
        <Form>
          <Row>
            {/* Class Dropdown */}
            <Col md={4}>
              <Form.Group className="mb-3" controlId="classSelect">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Class
                </Form.Label>
                <Select
                  options={classOptions}
                  onChange={handleClassChange}
                  value={selectedClass}
                  placeholder="Select Class"
                  className="basic-single-select"
                  classNamePrefix="select"
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                      position: "absolute",
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "400",
                    }),
                  }}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3" controlId="dateRange">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Date Range
                </Form.Label>
                <div style={{ position: "relative" }}>
                  <button
                    className="btn btn-outline-secondary d-flex align-items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowDatePicker(true);
                    }}
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #CCCCCC",
                      borderRadius: "4px",
                      padding: "8px 12px",
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "400",
                    }}
                  >
                    <i className="bi bi-calendar-range me-2"></i>
                    {formatDisplayDate(dateRange[0].startDate)} -{" "}
                    {formatDisplayDate(dateRange[0].endDate)}
                    <i className="bi bi-chevron-down ms-2"></i>
                  </button>

                  {showDatePicker && (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: 20000,
                        top: "100%",
                        left: 0,
                        backgroundColor: "#fff",
                        border: "1px solid #dee2e6",
                        borderRadius: "4px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        padding: "10px",
                        marginTop: "5px",
                      }}
                    >
                      <DateRange
                        editableDateInputs={true}
                        onChange={(item) => setDateRange([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={dateRange}
                        maxDate={new Date()}
                        className="daterange"
                      />
                      <div className="d-flex justify-content-end mt-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setShowDatePicker(false)}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3" controlId="statusSelect">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Status Type
                </Form.Label>
                <Select
                  options={[
                    { value: "success", label: "Success" },
                    { value: "cancelled", label: "Cancelled" },
                    { value: "pending", label: "Pending" },
                  ]}
                  onChange={handleStatusChange}
                  value={selectedStatus}
                  placeholder="Select Status"
                  classNamePrefix="select"
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                      position: "absolute",
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "400",
                    }),
                  }}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3" controlId="searchTypeSelect">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Installment Type
                </Form.Label>
                <Select
                  options={installmentOptions}
                  value={selectedInstallment}
                  onChange={(selected) => setSelectedInstallment(selected)}
                  placeholder="Select Installment Type"
                  isDisabled={installmentOptions.length === 0}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                      position: "absolute",
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "400",
                    }),
                  }}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              </Form.Group>
            </Col>

            <Col md={8}>
              <div
                className="d-flex"
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                  textAlign: "center",
                  gap: "5px",
                }}
              >
                {/* Action Buttons */}
                <div className="d-flex mt-4">
                  <button
                    className="btn btn-primary"
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      fetchReportData();
                    }}
                  >
                    Apply Filters
                  </button>

                  <button
                    className="btn btn-secondary ms-2"
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>

                {/* Export Buttons */}
                <div className="d-flex gap-2 mt-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Name or GR No"
                    style={{
                      maxWidth: "380px",
                      height: "43px",
                      // width:'380px',
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {/* <button
                    className="btn"
                    type="button" // ADD THIS LINE
                    onClick={exportToPDF}
                    style={{
                      outline: "none",
                      border: "none",
                      backgroundColor: "#F3F3F3",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      width: "51px",
                      height: "43px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 25H15C18.7712 25 20.6569 25 21.8284 23.7113C23 22.4225 23 20.3484 23 16.2V15.7192C23 13.7891 23 10.8241 22.654 9.96951C22.308 9.11492 21.6559 8.46935 20.3517 7.1782L18.3929 5.25901C17.2651 4.14243 16.7012 3.58414 16.0092 3.29207C15.3173 3 12.5548 3 11.0298 3C7.23869 3 5.34315 3 4.17157 4.28873C3 5.57746 3 7.65164 3 11.8V16.2C3 20.3484 3 22.4225 4.17157 23.7113C5.34315 25 7.22876 25 11 25Z"
                        fill="#1C274C"
                      />
                      <path
                        d="M18.3929 5.25901L17.8653 5.79201L17.8681 5.79473L18.3929 5.25901ZM20.3517 7.1782L20.8794 6.6452L20.8766 6.64248L20.3517 7.1782ZM22.654 9.96951L21.9588 10.251V10.251L22.654 9.96951ZM4.17157 23.7113L4.72653 23.2068H4.72653L4.17157 23.7113ZM21.8284 23.7113L21.2735 23.2068V23.2068L21.8284 23.7113ZM15 24.25H11V25.75H15V24.25ZM3.75 16.2V11.8H2.25V16.2H3.75ZM22.25 15.7192V16.2H23.75V15.7192H22.25ZM17.8681 5.79473L19.8268 7.71392L20.8766 6.64248L18.9178 4.7233L17.8681 5.79473ZM23.75 15.7192C23.75 14.7571 23.7501 13.5181 23.7062 12.4113C23.6842 11.8581 23.6508 11.3266 23.5992 10.8723C23.5501 10.4396 23.4773 10.0045 23.3492 9.68804L21.9588 10.251C22.0037 10.3618 22.0607 10.6178 22.1088 11.0417C22.1545 11.4441 22.1861 11.9347 22.2073 12.4708C22.2499 13.5426 22.25 14.7512 22.25 15.7192H23.75ZM19.8241 7.71119C21.171 9.04465 21.6839 9.57188 21.9588 10.251L23.3492 9.68804C22.9321 8.65797 22.1408 7.89405 20.8794 6.64521L19.8241 7.71119ZM11.0298 3.75C11.7947 3.75 12.8524 3.75009 13.8036 3.78598C14.2798 3.80394 14.718 3.8305 15.0732 3.86888C15.4571 3.91036 15.6578 3.95782 15.7176 3.98304L16.3009 2.60111C16.0147 2.48029 15.6106 2.41822 15.2343 2.37756C14.8293 2.33379 14.3518 2.30559 13.8602 2.28704C12.876 2.24991 11.7899 2.25 11.0298 2.25V3.75ZM18.9206 4.72602C17.8367 3.65297 17.1576 2.96274 16.3009 2.60111L15.7176 3.98304C16.2447 4.20554 16.6935 4.63189 17.8653 5.792L18.9206 4.72602ZM11 24.25C9.09112 24.25 7.74235 24.2481 6.72064 24.097C5.72841 23.9502 5.15365 23.6766 4.72653 23.2068L3.61662 24.2158C4.36107 25.0347 5.31491 25.4054 6.50119 25.5808C7.65799 25.7519 9.13764 25.75 11 25.75V24.25ZM2.25 16.2C2.25 18.2549 2.24868 19.8647 2.40199 21.119C2.55711 22.3881 2.88145 23.4071 3.61662 24.2158L4.72653 23.2068C4.29013 22.7267 4.02868 22.0642 3.89091 20.937C3.75132 19.795 3.75 18.2935 3.75 16.2H2.25ZM15 25.75C16.8624 25.75 18.342 25.7519 19.4988 25.5808C20.6851 25.4054 21.6389 25.0347 22.3834 24.2158L21.2735 23.2068C20.8464 23.6766 20.2716 23.9502 19.2794 24.097C18.2577 24.2481 16.9089 24.25 15 24.25V25.75ZM22.25 16.2C22.25 18.2935 22.2487 19.795 22.1091 20.937C21.9713 22.0642 21.7099 22.7267 21.2735 23.2068L22.3834 24.2158C23.1186 23.4071 23.4429 22.3881 23.598 21.119C23.7513 19.8647 23.75 18.2549 23.75 16.2H22.25ZM3.75 11.8C3.75 9.7065 3.75132 8.20504 3.89091 7.06299C4.02868 5.93577 4.29013 5.27328 4.72653 4.79323L3.61662 3.78423C2.88145 4.59291 2.55711 5.61188 2.40199 6.88101C2.24868 8.13533 2.25 9.74514 2.25 11.8H3.75ZM11.0298 2.25C9.15742 2.25 7.6706 2.2481 6.50912 2.41909C5.31874 2.59434 4.36168 2.96466 3.61662 3.78423L4.72653 4.79323C5.15304 4.32407 5.72954 4.05003 6.7276 3.90309C7.75456 3.7519 9.11106 3.75 11.0298 3.75V2.25Z"
                        fill="#1C274C"
                      />
                      <path
                        d="M15 3.66667V1L25 9H20.5556C17.9366 9 16.6272 9 15.8136 8.21895C15 7.4379 15 6.18082 15 3.66667Z"
                        fill="#8694C4"
                      />
                      <path
                        d="M15 1L15.4685 0.414348C15.2434 0.234246 14.935 0.199133 14.6751 0.324023C14.4153 0.448913 14.25 0.711696 14.25 1L15 1ZM25 9V9.75C25.3185 9.75 25.6023 9.54882 25.7077 9.24825C25.8132 8.94769 25.7172 8.61332 25.4685 8.41435L25 9ZM15.8136 8.21895L15.2942 8.75999H15.2942L15.8136 8.21895ZM14.25 1V3.66667H15.75V1H14.25ZM20.5556 9.75H25V8.25H20.5556V9.75ZM14.25 3.66667C14.25 4.90168 14.2483 5.9065 14.3589 6.69675C14.4731 7.51182 14.7195 8.2083 15.2942 8.75999L16.333 7.67791C16.0941 7.44856 15.9337 7.12597 15.8445 6.4887C15.7517 5.82661 15.75 4.94581 15.75 3.66667H14.25ZM20.5556 8.25C19.2257 8.25 18.3008 8.24853 17.6036 8.15854C16.9249 8.07094 16.5762 7.91139 16.333 7.67791L15.2942 8.75999C15.8646 9.30756 16.5774 9.53854 17.4116 9.6462C18.2272 9.75147 19.2665 9.75 20.5556 9.75V8.25ZM14.5315 1.58565L24.5315 9.58565L25.4685 8.41435L15.4685 0.414348L14.5315 1.58565Z"
                        fill="#F3F3F3"
                      />
                      <path
                        d="M4.7 22V14.8H7.61C7.68 14.8 7.76667 14.8033 7.87 14.81C7.97333 14.8133 8.07167 14.8233 8.165 14.84C8.565 14.9033 8.89833 15.04 9.165 15.25C9.435 15.46 9.63667 15.725 9.77 16.045C9.90333 16.365 9.97 16.7183 9.97 17.105C9.97 17.495 9.90333 17.85 9.77 18.17C9.63667 18.49 9.435 18.755 9.165 18.965C8.89833 19.175 8.565 19.3117 8.165 19.375C8.07167 19.3883 7.97167 19.3983 7.865 19.405C7.76167 19.4117 7.67667 19.415 7.61 19.415H5.745V22H4.7ZM5.745 18.425H7.57C7.63667 18.425 7.71 18.4217 7.79 18.415C7.87333 18.4083 7.95167 18.3967 8.025 18.38C8.23833 18.33 8.41 18.2383 8.54 18.105C8.67 17.9683 8.76333 17.8117 8.82 17.635C8.87667 17.4583 8.905 17.2817 8.905 17.105C8.905 16.9283 8.87667 16.7533 8.82 16.58C8.76333 16.4033 8.67 16.2483 8.54 16.115C8.41 15.9783 8.23833 15.885 8.025 15.835C7.95167 15.815 7.87333 15.8017 7.79 15.795C7.71 15.7883 7.63667 15.785 7.57 15.785H5.745V18.425ZM10.9695 22V14.8H13.2245C13.2912 14.8 13.4145 14.8017 13.5945 14.805C13.7779 14.8083 13.9529 14.8217 14.1195 14.845C14.6829 14.915 15.1562 15.1167 15.5395 15.45C15.9262 15.7833 16.2179 16.2067 16.4145 16.72C16.6112 17.23 16.7095 17.79 16.7095 18.4C16.7095 19.0133 16.6112 19.5767 16.4145 20.09C16.2179 20.6 15.9262 21.0217 15.5395 21.355C15.1562 21.685 14.6829 21.885 14.1195 21.955C13.9529 21.9783 13.7779 21.9917 13.5945 21.995C13.4145 21.9983 13.2912 22 13.2245 22H10.9695ZM12.0395 21.005H13.2245C13.3379 21.005 13.4729 21.0017 13.6295 20.995C13.7862 20.9883 13.9245 20.975 14.0445 20.955C14.4112 20.885 14.7079 20.7267 14.9345 20.48C15.1645 20.23 15.3329 19.9233 15.4395 19.56C15.5462 19.1967 15.5995 18.81 15.5995 18.4C15.5995 17.9767 15.5445 17.585 15.4345 17.225C15.3245 16.8617 15.1545 16.5583 14.9245 16.315C14.6979 16.0683 14.4045 15.9117 14.0445 15.845C13.9245 15.8217 13.7845 15.8083 13.6245 15.805C13.4679 15.7983 13.3345 15.795 13.2245 15.795H12.0395V21.005ZM17.8738 22V14.8H22.1388V15.845H18.9188V17.875H21.5388V18.925H18.9188V22H17.8738Z"
                        fill="white"
                      />
                    </svg>
                  </button> */}

                  <button
                    className="btn"
                    type="button" // ADD THIS LINE
                    onClick={exportToExcel}
                    style={{
                      outline: "none",
                      border: "none",
                      backgroundColor: "#F3F3F3",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      width: "51px",
                      height: "43px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.7322 3.25901L15.2305 3.81648L15.7322 3.25901ZM20.0869 7.1782L19.5852 7.73567L20.0869 7.1782ZM22.6194 9.96951L21.9343 10.2746V10.2746L22.6194 9.96951ZM2.28873 21.7113L2.81906 21.1809H2.81906L2.28873 21.7113ZM21.7113 21.7113L21.1809 21.1809L21.1809 21.1809L21.7113 21.7113ZM14.2 22.25H9.8V23.75H14.2V22.25ZM1.75 14.2V9.8H0.25V14.2H1.75ZM22.25 13.7192V14.2H23.75V13.7192H22.25ZM15.2305 3.81648L19.5852 7.73567L20.5886 6.62073L16.234 2.70154L15.2305 3.81648ZM23.75 13.7192C23.75 11.8554 23.7651 10.6986 23.3045 9.66438L21.9343 10.2746C22.2349 10.9496 22.25 11.7229 22.25 13.7192H23.75ZM19.5852 7.73567C21.069 9.07113 21.6337 9.59971 21.9343 10.2746L23.3045 9.66438C22.8439 8.63013 21.974 7.86756 20.5886 6.62073L19.5852 7.73567ZM9.83277 1.75C11.5671 1.75 12.2402 1.76158 12.8414 1.99229L13.3788 0.591855C12.4578 0.238421 11.4535 0.25 9.83277 0.25V1.75ZM16.234 2.70154C15.0352 1.62264 14.2998 0.945248 13.3788 0.591855L12.8414 1.99229C13.4428 2.22303 13.948 2.66222 15.2305 3.81648L16.234 2.70154ZM9.8 22.25C7.70462 22.25 6.20853 22.2484 5.07194 22.0956C3.95693 21.9457 3.30085 21.6627 2.81906 21.1809L1.7584 22.2416C2.56534 23.0485 3.59072 23.4099 4.87207 23.5822C6.13184 23.7516 7.74702 23.75 9.8 23.75V22.25ZM0.25 14.2C0.25 16.253 0.248407 17.8682 0.417779 19.1279C0.590052 20.4093 0.951458 21.4347 1.7584 22.2416L2.81906 21.1809C2.33727 20.6992 2.05431 20.0431 1.9044 18.9281C1.75159 17.7915 1.75 16.2954 1.75 14.2H0.25ZM14.2 23.75C16.253 23.75 17.8682 23.7516 19.1279 23.5822C20.4093 23.4099 21.4347 23.0485 22.2416 22.2416L21.1809 21.1809C20.6992 21.6627 20.0431 21.9457 18.9281 22.0956C17.7915 22.2484 16.2954 22.25 14.2 22.25V23.75ZM22.25 14.2C22.25 16.2954 22.2484 17.7915 22.0956 18.9281C21.9457 20.0431 21.6627 20.6992 21.1809 21.1809L22.2416 22.2416C23.0485 21.4347 23.4099 20.4093 23.5822 19.1279C23.7516 17.8682 23.75 16.253 23.75 14.2H22.25ZM1.75 9.8C1.75 7.70462 1.75159 6.20853 1.9044 5.07194C2.05431 3.95692 2.33727 3.30085 2.81906 2.81906L1.7584 1.7584C0.951458 2.56534 0.590052 3.59072 0.417779 4.87207C0.248407 6.13184 0.25 7.74702 0.25 9.8H1.75ZM9.83277 0.25C7.7688 0.25 6.14567 0.248421 4.88071 0.417719C3.59473 0.58983 2.56593 0.950874 1.7584 1.7584L2.81906 2.81906C3.30026 2.33786 3.95838 2.05454 5.07969 1.90446C6.222 1.75158 7.72654 1.75 9.83277 1.75V0.25Z"
                        fill="#1C274C"
                      />
                      <path
                        d="M13 1V4C13 6.82843 13 8.24264 13.8136 9.12132C14.6272 10 15.9366 10 18.5556 10H23"
                        stroke="#1C274C"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M3.1 20L5.575 16.355L3.165 12.8H4.25L6.115 15.605L7.975 12.8H9.065L6.655 16.355L9.125 20H8.04L6.115 17.11L4.19 20H3.1ZM10.0207 20V12.8H10.9107V19.155H14.2507V20H10.0207ZM17.6515 20.15C17.1415 20.15 16.6815 20.0633 16.2715 19.89C15.8648 19.7167 15.5282 19.47 15.2615 19.15C14.9982 18.8267 14.8265 18.445 14.7465 18.005L15.6665 17.86C15.7832 18.3133 16.0248 18.6683 16.3915 18.925C16.7615 19.1783 17.1965 19.305 17.6965 19.305C18.0198 19.305 18.3115 19.255 18.5715 19.155C18.8348 19.0517 19.0432 18.905 19.1965 18.715C19.3498 18.525 19.4265 18.3 19.4265 18.04C19.4265 17.88 19.3982 17.7433 19.3415 17.63C19.2882 17.5133 19.2132 17.415 19.1165 17.335C19.0232 17.2517 18.9165 17.1817 18.7965 17.125C18.6765 17.0683 18.5515 17.0217 18.4215 16.985L16.5865 16.44C16.3865 16.38 16.1932 16.305 16.0065 16.215C15.8198 16.1217 15.6532 16.0067 15.5065 15.87C15.3598 15.73 15.2432 15.5633 15.1565 15.37C15.0698 15.1733 15.0265 14.9417 15.0265 14.675C15.0265 14.2483 15.1365 13.885 15.3565 13.585C15.5798 13.2817 15.8815 13.05 16.2615 12.89C16.6415 12.73 17.0698 12.6517 17.5465 12.655C18.0298 12.6583 18.4615 12.745 18.8415 12.915C19.2248 13.0817 19.5415 13.3217 19.7915 13.635C20.0448 13.9483 20.2148 14.3233 20.3015 14.76L19.3565 14.925C19.3065 14.6317 19.1948 14.38 19.0215 14.17C18.8515 13.9567 18.6382 13.7933 18.3815 13.68C18.1248 13.5633 17.8432 13.5033 17.5365 13.5C17.2432 13.4967 16.9782 13.5433 16.7415 13.64C16.5048 13.7367 16.3165 13.8717 16.1765 14.045C16.0365 14.215 15.9665 14.4117 15.9665 14.635C15.9665 14.855 16.0298 15.0333 16.1565 15.17C16.2832 15.3033 16.4382 15.41 16.6215 15.49C16.8082 15.5667 16.9898 15.63 17.1665 15.68L18.5365 16.075C18.6932 16.1183 18.8732 16.1783 19.0765 16.255C19.2832 16.3317 19.4832 16.44 19.6765 16.58C19.8698 16.7167 20.0298 16.9 20.1565 17.13C20.2832 17.3567 20.3465 17.6433 20.3465 17.99C20.3465 18.3367 20.2765 18.645 20.1365 18.915C19.9998 19.185 19.8082 19.4117 19.5615 19.595C19.3148 19.775 19.0282 19.9117 18.7015 20.005C18.3748 20.1017 18.0248 20.15 17.6515 20.15Z"
                        fill="#1C274C"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Fee Collection Table */}
      <div
        className="modal-body px-lg-5"
        style={{ backgroundColor: "#F2F6FF", fontFamily: "Manrope" }}
      >
        <div
          style={{
            overflowX: "auto",
            position: "relative",
            borderRadius: "10px",
          }}
        >
          <table
            style={{
              minWidth: "100%",
              tableLayout: "fixed",
              borderCollapse: "separate",
              borderSpacing: "1px 0 #000",
            }}
          >
            <thead
              style={{
                backgroundColor: "#fff",
                borderBottom: "1px solid #E0E4F0",
                fontFamily: "Manrope",
                fontSize: "14px",
                color: "#1C335C",
              }}
            >
              <tr
                style={{
                  backgroundColor: "#C4E1E6",
                  borderBottom: "1px solid #E0E4F0",
                  fontFamily: "Manrope",
                  fontWeight: "600",
                  color: "#1C335C",
                  fontSize: "14px",
                }}
              >
                <th
                  style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 99, // higher z-index to ensure it stays on top
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    backgroundColor: "#C4E1E6", // matches sticky cell background
                  }}
                >
                  Student Name
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  E-Mail
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Mobile
                </th>
                <th
                  style={{
                    padding: "10px 15px",
                    textAlign: "left",
                    minWidth: "100px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Class
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "100px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Section
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "100px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  GR No.
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Invoice Number
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Fee Head
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Due Date
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Total Amount
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Payment Status
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Paid Amount
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "180px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Fees Paid Date
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Transaction ID
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Receipt Number
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Payment Option
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Payment Instrument
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="15" className="text-center p-4">
                    <div className="d-flex justify-content-center align-items-center">
                      <Spinner
                        animation="border"
                        role="status"
                        className="mr-2"
                      />
                      <span>
                        Getting and formatting data for you...{" "}
                        <strong>{formatTime(timer)}</strong>
                      </span>
                    </div>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                currentRecords.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "#EEEFE0" : ""}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#EEEFE0" : "#FFFFFF",
                      borderBottom: "1px solid #E0E4F0",
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      color: "#1C335C",
                    }}
                  >
                    <td
                      style={{
                        position: "sticky",
                        left: 0,
                        zIndex: 1, // lower z-index to align with header
                        backgroundColor: index % 2 === 0 ? "#EEEFE0" : "#fff",
                        minWidth: "180px",
                        padding: "10px 15px",
                        textAlign: "left",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "700",
                      }}
                    >
                      {item.student_name || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "180px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.email || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "150px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.mobile || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "100px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.class || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "100px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.section || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "120px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.gr_number || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "300px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.invoice_no || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "300px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.fee_group_name || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "150px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.due_date
                        ? new Date(item.due_date).toLocaleDateString(
                            "en-GB"
                          )
                        : "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "100px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.total_amount || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "80px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.payment_status || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "150px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.amount_paid || "N/A"}
                    </td>
                      <td
                        style={{
                          padding: "10px 15px",
                          textAlign: "left",
                          minWidth: "150px",
                          fontFamily: "Manrope",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        {item.transaction_date
                          ? new Date(item.transaction_date).toLocaleDateString(
                              "en-GB"
                            )
                          : "N/A"}
                      </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "180px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.transaction_id || "0.00"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "180px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.receipt_number || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "150px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.payment_method || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "150px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.pay_instrument || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="15" className="text-center p-4">
                    No data available. Please adjust your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
          <div
            className="pagination-controls"
            style={{
              marginTop: "20px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                backgroundColor: currentPage === 1 ? "#f5f5f5" : "#fff",
                color: currentPage === 1 ? "#999" : "#333",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                fontSize: "14px",
              }}
              onMouseOver={(e) => {
                if (currentPage !== 1) {
                  e.target.style.backgroundColor = "#f0f0f0";
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== 1) {
                  e.target.style.backgroundColor = "#fff";
                }
              }}
            >
              ««
            </button>

            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                backgroundColor: currentPage === 1 ? "#f5f5f5" : "#fff",
                color: currentPage === 1 ? "#999" : "#333",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                fontSize: "14px",
              }}
              onMouseOver={(e) => {
                if (currentPage !== 1) {
                  e.target.style.backgroundColor = "#f0f0f0";
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== 1) {
                  e.target.style.backgroundColor = "#fff";
                }
              }}
            >
              ‹ Prev
            </button>

            <span
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                color: "#000",
              }}
            >
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                backgroundColor:
                  currentPage === totalPages ? "#f5f5f5" : "#fff",
                color: currentPage === totalPages ? "#999" : "#333",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                fontSize: "14px",
              }}
              onMouseOver={(e) => {
                if (currentPage !== totalPages) {
                  e.target.style.backgroundColor = "#f0f0f0";
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== totalPages) {
                  e.target.style.backgroundColor = "#fff";
                }
              }}
            >
              Next ›
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                backgroundColor:
                  currentPage === totalPages ? "#f5f5f5" : "#fff",
                color: currentPage === totalPages ? "#999" : "#333",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                fontSize: "14px",
              }}
              onMouseOver={(e) => {
                if (currentPage !== totalPages) {
                  e.target.style.backgroundColor = "#f0f0f0";
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== totalPages) {
                  e.target.style.backgroundColor = "#fff";
                }
              }}
            >
              »»
            </button>
          </div>
      </div>
    </div>
  );
};

export { TablesWidget73 };
