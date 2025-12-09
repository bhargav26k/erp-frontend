/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
// import { Tooltip as ReactTooltip } from "react-tooltip";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
// import { CreateWalkinEnquiry } from "../../modals/create-app-stepper/CreateWalkinEnquiry";
// import { CreateEnquiryAction } from "../../modals/create-app-stepper/CreateEnquiryAction";
// import { CreateEditEnquiry } from "../../modals/create-app-stepper/CreateEditEnquiry";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
// import { UploadsFilter } from "../../modals/create-app-stepper/UploadsFilter";
// import { AddClasses } from "../../modals/create-app-stepper/AddClasses";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import "../../../partials/modals/create-app-stepper/style.css";
import { useNavigate } from "react-router-dom";
import {
  Form,
  InputGroup,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { CloseButton, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DeleteConfirmationModal } from "../../modals/create-app-stepper/DeleteConfirmationModal";

interface FilterData {
  admission_no: number;
  id: number;
  firstname: string;
  lastname: string;
  admission_no: string;
  dob: string;
  mobileno: string;
  father_name: string;
  gender: string;
  // Add other properties as needed
}

const TablesWidget55 = () => {
  const [filteredData, setFilteredData] = useState<FilterData[]>([]);
  const [allStudents, setAllStudents] = useState<FilterData[]>([]);

  const { currentUser } = useAuth();

  const school_id = (currentUser as any)?.school_id;
  const session_id = (currentUser as any)?.session_id;
  const sessionId = (currentUser as any)?.session_id;
  const user_id = (currentUser as any)?.id;
  const [classId, setClassId] = useState(null);
  const [studentId, setStudentId] = useState(0);
  const [sectionId, setsectionId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [uploadClassId, setUploadClassId] = useState<string | null>(null);
  const [uploadSectionId, setUploadSectionId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [timeoutDuration, setTimeoutDuration] = useState(3000);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
const [draftRoll, setDraftRoll] = useState<string>("");


  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const class_id = e.target.value;
    setClassId(class_id);
    setsectionId(null);
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const section_id = e.target.value;
    setsectionId(section_id);
  };

  const handleButtonClick = () => {
    if (selectedFile) {
      // If file is already selected, proceed with upload
      handleBulkUpload(selectedFile);
    } else {
      // If no file selected, trigger file input
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Validate the uploaded file format
        await validateFileFormat(file);
        setSelectedFile(file); // Save the file in state if valid
        toast.success("File format validated successfully!");
      } catch (error) {
        toast.error(error);
        setSelectedFile(null); // Clear the file if invalid
      }
    }
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setSelectedFile(file); // Save the file in state
  //   }
  // };

  const Navigate = useNavigate();

  const handleNav = (id: number) => {
    Navigate(`/student-profile-view?id=${id}`);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-class-section-session-wise-students/${classId}/${sectionId}/${session_id}/${school_id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        console.log(responseData);

        setAllStudents(responseData);
        setFilteredData(responseData);
        setRefresh(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStudents();
  }, [school_id, sectionId, session_id, refresh]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-classes?schoolId=${school_id}&sessionId=${sessionId}`
        );
        const data = await response.json();
        setClasses(data);
        setsectionId(null);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [sessionId]);

  useEffect(() => {
    const fetchSections = async () => {
      if (classId === null) {
        return; // Return early if classId is null, preventing further execution
      }

      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-classwise-sections?schoolId=${school_id}&classId=${classId}`
        );
        const data = await response.json();

        setSections(data); // Set the fetched sections to the state
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    // Only call fetchSections if classId is not null
    if (classId !== null) {
      fetchSections(); // Call the function when classId changes and is valid
    }
  }, [classId, sessionId]); // Re-run effect when classId changes

  // Separate handlers for the upload-specific class and section selections
  const handleUploadClassChange = async (e) => {
    const selectedClassId = e.target.value;
    setUploadClassId(selectedClassId);
    setUploadSectionId(null); // Reset section selection for upload

    // Fetch sections for selected upload class
    if (selectedClassId) {
      const response = await fetch(
        `${DOMAIN}/api/school/get-classwise-sections?schoolId=${school_id}&classId=${selectedClassId}`
      );
      const data = await response.json();
      setSections(data);
    }
  };

  const handleUploadSectionChange = (e) => {
    setUploadSectionId(e.target.value);
  };

  // const validateFileFormat = async (file) => {
  //   const expectedHeaders = [
  //     "admission_no",
  //     "parent_id",
  //     "gr_number",
  //     "roll_no",
  //     "firstname",
  //     "middlename",
  //     "lastname",
  //     "rte",
  //     "mobileno",
  //     "email",
  //     "state",
  //     "city",
  //     "pincode",
  //     "religion",
  //     "caste",
  //     "dob",
  //     "gender",
  //     "current_address",
  //     "category_id",
  //     "blood_group",
  //     "adhar_no",
  //     "father_name",
  //     "father_phone",
  //     "mother_name",
  //     "mother_phone",
  //   ];

  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();

  //     reader.onload = (event) => {
  //       try {
  //         const data = new Uint8Array(event.target.result);
  //         const workbook = XLSX.read(data, { type: "array" });

  //         // Get the first sheet from the workbook
  //         const firstSheetName = workbook.SheetNames[0];
  //         const firstSheet = workbook.Sheets[firstSheetName];

  //         // Parse the sheet into JSON with headers
  //         const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

  //         // Validate headers
  //         const headers = rows[0];
  //         console.log(headers);
  //         console.log(headers.length);
  //         console.log(expectedHeaders.length);
  //         console.log(headers.every((header, index) => header === expectedHeaders[index]));

  //         if (
  //           headers.length !== expectedHeaders.length
  //           ||
  //           !headers.every((header, index) => header === expectedHeaders[index])
  //         ) {
  //           reject(
  //             `Invalid file format. Expected headers: ${expectedHeaders.join(
  //               ", "
  //             )}`
  //           );
  //           return;
  //         }

  //         // Validate each row of data
  //         const invalidRows = [];
  //         rows.slice(1).forEach((row, rowIndex) => {
  //           const isRowInvalid = expectedHeaders.some((header, index) => {
  //             const cellValue = row[index];

  //             // Skip validation for "parent_id" and "middlename"
  //             if (
  //               header === "parent_id" ||
  //               header === "middlename" ||
  //               header === "roll_no" ||
  //               header === "gr_number"
  //             ) {
  //               return false;
  //             }

  //             // Validate other columns for empty or invalid values
  //             return (
  //               cellValue === undefined || // Check for undefined
  //               cellValue === "" || // Check for empty strings
  //               cellValue === " " || // Check for single space
  //               cellValue === `` || // Check for empty strings
  //               cellValue === "NaN" || // Check for string "NaN"
  //               cellValue === "nan" || // Check for string "NaN"
  //               cellValue === "non" || // Check for string "NaN"
  //               cellValue === "Non" || // Check for string "NaN"
  //               cellValue === "undefined" || // Check for string "NaN"
  //               cellValue === "Undefined" || // Check for string "NaN"
  //               /^\s*$/.test(cellValue) // Check for whitespace-only strings
  //             );
  //           });

  //           if (isRowInvalid) {
  //             invalidRows.push(rowIndex + 2); // +2 to account for the header and 1-based index
  //           }
  //         });

  //         // Reject if any invalid rows exist
  //         if (invalidRows.length > 0) {
  //           reject(
  //             `Invalid data found in the following rows: ${invalidRows.join(
  //               ", "
  //             )}. Please check for empty or invalid values.`
  //           );
  //           return;
  //         }

  //         resolve(true); // File is valid
  //       } catch (error) {
  //         reject(
  //           "Error reading the file. Please ensure it is a valid .xlsx file."
  //         );
  //       }
  //     };

  //     reader.onerror = () => {
  //       reject("File reading failed. Please try again.");
  //     };

  //     reader.readAsArrayBuffer(file);
  //   });
  // };

  // const handleBulkUpload = async (file) => {
  //   setIsUploading(true); // ✅ Show loader immediately
  //   setTimeoutDuration(3000); // Reset timeout duration

  //   let uploadTimeout = setTimeout(function extendTimeout() {
  //     setTimeoutDuration((prev) => prev + 5000);
  //     uploadTimeout = setTimeout(extendTimeout, timeoutDuration);
  //   }, timeoutDuration);

  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("school_id", school_id);
  //   formData.append("session_id", session_id);
  //   formData.append("class_id", uploadClassId);
  //   formData.append("section_id", uploadSectionId);
  //   formData.append("user_id", user_id);

  //   try {
  //     const response = await fetch(`${DOMAIN}/api/school/upload/students`, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     clearTimeout(uploadTimeout); // ✅ Stop timeout when response arrives

  //     const responseData = await response.json();

  //     if (!response.ok) {
  //       const errorMessages = responseData.errors
  //         ? responseData.errors
  //             .map((err, idx) => `Error ${idx + 1}: ${err}`)
  //             .join("\n")
  //         : "Unknown error occurred.";
  //       toast.error(errorMessages);
  //       setUploadError(errorMessages);
  //     } else {
  //       toast.success("Data Upload Done Successfully!");
  //       setUploadError(null);
  //       setSelectedFile(null);
  //       handleCloseUploadModal();
  //     }
  //   } catch (error) {
  //     clearTimeout(uploadTimeout); // ✅ Stop timeout in case of error
  //     console.error("Upload error:", error);
  //     setUploadError("An unexpected error occurred during the upload.");
  //     toast.error(
  //       "An unexpected error occurred during the upload. Please try again later."
  //     );
  //   } finally {
  //     setIsUploading(false); // ✅ Hide loader after process completes
  //   }
  // };

  const validateFileFormat = async (file) => {
    const expectedHeaders = [
      "admission_no",
      "parent_id",
      "gr_number",
      "roll_no",
      "firstname",
      "middlename",
      "lastname",
      "rte",
      "mobileno",
      "email",
      "state",
      "city",
      "pincode",
      "religion",
      "caste",
      "dob",
      "gender",
      "current_address",
      "category_id",
      "blood_group",
      "adhar_no",
      "father_name",
      "father_phone",
      "mother_name",
      "mother_phone",
    ];

    const requiredFields = [
      "admission_no",
      "firstname",
      "lastname",
      "mobileno",
    ];

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

          const rawHeaders = rows[0] || [];

          const headers = rawHeaders.map((h) =>
            h
              ?.toString()
              .trim()
              .toLowerCase()
              .replace(/ /g, "_")
              .replace("addhar", "adhar")
              .replace("father_mobile", "father_phone")
              .replace("mother_mobile", "mother_phone")
              .replace("gr_no", "gr_number")
              .replace("first_name", "firstname")
              .replace("middle_name", "middlename")
              .replace("last_name", "lastname")
              .replace("mobile_no", "mobileno")
              .replace("category", "category_id")
          );

          if (
            headers.length !== expectedHeaders.length ||
            !headers.every((h, i) => h === expectedHeaders[i])
          ) {
            reject(
              `Invalid file format. Expected headers: ${expectedHeaders.join(
                ", "
              )}`
            );
            return;
          }

          const invalidRows = [];
          rows.slice(1).forEach((row, rowIndex) => {
            const isRowInvalid = requiredFields.some((header) => {
              const index = expectedHeaders.indexOf(header);
              const value = row[index];
              return (
                value === undefined ||
                value === "" ||
                /^\s*$/.test(String(value)) ||
                ["NaN", "nan", "non", "Non", "undefined", "Undefined"].includes(
                  String(value)
                )
              );
            });

            if (isRowInvalid) {
              invalidRows.push(rowIndex + 2); // +2 accounts for header + 1-based index
            }
          });

          if (invalidRows.length > 0) {
            reject(`Invalid data in rows: ${invalidRows.join(", ")}`);
            return;
          }

          resolve(true);
        } catch (error) {
          reject("Error reading file. Please ensure it's a valid .xlsx file.");
        }
      };

      reader.onerror = () => {
        reject("File reading failed. Please try again.");
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleBulkUpload = async (file) => {
    setIsUploading(true); // ✅ Show loader immediately
    setTimeoutDuration(3000); // Reset timeout duration

    let uploadTimeout = setTimeout(function extendTimeout() {
      setTimeoutDuration((prev) => prev + 5000);
      uploadTimeout = setTimeout(extendTimeout, timeoutDuration);
    }, timeoutDuration);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("school_id", school_id);
    formData.append("session_id", session_id);
    formData.append("class_id", uploadClassId);
    formData.append("section_id", uploadSectionId);
    formData.append("user_id", user_id);

    try {
      const response = await fetch(`${DOMAIN}/api/school/upload/students`, {
        method: "POST",
        body: formData,
      });

      clearTimeout(uploadTimeout); // ✅ Stop timeout when response arrives

      const responseData = await response.json();

      if (!response.ok) {
        let errorMessages;
        if (responseData.errors) {
          errorMessages = responseData.errors
            .map((err, idx) => {
              if (err.includes("Missing column")) {
                // return `Error ${idx + 1}: Missing required column - ${err}`;
                return `Error Missing required column`;
              } else if (err.includes("Wrong format")) {
                // return `Error ${idx + 1}: Incorrect format - ${err}`;
                return `Error Incorrect format`;
              } else {
                return `Error ${idx + 1}: ${err}`;
              }
            })
            .join("\n");
        } else {
          errorMessages = "Unknown error occurred.";
        }
        toast.error(errorMessages);
        setUploadError(errorMessages);
      } else {
        toast.success("Data Upload Done Successfully!");
        setUploadError(null);
        setSelectedFile(null);
        handleCloseUploadModal();
      }
    } catch (error) {
      clearTimeout(uploadTimeout); // ✅ Stop timeout in case of error
      console.error("Upload error:", error);
      setUploadError("An unexpected error occurred during the upload.");
      toast.error(
        "An unexpected error occurred during the upload. Please try again later."
      );
    } finally {
      setIsUploading(false); // ✅ Hide loader after process completes
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  function handleModal(): void {
    throw new Error("Function not implemented.");
  }

  const handleOpenUploadModal = () => {
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setUploadClassId("");
    setUploadSectionId("");
  };

  const handleShowDeleteModal = (id: number) => {
    setStudentId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setStudentId(0);
    setShowDeleteModal(false);
  };

  const handleDisable = async () => {
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/disable-student/${studentId}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        // Extract the status and error message from the response
        const errorData = await response.json();
        throw new Error(
          `Error Diabling Student: ${errorData.status}: ${
            errorData.error || "Unknown error"
          }`
        );
      }

      setRefresh(true);
      toast.success("Student disabled successfully.", { autoClose: 3000 });
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error disabling student:", error);
      toast.error("Failed to disable student!", { autoClose: 3000 });
    }
  };

  const filteredResults = filteredData.filter((item) => {
    const fullName = `${item.firstname} ${item.lastname}`.toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      item.admission_no.toLowerCase().includes(search) ||
      item.gr_number.toLowerCase().includes(search) ||
      fullName.includes(search) ||
      item.mobileno.includes(search)
    );
  });

  const isValidDOB = (dob) => {
    if (!dob) return false;

    const invalidDobValues = [
      "0000-00-00",
      "0000-00-00T00:00:00.000Z",
      "1899-11-30T00:00:00.000Z",
      "1899-11-29T18:38:50.000Z", // seen in your logs
      "1899-12-31T00:00:00.000Z",
    ];

    return !invalidDobValues.includes(dob);
  };


  const startEdit = (admission_no: string, currentRoll: string | null) => {
    setEditingId(admission_no);
    setDraftRoll(currentRoll ?? "");
  };
  
  
  const commitEdit = (admission_no: string) => {
    const student = allStudents.find((it) => it.admission_no === admission_no);
    if (!student) return setEditingId(null);
  
    const existingRoll = student.roll_no ?? "";
    console.log(existingRoll);
    
  
    if (draftRoll.trim() === existingRoll.trim()) {
      return setEditingId(null); // no changes
    }
  
    if (draftRoll !== null && admission_no === editingId) {
      onUpdateRollNumber(admission_no, draftRoll.trim());
    }
  
    setEditingId(null);
  };

  console.log(allStudents);
  
  const onUpdateRollNumber = useCallback(
    async (admission_no: string, newRoll: string) => {
      try {
        const res = await fetch(`${DOMAIN}/api/school/update-roll-number`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            school_id: school_id,
            admission_no,
            roll_no: newRoll,
          }),
        });
  
        const payload = await res.json();
  
        if (!res.ok) {
          if (res.status === 409) {
            return alert(payload.message || "This Roll number is already in use");
          }
          throw new Error(payload.message || "Could not update Roll number");
        }
  
        setRefresh(true);
        setFilteredData((prev) =>
          prev.map((it) =>
            it.admission_no === admission_no ? { ...it, roll_no: newRoll } : it
          )
        );
  
        // Optionally: toast.success("Roll number updated successfully");
      } catch (err: any) {
        console.error(err);
        alert(err.message || "An unexpected error occurred");
      }
    },
    [school_id]
  );
  

  return (
    <div
      className="card-style"
      style={{
        width: "100%",
        borderRadius: "16px",
        backgroundColor: "rgb(242, 246, 255)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        marginTop: "20px",
        padding: "20px",
        fontFamily: "Manrope",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          width: "100%",
          marginTop: "20px",
          justifyContent: "left",
        }}
      >
        <select
          value={classId || ""}
          onChange={handleClassChange}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "20%",
            backgroundColor: "#fff",
          }}
          className="form-select"
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.class}
            </option>
          ))}
        </select>

        <select
          value={sectionId || ""}
          onChange={handleSectionChange}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "20%",
            backgroundColor: "#fff",
          }}
          className="form-select"
        >
          <option value="">Select Section</option>
          {sections.map((sec) => (
            <option key={sec.id} value={sec.id}>
              {sec.section}
            </option>
          ))}
        </select>
      </div>
      <div
        className="card-header"
        style={{
          backgroundColor: "rgb(242, 246, 255)",
          padding: "16px 20px",
          borderBottom: "1px solid #E0E4F0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#1C335C",
            fontFamily: "Manrope",
          }}
        >
          Manage Students
        </span>
        <div style={{ display: "flex", gap: "10px" }}>
          <div
            className="input-group flex-nowrap"
            style={{
              width: "380px",
              height: "44px",
              borderRadius: "8px",
              border: "1px solid #1F4061",
            }}
          >
            <span
              className="input-group-text border-0 pe-1 pr-0"
              style={{ backgroundColor: "transparent" }}
              id="addon-wrapping"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_582_4295)">
                  <circle
                    cx="8.50002"
                    cy="7.66665"
                    r="6.33333"
                    stroke="#1F4061"
                    stroke-width="1.5"
                  />
                  <path
                    d="M14.1667 13.3333L15.5 14.6666"
                    stroke="#1F4061"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_582_4295">
                    <rect
                      width="16"
                      height="16"
                      fill="#1F4061"
                      transform="translate(0.833374)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <input
              type="text"
              style={{
                backgroundColor: "transparent",
                color: "#1C335C",
                fontSize: "14px",
              }}
              className="form-control border-0"
              placeholder="Search by Phone no. | Name | Gr Number ...."
              aria-label="Search"
              aria-describedby="addon-wrapping"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* <div
            onClick={handleModal}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              backgroundColor: "#1C335C",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#16294D")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#1C335C")
            }
          >
            <span
              style={{
                marginRight: "8px",
                color: "white",
                fontSize: "14px",
                fontWeight: "700",
                fontFamily: "Manrope",
              }}
            >
              Add Student
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16px"
              height="16px"
              fill="#ffffff"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M3 17.25V21h3.75l11-11.03-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </div> */}
          <div
            onClick={handleOpenUploadModal}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              backgroundColor: "#1C335C",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#16294D")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#1C335C")
            }
          >
            <i
              className="fa-solid fa-file-arrow-up"
              style={{ color: "#fff", fontSize: "16px" }}
            ></i>
            <span
              style={{
                marginLeft: "8px",
                color: "white",
                fontSize: "14px",
                fontWeight: "700",
                fontFamily: "Manrope",
              }}
            >
              Upload
            </span>
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".csv, .xlsx"
              onChange={handleFileChange}
            />
            <a
              href="./assets/Student_upload_format.xlsx"
              download="Student_upload_format.xlsx"
            >
              <button
                className=""
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "9px 12px",
                  backgroundColor: "#1C335C",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "700",
                  fontFamily: "Manrope",
                  gap: "8px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#16294D")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1C335C")
                }
              >
                <i
                  className="fa fa-download"
                  aria-hidden="true"
                  style={{ color: "#fff", fontSize: "16px" }}
                ></i>
                Format
              </button>
            </a>
          </div>
          {/* Hidden file input */}
          {/* Modal for class and section selection */}
          <Modal
            show={showUploadModal}
            onHide={handleCloseUploadModal}
            centered
          >
            <div
              className="modal-header"
              style={{
                backgroundColor: "#F2F6FF",
                borderBottom: "1px solid lightgray",
                display: "flex",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontFamily: "Manrope",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                Upload Students in Bulk
              </h2>
              <div
                className="btn btn-sm btn-icon btn-active-color-primary"
                onClick={handleCloseUploadModal}
              >
                <i className="fas fa-times"></i>
              </div>
            </div>
            <Modal.Body>
              <Form.Group className="mb-3 custom-input" controlId="formClass">
                <Form.Label>Select Class</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-chalkboard"></i>
                  </InputGroup.Text>
                  <Form.Select
                    value={uploadClassId || ""}
                    onChange={handleUploadClassChange}
                    name="class_id"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.class}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3 custom-input" controlId="formSection">
                <Form.Label>Select Section</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-chalkboard"></i>
                  </InputGroup.Text>
                  <Form.Select
                    value={uploadSectionId || ""}
                    onChange={handleUploadSectionChange}
                    name="section_id"
                    disabled={!uploadClassId}
                  >
                    <option value="">
                      {!uploadClassId
                        ? "Select Class first..."
                        : "Select Section"}
                    </option>
                    {sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.section}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Form.Group>
              {uploadError && (
                <p style={{ color: "red", marginTop: "10px" }}>{uploadError}</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <button
                onClick={handleButtonClick}
                className="btn btn-primary"
                disabled={!uploadClassId || !uploadSectionId} // Enable only after selecting class and section
              >
                {selectedFile ? "Upload" : "Select File to Upload"}
              </button>
              <button
                onClick={handleCloseUploadModal}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".csv, .xlsx"
                onChange={handleFileChange}
              />
            </Modal.Footer>
            {isUploading && (
              <div className="loading-overlay">
                <div className="loading-box">
                  <div className="loader"></div>
                  <p className="loading-text">Uploading file, please wait...</p>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
      <div
        style={{
          height: "650px", // Fixed height for the table container
          overflowY: "auto", // Enable vertical scrolling
        }}
      >
        <table
          className="table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#FFFFFF", // White background for the table
            borderRadius: "12px", // Round corners for the table
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)", // Light shadow for the table
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "rgb(242, 246, 255)", // Header background color
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
                }}
              >
                Admission No
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                GR No.
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Roll No.
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Student Name
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Date Of Birth
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Student's Gender
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Mobile No.
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Father's Name
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "center",
                }}
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredResults.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <h3
                    style={{
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    No Data Please Select Class and Section
                  </h3>
                </td>
              </tr>
            ) : (
              <>
                {filteredResults.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? "rgb(242, 246, 255)" : "#FFFFFF",
                      borderBottom: "1px solid #E0E4F0",
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      color: "#1C335C",
                      height: "auto",
                    }}
                  >
                    <td
                      style={{
                        padding: "20px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1F4061",
                        fontFamily: "Manrope",
                      }}
                    >
                      {item.admission_no}
                    </td>
                    <td
                      style={{
                        padding: "20px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1F4061",
                        fontFamily: "Manrope",
                      }}
                    >
                      {item.gr_number}
                    </td>
                    <td
                      style={{
                        padding: "20px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1F4061",
                        fontFamily: "Manrope",
                        cursor: "pointer",
                      }}
                      onDoubleClick={() =>
                        startEdit(item.admission_no, item.roll_no)
                      }
                    >
                      {editingId === item.admission_no ? (
                        <input
                          type="text"
                          value={draftRoll}
                          autoFocus
                          onChange={(e) => setDraftRoll(e.target.value)}
                          onBlur={() => commitEdit(item.admission_no)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              commitEdit(item.admission_no);
                            } else if (e.key === "Escape") {
                              setEditingId(null);
                            }
                          }}
                          style={{ width: "100%" }}
                        />
                      ) : (
                        item.roll_no || "NA"
                      )}
                    </td>

                    <td
                      style={{
                        padding: "20px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1F4061",
                        fontFamily: "Manrope",
                      }}
                    >
                      {item.firstname + "     " + item.lastname}
                    </td>
                    <td
                      style={{
                        padding: "20px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1F4061",
                        fontFamily: "Manrope",
                      }}
                    >
                      {isValidDOB(item.dob) ? formatDate(item.dob) : ""}
                    </td>
                    <td
                      style={{
                        padding: "20px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1F4061",
                        fontFamily: "Manrope",
                      }}
                    >
                      {item.gender}
                    </td>
                    <td
                      style={{
                        padding: "20px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1F4061",
                        fontFamily: "Manrope",
                      }}
                    >
                      {item.mobileno}
                    </td>
                    <td
                      style={{
                        padding: "20px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1F4061",
                        fontFamily: "Manrope",
                      }}
                    >
                      {item.father_name}
                    </td>

                    <td
                      style={{
                        display: "flex",
                        gap: "10px", // Adds space between the buttons
                        justifyContent: "center", // Aligns buttons horizontally in the center
                        alignItems: "center", // Vertically centers the buttons
                        padding: "12px 20px",
                        border: "none",
                      }}
                    >
                      <div
                        onClick={() => handleNav(item.admission_no)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "8px 12px",
                          backgroundColor: "#1C335C",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#16294D")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#1C335C")
                        }
                      >
                        <span
                          style={{
                            marginRight: "8px",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "700",
                            fontFamily: "Manrope",
                          }}
                        >
                          View Profile
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="16px"
                          height="16px"
                          fill="#ffffff"
                        >
                          <path d="M0 0h24v24H0V0z" fill="none" />
                          <path d="M3 17.25V21h3.75l11-11.03-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                      </div>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip1`}>Disable Student</Tooltip>
                        }
                      >
                        <div
                          onClick={() =>
                            handleShowDeleteModal(item.admission_no)
                          }
                          style={{
                            width: "32px",
                            height: "40px",
                            borderRadius: "6px",
                            padding: "10px 6px 10px 6px",
                            gap: "10px",
                            backgroundColor: "#D8F1FF",
                            cursor: "pointer",
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              {" "}
                              <path
                                d="M22 6.5H16"
                                stroke="#292D32"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>{" "}
                              <g opacity="0.4">
                                {" "}
                                <path
                                  d="M6 6.5H2"
                                  stroke="#292D32"
                                  stroke-width="1.5"
                                  stroke-miterlimit="10"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>{" "}
                                <path
                                  d="M10 10C11.933 10 13.5 8.433 13.5 6.5C13.5 4.567 11.933 3 10 3C8.067 3 6.5 4.567 6.5 6.5C6.5 8.433 8.067 10 10 10Z"
                                  stroke="#292D32"
                                  stroke-width="1.5"
                                  stroke-miterlimit="10"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>{" "}
                              </g>{" "}
                              <path
                                d="M8 17.5H2"
                                stroke="#292D32"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>{" "}
                              <g opacity="0.4">
                                {" "}
                                <path
                                  d="M22 17.5H18"
                                  stroke="#292D32"
                                  stroke-width="1.5"
                                  stroke-miterlimit="10"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>{" "}
                                <path
                                  d="M14 21C15.933 21 17.5 19.433 17.5 17.5C17.5 15.567 15.933 14 14 14C12.067 14 10.5 15.567 10.5 17.5C10.5 19.433 12.067 21 14 21Z"
                                  stroke="#292D32"
                                  stroke-width="1.5"
                                  stroke-miterlimit="10"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>{" "}
                              </g>{" "}
                            </g>
                          </svg>
                        </div>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={12}
                style={{
                  padding: "12px 20px",
                  textAlign: "right",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#1C335C",
                }}
              >
                Total Items: {filteredData.length}
              </td>
            </tr>
          </tfoot>

          <DeleteConfirmationModal
            show={showDeleteModal}
            handleClose={handleCloseDeleteModal}
            handleDelete={handleDisable}
            title="Confirm Disabling Student"
            description={`Are you sure you want to disable the Student ?`}
            confirmButtonText="Disable"
            cancelButtonText="Cancel"
          />
        </table>
      </div>
    </div>
  );
};

export { TablesWidget55 };
