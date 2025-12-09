/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DOMAIN,
  getSchoolWiseSessions,
} from "../../../../app/routing/ApiEndpoints";
import { useAuth } from "../../../../app/modules/auth";
import { AddSessionSchool } from "../../modals/create-app-stepper/AddSessionSchool";
import { EditSessionSchool } from "../../modals/create-app-stepper/EditSessionSchool";

interface Sessions {
  designation_id: number;
  name: string;
  is_active: number;
  updated_at: string;
}

const TablesWidget67 = () => {
  const [sessions, setSessions] = useState<Sessions[]>([]);
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedSession, setSelectedSession] = useState(0);
  const Navigate = useNavigate();

  // Fetch school-wise sessions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/${getSchoolWiseSessions}/${schoolId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error("Error fetching school details:", error);
      }
    };

    fetchData();
  }, [schoolId, refresh]);

  const handleModules = (designationId: number) => {
    Navigate(
      `/user-designation/permission?schoolId=${schoolId}&designationId=${designationId}`
    );
  };

  const handleShowAddModal = () => {
    setShowModal(true);
  };

  const handleCloseAddModal = () => {
    setShowModal(false);
  };
  const handleEditModules = (session_id) => {
    setSelectedSession(session_id);
    setEditModal(true);
  };

  const handleEditCloseModules = () => {
    setEditModal(false);
  };

  return (
    <div>
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
            padding: "16px 20px",
            borderBottom: "1px solid #E0E4F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
            School Sessions
          </span>
          {(currentUser?.designation === "School Master" ||  currentUser?.designation === "School Admin")&& (
            <div
              onClick={handleShowAddModal}
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
                Add New Session
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
          )}
        </div>
        <div
          style={{
            height: "650px", // Fixed height for the table container
            overflowY: "auto", // Enable vertical scrolling
            padding: "16px 0", // Optional: adds some padding around the table
          }}
        >
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
                <th style={{ padding: "12px 20px", textAlign: "left" }}>Id</th>
                <th style={{ padding: "12px 20px", textAlign: "center" }}>
                  Session Name
                </th>
                <th style={{ padding: "12px 20px", textAlign: "right" }}>
                  Is Active
                </th>
                <th style={{ padding: "12px 20px", textAlign: "right" }}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {sessions.length > 0 ? (
                sessions.map((item, index) => (
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
                    <td style={{ padding: "12px 20px" }}>{item.id}</td>
                    <td style={{ padding: "12px 20px", textAlign: "center" }}>
                      {item.session}
                    </td>
                    <td style={{ padding: "12px 20px", textAlign: "right" }}>
                      {item.current === 1 ? (
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: "12px",
                            backgroundColor: "#28a745",
                            color: "#FFFFFF",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          Current
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: "12px",
                            backgroundColor:
                              item.is_active === "yes" ? "#28a745" : "#dc3545",
                            color: "#FFFFFF",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          {item.is_active == "yes" ? "active" : "in-active"}
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        display: "flex",
                        gap: "10px", // Adds space between the buttons
                        justifyContent: "right", // Aligns buttons horizontally in the center
                        alignItems: "center", // Vertically centers the buttons
                        padding: "12px 20px",
                      }}
                    >
                      <div
                        onClick={() =>
                          item.is_active !== "yes" &&
                          new Date() >= new Date(item.start_date) &&
                          new Date() <= new Date(item.end_date)
                            ? handleModules(item.designation_id)
                            : null
                        }
                        style={{
                          display: "flex",
                          alignItems: "right",
                          padding: "8px 12px",
                          backgroundColor:
                            item.is_active === "yes" ||
                            new Date() < new Date(item.start_date) ||
                            new Date() > new Date(item.end_date)
                              ? "#9E9E9E" // Disabled (gray) color
                              : "#1C335C", // Enabled (active) color
                          borderRadius: "8px",
                          cursor:
                            item.is_active === "yes" ||
                            new Date() < new Date(item.start_date) ||
                            new Date() > new Date(item.end_date)
                              ? "not-allowed" // Disabled cursor
                              : "pointer", // Enabled cursor
                          transition: "background-color 0.3s",
                          opacity:
                            item.is_active === "yes" ||
                            new Date() < new Date(item.start_date) ||
                            new Date() > new Date(item.end_date)
                              ? 0.6 // Disabled (dimmed)
                              : 1, // Enabled (normal)
                        }}
                        onMouseEnter={(e) => {
                          if (
                            item.is_active !== "yes" &&
                            new Date() >= new Date(item.start_date) &&
                            new Date() <= new Date(item.end_date)
                          ) {
                            e.currentTarget.style.backgroundColor = "#16294D";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (
                            item.is_active !== "yes" &&
                            new Date() >= new Date(item.start_date) &&
                            new Date() <= new Date(item.end_date)
                          ) {
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
                          {item.is_active === "yes" ||
                          new Date() < new Date(item.start_date) ||
                          new Date() > new Date(item.end_date)
                            ? "Already Active or Not Available"
                            : "Activate"}
                        </span>
                      </div>
                      <div
                        onClick={() => handleEditModules(item.id)}
                        style={{
                          display: "flex",
                          alignItems: "right",
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
                          Edit
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "12px 20px",
                      textAlign: "center",
                      color: "#1C335C",
                      fontWeight: "600",
                      fontFamily: "Manrope",
                    }}
                  >
                    No roles assigned for this school.
                  </td>
                </tr>
              )}

              <AddSessionSchool
                show={showModal}
                handleClose={handleCloseAddModal}
                setRefresh={setRefresh}
              />
              <EditSessionSchool
                show={editModal}
                handleClose={handleEditCloseModules}
                setRefresh={setRefresh}
                selectedSession={selectedSession}
              />
            </tbody>
          </table>
        </div>
        {/* <div
        className="col-xxl-4"
        style={{
          borderRadius: "16px",
          border: "1px solid #5D637A",
          overflowX: "hidden",
          minHeight: "100%",
          marginBottom: "20px",
          height: "280px",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Manrope",
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px",
            backgroundColor: "#1C335C",
            height: "80px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            className=""
            id="staticBackdropLabel"
            style={{
              fontSize: "18px",
              fontWeight: "600",
              fontFamily: "Manrope",
              color: "white",
            }}
          >
            Add New Role :
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px",
            flexDirection: "column",
            marginTop: "10px",
          }}
        >
          <div style={{ marginBottom: "23px", width: "100%" }}>
            <label
              htmlFor="materialtitle"
              className="form-label"
              style={{
                fontSize: "12px",
                color: "#434343",
                fontWeight: "500",
              }}
            >
              Role Name
            </label>

            <div id="materialtitle">
              <input
                className=""
                style={{
                  height: "46px",
                  width: "100%",
                  paddingLeft: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "transparent",
                  border: "1px solid #ECEDF1",
                  borderRadius: "8px",
                }}
                // onChange={(e) =>
                //   // handleMaterialChange("title", e.target.value)
                // }
                type="text"
                placeholder="Enter Name"
                aria-expanded="false"
              />
            </div>
          </div>
          <div
            style={{ width: "100%", justifyContent: "right", display: "flex" }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
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
              // onClick={handleSubmit}
            >
              <span
                style={{
                  color: "#FFF",
                  fontFamily: "Manrope",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                Add
              </span>
            </button>
          </div>
        </div>
      </div> */}
      </div>
    </div>
  );
};

export { TablesWidget67 };
