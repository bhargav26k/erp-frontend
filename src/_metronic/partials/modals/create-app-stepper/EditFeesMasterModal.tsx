/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useAuth } from "../../../../app/modules/auth/index.ts";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints.tsx";

type Props = {
  show: boolean;
  onHide: () => void;
  // selectedFee: object;
  setRefresh: (refresh: boolean) => void;
};

interface FeeGroup {
  id: string;
  name: string;
}

interface FeeTypes {
  id: string;
  type: string;
}

interface FormData {
  Fees_group: string;
  fee_groups_id: string;
  Fees_Type: string;
  feetype_id: string;
  amount: number;
}

const EditFeesMasterModal = ({ show, onHide, selectedFee,setRefresh }: Props) => {
  // const [FeeDetails, setFeesDetails] = useState([]);
  const [feeFineType, setFeeFineType] = useState("");
  const { currentUser } = useAuth();
  console.log(selectedFee);
  const schoolId = currentUser?.school_id;
  const session_name = currentUser?.session_name;
  
  const [formData, setFormData] = useState<FormData>({
    Fees_group: "",
    fee_groups_id: "",
    Fees_Type: "",
    feetype_id: "",
    amount: 0,
  });

  const [feeGroups, setFeeGroups] = useState<FeeGroup[]>([]);
  const [feeTypes, setFeeTypes] = useState<FeeTypes[]>([]);
  const [initialData, setInitialData] = useState<FormData>({
    Fees_group: "",
    fee_groups_id: "",
    Fees_Type: "",
    feetype_id: "",
    amount: 0,
  });
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/getfeemaster/${schoolId}/${selectedFee}`
        );
        const data = await response.json();

        const initialData = {
          Fees_group: data[0]?.name || "",
          fee_groups_id: data[0]?.fee_groups_id || "",
          Fees_Type: data[0]?.type || "",
          feetype_id: data[0]?.feetype_id || "",
          amount: data[0]?.amount || 0,
        };
        setFormData(initialData);
        setInitialData(initialData);
      } catch (error) {
        console.error("Error fetching fee data:", error);
      }
    };
    fetchData();
  }, [selectedFee, schoolId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/getfeemaster-dropdown/${schoolId}`
        );
        const data = await response.json();

        const groups =
          data.find(
            (item: { dataType: string }) => item.dataType === "feeGroups"
          )?.data || [];
        const types =
          data.find(
            (item: { dataType: string }) => item.dataType === "feeTypes"
          )?.data || [];

        setFeeGroups(groups);
        setFeeTypes(types);
      } catch (error) {
        console.error("Error fetching fee master dropdown data:", error);
      }
    };

    fetchData();
  }, []);
  /* @ts-ignore */

  const handleForm = (field, value, idField = "", id = "") => {
    if (field === "Fees_group" || field === "Fees_Type") {
      setFormData({
        ...formData,
        [field]: value,
        [idField]: id,
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const modifiedData = {}; // Adjust the type as per your actual data structure

    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        /* @ts-ignore */
        if (formData[key] !== initialData[key]) {
          if (key === "Fees_group") {
            /* @ts-ignore */
            modifiedData["fee_groups_id"] = formData["fee_groups_id"];
          } else if (key === "Fees_Type") {
            /* @ts-ignore */
            modifiedData["feetype_id"] = formData["feetype_id"];
          } else {
            /* @ts-ignore */
            modifiedData[key] = formData[key];
          }
        }
      }
    }

    if (Object.keys(modifiedData).length > 0) {
      // console.log(modifiedData);
      // return;
      
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/updateFeeMasterByTypeId/${schoolId}/${selectedFee}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(modifiedData),
          }
        );

        const data = await response.json();
        if (response.ok) {
          onHide();
          setRefresh(true);
        }
      } catch (error) {
        console.error("Error updating fee data:", error);
      }
    }
  };

  return (
    <div>
      hi
    </div>
    // <Modal
    //   id="kt_modal_create_app"
    //   tabIndex={-1}
    //   aria-hidden="true"
    //   dialogClassName="modal-dialog modal-dialog-centered mw-850px"
    //   show={show}
    //   onHide={onHide}
    // >
    //   <div
    //     className="modal-header"
    //     style={{
    //       backgroundColor: "#F2F6FF",
    //       borderBottom: "1px solid lightgray",
    //       fontFamily: "Manrope",
    //     }}
    //   >
    //     <h2> Edit Fees Master Type : {session_name}</h2>
    //     <div
    //       className="btn btn-sm btn-icon btn-active-color-primary"
    //       onClick={onHide}
    //     >
    //       <i className="fas fa-times"></i>
    //     </div>
    //   </div>
    //   <div
    //     className="modal-body py-lg-10 px-lg-10"
    //     style={{
    //       backgroundColor: "#F2F6FF",
    //     }}
    //   >
    //     <form onSubmit={handleSubmit}>
    //     <div style={{ marginBottom: "23px" }}>
    //         <label
    //           htmlFor="feeGroupDropdown"
    //           className="form-label"
    //           style={{
    //             fontFamily: "Manrope",
    //             fontWeight: "500",
    //             fontSize: "14px",
    //           }}
    //         >
    //           Fees Group
    //         </label>

    //         <div className="dropdown" id="feeGroupDropdown">
    //           <button
    //             className="btn btn-secondary dropdown-toggle"
    //             style={{
    //               width: "100%",
    //               display: "flex",
    //               justifyContent: "space-between",
    //               alignItems: "center",
    //               backgroundColor: "white",
    //               border: "1px solid #ECEDF1",
    //               borderRadius: "8px",
    //               overflow: "hidden",
    //               fontFamily: "Manrope",
    //               fontWeight: "500",
    //               fontSize: "14px",
    //             }}
    //             type="button"
    //             data-bs-toggle="dropdown"
    //             aria-expanded="false"
    //           >
    //             {/* {selectedGroupName} */}
    //           </button>
    //           <ul
    //             className="dropdown-menu"
    //             style={{ width: "100%", height: "auto", overflow: "auto" }}
    //           >
    //             {feeGroups.map((group) => (
    //               <li 
    //               key={group.fee_groups_id}
    //               >
    //                 <a
    //                   className="dropdown-item"
    //                   href="#"
    //                   // onClick={() => handleSelectGroup(group)}
    //                   style={{
    //                     fontFamily: "Manrope",
    //                     fontWeight: "500",
    //                     fontSize: "14px",
    //                   }}
    //                 >
    //                   {group.fee_group_name}
    //                 </a>
    //               </li>
    //             ))}
    //           </ul>
    //         </div>
    //         <div>
    //           <strong>Selected Classes:</strong>{" "}
    //           {/* {selectedGroupClasses.join(", ")} */}
    //         </div>
    //       </div>
    //       <div style={{ display: "flex", gap: "10px" }}>
    //         <div style={{ marginBottom: "23px", width: "50%" }}>
    //           <label
    //             htmlFor="dueDate"
    //             className="form-label"
    //             style={{
    //               fontFamily: "Manrope",
    //               fontWeight: "500",
    //               fontSize: "14px",
    //             }}
    //           >
    //             Due Date
    //           </label>
    //           <input
    //             type="date"
    //             className="form-control"
    //             id="dueDate"
    //             // value={dueDate || ""}
    //             // onChange={handleDateChange}
    //             style={{
    //               fontFamily: "Manrope",
    //               fontWeight: "500",
    //               fontSize: "14px",
    //             }}
    //           />
    //         </div>
    //         <div style={{ marginBottom: "23px", width: "50%" }}>
    //           <label
    //             htmlFor="dueTypeDropdown"
    //             className="form-label"
    //             style={{
    //               fontFamily: "Manrope",
    //               fontWeight: "500",
    //               fontSize: "14px",
    //             }}
    //           >
    //             Due Type
    //           </label>

    //           <div className="dropdown" id="dueTypeDropdown">
    //             <button
    //               className="btn btn-secondary dropdown-toggle"
    //               style={{
    //                 width: "100%",
    //                 display: "flex",
    //                 justifyContent: "space-between",
    //                 alignItems: "center",
    //                 backgroundColor: "white",
    //                 border: "1px solid #ECEDF1",
    //                 borderRadius: "8px",
    //                 overflow: "hidden",
    //                 fontFamily: "Manrope",
    //                 fontWeight: "500",
    //                 fontSize: "14px",
    //               }}
    //               type="button"
    //               data-bs-toggle="dropdown"
    //               aria-expanded="false"
    //             >
    //               {/* {dueTypeName} */}
    //             </button>
    //             <ul
    //               className="dropdown-menu"
    //               style={{
    //                 width: "100%",
    //                 height: "120px",
    //                 overflow: "auto",
    //                 fontFamily: "Manrope",
    //                 fontSize: "14px",
    //                 color: "#1C335C",
    //               }}
    //             >
    //               <li>
    //                 <a
    //                   className="dropdown-item"
    //                   href="#"
    //                   // onClick={() => handleDueType({ id: "1", type: "Daily" })}
    //                   style={{
    //                     fontFamily: "Manrope",
    //                     fontWeight: "500",
    //                     fontSize: "12px",
    //                   }}
    //                 >
    //                   Daily
    //                 </a>
    //               </li>
    //               <li>
    //                 <a
    //                   className="dropdown-item"
    //                   href="#"
    //                   // onClick={() => handleDueType({ id: "2", type: "Weekly" })}
    //                   style={{
    //                     fontFamily: "Manrope",
    //                     fontWeight: "500",
    //                     fontSize: "12px",
    //                   }}
    //                 >
    //                   Weekly
    //                 </a>
    //               </li>
    //               <li>
    //                 <a
    //                   className="dropdown-item"
    //                   href="#"
    //                   onClick={() =>
    //                     // handleDueType({ id: "3", type: "Monthly" })
    //                   }
    //                   style={{
    //                     fontFamily: "Manrope",
    //                     fontWeight: "500",
    //                     fontSize: "12px",
    //                   }}
    //                 >
    //                   Monthly
    //                 </a>
    //               </li>
    //             </ul>
    //           </div>
    //         </div>
    //       </div>

    //       <div style={{ display: "flex", gap: "10px" }}>
    //         <div style={{ marginBottom: "23px", width: "50%" }}>
    //           <label
    //             htmlFor="fineTypeDropdown"
    //             className="form-label"
    //             style={{
    //               fontFamily: "Manrope",
    //               fontWeight: "500",
    //               fontSize: "14px",
    //             }}
    //           >
    //             Fine Type
    //           </label>

    //           <div className="dropdown" id="fineTypeDropdown">
    //             <button
    //               className="btn btn-secondary dropdown-toggle"
    //               style={{
    //                 width: "100%",
    //                 display: "flex",
    //                 justifyContent: "space-between",
    //                 alignItems: "center",
    //                 backgroundColor: "white",
    //                 border: "1px solid #ECEDF1",
    //                 borderRadius: "8px",
    //                 overflow: "hidden",
    //               }}
    //               type="button"
    //               data-bs-toggle="dropdown"
    //               aria-expanded="false"
    //             >
    //               {/* {fineType} */}
    //             </button>
    //             <ul
    //               className="dropdown-menu"
    //               style={{ width: "100%", height: "120px", overflow: "auto" }}
    //             >
    //               <li>
    //                 <a
    //                   className="dropdown-item"
    //                   href="#"
    //                   // onClick={() => setFineType("-None-")}
    //                   style={{
    //                     fontFamily: "Manrope",
    //                     fontWeight: "500",
    //                     fontSize: "12px",
    //                   }}
    //                 >
    //                   None
    //                 </a>
    //               </li>
    //               <li>
    //                 <a
    //                   className="dropdown-item"
    //                   href="#"
    //                   onClick={() => setFineType("Fixed")}
    //                   style={{
    //                     fontFamily: "Manrope",
    //                     fontWeight: "500",
    //                     fontSize: "12px",
    //                   }}
    //                 >
    //                   Fixed
    //                 </a>
    //               </li>
    //             </ul>
    //           </div>
    //         </div>
    //         {fineType !== "-None-" && (
    //           <div style={{ marginBottom: "23px", width: "50%" }}>
    //             <label
    //               htmlFor="fineAmount"
    //               className="form-label"
    //               style={{
    //                 fontFamily: "Manrope",
    //                 fontWeight: "500",
    //                 fontSize: "14px",
    //               }}
    //             >
    //               {"Fixed"}
    //             </label>
    //             <input
    //               type="number"
    //               className="form-control"
    //               id="fineAmount"
    //               value={fineAmount}
    //               onChange={(e) =>
    //                   setFineAmount(parseFloat(e.target.value))
    //               }
    //               placeholder="0"
    //               style={{
    //                 width: "100%",
    //                 display: "flex",
    //                 justifyContent: "space-between",
    //                 alignItems: "center",
    //                 backgroundColor: "white",
    //                 border: "1px solid #ECEDF1",
    //                 borderRadius: "8px",
    //                 overflow: "hidden",
    //               }}
    //             />
    //           </div>
    //         )}
    //       </div>

    //       <div className="modal-footer">
    //         <button
    //           type="submit"
    //           className="btn btn-primary"
    //           style={{
    //             display: "flex",
    //             alignItems: "center",
    //             padding: "12px 16px",
    //             backgroundColor: "#1C335C",
    //             borderRadius: "8px",
    //             cursor: "pointer",
    //             transition: "background-color 0.3s",
    //             width: "max-content",
    //           }}
    //         >
    //           Save changes
    //         </button>
    //         <button
    //           type="button"
    //           className="btn btn-secondary"
    //           onClick={handleCancle}
    //           style={{
    //             display: "flex",
    //             alignItems: "center",
    //             padding: "12px 16px",
    //             backgroundColor: "#FFE7E1",
    //             borderRadius: "8px",
    //             cursor: "pointer",
    //             transition: "background-color 0.3s",
    //             width: "max-content",
    //           }}
    //         >
    //           <span
    //             style={{
    //               color: "#FF5B5B",
    //               fontFamily: "Manrope",
    //               fontSize: "14px",
    //               fontWeight: "600",
    //             }}
    //           >
    //             Close
    //           </span>
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </Modal>
  );
};

export { EditFeesMasterModal };
