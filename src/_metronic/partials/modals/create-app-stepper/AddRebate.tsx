import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Modal, Button } from "react-bootstrap";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { toast } from "react-toastify";

type Props = {
  show: boolean;
  handleClose: () => void;
  selectedGroupData: any;
  setRefresh: (refresh: boolean) => void;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const AddRebate: React.FC<Props> = ({
  show,
  handleClose,
  selectedGroupData,
  setRefresh,
}) => {
  const { currentUser } = useAuth();
  const [newAdjustment, setNewAdjustment] = useState<string>("");
  const [error, setError] = useState(false);

  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (event.key === "F12") {
  //       event.preventDefault();
  //       openCalculator();
  //     } else if (event.key === "Tab") {
  //       event.preventDefault();
  //       fetchCalculatedAmount();
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  // const openCalculator = () => {
  //   alert(
  //     "Please open your system calculator manually (Windows: Win+R → type 'calc' → Enter)."
  //   );
  // };

  // const fetchCalculatedAmount = () => {
  //   const result = prompt("Enter calculated amount:");
  //   if (result && !isNaN(parseFloat(result))) {
  //     setNewAdjustment(result);
  //   }
  // };

  const handleModalClose = () => {
    setNewAdjustment("");
    setRefresh(true);
    handleClose();
  };

  const handleLedgerUpdate = async () => {
    const adjustmentValue = parseFloat(newAdjustment);
    if (isNaN(adjustmentValue) || adjustmentValue === 0) {
      toast.error("Please enter a valid rebate amount.");
      return;
    }

    const payload = {
      fee_session_group_id: selectedGroupData?.fee_session_group_id,
      student_session_id: selectedGroupData?.student_session_id,
      rebate_amount: adjustmentValue,
      session_id: currentUser?.session_id,
      school_id: currentUser?.school_id,
      is_update: selectedGroupData?.rebate_amount !== 0 ? 1 : 0,
    };

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/update-student-fee-rebate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toast.success("Ledger updated successfully!");
        handleModalClose();
      } else {
        const errorData = await response.json();
        toast.error(`Failed to update ledger: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating ledger:", error);
      toast.error("Failed to update ledger. Please try again.");
    }
  };

  return createPortal(
    <Modal
      show={show}
      onHide={handleModalClose}
      size="md"
      centered
      backdrop="static"
      keyboard={false}
    >
      <div
        className="modal-header"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
        }}
      >
        <h2 style={{ fontFamily: "Manrope" }}>Add Rebate</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleModalClose}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>

      <div
        className="modal-body py-lg-5 px-lg-5"
        style={{ backgroundColor: "#F2F6FF" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                fontFamily: "Manrope",
              }}
            >
              Group Name :
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: "Manrope",
              }}
            >
              {selectedGroupData?.group_name}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                fontFamily: "Manrope",
              }}
            >
              Invoice Number :
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: "Manrope",
              }}
            >
              {selectedGroupData?.invoice_number}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                fontFamily: "Manrope",
              }}
            >
              Installment Amount :
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: "Manrope",
              }}
            >
              {currentUser?.currency_symbol +
                "" +
                (selectedGroupData?.total_amount || 0)}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                fontFamily: "Manrope",
              }}
            >
              Previous Rebate :
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: "Manrope",
              }}
            >
              -{" "}
              {currentUser?.currency_symbol +
                "" +
                (selectedGroupData?.rebate_amount || 0)}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                fontFamily: "Manrope",
              }}
            >
              Pending Amount :
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: "Manrope",
              }}
            >
              {currentUser?.currency_symbol +
                "" +
                (selectedGroupData?.pending_amount || 0)}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  fontFamily: "Manrope",
                }}
              >
                Update Rebate :
              </span>
              <input
                type="number"
                placeholder="0"
                value={newAdjustment || null}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value <= (selectedGroupData?.total_amount || null)) {
                    setNewAdjustment(value);
                    setError(""); // Clear error if value is valid
                  } else {
                    setError("Rebate amount cannot exceed total amount");
                  }
                }}
                style={{ width: "80px", borderColor: error ? "red" : "" }}
                disabled={
                  selectedGroupData?.status === "partial" ||
                  selectedGroupData?.status === "paid"
                }
              />
            </div>
            {error && (
              <span
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginTop: "2px",
                  textAlign: "end",
                }}
              >
                {error}
              </span>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                fontFamily: "Manrope",
              }}
            >
              Installment Amount :
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: "Manrope",
              }}
            >
              {newAdjustment > 0
                ? currentUser?.currency_symbol +
                  (selectedGroupData?.pending_amount -
                    Number(newAdjustment || currentUser?.currency_symbol + "0"))
                : 0}
            </span>
          </div>
        </div>

        <div className="modal-footer border-0">
          <Button
            variant="primary"
            onClick={handleLedgerUpdate}
            disabled={
              selectedGroupData?.status === "partial" ||
              selectedGroupData?.status === "paid"
            }
          >
            Update Ledger
          </Button>
        </div>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { AddRebate };
