import React, { useEffect, useState } from "react";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
import { DeleteFeeTypeModal } from "../../modals/create-app-stepper/DeleteFeeTypeModal";
import { CreateEditFeeType } from "../../modals/create-app-stepper/CreateEditFeeType";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import {
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CurrentUser {
  school_id: string;
}
interface DataItem {
  id: number;
  type: string;
  code: string;
}

const TablesWidget60 = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [referesh, setReferesh] = useState(false);
  const { currentUser } = useAuth();
  const [fee_type_id, setfee_type_id] = useState<number | null>(null);
  const [fee_type_name, setfee_type_name] = useState<string>("");
  const [fee_type_code, setfee_type_code] = useState<string>("");
  const schoolId = (currentUser as unknown as CurrentUser)?.school_id;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    feeCode: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);

  const handleShowEditModal = (
    fee_type_id: number,
    name: string,
    feecode: string
  ) => {
    setfee_type_id(fee_type_id);
    setfee_type_name(name);
    setfee_type_code(feecode);
    setShowEditModal(true);
  };

  const handleShowDeleteModal = (fee_type_id: number) => {
    setfee_type_id(fee_type_id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setfee_type_id(null);
  };

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };
  const handleAddCancel = () => {
    setfee_type_id(null);
    setfee_type_name("");
    setfee_type_code("");
    setFormData({
      name: "",
      feeCode: "",
    });
    setIsAddModalVisible(false);
  };

  const handleCloseEditModal = () => {
    setfee_type_id(null);
    setfee_type_name("");
    setfee_type_code("");
    setShowEditModal(false);
  };

  useEffect(() => {
    const fetchFeeTypes = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/getfeetype/${schoolId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        setData(responseData);
        setFilteredData(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchFeeTypes();
    setReferesh(false);
  }, [schoolId, referesh]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = data.filter(
      (item) =>
        item.type.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query)
    );

    setFilteredData(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevents multiple clicks
    setIsSubmitting(true);

    // Trim and normalize inputs
    const name = formData.name;
    const feeCode = formData.feeCode.trim().toUpperCase().replace(/\s+/g, "");

    if (!name || !feeCode) {
      toast.error("Please enter a valid fee type name and fee code.");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/add-feetype/${schoolId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, feeCode }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast.warning("Fee type with this name or code already exists.");
        } else {
          toast.error(result.error || "Failed to add fee type.");
        }
        return;
      }

      toast.success("Fee type added successfully!");
      setReferesh(true);
      handleAddCancel(); // Close modal after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F2") {
        showAddModal(); // Trigger the modal-opening function
      }
    };

    window.addEventListener("keydown", handleKeyDown); // Attach the event listener

    return () => {
      window.removeEventListener("keydown", handleKeyDown); // Cleanup on unmount
    };
  }, []);

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
          Fees Type List
        </span>
        <div style={{ display: "flex", gap: "10px" }}>
          <div
            className="alert alert-info mb-0"
            style={{
              flex: "1",
              padding: "8px 16px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Press <strong> F2 </strong> to add a new section here itself.
          </div>
          <div
            className="input-group flex-nowrap"
            style={{
              width: "300px",
              height: "36px",
              borderRadius: "5px",
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
                fontFamily: "Manrope",
                fontWeight: "500",
                fontSize: "14px",
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
              backgroundColor: "#1F4061",
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
              Add Type
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
          height: "680px", // Fixed height for the table container
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
                Fee Type
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "center",
                }}
              >
                Fee Code
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
                  {item.type}
                </td>
                <td
                  style={{
                    padding: "20px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#1F4061",
                    fontFamily: "Manrope",
                    textAlign: "center",
                  }}
                >
                  {item.code}
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
                      handleShowEditModal(item.id, item.type, item.code)
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 12px",
                      backgroundColor: "#1F4061",
                      borderRadius: "5px",
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
                    placement="top"
                    overlay={
                      item.delete === "no" ? (
                        <Tooltip id={`tooltip1`}>
                          cannot delete used in Fee Master
                        </Tooltip>
                      ) : (
                        <span />
                      )
                    }
                  >
                    <div
                      onClick={() =>
                        item.delete === "yes" && handleShowDeleteModal(item.id)
                      }
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
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={3}
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
        </table>
      </div>
      <Modal
        id="kt_modal_create_app"
        tabIndex={-1}
        aria-hidden="true"
        dialogClassName="modal-dialog modal-dialog-centered mw-800px"
        show={isAddModalVisible}
        onHide={handleAddCancel}
        backdrop={true}
      >
        <div
          className="modal-header"
          style={{
            borderBottom: "1px solid lightgray",
            backgroundColor: "rgb(242, 246, 255)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            maxHeight:'70px'
          }}
        >
          <h2
            style={{
              fontFamily: "Manrope",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Add Fees Type :
          </h2>
          <div
            className="btn btn-sm btn-icon btn-active-color-primary"
            onClick={handleAddCancel}
          >
            <i className="fas fa-times"></i>
          </div>
        </div>
        <div
          className="modal-body py-lg-10 px-lg-10"
          style={{
            backgroundColor: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formDesignationName"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Fees Type Name
                  </Form.Label>
                  <InputGroup>
                    {/* <InputGroup.Text>
                      <i className="fas fa-school"></i>
                    </InputGroup.Text> */}
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
              <Col md={6}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formFeesCode"
                >
                  <Form.Label
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Fees Code
                  </Form.Label>
                  <InputGroup>
                    {/* <InputGroup.Text>
                      <i className="fas fa-code"></i>
                    </InputGroup.Text> */}
                    <Form.Control
                      type="text"
                      name="feeCode"
                      placeholder="Enter fee code"
                      value={formData.feeCode || ""}
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
            </Row>
            <div style={{ justifyContent: "right", display: "flex" }}>
              <Button
                type="submit"
                variant="secondary"
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

      <CreateEditFeeType
        show={showEditModal}
        handleClose={handleCloseEditModal}
        fee_type_id={fee_type_id}
        fee_type_name={fee_type_name}
        fee_type_code={fee_type_code}
        setReferesh={setReferesh}
      />

      <DeleteFeeTypeModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        fee_type_id={fee_type_id}
        setReferesh={setReferesh}
      />
    </div>
  );
};

export { TablesWidget60 };

//   </div>
// </div>
