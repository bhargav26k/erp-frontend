import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { createPortal } from "react-dom";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { useAuth } from "../../../../app/modules/auth";

const modalsRoot = document.getElementById("root-modals") || document.body;

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: (refresh: boolean) => void;
  admissionEnqId: string;
};

const AdmissionFeesHistory = ({
  show,
  handleClose,
  setRefresh,
  admissionEnqId,
}: Props) => {
  const {currentUser} = useAuth();
  const [transactionHistroy, setTransactionHistroy] = useState([]);
  const handleCloseModal = () => {
    setTransactionHistroy([]);
    setRefresh(true); // If you need to refresh after closing
    handleClose(); // Closes the modal
  };

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!admissionEnqId) return;

      try {
        const response = await fetch(
          `${DOMAIN}/api/school/admissionfees-transaction-history/${admissionEnqId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTransactionHistroy(data);
      } catch (error) {
        console.error("Error fetching references:", error);
      }
    };
    fetchTransactionDetails();
  }, [admissionEnqId]);

  return createPortal(
    <Modal
      id="kt_modal_create_enquiry"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      show={show}
      onHide={handleCloseModal}
      backdrop={true}
    >
      <div
        className="modal-header"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
        }}
      >
        <h2 style={{ color: "#1C335C", fontFamily: "Manrope" }}>
          View Transaction History
        </h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleCloseModal}
        >
          <i className="fas fa-times" style={{ color: "#1C335C" }}></i>
        </div>
      </div>

      <div
        style={{
          height: "auto", // Fixed height for the table container
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
                Transaction Id
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Name
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Type
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Amount
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Payment Method
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Transaction Date
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {transactionHistroy?.map((item) => {
              return (
                <tr
                  key={item.id}
                  style={{
                    backgroundColor:
                      item.feetype_id % 2 === 0
                        ? "rgb(242, 246, 255)"
                        : "#FFFFFF",
                    borderBottom: "1px solid #E0E4F0",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    color: "#1C335C",
                  }}
                >
                  <td
                    style={{
                      padding: "12px 20px",
                    }}
                  >
                    {item.transaction_id}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                    }}
                  >
                    {item.name}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                    }}
                  >
                    {item.type}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                    }}
                  >
                    {currentUser?.currency_symbol + "" +item.amount}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                    }}
                  >
                    {item.payment_method}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                    }}
                  >
                    {item.transaction_date}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                    }}
                  >
                    {item.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { AdmissionFeesHistory };
