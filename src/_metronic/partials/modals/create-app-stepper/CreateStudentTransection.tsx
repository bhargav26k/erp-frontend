import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Modal } from "react-bootstrap";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
  studentFeesMasterId: number;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateStudentTransection = ({
  show,
  handleClose,
  setRefresh,
  studentFeesMasterId,
}: Props) => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;

  const [transactionDetails, setTransactionDetails] = useState([]);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-transection-details/${studentFeesMasterId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        setTransactionDetails(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchFees();
  }, [school_id, studentFeesMasterId]);

  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      size="xl"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered"
      show={show}
      onHide={handleClose}
    >
      <div
        className="modal-header"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
        }}
      >
        <h2 style={{fontFamily:'Manrope'}}>Transection History</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>
      <div
        className="modal-body py-lg-5 px-lg-5"
        style={{ backgroundColor: "#F2F6FF" }}
      >
        <div
          style={{
            height: "auto", // Fixed height for the table container
            overflowY: "hidden",
            // border:'1px solid'
          }}
        >
          <table
            className="table"
            style={{
              width: "100%",
              height: "100%",
              borderCollapse: "collapse",
              // marginTop: "10px",
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
                  Transaction ID
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
                  Student Fees Master ID
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
                  Transaction Reference
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
              {transactionDetails.map((item, index) => (
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
                    }}
                  >
                    {item.transaction_id}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                    }}
                  >
                    {new Date(item.transaction_date).toLocaleDateString()}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                    }}
                  >
                    {item.student_fees_master_id}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                    }}
                  >{`$${Number(item.amount).toFixed(2)}`}</td>{" "}
                  {/* Conversion to number */}
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
                    {item.transaction_ref || "N/A"}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight:'500',
                        color:'#fff'
                      }}
                      className={`badge ${
                        item.status === "success" ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateStudentTransection };
