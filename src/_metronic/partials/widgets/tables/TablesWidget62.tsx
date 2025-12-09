/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
// import { CreateWalkinEnquiry } from "../../modals/create-app-stepper/CreateWalkinEnquiry";
import { CreateFeeCollectExist } from "../../modals/create-app-stepper/CreateFeeCollectExist";
import { CreateStartAdmissionProcess } from "../../modals/create-app-stepper/CreateStartAdmissionProcess";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface DataItem {
  status: string;
  name: string;
}
interface FilterData {
  id: string;
  class: string;
}

const TablesWidget62: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const Navigate = useNavigate();

  const [filteredData, setFilteredData] = useState<FilterData[]>([]);

  const [searchQuery, setSearchQuery] = useState(0);
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const sessionId = currentUser?.session_id;
  const role = currentUser?.role_name;
  const userId = currentUser?.id;

  // const [showModal, setShowModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [feeGroup_id, setFeeGroup_id] = useState("");
  const [class_id, setClass_id] = useState("");
  const [referesh, setRefresh] = useState(false);

  // const handleModal = () => {
  //   setShowModal(true);
  // };
  // const handleModalClose = () => {
  //   setShowModal(false);
  // };

  const handleActionModal = (classId: string) => {
    setClass_id(classId);
    Navigate(`/fee-collect/assigned-students?classId=${classId}`);
  };

  const handleActionModalClose = () => {
    setShowActionModal(false);
  };

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-feeclasses/${schoolId}/${sessionId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        setData(responseData);
        setFilteredData(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEnquiries();
    setRefresh(false);
  }, [schoolId, referesh]);

  const handleSearch = (e: any) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = data.filter(
      (item) =>
        item.status.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query)
    );
    q;
    /* @ts-ignore */
    setFilteredData(filtered);
  };

  const formatDate = (dateString: string | number | Date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    /* @ts-ignore */
    return date.toLocaleDateString("en-GB", options);
  };

  const sendPaymentReminder = async (classId: number) => {
    // Get the current date
    const startDate = new Date();

    // Calculate the end date (3 days from the start date)
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 3);

    // Format the dates as ISO strings (or any required format)
    const formattedStartDate = startDate.toISOString();
    const formattedEndDate = endDate.toISOString();

    // Define the payload to send to the server
    const payload = {
      title: "Fee Reminder",
      message: "Kindly pay your fees.",
      classId: classId,
      sessionId: sessionId,
      schoolId: schoolId,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      userId: userId,
      role: role,
    };

    try {
      // Send the fee reminder data to the specified URL
      const response = await fetch(
        `${DOMAIN}/api/student/fee-reminder-for-class`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success("Fee reminder successfully sent!");
      } else {
        console.error("Failed to send the fee reminder: ", response.statusText);
        toast.error("Failed to send the fee reminder.");
      }
    } catch (error) {
      console.error("Error while sending the fee reminder: ", error);
      toast.error("Error while sending the fee reminder.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        backgroundColor: "#F2F6FF",
        borderRadius: "15px",
        padding: "20px",
      }}
    >
      <div
         className="modal-header pb-2"
         style={{
           backgroundColor: "#F2F6FF",
           borderBottom: "1px solid lightgray",
           fontFamily: "Manrope",
           display: "flex",
           alignItems: "center",
           justifyContent: "space-between",
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
          Fee Collect
        </span>
      </div>
      <div
        className="modal-body py-lg-5 px-lg-5"
        style={{ backgroundColor: "#F2F6FF", fontFamily: "Manrope" }}
      >
        <div style={{ overflowX: "auto", position: "relative" }}>
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
                {schoolId === "AMO-2509097151" ? "Group" : "Class"}
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "right",
                }}
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item, index) => (
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
                  {item.class}
                </td>
                <td
                  style={{
                    display: "flex",
                    gap: "10px", // Adds space between the buttons
                    justifyContent: "right", // Aligns buttons horizontally in the center
                    alignItems: "center", // Vertically centers the buttons
                    padding: "12px 20px",
                    border: "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 12px",
                      backgroundColor: "#1C335C",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#16294D")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1C335C")
                    }
                    onClick={() => handleActionModal(item.id)}
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
                      Collect
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
                  {/* <div
                      onClick={() =>
                        sendPaymentReminder(item.id)
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px",
                        backgroundColor: "#1C335C",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "700",
                          fontFamily: "Manrope",
                        }}
                      >
                        Send Reminder
                      </span>{" "}
                      &nbsp;
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <g fill="none">
                          <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                          <path
                            fill="white"
                            d="M12 2a7 7 0 0 0-7 7v3.528a1 1 0 0 1-.105.447l-1.717 3.433A1.1 1.1 0 0 0 4.162 18h15.676a1.1 1.1 0 0 0 .984-1.592l-1.716-3.433a1 1 0 0 1-.106-.447V9a7 7 0 0 0-7-7m0 19a3 3 0 0 1-2.83-2h5.66A3 3 0 0 1 12 21"
                          />
                        </g>
                      </svg>
                    </div> */}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={3}
                style={{
                  padding: "12px 20px",
                  textAlign: "right",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#1C335C",
                }}
              >
                Total Items: {filteredData.length}
              </td>
            </tr>
          </tfoot>
          {/* <CreateWalkinEnquiry show={showModal} handleClose={handleModalClose} /> */}
          {/* <CreateFeeCollectExist show={showActionModal} handleClose={handleActionModalClose} feeGroup_id={feeGroup_id} class_id={class_id} setRefresh={setRefresh}/> */}
          {/* <CreateStartAdmissionProcess show={showEditModal} handleClose={handleModalEditClose} feeGroup_id={feeGroup_id} /> */}
        </table>
        </div>
      </div>
    </div>
  );
};

export { TablesWidget62 };
