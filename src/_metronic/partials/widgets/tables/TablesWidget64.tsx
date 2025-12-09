import React, { useEffect, useState } from "react";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN,get_subscriptions,AddSubscription,UpdateSubscription,DeleteSubscription} from "../../../../app/routing/ApiEndpoints";
import { useNavigate } from "react-router-dom";
import { DeleteConfirmationModal } from "../../modals/create-app-stepper/DeleteConfirmationModal";
import { Modal, Form, Row, Col, InputGroup } from "react-bootstrap";

interface CurrentUser {
  school_id: string;
}
interface DataItem {
  id: number;
  name: string;
  is_active:string;
}

const TablesWidget64 = () => {
  const [data, setData] = useState<DataItem[]>([]);

  const { currentUser } = useAuth();
  const Navigate = useNavigate();
  const schoolId = (currentUser as unknown as CurrentUser)?.school_id;
  
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<DataItem | null>(null);

  const handleShowDeleteModal = (subscription: DataItem) => {
    setSelectedSubscription(subscription);
    setShowModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedSubscription(null);
    setShowModal(false);
  };

  const handleModules = (selectedItem: number, selectedName: string) => () => {
    Navigate(`/subscriptions/modules?subscriptionId=${selectedItem}&subscriptionName=${selectedName}`);
  };

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/${get_subscriptions}`
        );
        if (!response.ok) {
          // Extract the status and error message from the response
          const errorData = await response.json();
          throw new Error(`Error ${errorData.status}: ${errorData.error || "Unknown error"}`);
        }
        const responseData = await response.json();
        setData(responseData.data);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching Subscriptions:", error.message);
        } else {
          console.error("An unexpected error occurred");
        }
      }
    };

    setRefresh(false);
    fetchSubscription();
  }, [schoolId, refresh]);

  const handleSave = (e: any) => {
    
    e.preventDefault();
    if (isEditMode) {
      // console.log(isEditMode);
      
      // Call the update subscription API
      updateSubscription(formData);
    } else {
      // Call the create subscription API
      createSubscription(formData);
    }
    resetForm();
  };

  const createSubscription = async (data:any) => {
    try {
      // Replace with your backend API call
      const response = await fetch(
        `${DOMAIN}/${AddSubscription}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setRefresh(true);
        handleAddCancel();
        // Refresh the data list or update UI accordingly
      } else if (!response.ok) {
        // Extract the status and error message from the response
        const errorData = await response.json();
        throw new Error(`Error ${errorData.status}: ${errorData.error || "Unknown error"}`);
      }
    }catch (error) {
      if (error instanceof Error) {
        console.error("Error Adding Subscription:", error);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  const updateSubscription = async (data:any) => {
    try {
      // Replace with your backend API call
      const response = await fetch(
        `${DOMAIN}/${UpdateSubscription}/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        console.log("Subscription updated successfully");
        setRefresh(true);
        handleAddCancel();
        // Refresh the data list or update UI accordingly
      } else if (!response.ok) {
        // Extract the status and error message from the response
        const errorData = await response.json();
        throw new Error(`Failed To Update Subscription: ${errorData.status}: ${errorData.error || "Unknown error"}`);
      }
    }catch (error) {
      if (error instanceof Error) {
        console.error("Error Updating Subscriptions:", error);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditMode = (subscriptionId: number) => {
    const selectedSubscription = data.find(
      (item) => item.id === subscriptionId
    );

    if (selectedSubscription) {
      setFormData({
        id: selectedSubscription.id.toString(),
        name: selectedSubscription.name,
      });
      setIsEditMode(true); 
      setIsAddModalVisible(true);
    } else {
      console.error("Subscription not found");
    }
  };

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };
  const handleAddCancel = () => {
    resetForm()
    setIsAddModalVisible(false);
  };


  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
    });
    setIsEditMode(false); // Reset to create mode
  };

  const handleDelete = async () => {
    if (!selectedSubscription) return;

    try {
      const response = await fetch(
        `${DOMAIN}/${DeleteSubscription}/${selectedSubscription.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        console.log("Subscription deleted successfully");
        setRefresh(true);
        handleCloseDeleteModal();
      } else if (!response.ok) {
        // Extract the status and error message from the response
        const errorData = await response.json();
        throw new Error(`Failed to delete subscription: ${errorData.status}: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching Subscriptions:", error);
      } else {
        console.error("An unexpected error occurred");
      }
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
          Subscriptions List
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
            Add Subscription
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
                Subscription Name
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "right",
                }}
              >
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "center",
                  width:'50vh',
                }}
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
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
                    padding: "12px 20px",
                    textAlign:'left'
                  }}
                >
                  {item.name}
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                  }}
                >
                  {item.is_active}
                </td>
                <td
                  style={{
                    display: "flex",
                    gap: "10px", // Adds space between the buttons
                    justifyContent: "right", // Aligns buttons horizontally in the center
                    alignItems: "left", // Vertically centers the buttons
                    padding: "12px 20px",
                  }}
                >
                  <div
                    onClick={handleModules(item.id, item.name)}
                    style={{
                      width:'19vh',
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
                      Assign Modules
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.082 3.01775L20.1081 3.76729L20.082 3.01775ZM16.5 3.48744L16.2849 2.76895V2.76895L16.5 3.48744ZM13.6738 4.80275L13.2982 4.15363L13.2982 4.15363L13.6738 4.80275ZM3.9824 3.07489L3.93639 3.82348L3.9824 3.07489ZM7 3.48744L7.19136 2.76227V2.76227L7 3.48744ZM10.2823 4.87546L9.93167 5.53847L10.2823 4.87546ZM13.6276 20.0692L13.9804 20.7311L13.6276 20.0692ZM17 18.6334L16.8086 17.9082H16.8086L17 18.6334ZM19.9851 18.2228L20.032 18.9714L19.9851 18.2228ZM10.3724 20.0692L10.0196 20.7311H10.0196L10.3724 20.0692ZM7 18.6334L7.19136 17.9082H7.19136L7 18.6334ZM4.01486 18.2228L3.96804 18.9714H3.96804L4.01486 18.2228ZM2.75 16.1436V4.9978H1.25V16.1436H2.75ZM22.75 16.1436V4.93319H21.25V16.1436H22.75ZM20.0559 2.2682C18.9175 2.30785 17.4296 2.42627 16.2849 2.76895L16.7151 4.20594C17.6643 3.92179 18.9892 3.80627 20.1081 3.76729L20.0559 2.2682ZM16.2849 2.76895C15.2899 3.06684 14.1706 3.64868 13.2982 4.15363L14.0495 5.45188C14.9 4.95969 15.8949 4.45149 16.7151 4.20594L16.2849 2.76895ZM3.93639 3.82348C4.90238 3.88285 5.99643 3.99829 6.80864 4.21262L7.19136 2.76227C6.23055 2.50873 5.01517 2.38695 4.02841 2.3263L3.93639 3.82348ZM6.80864 4.21262C7.77076 4.46651 8.95486 5.02196 9.93167 5.53847L10.6328 4.21244C9.63736 3.68606 8.32766 3.06211 7.19136 2.76227L6.80864 4.21262ZM13.9804 20.7311C14.9714 20.2028 16.1988 19.6205 17.1914 19.3585L16.8086 17.9082C15.6383 18.217 14.2827 18.8701 13.2748 19.4074L13.9804 20.7311ZM17.1914 19.3585C17.9943 19.1466 19.0732 19.0313 20.032 18.9714L19.9383 17.4743C18.9582 17.5356 17.7591 17.6574 16.8086 17.9082L17.1914 19.3585ZM10.7252 19.4074C9.71727 18.8701 8.3617 18.217 7.19136 17.9082L6.80864 19.3585C7.8012 19.6205 9.0286 20.2028 10.0196 20.7311L10.7252 19.4074ZM7.19136 17.9082C6.24092 17.6574 5.04176 17.5356 4.06168 17.4743L3.96804 18.9714C4.9268 19.0313 6.00566 19.1466 6.80864 19.3585L7.19136 17.9082ZM21.25 16.1436C21.25 16.8293 20.6817 17.4278 19.9383 17.4743L20.032 18.9714C21.5062 18.8791 22.75 17.6798 22.75 16.1436H21.25ZM22.75 4.93319C22.75 3.46989 21.5847 2.21495 20.0559 2.2682L20.1081 3.76729C20.7229 3.74588 21.25 4.25161 21.25 4.93319H22.75ZM1.25 16.1436C1.25 17.6798 2.49378 18.8791 3.96804 18.9714L4.06168 17.4743C3.31831 17.4278 2.75 16.8293 2.75 16.1436H1.25ZM13.2748 19.4074C12.4825 19.8297 11.5175 19.8297 10.7252 19.4074L10.0196 20.7311C11.2529 21.3885 12.7471 21.3885 13.9804 20.7311L13.2748 19.4074ZM13.2982 4.15363C12.4801 4.62709 11.4617 4.6507 10.6328 4.21244L9.93167 5.53847C11.2239 6.22177 12.791 6.18025 14.0495 5.45188L13.2982 4.15363ZM2.75 4.9978C2.75 4.30062 3.30243 3.78451 3.93639 3.82348L4.02841 2.3263C2.47017 2.23053 1.25 3.49864 1.25 4.9978H2.75Z"
                        fill="white"
                      />
                      <path
                        d="M12 5.854V20.9999"
                        stroke="white"
                        stroke-width="1.5"
                      />
                      <path
                        d="M5 9L9 10"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M5 13L9 14"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M19 13L15 14"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M19 5.5V9.51029C19 9.78587 19 9.92366 18.9051 9.97935C18.8103 10.035 18.6806 9.97343 18.4211 9.85018L17.1789 9.26011C17.0911 9.21842 17.0472 9.19757 17 9.19757C16.9528 9.19757 16.9089 9.21842 16.8211 9.26011L15.5789 9.85018C15.3194 9.97343 15.1897 10.035 15.0949 9.97935C15 9.92366 15 9.78587 15 9.51029V6.95002"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                    </svg>
                  </div>
                  <div
                      onClick={() => handleEditMode(item.id)}
                    style={{
                      width:'14vh',
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
                      Edit Name
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
                    onClick={() => handleShowDeleteModal(item)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 12px",
                      border: "1px solid #1C335C",
                      // backgroundColor: "#1C335C",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                    // onMouseEnter={(e) =>
                    //   (e.currentTarget.style.backgroundColor = "#16294D")
                    // }
                    // onMouseLeave={(e) =>
                    //   (e.currentTarget.style.backgroundColor = "#1C335C")
                    // }
                  >
                    <span
                      style={{
                        marginRight: "8px",
                        color: "#ED5578",
                        fontSize: "14px",
                        fontWeight: "500",
                        fontFamily: "Manrope",
                      }}
                    >
                      Delete
                    </span>
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
                        d="M15.6944 7.08325L15.3111 12.8325C15.1637 15.0449 15.0899 16.1512 14.3691 16.8255C13.6482 17.4999 12.5396 17.4999 10.3222 17.4999H9.67775C7.46042 17.4999 6.35175 17.4999 5.63091 16.8255C4.91007 16.1512 4.83632 15.0449 4.68883 12.8325L4.30554 7.08325"
                        stroke="#ED5578"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M7.91663 9.16675L8.33329 13.3334"
                        stroke="#ED5578"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M12.0833 9.16675L11.6666 13.3334"
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
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        show={showModal}
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete the subscription "${selectedSubscription?.name}"? This will also delete all entries assigned to this subscription. This action cannot be undone.`}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />


      <Modal
        id="kt_modal_create_app"
        tabIndex={-1}
        aria-hidden="true"
        dialogClassName="modal-dialog modal-dialog-centered mw-500px"
        show={isAddModalVisible}
        onHide={handleAddCancel}
        backdrop={true}
      >
        <div className="modal-header">
          <h2 style={{ fontFamily: "Manrope" }}>{isEditMode ? 'Edit Subscription:' : 'Add Subscription:'}</h2>
          <div
            className="btn btn-sm btn-icon btn-active-color-primary"
            onClick={handleAddCancel}
          >
            <i className="fas fa-times"></i>
          </div>
        </div>
        <div className="modal-body py-lg-10 px-lg-10">
          <Form onSubmit={handleSave}>
            <Row>
              <Col md={12}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formSchoolName"
                >
                  <Form.Label>Subscription Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-bookmark"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="name"
                       placeholder="Enter Name"
                      value={formData.name} // Update the formData value
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
        <div className="modal-footer border-0">

          <button
            type="submit"
            className="btn btn-secondary"
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
        
          >
            <span
              style={{
                color: "#FFF",
                fontFamily: "Manrope",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
               {isEditMode ? "Update" : "Save"}
            </span>
          </button>
        </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export { TablesWidget64 };
