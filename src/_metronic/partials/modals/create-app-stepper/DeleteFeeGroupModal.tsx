/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useAuth } from "../../../../app/modules/auth/index.ts";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints.tsx";

type Props = {
  show: boolean;
  onHide: () => void;
  fee_group_id: number | null;
  setReferesh : any;
};




const DeleteFeeGroupModal = ({ show, onHide, fee_group_id,setReferesh, }: Props) => {
  // const [FeeDetails, setFeesDetails] = useState([]);
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  
  const [isConfirmed, setIsConfirmed] = useState(false); // State to track confirmation
  

  const handleConfirm = () => {
    setIsConfirmed(true); // Set confirmation state to true
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/delete-feegroup/${fee_group_id}/${schoolId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReferesh(true);
      onHide();
      console.log("Deleted Successfully:", data);
    } catch (error) {
      console.error("Error in Delete:", error);
    }
  };

  return(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      size='sm'
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-500px"
      show={show}
      onHide={onHide}
    >
      <div
        className="modal-content"
        style={{ padding: "20px 5px", borderRadius: "17px" }}
      >
        <div
          className="modal-header border-0"
          style={{ width: "100%", height: "27px" }}
        >
          <span
            className=""
            id="staticBackdropLabel"
            style={{
              justifyContent: "center",
              textAlign: "center",
              alignItems: "center",
              fontSize: "24px",
              fontWeight: "600",
              fontFamily: "Manrope",
            }}
          >
            Delete Entry ?
          </span>
          <span
            data-bs-dismiss="modal"
            onClick={onHide}
            aria-label="Close"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="16" fill="#ECECEC" />
              <path
                d="M22.8572 9.14294L9.14288 22.8572M9.14288 9.14294L22.8572 22.8572"
                stroke="#464646"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <hr />
        <div className="modal-body" style={{ justifyContent: "center" }}>
          {!isConfirmed ? (
            <div style={{ textAlign: "center" }}>
              <p>Are you sure you want to Delete this Entry?</p>
              <button className="btn btn-danger" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "23px" , display:'flex', justifyContent:'center',alignItems:'center',}}>

                <div style={{ display: "flex", justifyContent: "end" , marginRight:'5px',}}>
                  <button className="btn btn-danger" type="submit">
                    Delete
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "end", marginLeft:'5px', }}>
                  <button className="btn btn-danger" type="button" onClick={()=>onHide()}>
                    Cancel
                  </button>
                </div>

              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};

export { DeleteFeeGroupModal };
