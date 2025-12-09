/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DeleteConfirmationModal } from "../../modals/create-app-stepper/DeleteConfirmationModal";

interface FilterData {
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

const TablesWidget75 = () => {
  const [filteredData, setFilteredData] = useState<FilterData[]>([]);

  const { currentUser } = useAuth();

  const school_id = (currentUser as any)?.school_id;
  const session_id = (currentUser as any)?.session_id;
  const sessionId = (currentUser as any)?.session_id;

  const [classId, setClassId] = useState<string | null>(null); // Allow `null` to represent "no filter"
  const [studentId, setStudentId] = useState(0);
  const [sectionId, setSectionId] = useState<string | null>(null); // Allow `null` for "no filter"
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const Navigate = useNavigate();

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const class_id = e.target.value;
    setClassId(class_id || null); // Set `null` if the user selects no class
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const section_id = e.target.value;
    setSectionId(section_id || null); // Set `null` if the user selects no section
  };

  const handleNav = (id: number) => {
    Navigate(`/student-profile-view?id=${id}`);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Adjust API URL based on the filter state
        const apiUrl =
          classId && sectionId
            ? `${DOMAIN}/api/school/get-class-section-session-wise-disabled-students/${classId}/${sectionId}/${session_id}/${school_id}`
            : `${DOMAIN}/api/school/get-all-disabled-students/${session_id}/${school_id}`; // Fetch all students if no filters

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const responseData = await response.json();
        setFilteredData(responseData); // Set data to state
        setRefresh(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStudents();
  }, [school_id, session_id, classId, sectionId, refresh]); // Include classId and sectionId in the dependencies

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-classes?schoolId=${school_id}&sessionId=${sessionId}`
        );
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      if (!classId) {
        setSections([]); // Reset sections if no class is selected
        return;
      }
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-classwise-sections?schoolId=${school_id}&classId=${classId}`
        );
        const data = await response.json();
        setSections(data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchSections();
  }, [classId]); // Fetch sections when classId changes

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleShowDeleteModal = (id: number) => {
    setStudentId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setStudentId(0);
    setShowDeleteModal(false);
  };

  const handleEnable = async () => {
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/enable-student/${studentId}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error Enabling Student: ${errorData.status}: ${
            errorData.error || "Unknown error"
          }`
        );
      }

      setRefresh(true);
      toast.success("Student enabled successfully.", { autoClose: 3000 });
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error enabling student:", error);
      toast.error("Failed to enable student!", { autoClose: 3000 });
    }
  };
  const isValidDOB = (dob) => {
    if (!dob) return false;
  
    const invalidDobValues = [
      '0000-00-00',
      '0000-00-00T00:00:00.000Z',
      '1899-11-30T00:00:00.000Z',
      '1899-11-29T18:38:50.000Z', // seen in your logs
      '1899-12-31T00:00:00.000Z',
    ];
  
    return !invalidDobValues.includes(dob);
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
          <option value="">All Classes</option>
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
           <option value="">All Sections</option>
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
          Disabled Students
        </span>
        <div
          className="input-group flex-nowrap"
          style={{
            width: "300px",
            height: "36px",
            borderRadius: "8px",
            border: "1px solid #D9D9D9",
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
                  stroke="white"
                  stroke-width="1.5"
                />
                <path
                  d="M14.1667 13.3333L15.5 14.6666"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_582_4295">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
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
              color: "black",
            }}
            className="form-control border-0"
            placeholder="Search ...."
            aria-label="Search"
            aria-describedby="addon-wrapping"
          />
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
                  textAlign: "left",
                }}
              >
                Gender
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
            {filteredData.length === 0 ? (
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
                {filteredData.map((item, index) => (
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
                        display: "flex",
                        gap: "10px", // Adds space between the buttons
                        justifyContent: "center", // Aligns buttons horizontally in the center
                        alignItems: "center", // Vertically centers the buttons
                        padding: "12px 20px",
                        border: "none",
                      }}
                    >
                      <div
                        onClick={() => handleNav(item.id)}
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
                          <Tooltip id={`tooltip1`}>Enable Student</Tooltip>
                        }
                      >
                        <div
                          onClick={() => handleShowDeleteModal(item.id)}
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

          <DeleteConfirmationModal
            show={showDeleteModal}
            handleClose={handleCloseDeleteModal}
            handleDelete={handleEnable}
            title="Confirm Enabling Student"
            description={`Are you sure you want to Enable the Student ?`}
            confirmButtonText="Enable"
            cancelButtonText="Cancel"
          />
        </table>
      </div>
    </div>
  );
};

export { TablesWidget75 };
