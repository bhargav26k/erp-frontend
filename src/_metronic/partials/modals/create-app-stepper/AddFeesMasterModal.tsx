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

const AddFeesMasterModal = ({ show, onHide, setRefresh }: Props) => {
  const { currentUser } = useAuth();
  const schoolId = (currentUser as unknown as CurrentUser)?.school_id;
  const sessionId = (currentUser as unknown as CurrentUser)?.session_id;
  const session_name = (currentUser as unknown as CurrentUser)?.session_name;

  const [feeGroups, setFeeGroups] = useState<FeeGroup[]>([]);
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>([]);
  const [selectedGroupName, setSelectedGroupName] =
    useState<string>("Select Group");
  const [feeGroupSessionId, setFeeGroupSessionId] = useState<number | null>([]);
  const [session, setSession] = useState<number | null>(0);

  const [selectedFeeTypes, setSelectedFeeTypes] = useState<
    { id: string; type: string; amount: number }[]
  >([]);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [dueType, setDueType] = useState<string | null>(null);
  const [dueTypeName, setDueTypeName] = useState<string>("Select Due Type");
  const [fineType, setFineType] = useState<string>("-None-");
  const [fineAmount, setFineAmount] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGroupClasses, setSelectedGroupClasses] = useState<string[]>([]); // Stores class names separately
const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);
  

  const handleSelectGroup = (group: FeeGroup) => {
    console.log("Selected Group:", group);  
    
    setSelectedGroup(group.fee_groups_id); // Store fee group ID
    setSelectedGroupName(group.fee_group_name); // Store only the group name
    setSelectedGroupClasses(group.class_names); // Store class names separately
    setSelectedClassIds(group.class_ids); // Store multiple class IDs separately
    setFeeGroupSessionId(group.fee_group_session_id);
    setSession(group.session_id);
  };

  const handleSelectFeeType = (type: FeeType) => {
    setSelectedFeeTypes((prev) => {
      const existingType = prev.find((t) => t.id === type.id);
      if (existingType) {
        return prev.map((t) =>
          t.id === type.id ? { ...t, amount: t.amount } : t
        );
      } else {
        return [...prev, { id: type.id, type: type.type, amount: 0 }];
      }
    });
  };

  const handleAmountChange = (id: string, amount: number) => {
    setSelectedFeeTypes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, amount } : t))
    );
  };

  const handleDeleteFeeType = (id: string) => {
    setSelectedFeeTypes((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDueType = (type: { id: string; type: string }) => {
    setDueType(type.id);
    setDueTypeName(type.type);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value; // Value will be in YYYY-MM-DD format
    const formattedDate = formatDate(selectedDate);
    setDueDate(formattedDate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!selectedGroup) {
      toast.error("Fee group is required.");
      return;
    }
    if (!session) {
      toast.error("Session is required.");
      return;
    }
    if (!schoolId) {
      toast.error("School ID is required.");
      return;
    }
    if (!feeGroupSessionId) {
      toast.error("Fee Group Session ID is required.");
      return;
    }
    if (selectedFeeTypes.length === 0) {
      toast.error("At least one fee type must be selected.");
      return;
    }
    if (selectedFeeTypes.some((fee) => fee.amount <= 0)) {
      toast.error("Each fee type amount must be greater than 0.");
      return;
    }
    if (!dueDate) {
      toast.error("Due date is required.");
      return;
    }
    if (!dueType) {
      toast.error("Due type is required.");
      return;
    }

    // Fine type validation
    if (fineType !== "None") {
      if (fineType === "Fixed") {
        if (!fineAmount || fineAmount <= 0) {
          toast.error("Fine amount must be greater than 0.");
          return;
        }
      }
    }

    const startTime = Date.now(); // ✅ Capture start time
    setIsLoading(true); // ✅ Show loader

    // Construct the request body
    const requestBody = {
      feeGroupSessionId,
      selectedGroup,
      feeTypes: selectedFeeTypes,
      fineType,
      dueDate,
      fineAmount: fineType === "Fixed" ? fineAmount : 0.0,
      dueTypeName,
      session,
      schoolId,
    };
    try {
      const response = await fetch(`${DOMAIN}/api/school/add-feegroupfeetype`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsedTime); // ✅ Ensures total 3s duration

      setTimeout(async () => {
        setIsLoading(false); // ✅ Hide loader only after 3s

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(`Error: ${errorData.message || "Something went wrong"}`); // ✅ Show toast after 3s
        } else {
          toast.success("Data saved successfully!"); // ✅ Show success toast after 3s
          setRefresh(true);
          handleCancle(); // ✅ Hide modal only after full 3 seconds
        }
      }, remainingTime);
    } catch (error) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsedTime);

      setTimeout(() => {
        setIsLoading(false);
        toast.error("An unexpected error occurred. Please try again."); // ✅ Show toast after 3s
      }, remainingTime);

      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchFeeGroups = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/getfeegroup/${schoolId}/${sessionId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch fee groups");
        }

        const responseData = await response.json();
console.log(responseData);

        // Process data to group by fee_group_name
        const groupedData = responseData.reduce((acc, group) => {
          const existingGroup = acc.find(
            (g) => g.fee_group_name === group.fee_group_name
          );

          if (existingGroup) {
            // Append to existing group
            existingGroup.class_ids.push(group.class_id);
            existingGroup.class_names.push(group.class_name);
            existingGroup.fee_groups_id.push(group.fee_groups_id);
            existingGroup.fee_group_session_id.push(group.fee_group_session_id);
          } else {
            // Create new group
            acc.push({
              fee_group_name: group.fee_group_name,
              class_ids: [group.class_id],
              class_names: [group.class_name],
              fee_groups_id: [group.fee_groups_id],
              fee_group_session_id: [group.fee_group_session_id],
              session_id: group.session_id,
              session_name: group.session_name,
            });
          }

          return acc;
        }, []);
        setFeeGroups(groupedData);
      } catch (error) {
        console.error("Error fetching fee groups:", error);
      }
    };

    fetchFeeGroups();
  }, [schoolId, show]);

  useEffect(() => {
    const fetchFeeTypes = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/getfeetype/${schoolId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch fee types");
        }
        const responseData = await response.json();
        setFeeTypes(responseData);
      } catch (error) {
        console.error("Error fetching fee types:", error);
      }
    };

    fetchFeeTypes();
  }, [schoolId, show]);

  const handleCancle = () => {
    setFeeGroups([]);
    setFeeTypes([]);
    setDueDate(null);
    setDueType(null);
    setDueTypeName("Select Due Type");
    setFineType("None");
    setFineAmount(0);
    setSelectedGroup(null);
    setSelectedGroupName("Select Group");
    setFeeGroupSessionId(0);
    setSession(0);
    setSelectedFeeTypes([]);
    setSelectedGroupClasses([]);
    setSelectedClassIds([]);
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
              Adding Fees Master for you, please wait!
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
          Add Fees Master : {session_name}
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
              Fees Group
            </label>

            <div className="dropdown" id="feeGroupDropdown">
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
                {selectedGroupName}
              </button>
              <ul
                className="dropdown-menu"
                style={{ width: "100%", height: "150px", overflow: "auto" }}
              >
                {feeGroups.map((group) => (
                  <li key={group.fee_groups_id}>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleSelectGroup(group)}
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      {group.fee_group_name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Selected Classes:</strong>{" "}
              {selectedGroupClasses.join(", ")}
            </div>
          </div>
          <div style={{ marginBottom: "23px" }}>
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
              Fees Type
            </label>

            <div className="dropdown" id="feeTypeDropdown">
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
                {selectedFeeTypes.length > 0
                  ? selectedFeeTypes.map((ft) => ft.type).join(", ")
                  : "Select Fee Type"}
              </button>
              <ul
                className="dropdown-menu"
                style={{ width: "100%", height: "auto", overflow: "auto" }}
              >
                {feeTypes.map((type) => (
                  <li key={type.id}>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleSelectFeeType(type)}
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      {type.type}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {selectedFeeTypes.length > 0 && (
            <div style={{ marginBottom: "23px" }}>
              <label
                htmlFor="feeAmounts"
                className="form-label"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Fee Amounts
              </label>
              <table
                className="table"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "10px",
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
                        fontFamily: "Manrope",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      Fee Type
                    </th>
                    <th
                      style={{
                        padding: "12px 20px",
                        textAlign: "center",
                        fontFamily: "Manrope",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      Amount
                    </th>
                    <th
                      style={{
                        padding: "12px 20px",
                        textAlign: "right",
                        fontFamily: "Manrope",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedFeeTypes.map((feeType, index) => (
                    <tr
                      key={feeType.id}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "rgb(242, 246, 255)" : "#FFFFFF",
                        borderBottom: "1px solid #E0E4F0",
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        color: "#1C335C",
                        width: "100%",
                      }}
                    >
                      <td
                        style={{
                          padding: "16px 20px",
                          textAlign: "left",
                          fontFamily: "Manrope",
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        {feeType.type}
                      </td>

                      <td
                        style={{
                          padding: "12px 20px",
                          textAlign: "center",
                          fontFamily: "Manrope",
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "center",
                          }}
                        >
                          <InputGroup
                            style={{
                              display: "flex",
                              alignItems: "center",
                              border: "1px solid #E0E4F0",
                              borderRadius: "8px",
                              overflow: "hidden",
                              background: "#FFFFFF",
                              width: "100%",
                            }}
                          >
                            {/* Rupee Symbol */}
                            <InputGroup.Text
                              style={{
                                background: "#f8f9fa",
                                fontWeight: "600",
                                fontSize: "16px",
                                color: "#1C335C",
                                padding: "10px 12px",
                                border: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "38px",
                                width: "10%",
                              }}
                            >
                              ₹
                            </InputGroup.Text>
                            <div style={{ width: "90%" }}>
                              <input
                                type="number"
                                value={
                                  feeType.amount === 0 ? "" : feeType.amount
                                }
                                onChange={(e) => {
                                  const newValue =
                                    e.target.value === ""
                                      ? ""
                                      : parseFloat(e.target.value) || 0;
                                  handleAmountChange(feeType.id, newValue);
                                }}
                                placeholder="0"
                                style={{
                                  width: "100%",
                                  fontFamily: "Manrope",
                                  fontSize: "14px",
                                  color: "#1C335C",
                                  padding: "10px",
                                  height: "38px",
                                  border: "none",
                                  outline: "none",
                                  background: "#FFFFFF",
                                }}
                              />
                            </div>
                            {/* Amount Input Field */}
                          </InputGroup>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px 20px",
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "right",
                        }}
                      >
                        <div
                          onClick={() => handleDeleteFeeType(feeType.id)}
                          style={{
                            width: "34px",
                            height: "40px",
                            borderRadius: "6px",
                            padding: "6px 6px",
                            gap: "10px",
                            backgroundColor: "#FFE7E1",
                          }}
                        >
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
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M15.6944 7.08331L15.3111 12.8326C15.1637 15.045 15.0899 16.1512 14.3691 16.8256C13.6482 17.5 12.5396 17.5 10.3222 17.5H9.67775C7.46042 17.5 6.35175 17.5 5.63091 16.8256C4.91007 16.1512 4.83632 15.045 4.68883 12.8326L4.30554 7.08331"
                              stroke="#ED5578"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M7.91663 9.16669L8.33329 13.3334"
                              stroke="#ED5578"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M12.0833 9.16669L11.6666 13.3334"
                              stroke="#ED5578"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ marginBottom: "23px", width: "50%" }}>
              <label
                htmlFor="dueDate"
                className="form-label"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Due Date
              </label>
              <input
                type="date"
                className="form-control"
                id="dueDate"
                value={dueDate || ""}
                onChange={handleDateChange}
                style={{
                  fontFamily: "Manrope",
                  fontWeight: "500",
                  fontSize: "14px",
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
                Due Type
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
                  {dueTypeName}
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
                      onClick={() => handleDueType({ id: "1", type: "Daily" })}
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: "500",
                        fontSize: "12px",
                      }}
                    >
                      Daily
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleDueType({ id: "2", type: "Weekly" })}
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: "500",
                        fontSize: "12px",
                      }}
                    >
                      Weekly
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() =>
                        handleDueType({ id: "3", type: "Monthly" })
                      }
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: "500",
                        fontSize: "12px",
                      }}
                    >
                      Monthly
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ marginBottom: "23px", width: "50%" }}>
              <label
                htmlFor="fineTypeDropdown"
                className="form-label"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                {schoolId?.slice(0, 3) === "INN" ? "Administrative Type" : "Fine Type"}
              </label>

              <div className="dropdown" id="fineTypeDropdown">
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
                  }}
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {fineType}
                </button>
                <ul
                  className="dropdown-menu"
                  style={{ width: "100%", height: "auto", overflow: "auto" }}
                >
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => setFineType("-None-")}
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: "500",
                        fontSize: "12px",
                      }}
                    >
                      None
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => setFineType("Fixed")}
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: "500",
                        fontSize: "12px",
                      }}
                    >
                      Fixed
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {fineType !== "-None-" && (
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
                  {"Fixed"}
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="fineAmount"
                  value={fineAmount}
                  onChange={(e) => setFineAmount(parseFloat(e.target.value))
                  }
                  placeholder="0"
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
            )}
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

export { AddFeesMasterModal };
