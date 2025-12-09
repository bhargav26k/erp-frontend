/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// import { Tooltip as ReactTooltip } from "react-tooltip";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
// import { CreateWalkinEnquiry } from "../../modals/create-app-stepper/CreateWalkinEnquiry";
// import { CreateEnquiryAction } from "../../modals/create-app-stepper/CreateEnquiryAction";
// import { CreateEditEnquiry } from "../../modals/create-app-stepper/CreateEditEnquiry";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
// import { UploadsFilter } from "../../modals/create-app-stepper/UploadsFilter";
// import { AddClasses } from "../../modals/create-app-stepper/AddClasses";
import {
  AddUser,
  DOMAIN,
  getAllDesignations,
  getAllRoles,
  getSchoolWiseDesignations,
} from "../../../../app/routing/ApiEndpoints";
import { useNavigate } from "react-router-dom";
import {
  Col,
  Form,
  InputGroup,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { DeleteConfirmationModal } from "../../modals/create-app-stepper/DeleteConfirmationModal";

interface FilterData {
  id: number;
  staff_id: string;
  role: string;
  gender: string;
  contact_no: string;
  email: string;
  marital_status: string;
  staff_name: string;
  // Add other properties as needed
}

interface UserDetails {
  employee_id: number;
  name: string;
  surname: string;
  email: string;
  contact_no: string;
  role_id: number;
  role_name: string;
  designation_name: string;
  isActive: number;
  designation_id: number;
  // Add more properties as per your actual data structure
}

const TablesWidget56 = () => {
  const [filteredData, setFilteredData] = useState<FilterData[]>([]);
  const [formData, setFormData] = useState<Partial<UserDetails>>({});
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [roles, setRoles] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectDes, setSelectDes] = useState(
    "Select Admin staff to access designation..."
  );
  const [isActive, setIsActive] = useState(true);
  const school_id = (currentUser as any)?.school_id;

  const [refresh, setRefresh] = useState(false);

  const Navigate = useNavigate();

  const handleNav = (staff_id: string) => {
    Navigate(`/employee-profile?staff_id=${staff_id}`);
  };

  const [disable, setDisable] = useState(true);
  const [staffId, setStaffId] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEnableModal, setShowEnableModal] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-allstaff/${school_id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        console.log(responseData);

        setFilteredData(responseData);
        // console.log(responseData);
        setRefresh(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStaff();
  }, [school_id, refresh]);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${DOMAIN}/${getAllRoles}`);
      if (!response.ok) {
        // Extract the status and error message from the response
        const errorData = await response.json();
        throw new Error(
          `Error ${errorData.status}: ${errorData.error || "Unknown error"}`
        );
      }
      const result = await response.json();
      setRoles(result.data); // Update roles state
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching Roles:", error.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    fetchRoles(); // Fetch roles when the component mounts
  }, []);

  const fetchDesignation = async () => {
    try {
      const response = await fetch(`${DOMAIN}/${getSchoolWiseDesignations}/${schoolId}`);
      if (!response.ok) {
        // Extract the status and error message from the response
        const errorData = await response.json();
        throw new Error(
          `Error ${errorData.status}: ${errorData.error || "Unknown error"}`
        );
      }
      const result = await response.json();
      console.log(result);
      
      setDesignations(result);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching Designations:", error.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    if (formData.role_id == 3) {
      fetchDesignation();
      setDisable(false);
      setSelectDes("Select Designation");
    } else {
      setDisable(true);
      setSelectDes("Select Admin staff to access designation...");
    }
  }, [formData.role_id]);

  const handleModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
  };
  //   const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSave = async () => {
    const updatedFormData = { ...formData, isActive: isActive ? 1 : 0 }; // Add isActive as 0 or 1
    try {
      const response = await fetch(`${DOMAIN}/${AddUser}/${schoolId}`, {
        method: "POST", // Assuming you are using PUT method to update
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData), // Send updated form data including isActive
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("An error occurred!", { autoClose: 3000 });
        throw new Error(
          `Error ${errorData.status}: ${errorData.error || "Unknown error"}`
        );
      }
      const updatedData = await response.json();
      toast.success("Data sent successfully.", { autoClose: 3000 });
      setRefresh(true);
      setIsAddModalVisible(false);
      setSelectDes("Select Admin staff to access designation...");
      setDisable(true);
      // Close the modal
      handleAddCancel(); // Close the modal
    } catch (error) {
      console.error("Error updating school details:", error);
      toast.error("Failed to communicate with server!", { autoClose: 3000 });
    }
  };

  const handleToggle = () => {
    setIsActive((prevState) => !prevState); // Toggles the isActive state
  };

  const handleDisable = async () => {
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/disable-staff/${staffId}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        // Extract the status and error message from the response
        const errorData = await response.json();
        throw new Error(
          `Error Diabling Staff: ${errorData.status}: ${
            errorData.error || "Unknown error"
          }`
        );
      }

      setRefresh(true);
      toast.success("Staff disabled successfully.", { autoClose: 3000 });
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error disabling student:", error);
      toast.error("Failed to disable student!", { autoClose: 3000 });
    }
  };
  const handleEnable = async () => {
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/enable-staff/${staffId}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        // Extract the status and error message from the response
        const errorData = await response.json();
        throw new Error(
          `Error Diabling Staff: ${errorData.status}: ${
            errorData.error || "Unknown error"
          }`
        );
      }

      setRefresh(true);
      toast.success("Staff disabled successfully.", { autoClose: 3000 });
      handleCloseEnableModal();
    } catch (error) {
      console.error("Error disabling student:", error);
      toast.error("Failed to disable student!", { autoClose: 3000 });
    }
  };

  const handleShowDeleteModal = (id: number) => {
    setStaffId(id);
    setShowDeleteModal(true);
  };

  const handleShowEnableModal = (id: number) => {
    setStaffId(id);
    setShowEnableModal(true);
  };

  const handleCloseDeleteModal = () => {
    setStaffId(0);
    setShowDeleteModal(false);
  };
  const handleCloseEnableModal = () => {
    setStaffId(0);
    setShowEnableModal(false);
  };

  const sortedData = [...filteredData].sort((a, b) => {
    // Sort by is_active status (active first, then disabled)
    if (a.is_active !== b.is_active) {
      return b.is_active - a.is_active; // Active (1) comes before inactive (0)
    }
    // If same status, maintain original order
    return 0;
  });

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
          Manage Staff
        </span>
        <div style={{ display: "flex", gap: "10px" }}>
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
          <div
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
              Add Staff
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
                Staff ID
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Staff Name
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Email
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Role
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
            {sortedData.map((item, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor:
                    item.is_active === 0
                      ? "#f8f9fa" // Light gray for disabled rows
                      : index % 2 === 0
                      ? "rgb(242, 246, 255)"
                      : "#FFFFFF",
                  borderBottom: "1px solid #E0E4F0",
                  fontFamily: "Manrope",
                  fontSize: "14px",
                  color: item.is_active === 0 ? "#6c757d" : "#1C335C", // Muted color for disabled
                  opacity: item.is_active === 0 ? 0.6 : 1, // Reduced opacity for disabled
                  transition: "all 0.3s ease",
                }}
              >
                <td
                  style={{
                    padding: "20px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: item.is_active === 0 ? "#6c757d" : "#1F4061",
                    fontFamily: "Manrope",
                    textDecoration:
                      item.is_active === 0 ? "line-through" : "none",
                  }}
                >
                  {item.staff_id}
                  {item.is_active === 0 && (
                    <span
                      style={{
                        marginLeft: "8px",
                        fontSize: "10px",
                        padding: "2px 6px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        borderRadius: "10px",
                        fontWeight: "600",
                      }}
                    >
                      DISABLED
                    </span>
                  )}
                </td>

                <td
                  style={{
                    padding: "20px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: item.is_active === 0 ? "#6c757d" : "#1F4061",
                    fontFamily: "Manrope",
                    textDecoration:
                      item.is_active === 0 ? "line-through" : "none",
                  }}
                >
                  {item.staff_name}
                </td>

                <td
                  style={{
                    padding: "20px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: item.is_active === 0 ? "#6c757d" : "#1F4061",
                    fontFamily: "Manrope",
                    textDecoration:
                      item.is_active === 0 ? "line-through" : "none",
                  }}
                >
                  {item.email}
                </td>

                <td
                  style={{
                    padding: "20px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: item.is_active === 0 ? "#6c757d" : "#1F4061",
                    fontFamily: "Manrope",
                    textDecoration:
                      item.is_active === 0 ? "line-through" : "none",
                  }}
                >
                  {item.role}
                  {item.is_active === 0 && (
                    <div
                      style={{
                        marginTop: "4px",
                        fontSize: "11px",
                        color: "#dc3545",
                        fontWeight: "600",
                      }}
                    >
                      (Inactive)
                    </div>
                  )}
                </td>

                <td
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "12px 20px",
                    border: "none",
                  }}
                >
                  <div
                    onClick={() =>
                      item.is_active === 1 && handleNav(item.staff_id)
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 12px",
                      backgroundColor:
                        item.is_active === 0 ? "#6c757d" : "#1C335C",
                      borderRadius: "8px",
                      cursor: item.is_active === 0 ? "not-allowed" : "pointer",
                      transition: "background-color 0.3s",
                      opacity: item.is_active === 0 ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (item.is_active === 1) {
                        e.currentTarget.style.backgroundColor = "#16294D";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (item.is_active === 1) {
                        e.currentTarget.style.backgroundColor = "#1C335C";
                      }
                    }}
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
                      Profile
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
                      <Tooltip id={`tooltip1`}>
                        {item.is_active === 0
                          ? "Enable Staff"
                          : "Disable Staff"}
                      </Tooltip>
                    }
                  >
                    <div
                      onClick={() => item.is_active === 0 ? handleShowEnableModal(item.staff_id) : handleShowDeleteModal(item.staff_id)}
                      style={{
                        width: "32px",
                        height: "40px",
                        borderRadius: "6px",
                        padding: "10px 6px 10px 6px",
                        gap: "10px",
                        backgroundColor:
                          item.is_active === 0 ? "#d4edda" : "#D8F1FF",
                        cursor: "pointer",
                      }}
                    >
                      {item.is_active === 0 ? (
                        // Enable icon (checkmark or power icon)
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 12L11 14L15 10"
                            stroke="#28a745"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="#28a745"
                            strokeWidth="2"
                          />
                        </svg>
                      ) : (
                        // Original disable icon
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            <path
                              d="M22 6.5H16"
                              stroke="#292D32"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <g opacity="0.4">
                              <path
                                d="M6 6.5H2"
                                stroke="#292D32"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                              <path
                                d="M10 10C11.933 10 13.5 8.433 13.5 6.5C13.5 4.567 11.933 3 10 3C8.067 3 6.5 4.567 6.5 6.5C6.5 8.433 8.067 10 10 10Z"
                                stroke="#292D32"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </g>
                            <path
                              d="M8 17.5H2"
                              stroke="#292D32"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <g opacity="0.4">
                              <path
                                d="M22 17.5H18"
                                stroke="#292D32"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                              <path
                                d="M14 21C15.933 21 17.5 19.433 17.5 17.5C17.5 15.567 15.933 14 14 14C12.067 14 10.5 15.567 10.5 17.5C10.5 19.433 12.067 21 14 21Z"
                                stroke="#292D32"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </g>
                          </g>
                        </svg>
                      )}
                    </div>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>

          {/* end::Table body */}
        </table>
      </div>

      <Modal
        id="kt_modal_create_app"
        tabIndex={-1}
        aria-hidden="true"
        dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
        show={isAddModalVisible}
        onHide={handleAddCancel}
        backdrop={true}
      >
        <div className="modal-header">
          <h2 style={{ fontFamily: "Manrope" }}>Add User Details:</h2>
          <div
            className="btn btn-sm btn-icon btn-active-color-primary"
            onClick={handleAddCancel}
          >
            <i className="fas fa-times"></i>
          </div>
        </div>
        <div className="modal-body py-lg-10 px-lg-10">
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formUserName"
                >
                  <Form.Label>User Firstname</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-school"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter Username"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formUserSurname"
                >
                  <Form.Label>User Surname</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-school"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="surname"
                      placeholder="Enter User Surname"
                      value={formData.surname || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3 custom-input" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-school"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="email"
                      placeholder="Enter Email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3 custom-input" controlId="formRole">
                  <Form.Label>Select Role</Form.Label>
                  <Form.Control
                    as="select"
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.role}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formDesignation"
                >
                  <Form.Label>Select Designation</Form.Label>
                  <Form.Control
                    as="select"
                    name="designationId"
                    value={formData.designation_id}
                    onChange={handleInputChange}
                    disabled={disable}
                    required
                  >
                    <option value="">{selectDes}</option>
                    {designations.map((designation) => (
                      <option key={designation.designation_id} value={designation.designation_id}>
                        {designation.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formIsActive"
                >
                  <Form.Label className="mb-2">Is Active</Form.Label>
                  <Form.Check
                    type="switch"
                    id="isActiveSwitch"
                    label={isActive ? "Active" : "Inactive"}
                    checked={isActive}
                    onChange={handleToggle}
                    className="ms-2"
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: isActive ? "#28a745" : "#dc3545",
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="modal-footer border-0">
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            style={{
              width: "118px",
              height: "36px",
              padding: "8px 10px",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              flexShrink: "0",
              backgroundColor: "rgba(39, 59, 99, 0.76)",
            }}
            onClick={handleAddSave}
          >
            <span
              style={{
                color: "#FFF",
                fontFamily: "Manrope",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              Save
            </span>
          </button>
        </div>
      </Modal>

      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDisable}
        title="Confirm Disabling Staff"
        description={`Are you sure you want to disable the Staff ?`}
        confirmButtonText="Disable"
        cancelButtonText="Cancel"
      />
      <DeleteConfirmationModal
        show={showEnableModal}
        handleClose={handleCloseEnableModal}
        handleDelete={handleEnable}
        title="Confirm Enabling Staff"
        description={`Are you sure you want to Enable the Staff ?`}
        confirmButtonText="Enable"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export { TablesWidget56 };
