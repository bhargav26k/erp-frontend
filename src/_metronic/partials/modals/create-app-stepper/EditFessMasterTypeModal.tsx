/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useAuth } from "../../../../app/modules/auth/index.ts";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints.tsx";

type Props = {
  show: boolean;
  onHide: () => void;
  feeId: number | null;
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

const EditFessMasterTypeModal = ({ show, onHide, feeId,setRefresh }: Props) => {
  // const [FeeDetails, setFeesDetails] = useState([]);
  const [feeFineType, setFeeFineType] = useState("");
  const { currentUser } = useAuth();
  console.log(currentUser);
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
          `${DOMAIN}/api/school/getfeemaster/${schoolId}/${feeId}`
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
  }, [feeId, schoolId]);

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

  const handlesubmit = async (e) => {
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
          `${DOMAIN}/api/school/updateFeeMasterByTypeId/${schoolId}/${feeId}`,
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
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-850px"
      show={show}
      onHide={onHide}
    >
      <div
        className="modal-header"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
          fontFamily: "Manrope",
        }}
      >
        <h2> Edit Fees Master Type : {session_name}</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={onHide}
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
        <form action="/" method="post">
          <div style={{ marginBottom: "23px" }}>
            <label
              htmlFor="Fees_Group"
              className="form-label"
              style={{
                fontSize: "12px",
                color: "#434343",
                fontWeight: "500",
              }}
            >
              Fees Group
            </label>

            <div className="dropdown" id="Fees_Group">
              <input
                className="form-select"
                value={formData.Fees_group}
                disabled
              />
            </div>
          </div>
          <div style={{ marginBottom: "23px" }}>
            <label
              htmlFor="Fees_Type"
              className="form-label"
              style={{
                fontSize: "12px",
                color: "#434343",
                fontWeight: "500",
              }}
            >
              Fees Type
            </label>

            <div className="dropdown" id="Fees_Type">
              <select
                className="form-select"
                value={formData.Fees_Type}
                onChange={(e) => {
                  const selectedIndex = e.target.selectedIndex;
                  const selectedOption = e.target.options[selectedIndex];
                  const selectedId = selectedOption.getAttribute("data-id");
                  handleForm(
                    "Fees_Type",
                    selectedOption.value,
                    "feetype_id",
                    /* @ts-ignore */
                    selectedId
                  );
                }}
              >
                <option value={formData.Fees_Type}>{formData.Fees_Type}</option>
                {feeTypes.map((group) => (
                  <option key={group.id} value={group.type} data-id={group.id}>
                    {group.type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: "23px" }}>
            <label
              htmlFor="amount"
              className="form-label"
              style={{
                fontSize: "12px",
                color: "#434343",
                fontWeight: "500",
              }}
            >
              Amount
            </label>

            <div className="dropdown" id="amount">
              <input
                type="number"
                name="amount"
                id="amount"
                className="form-control"
                placeholder="Enter Percentage"
                value={formData.amount}
                onChange={(e) => handleForm("amount", Number(e.target.value))}
                style={{ border: "1px solid #ECEDF1" }}
              />
            </div>
          </div>
          <div className="modal-footer border-0">
            <button
              type="submit"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={handlesubmit}
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
                Save
              </span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export { EditFessMasterTypeModal };
