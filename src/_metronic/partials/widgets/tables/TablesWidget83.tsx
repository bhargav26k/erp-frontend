import React, { useEffect, useState } from "react";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { toast } from "react-toastify";
import { DeleteConfirmationModal } from "../../modals/create-app-stepper/DeleteConfirmationModal";
import { AddCircular } from "../../modals/create-app-stepper/AddCircular";
import { CreateEditCircular } from "../../modals/create-app-stepper/CreateEditCircular";
import { AddDailyLog } from "../../modals/create-app-stepper/AddDailyLog";
import { CreateEditDailyLog } from "../../modals/create-app-stepper/CreateEditDailyLog";
import { InboxCompose } from "../../layout/InboxCompose";
import { Eye } from "lucide-react";

interface CurrentUser {
  school_id: string;
  session_id: string;
}

interface Data {
  id: number;
  title: string;
  description: string;
  visibility: string;
  start_date: string;
  end_date: string;
  created_for: string;
  class_names: string;
  is_event: number;
}

interface EditBucket {
  class_id: number;
  section_id: number;
  log_date: string; // "YYYY-MM-DD"
  class_name: string;
  section_name: string;
  is_approved: number;
  entries: Array<{
    id: number; // daily_log primary key
    subject_id: number;
    subject_name: string;
    class_work: string;
    home_work: string;
    document: string | null;
    staff_id: number;
    is_approved: number;
    created_at: string;
    updated_at: string;
  }>;
}

// const formatDate = (dateString: string) => {
//   const date = new Date(dateString);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const TablesWidget83 = () => {
  const [filteredData, setFilteredData] = useState<Data[]>([]);
  const isMobile = useMobile();
  const { currentUser } = useAuth();
  const isTeacher = currentUser?.designation.toLowerCase() === "teacher";

  const school_id = currentUser?.school_id;
  const session_id = currentUser?.session_id;

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewOnlyMode, setViewOnlyMode] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [bucketData, setBucketData] = useState<EditBucket | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [bucketToDelete, setBucketToDelete] = useState<EditBucket | null>(null);

  const displayedData = filteredData.filter((log) => {
    const label = `Daily log - ${log.class_name} - ${log.section_name}`;
    const lowerLabel = label.toLowerCase();
    const lowerTerm = searchTerm.toLowerCase();
    return (
      lowerLabel.includes(lowerTerm) ||
      formatDate(log.log_date).includes(lowerTerm)
    );
  });

  const handleModal = () => {
    setShowModal(true);
  };
  const handleShowDeleteModal = (bucket: EditBucket) => {
    setBucketToDelete(bucket);
    setShowDeleteModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
    setRefresh(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setRefresh(true);
  };

  const handleModalEdit = (bucket: EditBucket) => {
    console.log(bucket);

    setBucketData(bucket);
    setViewOnlyMode(isTeacher && bucket.is_approved === 1);
    setShowEditModal(true);
  };

  const handleModalEditClose = () => {
    setBucketData(null);
    setShowEditModal(false);
  };
  // In TablesWidget83.tsx (your frontend):
  useEffect(() => {
    const fetchDailyLogs = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/student/get-daily-logs/${school_id}/${session_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch daily logs");

        const data = await response.json();
        console.log(data);

        // data.logs now looks like:
        //   [
        //     {
        //       id: 1,
        //       class_id: 1,
        //       class_name: "Class 1",
        //       section_id: 2,
        //       section_name: "Section A",
        //       log_date: "2025-06-01",
        //       subject_id: 10,
        //       subject_name: "Mathematics",
        //       class_work: "Chapter 5 notes…",
        //       home_work: "Solve problems 1–10…",
        //       document: null,
        //       staff_id: 6,
        //       is_approved: 0,
        //       created_at: "...",
        //       updated_at: "..."
        //     },
        //     …
        //   ]

        // 1) Group by “class|section|log_date”
        const groupedMap: Record<string, EditBucket> = {};

        data.logs.forEach((row: any) => {
          // normalize the incoming "2025-06-01" (or whatever) to YYYY-MM-DD
          // const dateKey = new Date(row.log_date).toISOString().slice(0, 10);

          const key = `${row.class_id}|${row.section_id}|${row.log_date}`;

          if (!groupedMap[key]) {
            groupedMap[key] = {
              class_id: row.class_id,
              section_id: row.section_id,
              log_date: row.log_date,
              class_name: row.class_name,
              section_name: row.section_name,
              is_approved: row.is_approved ? 1 : 0,
              entries: [],
            };
          } else {
            // if any entry in this group is approved, mark the entire group as approved
            if (row.is_approved) {
              groupedMap[key].is_approved = 1;
            }
          }

          groupedMap[key].entries.push({
            id: row.id,
            subject_id: row.subject_id,
            subject_name: row.subject_name,
            class_work: row.class_work,
            home_work: row.home_work,
            document: row.document,
            staff_id: row.staff_id,
            is_approved: row.is_approved,
            created_at: row.created_at,
            updated_at: row.updated_at,
          });
        });

        // 2) Turn it into an array
        const groupedArray: EditBucket[] = Object.values(groupedMap);
        console.log(groupedArray);

        setFilteredData(groupedArray);
        setRefresh(false);
      } catch (error) {
        console.error("Error fetching daily logs:", error);
      }
    };

    fetchDailyLogs();
  }, [school_id, session_id, refresh]);

  const handleDelete = async () => {
    if (!bucketToDelete) {
      toast.error("No bucket selected to delete");
      return;
    }

    const entryIds = bucketToDelete.entries.map((e) => e.id);
    if (entryIds.length === 0) {
      toast.info("Nothing to delete");
      setShowDeleteModal(false);
      return;
    }

    try {
      const response = await fetch(
        `${DOMAIN}/api/student/delete-dailylogs/${school_id}/${session_id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entryIds }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete daily‐log entries");
      }
      await response.json();
      toast.success("Deleted all entries in this bucket", { autoClose: 3000 });
      setRefresh(true);
      setShowDeleteModal(false);
      setBucketToDelete(null);
    } catch (error) {
      console.error("Error deleting daily‐log entries:", error);
      toast.error("Failed to delete entries!", { autoClose: 3000 });
    }
  };

  return (
    <div
      className="card-style"
      style={{
        width: "100%",
        borderRadius: "16px",
        backgroundColor: "rgb(242, 246, 255)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        marginTop: "20px",
        padding: "20px",
      }}
    >
      <div
        className="card-header"
        style={{
          backgroundColor: "rgb(242, 246, 255)",
          padding: isMobile ? "16px" : "16px 20px",
          borderBottom: "1px solid #E0E4F0",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: isMobile ? "center" : "space-between",
          alignItems: isMobile ? "center" : "center",
          gap: isMobile ? "16px" : "0",
        }}
      >
        {/* Title - Only for Desktop */}
        {!isMobile && (
          <span
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1C335C",
              fontFamily: "Manrope",
            }}
          >
            Manage Daily Logs
          </span>
        )}

        {/* Title and Button Row for Mobile */}
        {isMobile && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              order: 1,
            }}
          >
            <span
              style={{
                fontSize: "17px",
                fontWeight: "600",
                color: "#1C335C",
                fontFamily: "Manrope",
              }}
            >
              Manage Daily Logs
            </span>
            <div
              onClick={!isTeacher ? handleModal : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 0px",
                backgroundColor: isTeacher ? "#888888" : "#1C335C",
                borderRadius: "8px",
                cursor: isTeacher ? "not-allowed" : "pointer",
                opacity: isTeacher ? 0.6 : 1,
                transition: "background-color 0.3s",
                pointerEvents: isTeacher ? "none" : "auto",
                width: "80px",
              }}
              onMouseEnter={(e) => {
                if (!isTeacher) {
                  e.currentTarget.style.backgroundColor = "#16294D";
                }
              }}
              onMouseLeave={(e) => {
                if (!isTeacher) {
                  e.currentTarget.style.backgroundColor = "#1C335C";
                }
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "700",
                  fontFamily: "Manrope",
                }}
              >
                + Add Log
              </span>
            </div>
          </div>
        )}

        {/* Search Bar for Mobile */}
        {isMobile && (
          <div
            className="input-group flex-nowrap"
            style={{
              width: "100%",
              height: "36px",
              borderRadius: "8px",
              border: "1px solid #D9D9D9",
              order: 2,
            }}
          >
            <span
              className="input-group-text border-0 pe-1 pr-0"
              style={{ backgroundColor: "transparent" }}
              id="addon-wrapping"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_582_4295)">
                  <circle
                    cx="8.50002"
                    cy="7.66665"
                    r="6.33333"
                    stroke="#999999"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M14.1667 13.3333L15.5 14.6666"
                    stroke="#999999"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_582_4295">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(0.833374)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <input
              type="text"
              className="form-control border-0"
              style={{ backgroundColor: "transparent", color: "black" }}
              placeholder="Search …. by date or label"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Controls Container for Desktop */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            {/* Search Bar for Desktop */}
            <div
              className="input-group flex-nowrap"
              style={{
                width: "300px",
                height: "36px",
                borderRadius: "8px",
                border: "1px solid #D9D9D9",
              }}
            >
              <span
                className="input-group-text border-0 pe-1 pr-0"
                style={{ backgroundColor: "transparent" }}
                id="addon-wrapping"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_582_4295)">
                    <circle
                      cx="8.50002"
                      cy="7.66665"
                      r="6.33333"
                      stroke="#999999"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M14.1667 13.3333L15.5 14.6666"
                      stroke="#999999"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_582_4295">
                      <rect
                        width="16"
                        height="16"
                        fill="white"
                        transform="translate(0.833374)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <input
                type="text"
                className="form-control border-0"
                style={{ backgroundColor: "transparent", color: "black" }}
                placeholder="Search …. by date or label"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Add Daily Log Button for Desktop */}
            <div
              onClick={!isTeacher ? handleModal : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 12px",
                backgroundColor: isTeacher ? "#888888" : "#1C335C",
                borderRadius: "8px",
                cursor: isTeacher ? "not-allowed" : "pointer",
                opacity: isTeacher ? 0.6 : 1,
                transition: "background-color 0.3s",
                pointerEvents: isTeacher ? "none" : "auto",
              }}
              onMouseEnter={(e) => {
                if (!isTeacher) {
                  e.currentTarget.style.backgroundColor = "#16294D";
                }
              }}
              onMouseLeave={(e) => {
                if (!isTeacher) {
                  e.currentTarget.style.backgroundColor = "#1C335C";
                }
              }}
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
                Add Daily Log
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
          </div>
        )}
      </div>
      <div
        className="table-responsive"
        style={{
          height: isMobile ? "auto" : "650px", // Auto height on mobile
          maxHeight: isMobile ? "70vh" : "650px", // Max height on mobile
          overflowY: "auto",
          overflowX: isMobile ? "hidden" : "auto", // Hide horizontal scroll on mobile
        }}
      >
        {isMobile ? (
          // Mobile Card View
          <div style={{ padding: "10px" }}>
            {displayedData.map((log, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                  marginBottom: "15px",
                  padding: "15px",
                  border: "1px solid #E0E4F0",
                }}
              >
                {/* Date */}
                <div
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#888",
                      fontWeight: "600",
                    }}
                  >
                    Date :
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1C335C",
                      fontFamily: "Manrope",
                    }}
                  >
                    {formatDate(log.log_date)}
                  </div>
                </div>

                {/* Log Label */}
                <div style={{ marginBottom: "10px", gap: "5px" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#888",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    Log Title :
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#1C335C",
                      fontFamily: "Manrope",
                      lineHeight: "1.4",
                      fontWeight: "700",
                    }}
                  >
                    Daily log - {log.class_name} - {log.section_name}
                  </div>
                </div>

                {/* Status */}
                <div
                  style={{
                    marginBottom: "15px",
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#888",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    Status :
                  </div>
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: "20px",
                      backgroundColor: log.is_approved ? "#E7F8F0" : "#FFF2E5",
                      color: log.is_approved ? "#0F9D58" : "#FF9800",
                      fontWeight: "600",
                      fontSize: "12px",
                      display: "inline-block",
                    }}
                  >
                    {log.is_approved ? "Approved" : "Pending"}
                  </span>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <div
                    onClick={() => handleModalEdit(log)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "36px",
                      height: "36px",
                      padding: "8px",
                      backgroundColor:"#1C335C",
                      borderRadius: "8px",
                      cursor: "pointer",
                      opacity: 1,
                      transition: "background-color 0.3s",
                    }}
                    title={isTeacher && log.is_approved === 1 ? "View" : "Edit"}
                  >
                    {isTeacher && log.is_approved === 1 ? (
                      <Eye width={18} height={18} fill="#fff" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="18px"
                        height="18px"
                        fill="#ffffff"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M3 17.25V21h3.75l11-11.03-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      </svg>
                    )}
                  </div>

                  <div
                    onClick={() => handleShowDeleteModal(log)}
                    style={{
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isTeacher ? "#FFE7E1" : "#FFE7E1",
                      borderRadius: "8px",
                      cursor: isTeacher ? "not-allowed" : "pointer",
                      opacity: isTeacher ? 0.6 : 1,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
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
                      <path
                        d="M5.41663 5C5.46319 5 5.48648 5 5.50758 4.99947C6.19379 4.98208 6.79915 4.54576 7.03264 3.90027C7.03982 3.88041 7.04719 3.85832 7.06191 3.81415L7.14282 3.57143C7.21188 3.36423 7.24642 3.26063 7.29222 3.17267C7.47497 2.82173 7.81308 2.57803 8.2038 2.51564C8.30173 2.5 8.41094 2.5 8.62934 2.5H11.3706C11.589 2.5 11.6982 2.5 11.7961 2.51564C12.1868 2.57803 12.525 2.82173 12.7077 3.17267C12.7535 3.26063 12.788 3.36423 12.8571 3.57143L12.938 3.81415C12.9527 3.85826 12.9601 3.88042 12.9673 3.90027C13.2008 4.54576 13.8061 4.98208 14.4923 4.99947C14.5134 5 14.5367 5 14.5833 5"
                        stroke="#ED5578"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop Table View
          <table
            className="table"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "rgb(242, 246, 255)",
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
                    textAlign: "center",
                    width: "10%",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                    width: "25%",
                  }}
                >
                  Log label
                </th>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "center",
                    width: "10%",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "end",
                    width: "15%",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {displayedData.map((log, index) => (
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
                      padding: "12px 15px",
                      textAlign: "center",
                      fontWeight: "600",
                      fontFamily: "Manrope",
                    }}
                  >
                    {formatDate(log.log_date)}
                  </td>
                  <td style={{ textAlign: "left", padding: "12px 20px" }}>
                    <div
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        maxWidth: "400px",
                      }}
                    >
                      Daily log - {log.class_name} - {log.section_name}
                    </div>
                  </td>

                  <td style={{ textAlign: "center", padding: "12px 20px" }}>
                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: "20px",
                        backgroundColor: log.is_approved
                          ? "#E7F8F0"
                          : "#FFF2E5",
                        color: log.is_approved ? "#0F9D58" : "#FF9800",
                        fontWeight: "600",
                        maxWidth: "400px",
                      }}
                    >
                      {log.is_approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td
                    style={{
                      height: "80px",
                      display: "flex",
                      gap: "10px",
                      justifyContent: "end",
                      alignItems: "center",
                      padding: "12px 20px",
                    }}
                  >
                    <div
                      onClick={() => handleModalEdit(log)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px 12px",
                        backgroundColor:"#1C335C",
                        borderRadius: "8px",
                        cursor: "pointer",
                        opacity: 1,
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        if (!(isTeacher && log.is_approved === 1)) {
                          e.currentTarget.style.backgroundColor = "#16294D";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!(isTeacher && log.is_approved === 1)) {
                          e.currentTarget.style.backgroundColor = "#1C335C";
                        }
                      }}
                    >
                      <span
                        style={{
                          marginRight: "8px",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      >
                        {isTeacher && log.is_approved === 1 ? "View" : "Edit"}
                      </span>

                      {isTeacher && log.is_approved === 1 ? (
                        <Eye width={16} height={16} fill="#ffffff" />
                      ) : (
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
                      )}
                    </div>

                    <div
                      onClick={() => handleShowDeleteModal(log)}
                      style={{
                        width: "32px",
                        height: "40px",
                        padding: "10px 6px 10px 6px",
                        gap: "10px",
                        backgroundColor: isTeacher ? "#FFE7E1" : "#FFE7E1",
                        borderRadius: "8px",
                        cursor: isTeacher ? "not-allowed" : "pointer",
                        opacity: isTeacher ? 0.6 : 1,
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
                        <path
                          d="M5.41663 5C5.46319 5 5.48648 5 5.50758 4.99947C6.19379 4.98208 6.79915 4.54576 7.03264 3.90027C7.03982 3.88041 7.04719 3.85832 7.06191 3.81415L7.14282 3.57143C7.21188 3.36423 7.24642 3.26063 7.29222 3.17267C7.47497 2.82173 7.81308 2.57803 8.2038 2.51564C8.30173 2.5 8.41094 2.5 8.62934 2.5H11.3706C11.589 2.5 11.6982 2.5 11.7961 2.51564C12.1868 2.57803 12.525 2.82173 12.7077 3.17267C12.7535 3.26063 12.788 3.36423 12.8571 3.57143L12.938 3.81415C12.9527 3.85826 12.9601 3.88042 12.9673 3.90027C13.2008 4.54576 13.8061 4.98208 14.4923 4.99947C14.5134 5 14.5367 5 14.5833 5"
                          stroke="#ED5578"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AddDailyLog
        show={showModal}
        handleClose={handleModalClose}
        setRefresh={setRefresh}
      />

      <CreateEditDailyLog
        show={showEditModal}
        handleClose={handleModalEditClose}
        setRefresh={setRefresh}
        bucketData={bucketData}
        readOnly={viewOnlyMode}
      />

      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => {
          setShowDeleteModal(false);
          setBucketToDelete(null);
        }}
        handleDelete={handleDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete all daily‐log entries for ${
          bucketToDelete?.class_name
        } / ${bucketToDelete?.section_name} on ${formatDate(
          bucketToDelete?.log_date || ""
        )}? This cannot be undone.`}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export { TablesWidget83 };
