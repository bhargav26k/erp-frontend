import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import Select from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { CreateOutstandingDetails } from "../../modals/create-app-stepper/CreateOutstandingDetails";
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

const customSelectStyles = {
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
    position: "absolute",
    fontFamily: "Manrope",
    fontSize: "14px",
    fontWeight: "400",
  }),
  control: (base, state) => ({
    ...base,
    minHeight: "43px",
    borderColor: state.isFocused ? "#007bff" : "#ced4da",
    boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(0,123,255,.25)" : "none",
    "&:hover": {
      borderColor: "#007bff",
    },
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#e3f2fd",
    borderRadius: "4px",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#1565c0",
    fontSize: "13px",
    fontWeight: "500",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#1565c0",
    ":hover": {
      backgroundColor: "#bbdefb",
      color: "#0d47a1",
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#007bff"
      : state.isFocused
      ? "#f8f9fa"
      : "white",
    color: state.isSelected ? "white" : "#333",
    ":active": {
      backgroundColor: state.isSelected ? "#007bff" : "#e9ecef",
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#6c757d",
    fontSize: "14px",
  }),
};


const TablesWidget87 = () => {
  const [data, setData] = useState<ApplicationData[]>([]);
  const [classOptions, setClassOptions] = useState([]);
  const [schoolDetails, setSchoolDetails] = useState(null);

  const [installmentOptions, setInstallmentOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState([
    { value: "all_classes", label: "All Classes" },
  ]);

  const [selectedInstallment, setSelectedInstallment] = useState([
    { value: "all", label: "All Installments" },
  ]);

  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const sessionId = currentUser?.session_id;
  const sessionName = currentUser?.session_name;
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const Navigate = useNavigate();
  const filteredData = data?.filter(
    (student) =>
      (student?.student_name ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (student?.gen_reg_no ?? "")
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

  const handleClassChange = (selected) => {
    // Handle single select - selected is an object, not an array
    setSelectedClass(
      selected || { value: "all_classes", label: "All Classes" }
    );

    // Reset installment filter whenever class changes
    setSelectedInstallment([{ value: "all", label: "All Installments" }]);
  };
  useEffect(() => {
    const fetchInstallments = async () => {
      try {
        const params = new URLSearchParams({
          schoolId: String(schoolId),
          sessionId: String(sessionId),
        });

        // Add class filter only when a specific class is selected
        // selectedClass is now a single object, not an array
        if (selectedClass?.value && selectedClass.value !== "all_classes") {
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

        // Reset installment selection to "All Installments" when class changes
        setSelectedInstallment([{ value: "all", label: "All Installments" }]);
      } catch (err) {
        console.error("Error fetching installments", err);
        toast.error("Error loading installment options");
        setInstallmentOptions([{ value: "all", label: "All Installments" }]);
      }
    };

    if (schoolId && sessionId) {
      fetchInstallments();
    }
  }, [schoolId, sessionId, selectedClass]);
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

  const fetchReportData = async (customFilters = null) => {
    try {
      setLoading(true);

      // Use custom filters if provided, otherwise use current state
      const filters = customFilters || {
        class: selectedClass,
        installment: selectedInstallment,
      };

      const params = new URLSearchParams({
        school_id: currentUser?.school_id,
        session_id: currentUser?.session_id,
      });

      // Handle class parameter - filters.class is now a single object
      if (filters.class?.value && filters.class.value !== "all_classes") {
        params.append("class_id", filters.class.value);
      }

      // Handle installment parameters - send as array
      if (filters.installment?.length > 0) {
        const installmentValues = filters.installment
          .filter((inst) => inst.value !== "all") // Exclude "all" from API call
          .map((inst) => inst.value);

        if (installmentValues.length > 0) {
          // Send multiple installment_type parameters
          installmentValues.forEach((value) => {
            params.append("installment_type", value);
          });
        }
        // If only "all" is selected or array is empty after filtering, don't add the parameter
      }

      const response = await fetch(
        `${DOMAIN}/api/school/get-fee-receivable-report?${params.toString()}`
      );

      const result = await response.json();
      console.log("API Response:", result);

      if (result.message === "No outstanding fees found") {
        setData([]);
      } else {
        setData(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
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

  console.log(selectedInstallment);
  
  const exportToExcel = () => {
    const headers = [
      "Sr.",
      "Reg No",
      "Student Name",
      "Class",
      "Section",
      "Roll No",
      "Total Amount",
      "Fee Received",
      "Balance Due",
      "Remarks",
    ];

    // Format the data using the correct field names from your backend
    const formattedData = data.map((item, index) => [
      index + 1, // Sr.
      item.gen_reg_no || "",
      item.student_name || "",
      item.class_name || "",
      item.division || "",
      item.roll_no || "",
      parseFloat(item.total_amount) || 0,
      parseFloat(item.fee_received) || 0,
      parseFloat(item.balance_due) || 0,
      item.remarks || "",
    ]);

    // Create the complete sheet data structure
    const sheetData = [
      // Row 1: School Name
      [
        schoolDetails?.name || "School Name",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [""],
      // Row 3: School Address
      [
        schoolDetails?.address || "School Address",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      // Row 4: Empty
      ["", "", "", "", "", "", "", "", "", ""],
      // Row 5: Fee receivable line + Summary header
      [
        "Fee receivable as on date ........................................",
        "",
        "",
        "",
        "",
        "",
        "",
        `SUMMARY - A.Y. ${sessionName || "Current Session"}`,
        "",
        "",
      ],
      ["", "", "", "", "", "", "", "", "", ""],
      // Row 5: Fee receivable line + Summary header
      [
       `Selected Filters = ${selectedInstallment?.map(item => item.label).join(", ") || ""}`,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      ["", "", "", "", "", "", "", "", "", ""],
      headers,
      // Data rows
      ...formattedData,
    ];

    // Calculate totals for summary
    const totalAmount = data.reduce(
      (sum, item) => sum + (parseFloat(item.total_amount) || 0),
      0
    );
    const totalReceived = data.reduce(
      (sum, item) => sum + (parseFloat(item.fee_received) || 0),
      0
    );
    const totalDue = data.reduce(
      (sum, item) => sum + (parseFloat(item.balance_due) || 0),
      0
    );

    // Add summary rows at the end
    sheetData.push(
      ["", "", "", "", "", "", "", "", "", ""], // Empty row
      ["", "", "", "", "", "TOTALS:", totalAmount, totalReceived, totalDue, ""]
    );

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Set column widths
    worksheet["!cols"] = [
      { width: 8 }, // Sr.
      { width: 15 }, // Gen Reg No
      { width: 25 }, // Name of Student
      { width: 10 }, // Class
      { width: 10 }, // Div.
      { width: 12 }, // Roll No
      { width: 18 }, // Total Amount
      { width: 20 }, // Fee Received
      { width: 15 }, // Balance due
      { width: 20 }, // Remarks
    ];

    // Define merges
    worksheet["!merges"] = [
      // School Name Line 1 (A1:F1)
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
      // School Name Line 2 (A2:F2)
      { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
      // School Address (A3:F3)
      { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } },
      // Fee receivable text (A5:G5)
      { s: { r: 4, c: 0 }, e: { r: 4, c: 6 } },
      // Summary header (H5:J5)
      { s: { r: 4, c: 7 }, e: { r: 4, c: 9 } },
    ];

    // Get the range of the worksheet
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    // Apply styling to all cells
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });

        // Ensure cell exists
        if (!worksheet[cellAddress]) {
          worksheet[cellAddress] = { t: "s", v: "" };
        }

        // Initialize style object
        if (!worksheet[cellAddress].s) {
          worksheet[cellAddress].s = {};
        }

        // Add borders to all cells
        worksheet[cellAddress].s.border = {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        };

        // Style for column headers (Row 6, index 5)
        if (R === 5) {
          worksheet[cellAddress].s.fill = {
            patternType: "solid",
            fgColor: { rgb: "D0D0D0" },
          };
          worksheet[cellAddress].s.font = {
            bold: true,
            size: 10,
          };
          worksheet[cellAddress].s.alignment = {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          };
        }

        // Style for Summary header (Row 5, columns H-J)
        if (R === 4 && C >= 7 && C <= 9) {
          worksheet[cellAddress].s.fill = {
            patternType: "solid",
            fgColor: { rgb: "FFFF00" },
          };
          worksheet[cellAddress].s.font = {
            bold: true,
            size: 11,
          };
          worksheet[cellAddress].s.alignment = {
            horizontal: "center",
            vertical: "center",
          };
        }

        // Style for school name and address (Rows 1, 2, 3)
        if (R >= 0 && R <= 2) {
          worksheet[cellAddress].s.font = {
            bold: true,
            size: 12,
          };
          worksheet[cellAddress].s.alignment = {
            horizontal: "left",
            vertical: "center",
          };
        }

        // Style for fee receivable text
        if (R === 4 && C < 7) {
          worksheet[cellAddress].s.font = {
            size: 10,
          };
          worksheet[cellAddress].s.alignment = {
            horizontal: "left",
            vertical: "center",
          };
        }

        // Style for data rows
        if (R > 5) {
          worksheet[cellAddress].s.alignment = {
            horizontal: "center",
            vertical: "center",
          };

          // Number formatting for amount columns
          if (C === 6 || C === 7 || C === 8) {
            worksheet[cellAddress].s.numFmt = "#,##0.00";
          }
        }

        // Style for totals row
        if (R === range.e.r) {
          // Last row
          worksheet[cellAddress].s.font = {
            bold: true,
            size: 11,
          };
          worksheet[cellAddress].s.fill = {
            patternType: "solid",
            fgColor: { rgb: "E6F3FF" },
          };
        }
      }
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fee Receivable Report");

    // Export file
    const fileName = `Fee_Receivable_Report_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
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

  const handleModalClose = () => setShowModal(false);

  const handleReset = (e) => {
    e.preventDefault();

    const defaultFilters = {
      class: { value: "all_classes", label: "All Classes" }, // Single object, not array
      installment: [{ value: "all", label: "All Installments" }], // Array for multi-select
    };

    // Update UI state
    setSelectedClass(defaultFilters.class);
    setSelectedInstallment(defaultFilters.installment);

    // Fetch with reset filters immediately
    fetchReportData(defaultFilters);
  };

  const handleInstallmentChange = (selected) => {
    if (!selected || selected.length === 0) {
      // If nothing selected, default to "All Installments"
      setSelectedInstallment([{ value: "all", label: "All Installments" }]);
      return;
    }

    // Check if "All Installments" is selected
    const allSelected = selected.find((option) => option.value === "all");

    if (allSelected && selected.length > 1) {
      // If "All" is selected along with others, remove "All"
      const filteredSelection = selected.filter(
        (option) => option.value !== "all"
      );
      setSelectedInstallment(filteredSelection);
    } else if (allSelected) {
      // If only "All" is selected, keep it
      setSelectedInstallment([{ value: "all", label: "All Installments" }]);
    } else {
      // Normal multi-select behavior
      setSelectedInstallment(selected);
    }
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchReportData(); // This will use current selectedClass and selectedInstallment values
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
        <h2> Fees Receivable Report</h2>
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
              <Form.Group className="mb-3" controlId="searchTypeSelect">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Installment Type
                  {selectedInstallment.length > 1 && (
                    <span
                      style={{
                        marginLeft: "8px",
                        fontSize: "12px",
                        color: "#007bff",
                        fontWeight: "500",
                      }}
                    >
                      ({selectedInstallment.length} selected)
                    </span>
                  )}
                </Form.Label>
                <Select
                  options={installmentOptions}
                  value={selectedInstallment}
                  onChange={handleInstallmentChange}
                  placeholder="Select Installment Type"
                  isMulti
                  closeMenuOnSelect={false} // Keep menu open after selection
                  hideSelectedOptions={false} // Show selected options in dropdown
                  isDisabled={installmentOptions.length === 0}
                  styles={customSelectStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  components={{
                    // Custom option component to show checkmarks
                    Option: ({ children, ...props }) => {
                      const { isSelected, innerRef, innerProps } = props;
                      return (
                        <div
                          ref={innerRef}
                          {...innerProps}
                          style={{
                            ...props.getStyles("option", props),
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 12px",
                            cursor: "pointer",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              marginRight: "8px",
                              color: isSelected ? "white" : "#007bff",
                            }}
                          >
                            {isSelected ? "✓" : ""}
                          </div>
                          {children}
                        </div>
                      );
                    },
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
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
                      handleApplyFilters(e);
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
        className="modal-body py-lg-5 px-lg-5"
        style={{ backgroundColor: "#F2F6FF", fontFamily: "Manrope" }}
      >
        <div style={{ height: "auto", overflowY: "auto", overflowX: "auto" }}>
          <table
            className="table table-striped table-hover"
            style={{ minWidth: "2000px" }}
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
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "50px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Sr.no
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
                  Gen Reg No
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "50px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Name of Student
                </th>

                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "50px",
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
                    minWidth: "50px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Div
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "left",
                    minWidth: "80px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Roll No
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "center",
                    minWidth: "10px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Fee to be collected (2025-2026)
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "center",
                    minWidth: "80px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Fee Collected / Fee Received Rs.
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "center",
                    minWidth: "50px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Balance due Rs.
                </th>
                <th
                  style={{
                    padding: "15px 15px",
                    textAlign: "center",
                    minWidth: "130px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Remarks
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="text-center p-4">
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
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? "rgb(242, 246, 255)" : "#FFFFFF",
                      borderBottom: "1px solid #E0E4F0",
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      color: "#1C335C",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "50px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {(currentPage - 1) * recordsPerPage + index + 1}
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
                      {item.gen_reg_no || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "50px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.student_name || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "50px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.class_name || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "left",
                        minWidth: "50px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.division || "N/A"}
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
                      {item.roll_no || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "center",
                        minWidth: "10px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      ₹
                      {parseFloat(item.total_amount || 0).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "center",
                        minWidth: "80px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      ₹
                      {parseFloat(item.fee_received || 0).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "center",
                        minWidth: "120px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                        color:
                          parseFloat(item.balance_due || 0) > 0
                            ? "#dc3545"
                            : "#28a745",
                      }}
                    >
                      ₹
                      {parseFloat(item.balance_due || 0).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>
                    <td
                      style={{
                        padding: "10px 15px",
                        textAlign: "center",
                        minWidth: "100px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor:
                            item.remarks === "Paid" ? "#d4edda" : "#fff3cd",
                          color:
                            item.remarks === "Paid" ? "#155724" : "#856404",
                          border: `1px solid ${
                            item.remarks === "Paid" ? "#c3e6cb" : "#ffeaa7"
                          }`,
                        }}
                      >
                        {item.remarks || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No data available. Please adjust your filters to get data.
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
              backgroundColor: currentPage === totalPages ? "#f5f5f5" : "#fff",
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
              backgroundColor: currentPage === totalPages ? "#f5f5f5" : "#fff",
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
      <CreateOutstandingDetails
        show={showModal}
        handleClose={handleModalClose}
        studentId={selectedStudent}
        feeGroupId={selectedGroup}
      />
    </div>
  );
};

export { TablesWidget87 };
