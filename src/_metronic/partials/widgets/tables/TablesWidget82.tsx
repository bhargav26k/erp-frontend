/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
// import { Tooltip as ReactTooltip } from "react-tooltip";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
import { CreateGeneralEnquiry } from "../../modals/create-app-stepper/CreateGeneralEnquiry";
import { CreateEnquiryAction } from "../../modals/create-app-stepper/CreateEnquiryAction";
import { CreateEditGeneral } from "../../modals/create-app-stepper/CreateEditGeneral";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { CreateWalkinAdmission } from "../../modals/create-app-stepper/CreateWalkinAdmission";
import { CreateEditAdmission } from "../../modals/create-app-stepper/CreateEditAdmission";
import { Form, InputGroup, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import "../../../partials/modals/create-app-stepper/style.css";


interface DataItem {
  status: string;
  name: string;
}
interface FilterData {
  student_email: string;
  student_name: string;
  id: number;
  enquiry_id: string;
  date: string;
  class: string;
  name: string;
  source: string;
  email: string;
  follow_up_date: string;
  status: string;
  enquiry_type: string;
  // Add other properties as needed
}

const TablesWidget82 = () => {
  const [filteredData, setFilteredData] = useState<FilterData[]>([]);
  console.log(filteredData);
  

  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const sessionId = currentUser?.session_id;
  const userId = currentUser?.id;
  const [isUploading, setIsUploading] = useState(false);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [refresh, setRefresh] = useState(false);
  const [timeoutDuration, setTimeoutDuration] = useState(3000);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const expectedHeaders = [
    "admission_no",
    "student_name",
    "class_applied",
    "email",
    "phone",
    "fee_type",
    "amount",
    "transaction_date",
    "transaction_id",
    "pay_instrument",
    "payment_method",
    "pg_transaction_id",
    "pg_receipt_number",
    "status"
  ];
  
  const requiredFields = [
    "admission_no",
    "student_name",
    "class_applied",
    "email",
    "phone",
    "fee_type",
    "amount",
    "transaction_date", // FIXED
    "transaction_id",   // FIXED
    "pay_instrument",
    "payment_method",
    "status",
  ];
  
  const normalizeHeader = (header) =>
    header
      ?.toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_"); 


  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-admission-transaction/${schoolId}/${sessionId}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        
        const data = await response.json();
        console.log(data);
        

        if (Array.isArray(data)) { // Check if the data is a valid array before setting state
          setFilteredData(data);
        } else {
          console.error("Unexpected data format received:", data);
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEnquiries();
    setRefresh(false); // Ensure this is spelled correctly
  }, [schoolId, sessionId, refresh]); // Make sure 'refresh' is the dependency and not 'refresh'


  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter data based on search query with fallback for null or undefined
    const filtered = data.filter(
      (item) =>
        item.enquiry_type?.toLowerCase().includes(query) ||
        item.contact_number?.includes(query) ||
        item.email?.toLowerCase().includes(query)
    );

    setFilteredData(filtered);
  };

  const formatDate = (dateString: string | number | Date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    /* @ts-ignore */
    return date.toLocaleDateString("en-GB", options);
  };

  const handleOpenUploadModal = () => {
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {

    setShowUploadModal(false);
    setSelectedFile(null);
    setRefresh(true);
  };

  const handleFileChange = async (event) => {
    setIsLoading(true); // Start loader
    const file = event.target.files[0];
  
    if (file) {
      try {
        const isValid = await validateFileFormat(file);
        if (isValid) {
          setSelectedFile(file); // Store the validated file
          toast.success("File format validated successfully!");
        }
      } catch (error) {
        setSelectedFile(null); // Clear the file on error
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear input element
        }
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };
  
  
  const handleButtonClick = () => {
    if (selectedFile) {
      console.log("Ready to upload file:", selectedFile);
      handleBulkUpload(selectedFile);
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear any residual file
        fileInputRef.current.click(); // Trigger file selection
      }
    }
  };
  

  const validateFileFormat = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          
          const workbook = XLSX.read(data, { type: "array" });
  
          const firstSheetName = workbook.SheetNames[0];
          const firstSheet = workbook.Sheets[firstSheetName];
          const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
  
          if (rows.length < 4) {
            reject("The uploaded file doesn't have the expected structure.");
            return;
          }
  
          const headers = rows[3].map(normalizeHeader); // Read the actual headers at row 4 (index 3)  
          
          // Compare headers after trimming and converting to uppercase
          const formattedHeaders = headers.map(h => h?.toString().trim().toLowerCase());
          const expectedFormatted = expectedHeaders.map(h => h.toLowerCase());
          console.log(expectedFormatted.every((header, index) => header === formattedHeaders[index]));

          if (
            formattedHeaders.length !== expectedFormatted.length ||
            expectedFormatted.some((header, index) => header !== formattedHeaders[index])
          ) {
            reject(
              `Invalid file format. Expected headers: ${expectedHeaders.join(", ")}`
            );
            return;
          }
          resolve(true);
        } catch (error) {
          reject("Error reading the file. Ensure it is a valid .xlsx file.");
        }
      };
      reader.onerror = () => {
        reject("File reading failed. Please try again.");
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleBulkUpload = async (file) => {
    setIsUploading(true); 
    const formData = new FormData();
    if (!schoolId || !sessionId || !userId) {
      toast.error("Missing required data. Please check your login/session.");
      setIsUploading(false);
      return;
    }

    formData.append("file", file);
    formData.append("school_id", schoolId);
    formData.append("session_id", sessionId);
    formData.append("user_id", userId);
  
    try {
      const response = await fetch(`${DOMAIN}/api/school/upload/admission-transcation`, {
        method: "POST",
        body: formData,
      });
  
      const responseData = await response.json();
      console.log(responseData);
      
      if (responseData?.success) {
        toast.success("Data Upload Done Successfully!");
        handleCloseUploadModal();
      } else {
        toast.error("Errors occurred during processing: " + responseData.errors.join(", "));
      }

    } catch (error) {
      console.error("Upload error:", error);
      setSelectedFile(null);
      
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };



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
        className="card-header"
        style={{
          backgroundColor: "rgb(242, 246, 255)",
          padding: "16px 20px",
          borderBottom: "1px solid #E0E4F0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ width: "40%" }}>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1F4061",
              fontFamily: "Manrope",
            }}
          >
            Manual Admissions List
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            width: "60%",
            justifyContent: "end",
          }}
        >
          <div
            className="input-group flex-nowrap"
            style={{
              width: "380px",
              height: "36px",
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
              }}
              className="form-control border-0"
              placeholder="Search by admission number"
              aria-label="Search"
              aria-describedby="addon-wrapping"
              onChange={handleSearch}
              value={searchQuery}
            />
          </div>
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
            <span
              style={{
                marginRight: "8px",
                color: "white",
                fontSize: "14px",
                fontWeight: "700",
                fontFamily: "Manrope",
              }}
            >
              Upload Students
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
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".csv, .xlsx"
            onChange={handleFileChange}
          />
          <a
            href="./assets/manual_admission_format"
            download="manual_admission_format"
          >
            <button
              style={{
                backgroundColor: "#1C335C",
                fontFamily: "Manrope",
                fontSize: "14px",
                fontWeight: "600",
              }}
              className="btn btn-primary"
            >
              Download Format &nbsp;
              <i className="fa fa-download" aria-hidden="true"></i>
            </button>
          </a>
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
            {uploadError && (
              <p style={{ color: "red", marginTop: "10px" }}>{uploadError}</p>
            )}
            <Modal.Footer>
              <button onClick={handleButtonClick} className="btn btn-primary">
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
            {isLoading && (
            <div className="loading-overlay">
              <div className="loading-box">
                <div className="loader"></div>
                <p className="loading-text">
                  Validating and Preparing file, please wait...
                </p>
              </div>
            </div>
          )}
         
          </Modal>
        </div>
      </div>
      <div
        className="modal-body py-lg-5 px-lg-5"
        style={{ backgroundColor: "#F2F6FF", fontFamily: "Manrope" }}
      >
        <div>
          <table
            className="table table-striped"
            style={{ minWidth: "fit-content" }}
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
                  Student Name
                </th>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                  }}
                >
                  Admission Status
                </th>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                  }}
                >
                  Fee Type
                </th>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                  }}
                >
                  Amount Paid
                </th>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                  }}
                >
                  Class Applied For{" "}
                </th>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                  }}
                >
                  Pay Date{" "}
                </th>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "right",
                  }}
                >
                  Action{" "}
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
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
                    <td style={{ padding: "12px 20px" }}>
                      {item.admission_no}
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      {item.student_name}
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      {item.admission_status}
                    </td>
                    <td style={{ padding: "12px 20px" }}>{item.fee_type}</td>
                    <td style={{ padding: "12px 20px" }}>{item.amount}</td>
                    <td style={{ padding: "12px 20px" }}>
                      {item.class_applied}
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      {formatDate(item.transaction_date) || "-"}
                    </td>
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
                        onClick={
                          () => item.enquiry_type === "Admission"
                          // ? handleModalAdmissionEdit(item.enquiry_id)
                          // : handleModalGeneralEdit(item.enquiry_id)
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "8px",
                          backgroundColor: "#1C335C", // Disable button with grey color if transactionId exists
                          borderRadius: "8px",
                          cursor: "pointer", // Disable pointer if transactionId exists
                          transition: "background-color 0.3s",
                          position: "relative", // For tooltip positioning
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
                            marginRight: "5px",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "700",
                            fontFamily: "Manrope",
                          }}
                        >
                          Edit
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "8px 12px",
                          backgroundColor: "#FFE7E1",
                          borderRadius: "5px",
                          cursor: "pointer",
                          transition: "background-color 0.3s",
                        }}
                        // onClick={() => handleActionModal(item.enquiry_id)}
                      >
                        <span
                          style={{
                            marginRight: "8px",
                            color: "#ED5578",
                            fontSize: "14px",
                            fontWeight: "700",
                            fontFamily: "Manrope",
                          }}
                        >
                          Delete
                        </span>
                        <svg
                          width="17"
                          height="16"
                          viewBox="0 0 17 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.16672 9.3333C8.27129 9.3333 9.16672 10.2287 9.16672 11.3333C9.16672 12.4379 8.27129 13.3333 7.16672 13.3333C6.06215 13.3333 5.16672 12.4379 5.16672 11.3333C5.16672 10.2287 6.06215 9.3333 7.16672 9.3333Z"
                            stroke="#ED5578"
                          />
                          <path
                            d="M10.5 2.66667C9.39546 2.66667 8.50003 3.5621 8.50003 4.66667C8.50003 5.77124 9.39546 6.66667 10.5 6.66667C11.6046 6.66667 12.5 5.77124 12.5 4.66667C12.5 3.5621 11.6046 2.66667 10.5 2.66667Z"
                            stroke="#ED5578"
                          />
                          <path
                            d="M10.8334 11.3057L15.5 11.3057"
                            stroke="#ED5578"
                            strokeLinecap="round"
                          />
                          <path
                            d="M6.83337 4.63898L2.16671 4.63898"
                            stroke="#ED5578"
                            strokeLinecap="round"
                          />
                          <path
                            d="M2.16672 11.3057L3.50005 11.3057"
                            stroke="#ED5578"
                            strokeLinecap="round"
                          />
                          <path
                            d="M15.5 4.63898L14.1667 4.63898"
                            stroke="#ED5578"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="12"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      fontFamily: "Manrope",
                      fontSize: "16px",
                      color: "#1F4061",
                    }}
                  >
                    No Circular added yet. Please add a new Circular first.
                  </td>
                </tr>
              )}
            </tbody>

            {/* <CreateGeneralEnquiry
              show={showGeneralModal}
              handleClose={handleGeneralModalClose}
              setRefresh={setRefresh}
            /> */}
          </table>

          {/* modal */}
        </div>
      </div>
      {/* end::Table */}
    </div>
  );
};

export { TablesWidget82 };
