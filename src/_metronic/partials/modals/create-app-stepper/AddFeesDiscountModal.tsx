import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import "./AddFeesMasterModal.css";
import { InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";

type Props = {
  show: boolean;
  onHide: () => void;
  setRefresh: any;
};

interface CurrentUser {
  school_id: string;
}

interface FeeGroup {
  session_id: number | null;
  fee_groups_id: number;
  fee_group_name: string;
  fee_group_session_id: number;
  session: number;
}

interface FeeType {
  id: string;
  type: string;
}

const modalsRoot = document.getElementById("root-modals") || document.body;

const AddFeesDiscountModal = ({ show, onHide, setRefresh }: Props) => {
  const { currentUser } = useAuth();
  const schoolId = (currentUser as unknown as CurrentUser)?.school_id;
  const sessionId = (currentUser as unknown as CurrentUser)?.session_id;

  const [discountName, setDiscountName] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountType, setDiscountType] = useState("Flat"); // Default type
  const [discountValue, setDiscountValue] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleDiscountTypeChange = (type) => {
    setDiscountType(type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!discountName) {
      toast.error("Discount name is required.");
      return;
    }
    if (!discountCode) {
      toast.error("Discount code is required.");
      return;
    }
    if (!discountType) {
      toast.error("Discount type is required.");
      return;
    }
    if (!discountValue || discountValue <= 0) {
      toast.error("Discount value must be greater than 0.");
      return;
    }

    const startTime = Date.now(); // Capture start time
    setIsLoading(true); // Show loader

    // Construct the request body
    const requestBody = {
      discountName,
      discountCode,
      discountType,
      discountValue,
      description,
      schoolId,
      sessionId
    };

    try {
      const response = await fetch(`${DOMAIN}/api/school/add-fees-discount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsedTime); // Ensure total 3s duration

      setTimeout(async () => {
        setIsLoading(false); // Hide loader only after 3s

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(`Error: ${errorData.message || "Something went wrong"}`);
        } else {
          toast.success("Discount saved successfully!");
          setRefresh(true);
          handleCancle(); // Hide modal after full 3 seconds
        }
      }, remainingTime);
    } catch (error) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsedTime);

      setTimeout(() => {
        setIsLoading(false);
        toast.error("An unexpected error occurred. Please try again.");
      }, remainingTime);

      console.error("Error:", error);
    }
  };

  const handleCancle = () => {
    setDiscountName("");
    setDiscountCode("");
    setDiscountType("Flat");
    setDiscountValue(0);
    setDescription("");
    onHide();
  };

  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      show={show}
      onHide={handleCancle}
      backdrop="static"
    >
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="loader"></div>
            <p className="loading-text">
              Adding Fees Discount for you, please wait!
            </p>
          </div>
        </div>
      )}

      <div
        className="modal-header"
        style={{
          borderBottom: "1px solid lightgray",
          backgroundColor: "rgb(242, 246, 255)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{ fontFamily: "Manrope", fontSize: "18px", fontWeight: "600" }}
        >
          Add Fees Discount
        </h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleCancle}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>

      <div
        className="modal-body py-lg-10 px-lg-10"
        style={{
          backgroundColor: "#F2F6FF",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "23px" }}>
            <label
              htmlFor="feeGroupDropdown"
              className="form-label"
              style={{
                fontFamily: "Manrope",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Discount Name
            </label>

            <input
              type="text"
              className="form-control"
              id="discountName"
              value={discountName}
              onChange={(e) => handleChange(e, setDiscountName)}
              placeholder="Enter discount name"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "white",
                border: "1px solid #ECEDF1",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ marginBottom: "23px", width: "50%" }}>
              <label
                htmlFor="feeTypeDropdown"
                className="form-label"
                style={{
                  color: "#434343",
                  fontFamily: "Manrope",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Discount Code
              </label>

              <input
                type="text"
                className="form-control"
                id="discountCode"
                value={discountCode}
                onChange={(e) => handleChange(e, setDiscountCode)}
                placeholder="Enter discount code"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "white",
                  border: "1px solid #ECEDF1",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              />
            </div>
            <div style={{ marginBottom: "23px", width: "50%" }}>
              <label
                htmlFor="dueTypeDropdown"
                className="form-label"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Discount Type
              </label>

              <div className="dropdown" id="dueTypeDropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "white",
                    border: "1px solid #ECEDF1",
                    borderRadius: "8px",
                    overflow: "hidden",
                    fontFamily: "Manrope",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {discountType}
                </button>
                <ul
                  className="dropdown-menu"
                  style={{
                    width: "100%",
                    height: "120px",
                    overflow: "auto",
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    color: "#1C335C",
                  }}
                >
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleDiscountTypeChange("Flat")}
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: "500",
                        fontSize: "12px",
                      }}
                    >
                      Flat
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleDiscountTypeChange("Percentage")}
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: "500",
                        fontSize: "12px",
                      }}
                    >
                      Percentage
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ marginBottom: "23px", width: "50%" }}>
              <label
                htmlFor="fineAmount"
                className="form-label"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Discount Value/Amount
              </label>
              <input
                type="number"
                className="form-control"
                id="discountValue"
                value={discountValue}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d+$/.test(value)) {
                    setDiscountValue(value);
                  }
                }}
                placeholder="Enter amount or percentage"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "white",
                  border: "1px solid #ECEDF1",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              />
            </div>
            <div style={{ marginBottom: "23px", width: "50%" }}>
              <label
                htmlFor="fineAmount"
                className="form-label"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Description
              </label>
              <input
                type="text"
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => handleChange(e, setDescription)}
                placeholder="Enter description"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "white",
                  border: "1px solid #ECEDF1",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary"
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
              Save changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancle}
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
            >
              <span
                style={{
                  color: "#FF5B5B",
                  fontFamily: "Manrope",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Close
              </span>
            </button>
          </div>
        </form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { AddFeesDiscountModal };
