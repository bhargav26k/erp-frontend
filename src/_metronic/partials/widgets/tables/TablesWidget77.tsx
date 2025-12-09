import React, { useEffect, useState } from "react";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { EditPaymentGateway } from "../../modals/create-app-stepper/EditPaymentGateway";
import { AddPaymentGateWay } from "../../modals/create-app-stepper/AddPaymentGateWay";

interface TablesWidget43Props {
  schoolId: string | undefined;
}

const TablesWidget77: React.FC<TablesWidget43Props> = ({ schoolId }) => {
  const [paymentGateway, setPaymentgateway] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // To track if we are editing
  const [selectedPaymentGateway, setSelectedPaymentGateway] =
    useState<any>(null); // Store selected payment gateway for edit
  const [refresh, setRefresh] = useState(false);

  // Fetch school-wise paymentGateway
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-payment-gateway/${schoolId}`
        );
        if (!response.ok) {
          // Extract the status and error message from the response
          const errorData = await response.json();
          throw new Error(
            `Error ${errorData.status}: ${errorData.error || "Unknown error"}`
          );
        }
        const data = await response.json();
        // console.log(data);

        setPaymentgateway(data.paymentGateways);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching paymentGateway:", error.message);
        } else {
          console.error("An unexpected error occurred");
        }
      }
    };

    fetchData();
  }, [schoolId, refresh]);

  const handleShowEditModal = (paymentGatewayData: any) => {
    setShowEditModal(true);
    setSelectedPaymentGateway(paymentGatewayData);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPaymentGateway({});
  };

  const handleShowAddModal = () => {
    setShowModal(true);
  };

  const handleCloseAddModal = () => {
    setShowModal(false);
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
          Manage Payment Gateway
        </span>
        <div
          onClick={ handleShowAddModal}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
            backgroundColor: "#1C335C", // Change color when disabled
            borderRadius: "8px",
            cursor: "pointer", // Change cursor when disabled
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
            Add Payment Gateway
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
              <th style={{ padding: "12px 20px", textAlign: "left" }}>Id</th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>Mode</th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Router Domain
              </th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Username
              </th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Password
              </th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Merchant code
              </th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Private key
              </th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Private value
              </th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Url Success
              </th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Url Fail
              </th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Status
              </th>
              <th style={{ padding: "12px 20px", textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paymentGateway.length > 0 ? (
              paymentGateway.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? "rgb(242, 246, 255)" : "#FFFFFF",
                    borderBottom: "1px solid #E0E4F0",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    color: "#1C335C",
                    opacity: item.designation_id === 20 ? 0.5 : 1, // Make the row semi-transparent if designation_id is 20
                    pointerEvents: item.designation_id === 20 ? "none" : "auto", // Disable interaction for the row
                  }}
                  aria-readonly={item.designation_id === 20} // Optional: for accessibility
                >
                  <td style={{ padding: "12px 20px" }}>{item.id}</td>
                  <td style={{ padding: "12px 20px" }}>{item.mode}</td>
                  <td style={{ padding: "12px 20px" }}>{item.router_domain}</td>
                  <td style={{ padding: "12px 20px" }}>{item.username}</td>
                  <td style={{ padding: "12px 20px" }}>{item.password}</td>
                  <td style={{ padding: "12px 20px" }}>{item.merchant_code}</td>
                  <td style={{ padding: "12px 20px" }}>{item.private_key}</td>
                  <td style={{ padding: "12px 20px" }}>{item.private_value}</td>
                  <td style={{ padding: "12px 20px" }}>{item.url_success}</td>
                  <td style={{ padding: "12px 20px" }}>{item.url_fail}</td>
                  <td
                    style={{
                      padding: "12px 20px",
                      color: item.status === 1 ? "green" : "red",
                    }}
                  >
                    {item.status === 0  ? "InActive" : "Active"}
                  </td>
                  <td style={{ padding: "12px 20px", textAlign: "right" }}>
                    <button
                      onClick={() => handleShowEditModal(item)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#1C335C",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
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
        {/* Assign Designation Modal */}
        <EditPaymentGateway
          show={showEditModal}
          handleClose={handleCloseEditModal}
          setRefresh={setRefresh}
          selectedPaymentGateway={selectedPaymentGateway}
          schoolId={schoolId}
        />
        <AddPaymentGateWay
          show={showModal}
          handleClose={handleCloseAddModal}
          setRefresh={setRefresh}
          schoolId={schoolId}
        />
      </div>
    </div>
  );
};

export { TablesWidget77 };
