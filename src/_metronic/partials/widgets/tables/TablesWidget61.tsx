import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
// import { Tooltip as ReactTooltip } from "react-tooltip";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
// import { CreateWalkinEnquiry } from "../../modals/create-app-stepper/CreateWalkinEnquiry";
// import { CreateEnquiryAction } from "../../modals/create-app-stepper/CreateEnquiryAction";
// import { CreateEditEnquiry } from "../../modals/create-app-stepper/CreateEditEnquiry";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
// import { UploadsFilter } from "../../modals/create-app-stepper/UploadsFilter";
// import { AddClasses } from "../../modals/create-app-stepper/AddClasses";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
// import { DeleteFeeGroupModal } from "../../modals/create-app-stepper/DeleteFeeGroupModal";
import { CreateEditFeeGroup } from "../../modals/create-app-stepper/CreateEditFeeGroup";
import {
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DeleteConfirmationModal } from "../../modals/create-app-stepper/DeleteConfirmationModal";
import Select from "react-select";


interface CurrentUser {
  school_id: string;
}

interface DataItem {
  session_name: string;
  class_name: string;
  id: number;
  fee_group_name: string;
}
interface Session {
  id: number;
  session: number;
}

interface Class {
  class_id: number;
  id: number;
  name: string;
  class: string;
}

interface Section {
  id: number;
  section: string;
}

interface ClassData {
  id: number;
  className: string;
}
interface SessionData {
  id: number;
  session: number;
}

const TablesWidget61 = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const { currentUser } = useAuth();
  const [referesh, setReferesh] = useState(false);
  const [fee_group_id, setfee_group_id] = useState<number>(0);
  const [fee_group_session_id, setfee_group_session_id] = useState<number>(0);
  const [fee_group_name, setfee_group_name] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeletModal, setShowDeleteModal] = useState<boolean>(false);
  const [editsession, setEditSession] = useState<number>(0);
  const [editclass, setEditClass] = useState<number>(0);
  const [editsection, setEditSection] = useState<number>(0);
  const schoolId = (currentUser as CurrentUser)?.school_id;
  const sessionId = (currentUser as CurrentUser)?.session_id;
  const [formData, setFormData] = useState({
    name: "",
    class_ids: [], // Ensure it's an array, not a single value
  });

  const [getClass, setClass] = useState<Class[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<ClassData[]>([]); // Use an array

  const [selectedSections, setSelectedSections] = useState<Section[]>([]);
  const [isAllSectionsSelected, setIsAllSectionsSelected] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShowEditModal = (
    fee_group_id: number,
    fee_group_name: string,
    fee_group_session_id: number,
    session: number,
    class_id: number
  ) => {
    setfee_group_id(fee_group_id);
    setfee_group_name(fee_group_name);
    setfee_group_session_id(fee_group_session_id);
    setEditSession(session);
    setEditClass(class_id);
    setShowEditModal(true);
  };
  const showAddModal = () => {
    setIsAddModalVisible(true);
  };
  const handleAddCancel = () => {
    setIsAddModalVisible(false);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setfee_group_id(0);
    setfee_group_name("");
    setfee_group_session_id(0);
    setEditSession(0);
    setEditClass(0);
    setEditSection(0);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/delete-feegroup/${fee_group_id}/${fee_group_session_id}/${schoolId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json(); // Parse JSON response

      if (!response.ok) {
        // Handle custom error response from backend
        if (data.code === "001") {
          toast.error(data.error, { autoClose: 3000 });
          return; // Exit the function if deletion is not allowed
        }
        throw new Error(data.error || "Failed to delete fee group");
      }

      // Success case
      setReferesh(true); // Assuming you have a way to refresh the list of fee groups
      toast.success("Fee Group deleted successfully.", { autoClose: 3000 });
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting fee group:", error);
      toast.error(error.message || "Failed to delete fee group!", {
        autoClose: 3000,
      });
    }
  };

  const handleShowDeleteModal = (
    fee_group_id: number,
    fee_group_session_id: number
  ) => {
    setfee_group_id(fee_group_id);
    setfee_group_session_id(fee_group_session_id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setfee_group_id(0);
    setfee_group_session_id(0);
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-classes-for-session/${schoolId}/${sessionId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        setClass(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchClasses();
  }, [schoolId]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-school-sessions/${schoolId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        setSession(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSessions();
  }, [schoolId]);

  useEffect(() => {
    const fetchFeeGroups = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/getfeegroup/${schoolId}/${sessionId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch fee groups");
        }
        const responseData = await response.json();
        setData(responseData);
        setFilteredData(responseData);
      } catch (error) {
        console.error("Error fetching fee groups:", error);
      }
    };

    fetchFeeGroups();
    setReferesh(false);
  }, [schoolId, referesh, sessionId]);

  // const handleClassSelected = ({ class: className, class_id }: any) => {
  //   setSelectedClasses((prevSelected) => {
  //     const isAlreadySelected = prevSelected.find(
  //       (cls) => cls.class_id === class_id
  //     );

  //     const updatedClasses = isAlreadySelected
  //       ? prevSelected.filter((cls) => cls.class_id !== class_id) // Remove if already selected
  //       : [...prevSelected, { class_id, className }]; // Add if not selected

  //     // Update formData with selected class IDs
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       class_ids: updatedClasses.map((cls) => cls.class_id), // Store IDs in an array
  //     }));

  //     return updatedClasses;
  //   });
  // };

  const handleClassChange = (selectedOptions: any[]) => {
    const updatedClasses = selectedOptions || [];
  
    setSelectedClasses(updatedClasses); // update selected class objects
  
    // Update formData with selected class_ids
    setFormData((prevFormData) => ({
      ...prevFormData,
      class_ids: updatedClasses.map((cls) => cls.value), // Use `value` as class_id from react-select
    }));
  };
  

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    // Trim and normalize inputs
    const { name, class_ids } = formData;

    if (!name || class_ids.length === 0) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/add-feegroup/${schoolId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, class_ids, sessionId }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast.warning("Fee group already exists for this class and session.");
        } else {
          toast.error(result.error || "Failed to add fee group.");
        }
        return;
      }

      toast.success("Fee group added successfully!");
      handleClose();

      handleAddCancel(); // Close modal after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase(); // Convert the search query to lowercase
    setSearchQuery(query);
    // Filter data by checking if the query is present anywhere in the fee_group_name
    const filtered = data.filter(
      (item) => item.fee_group_name.toLowerCase().includes(query) // Match any part of the string
    );
    setFilteredData(filtered);
  };

  const handleClose = () => {
    handleAddCancel();
    setFormData({ name: "", class_ids: [] });
    setSelectedClasses([]);
    setIsSubmitting(false);
    setReferesh(true);
  };

  const classOptions = getClass.map((cls) => ({
    value: cls.class_id,
    label: cls.class,
  }));

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
          {" "}
          Fees Group List
        </span>
        <div style={{ display: "flex", gap: "10px" }}>
          <div
            className="input-group flex-nowrap"
            style={{
              width: "300px",
              height: "36px",
              borderRadius: "8px",
              border: "1px solid #1C335C",
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
                    stroke="#1C335C"
                    stroke-width="1.5"
                  />
                  <path
                    d="M14.1667 13.3333L15.5 14.6666"
                    stroke="#1C335C"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_582_4295">
                    <rect
                      width="16"
                      height="16"
                      fill="#1C335C"
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
              placeholder="Search ...."
              aria-label="Search"
              aria-describedby="addon-wrapping"
              value={searchQuery || ""} // Bind search input to state
              onChange={handleSearch} // Pass the event to handleSearch
            />
          </div>
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
              Add Group
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
                Fee Group
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                For Class
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                For Session
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "right",
                }}
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan="4" // Adjust this based on the number of columns in your table
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#1C335C",
                  }}
                >
                  No data available
                </td>
              </tr>
            ) : (
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
                  <td
                    style={{
                      padding: "20px 20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#1F4061",
                      fontFamily: "Manrope",
                    }}
                  >
                    {item.fee_group_name}
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
                    {item.class_name}
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
                    {item.session_name}
                  </td>
                  <td
                    style={{
                      display: "flex",
                      gap: "10px", // Adds space between the buttons
                      justifyContent: "right", // Aligns buttons horizontally in the center
                      alignItems: "center", // Vertically centers the buttons
                      padding: "12px 20px",
                      border: "none",
                    }}
                  >
                    <div
                      onClick={() =>
                        handleShowEditModal(
                          item.fee_groups_id,
                          item.fee_group_name,
                          item.fee_group_session_id,
                          item.session_id,
                          item.class_id
                        )
                      }
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
                    <OverlayTrigger
                      placement="top" // Tooltip position
                      overlay={
                        <Tooltip id="tooltip-disabled">
                          {item.delete === "no"
                            ? "Cannot delete - In use"
                            : "Delete"}
                        </Tooltip>
                      }
                    >
                      <div
                        onClick={() => {
                          if (item.delete === "yes") {
                            handleShowDeleteModal(
                              item.fee_groups_id,
                              item.fee_group_session_id
                            );
                          }
                        }}
                        style={{
                          width: "32px",
                          height: "40px",
                          borderRadius: "6px",
                          padding: "10px 6px 10px 6px",
                          gap: "10px",
                          backgroundColor:
                            item.delete === "no" ? "#E0E0E0" : "#FFE7E1", // Disabled color
                          cursor:
                            item.delete === "no" ? "not-allowed" : "pointer", // Disable pointer cursor
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            pointerEvents:
                              item.delete === "no" ? "none" : "auto", // Disable pointer events for SVG when delete is 'no'
                          }}
                        >
                          <path
                            d="M17.0834 5H2.91663"
                            stroke="#ED5578"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M15.6944 7.08331L15.3111 12.8326C15.1637 15.045 15.0899 16.1512 14.3691 16.8256C13.6482 17.5 12.5396 17.5 10.3222 17.5H9.67775C7.46042 17.5 6.35175 17.5 5.63091 16.8256C4.91007 16.1512 4.83632 15.045 4.68883 12.8326L4.30554 7.08331"
                            stroke="#ED5578"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M7.91663 9.16669L8.33329 13.3334"
                            stroke="#ED5578"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M12.0833 9.16669L11.6666 13.3334"
                            stroke="#ED5578"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M5.41663 5C5.46319 5 5.48648 5 5.50758 4.99947C6.19379 4.98208 6.79915 4.54576 7.03264 3.90027C7.03982 3.88041 7.04719 3.85832 7.06191 3.81415L7.14282 3.57143C7.21188 3.36423 7.24642 3.26063 7.29222 3.17267C7.47497 2.82173 7.81308 2.57803 8.2038 2.51564C8.30173 2.5 8.41094 2.5 8.62934 2.5H11.3706C11.589 2.5 11.6982 2.5 11.7961 2.51564C12.1868 2.57803 12.525 2.82173 12.7077 3.17267C12.7535 3.26063 12.788 3.36423 12.8571 3.57143L12.938 3.81415C12.9527 3.85826 12.9601 3.88042 12.9673 3.90027C13.2008 4.54576 13.8061 4.98208 14.4923 4.99947C14.5134 5 14.5367 5 14.5833 5"
                            stroke="#ED5578"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td
                className="pe-3"
                colSpan={4}
                style={{
                  width: "100%",
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

          {/* 
<UploadsFilter
show={showModal}
handleClose={handleModalClose}
filterData={applyfilters}
/> */}
          {/* <CreateEnquiryAction show={showActionModal} handleClose={handleActionModalClose} enqId={enqId}/> */}
          {/* <AddClasses show={showModal} handleClose={handleModalClose} /> */}

          {/* end::Table body */}
        </table>
      </div>
      <Modal
        id="kt_modal_create_app"
        tabIndex={-1}
        aria-hidden="true"
        dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
        show={isAddModalVisible}
        onHide={handleClose}
        backdrop={true}
      >
        <div
          className="modal-header"
          style={{
            borderBottom: "1px solid lightgray",
            backgroundColor: "rgb(242, 246, 255)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              fontFamily: "Manrope",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Add Fee Group :
          </h2>
          <div
            className="btn btn-sm btn-icon btn-active-color-primary"
            onClick={handleClose}
          >
            <i className="fas fa-times"></i>
          </div>
        </div>
        <div
          className="modal-body py-lg-10 px-lg-10"
          style={{
            borderBottom: "1px solid lightgray",
            backgroundColor: "rgb(242, 246, 255)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Fees Group Name */}
              <Col md={6}>
                <Form.Group className="mb-4" controlId="formGroupName">
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Fees Group Name
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter Fees Type name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      required
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              {/* Select Class */}
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formClass">
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Select Classes
                  </Form.Label>
                  <Select
                    options={classOptions}
                    isMulti
                    onChange={handleClassChange} // function to update selected classes
                    placeholder="Select Classes..."
                    className="basic-multi-select"
                    classNamePrefix="select"
                    closeMenuOnSelect={false}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "5px",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                        padding:'2px',
                        outline:'none'
                      }),
                    }}
                  />
                </Form.Group>
              </Col>

              {/* Select Section */}

              {/* Select Session */}
              {/* <Col md={6}>
                <div className="mb-2">
                  <span
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Select Session
                  </span>
                </div>
                <div style={{ marginBottom: "23px", width: "100%" }}>
                  <div className="dropdown" id="selectSession">
                    <div
                      className="btn btn-secondary dropdown-toggle"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "white",
                        border: "1px solid #ECEDF1",
                        borderRadius: "8px",
                        fontFamily: "Manrope",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {selectedSession.session
                        ? selectedSession.session
                        : "Select Session"}
                    </div>
                    <ul
                      className="dropdown-menu"
                      style={{
                        width: "100%",
                        maxHeight: "150px",
                        overflowY: "scroll",
                      }}
                    >
                      {getSession.map((item) => (
                        <li key={item.id}>
                          <div
                            className="dropdown-item"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSessionSelected({
                                id: item.id,
                                session: item.session,
                              });
                            }}
                            style={{
                              fontFamily: "Manrope",
                              fontWeight: "500",
                              fontSize: "14px",
                            }}
                          >
                            {item.session}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Col> */}
            </Row>

            {/* Add Button */}
            <div style={{ justifyContent: "flex-end", display: "flex" }}>
              <Button
                type="submit"
                variant="primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  backgroundColor: "#1C335C",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  width: "max-content",
                }}
                disabled={isSubmitting}
              >
                <span
                  style={{
                    color: "#FFF",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </span>
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
      <CreateEditFeeGroup
        show={showEditModal}
        handleClose={handleCloseEditModal}
        fee_group_id={fee_group_id}
        fee_group_session_id={fee_group_session_id}
        fee_group_name={fee_group_name}
        session={editsession}
        class_id={editclass}
        section_id={editsection}
        setReferesh={setReferesh}
      />{" "}
      <DeleteConfirmationModal
        show={showDeletModal}
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete this Fee Group ?  \n This action cannot be undone.`}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
    </div>
  );
};
export { TablesWidget61 };
