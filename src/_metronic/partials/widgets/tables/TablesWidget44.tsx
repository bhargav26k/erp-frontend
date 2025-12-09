/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// import { CreateAdminModal } from "../../../../_metronic/partials/modals/create-app-stepper/CreateAdminModal";
import {
  DOMAIN,
  getUsersBySchoolId,
  getAllRoles,
  getAllDesignations,
  getUserDetails,
  AddUser,
  UpdateUser,
  DeleteUser,
} from "../../../../app/routing/ApiEndpoints";

import { Modal, Form, Row, Col, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";

interface TablesWidget44Props {
  schoolId: string | undefined;
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

const TablesWidget44: React.FC<TablesWidget44Props> = ({ schoolId }: any) => {
  const [usersDetails, setUsersDetails] = useState<UserDetails[]>([]);
  const [formData, setFormData] = useState<Partial<UserDetails>>({});
  const [refresh, setRefresh] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState([]);

  const [isActive, setIsActive] = useState(false);
  const [roles, setRoles] = useState([]);
  
  const [designations, setDesignations] = useState([]);
  const [selectDes, setSelectDes] = useState(
    "Select Role to access designation..."
  );
  const [disable, setDisable] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/${getUsersBySchoolId}/${schoolId}`
        );
        if (!response.ok) {
          // Extract the status and error message from the response
          const errorData = await response.json();
          throw new Error(
            `Error ${errorData.status}: ${errorData.error || "Unknown error"}`
          );
        }
        const result = await response.json();
        setUsersDetails(result.data);
        setRefresh(false);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching School Users:", error.message);
        } else {
          console.error("An unexpected error occurred");
        }
      }
    };

    fetchData();
  }, [schoolId, refresh]);

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
      const response = await fetch(`${DOMAIN}/${getAllDesignations}`);
      if (!response.ok) {
        // Extract the status and error message from the response
        const errorData = await response.json();
        throw new Error(
          `Error ${errorData.status}: ${errorData.error || "Unknown error"}`
        );
      }
      const result = await response.json();
      setDesignations(result.data);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching Designations:", error.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    if (formData.role_id == 3 || userData.role_id == 3) {
      fetchDesignation();
      setDisable(false);
      setSelectDes("Select Designation");
    } else {
      setDisable(true);
      setSelectDes("Select Role to access designation...");
    }
  }, [formData.role_id, userData.role_id]);

  const fetchUserById = async () => {
    try {
      const response = await fetch(`${DOMAIN}/${getUserDetails}/${userId}`);
      if (!response.ok) {
        // Extract the status and error message from the response
        const errorData = await response.json();
        throw new Error(
          `Error ${errorData.status}: ${errorData.error || "Unknown error"}`
        );
      }
      const result = await response.json();

      setUserData(result.data[0]);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching User Details:", error.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    if (isEditModalVisible) {
      fetchUserById();
    }
  }, [isEditModalVisible]);

  const showAddModal = () => {
    setIsAddModalVisible(true);
    fetchRoles(); // ✅ Fetch fresh roles when opening add modal
    fetchDesignation(); // ✅ Fetch fresh designations when opening add modal
  };

  const showEditModal = (id: string) => {
    setIsEditModalVisible(true);
    setUserId(id);
    fetchRoles(); // ✅ Fetch fresh roles when opening edit modal
    fetchDesignation();
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
      setUsersDetails(updatedData); // Update the state with the new data
      setIsAddModalVisible(false);
      setRefresh(true);
      setSelectDes("Select Admin staff to access designation...");
      setDisable(true);
      // Close the modal
      handleAddCancel(); // Close the modal
    } catch (error) {
      console.error("Error updating school details:", error);
      toast.error("Failed to communicate with server!", { autoClose: 3000 });
    }
  };

  const handleEditSave = async () => {
    const updatedFormData = { ...userData, isActive: isActive ? 1 : 0 };
    try {
      const response = await fetch(`${DOMAIN}/${UpdateUser}/${userId}`, {
        method: "PUT", // Assuming you are using PUT method to update
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
      setUsersDetails(updatedData); // Update the state with the new data
      setIsEditModalVisible(false);
      setRefresh(true);
      setSelectDes("Select Admin staff to access designation...");
      setDisable(true);
      // Close the modal
      handleEditCancel(); // Close the modal
    } catch (error) {
      console.error("Error updating designation details:", error);
      toast.error("Failed to communicate with server!", { autoClose: 3000 });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this designation?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch(`${DOMAIN}/${DeleteUser}/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          // Extract the status and error message from the response
          const errorData = await response.json();
          throw new Error(
            `Error ${errorData.status}: ${errorData.error || "Unknown error"}`
          );
        }
        // Optionally, you can refresh the list or update the state to remove the deleted item
        setRefresh(true); // Assuming you have a way to refresh the list of designations
        toast.success("User deleted successfully.", { autoClose: 3000 });
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error Deleting User:", error);
        } else {
          console.error("An unexpected error occurred");
        }
      }
    }
  };

  const handleAddCancel = () => {

    setRoles([]);
  setDesignations([]);
  setSelectDes("Select Role to access designation...");
  setDisable(true);
  setIsAddModalVisible(false);
  };

  const handleEditCancel = () => {
    setRoles([]);
    setDesignations([]);
    setSelectDes("Select Role to access designation...");
    setDisable(true);
    setIsEditModalVisible(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleInputEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggle = () => {
    setIsActive((prevState) => !prevState); // Toggles the isActive state
  };

  const handleEditToggle = () => {
    setUserData((prevData) => ({
      ...prevData,
      is_active: !prevData.is_active, // Toggle the boolean value
    }));
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
          Manage Users
        </span>
        <div
          onClick={showAddModal}
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
            Add User
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
      <div
        style={{
          height: "400px", // Fixed height for the table container
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
                User Name
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                User Role
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                User Designation
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                User Email
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "center", // Centering IsActive column
                }}
              >
                IsActive
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "center", // Centering Actions column
                }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {usersDetails.length > 0 ? (
              usersDetails.map((usersDetail, index) => (
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
                    {usersDetail.name + " " + usersDetail.surname}
                  </td>
                  <td style={{ padding: "12px 20px" }}>
                    {usersDetail.role_id
                      ? usersDetail.role_name
                      : "Not rendered"}
                  </td>
                  <td style={{ padding: "12px 20px" }}>
                    {usersDetail.role_name === "Parent"
                      ? "-"
                      : usersDetail.designation_name}
                  </td>
                  <td style={{ padding: "12px 20px" }}>{usersDetail.email}</td>
                  <td style={{ padding: "12px 20px", textAlign: "center" }}>
                    {usersDetail.is_active === 1 ? (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "12px",
                          backgroundColor: "#28a745",
                          color: "#FFFFFF",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        Active
                      </span>
                    ) : (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "12px",
                          backgroundColor: "#dc3545",
                          color: "#FFFFFF",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        Inactive
                      </span>
                    )}
                  </td>

                  <td
                    style={{
                      display: "flex",
                      gap: "10px", // Adds space between the buttons
                      justifyContent: "center", // Aligns buttons horizontally in the center
                      alignItems: "center", // Vertically centers the buttons
                      padding: "12px 20px",
                    }}
                  >
                    <div
                      onClick={() => showEditModal(usersDetail.id)}
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
                      onClick={() => handleDelete(usersDetail.id)}
                      style={{
                        width: "32px",
                        height: "40px",
                        borderRadius: "6px",
                        padding: "10px 6px 10px 6px",
                        gap: "10px",
                        backgroundColor: "#FFE7E1",
                        cursor: "pointer",
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.0834 5H2.91663"
                          stroke="#ED5578"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                        <path
                          d="M15.6944 7.08331L15.3111 12.8326C15.1637 15.045 15.0899 16.1512 14.3691 16.8256C13.6482 17.5 12.5396 17.5 10.3222 17.5H9.67775C7.46042 17.5 6.35175 17.5 5.63091 16.8256C4.91007 16.1512 4.83632 15.045 4.68883 12.8326L4.30554 7.08331"
                          stroke="#ED5578"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                        <path
                          d="M7.91663 9.16669L8.33329 13.3334"
                          stroke="#ED5578"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                        <path
                          d="M12.0833 9.16669L11.6666 13.3334"
                          stroke="#ED5578"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                        <path
                          d="M5.41663 5C5.46319 5 5.48648 5 5.50758 4.99947C6.19379 4.98208 6.79915 4.54576 7.03264 3.90027C7.03982 3.88041 7.04719 3.85832 7.06191 3.81415L7.14282 3.57143C7.21188 3.36423 7.24642 3.26063 7.29222 3.17267C7.47497 2.82173 7.81308 2.57803 8.2038 2.51564C8.30173 2.5 8.41094 2.5 8.62934 2.5H11.3706C11.589 2.5 11.6982 2.5 11.7961 2.51564C12.1868 2.57803 12.525 2.82173 12.7077 3.17267C12.7535 3.26063 12.788 3.36423 12.8571 3.57143L12.938 3.81415C12.9527 3.85826 12.9601 3.88042 12.9673 3.90027C13.2008 4.54576 13.8061 4.98208 14.4923 4.99947C14.5134 5 14.5367 5 14.5833 5"
                          stroke="#ED5578"
                          stroke-width="1.5"
                        />
                      </svg>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "12px 20px",
                    textAlign: "center",
                    color: "#1C335C",
                    fontWeight: "600",
                    fontFamily: "Manrope",
                  }}
                >
                  No roles assigned for this school.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding designation  */}
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
                      <option key={designation.id} value={designation.id}>
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

      {/* Modal for Editing designation Details */}
      <Modal
        id="kt_modal_create_app"
        tabIndex={-1}
        aria-hidden="true"
        dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
        show={isEditModalVisible}
        onHide={handleEditCancel}
        backdrop={true}
      >
        <div className="modal-header">
          <h2 style={{ fontFamily: "Manrope" }}>Edit User Details:</h2>
          <div
            className="btn btn-sm btn-icon btn-active-color-primary"
            onClick={handleEditCancel}
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
                  <Form.Label>User First Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-user"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter User Name"
                      value={userData.name}
                      onChange={handleInputEditChange}
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
                      <i className="fas fa-user"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="surname"
                      placeholder="Enter User Surname"
                      value={userData.surname}
                      onChange={handleInputEditChange}
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
                      <i className="fas fa-envelope"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      value={userData.email}
                      onChange={handleInputEditChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3 custom-input" controlId="formRole">
                  <Form.Label>Select Role</Form.Label>
                  <Form.Select
                    name="role_id"
                    value={userData.role_id || ""}
                    onChange={handleInputEditChange}
                    required
                  >
                    <option value="" disabled>
                      Select a role
                    </option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.role}
                      </option>
                    ))}
                  </Form.Select>
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
                    value={userData.designation}
                    onChange={handleInputEditChange}
                    disabled={disable}
                    required
                  >
                    <option value="">{selectDes}</option>
                    {designations.map((designation) => (
                      <option key={designation.id} value={designation.id}>
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
                    label={userData.is_active ? "Active" : "Inactive"}
                    checked={userData.is_active}
                    onChange={handleEditToggle}
                    className="ms-2"
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: userData.is_active ? "#28a745" : "#dc3545",
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
            onClick={handleEditSave}
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
    </div>
  );
};

export { TablesWidget44 };
