/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useAuth } from "../../../../app/modules/auth/index.ts";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints.tsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  show: boolean;
  onHide: () => void;
  fee_type_id: number | null;
  setReferesh: any;
};

const DeleteFeeTypeModal = ({
  show,
  onHide,
  fee_type_id,
  setReferesh,
}: Props) => {
  // const [FeeDetails, setFeesDetails] = useState([]);
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const [isConfirmed, setIsConfirmed] = useState(false); // State to track confirmation

  const handleConfirm = () => {
    setIsConfirmed(true); // Set confirmation state to true
  };

  const handleCancel = () => {
    setIsConfirmed(false);
    setReferesh(true);
    onHide();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/delete-feetype/${fee_type_id}/${schoolId}`,
        {
          method: "DELETE", // Change to DELETE method
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Deleted Successfully:", data);

      // Show success notification
      toast.success("Fee type deleted successfully!", { autoClose: 3000 });

      handleCancel();
    } catch (error) {
      console.error("Error in Delete:", error);

      // Show error notification
      toast.error("Failed to delete fee type. Please try again.", {
        autoClose: 3000,
      });
    }
  };

  return (
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      size="sm"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-500px"
      show={show}
      onHide={onHide}
    >
      <div
        className="modal-header"
        style={{
          // backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
          fontFamily: "Manrope",
          backgroundColor: "rgb(242, 246, 255)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            fontFamily: "Manrope",
            fontSize: "18px",
            fontWeight: "600",
            color: "#1F4061",
          }}
        >
          Delete Type ?
        </h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleCancel}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>
      <div
        className="modal-body"
        style={{
          backgroundColor: "rgb(242, 246, 255)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {!isConfirmed ? (
          <div
            className="mx-auto"
            style={{
              textAlign: "center",
              fontFamily: "Manrope",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p>Are you sure you want to Delete this Entry?</p>
            <div
              onClick={handleConfirm}
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
            >
              <span
                style={{
                  color: "#FFF",
                  fontFamily: "Manrope",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Confirm
              </span>
            </div>
          </div>
        ) : (
          <form>
            <div
              style={{
                marginBottom: "23px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginRight: "5px",
                }}
              >
                <div
                  onClick={handleSubmit}
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
                >
                  <span
                    style={{
                      color: "#FFF",
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Delete
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginLeft: "5px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    backgroundColor: "#FFE7E1",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    width: "max-content",
                  }}
                  onClick={handleCancel}
                >
                  <span
                    style={{
                      color: "#FF5B5B",
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Cancle
                  </span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export { DeleteFeeTypeModal };
