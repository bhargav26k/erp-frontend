/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
// import { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { Content } from "../../../_metronic/layout/components/content";
import { useEffect, useState } from "react";
import { CreateSchoolModal } from "../../../_metronic/partials/modals/create-app-stepper/CreateSchoolModal";
import { useNavigate } from "react-router-dom";
import { DOMAIN, get_schools } from "../../routing/ApiEndpoints";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";

interface School {
  id: string;
  school_id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  // Add other properties as needed
}



const ManageSchoolsPage = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [showModal, setShowModal] = useState(false);
  // const [selectedSchool, setSelectedSchool] = useState(0);
  const [refreshData, setRefreshData] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch schools data from API
    const fetchSchools = async () => {
      try {
        const response = await fetch(`${DOMAIN}/${get_schools}`);
        if (!response.ok) {
          // Extract the status and error message from the response
          const errorData = await response.json();
          throw new Error(
            `Error ${errorData.status}: ${errorData.error || "Unknown error"}`
          );
        }

        const result = await response.json();
        setSchools(result.data);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching schools:", error.message);
        } else {
          console.error("An unexpected error occurred");
        }
      }
    };

    setRefreshData(false);
    fetchSchools();
  }, [refreshData]);

  // const editDetails = (id) => {
  //   // Navigate to a page/modal to edit details of the school with the given ID
  // };

  const handleDeleteSchool = (id: number) => {
    setSelectedSchoolId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteSchool = async () => {
    if (!selectedSchoolId) return;

    try {
      const response = await fetch(
        `${DOMAIN}/api/superadmin/delete-school/${selectedSchoolId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to delete school");

      toast.success("School deleted successfully!");
      setRefreshData(true);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting school:", error);
      toast.error("Failed to delete school. Please try again.");
    }
  };

  const handlePrimaryButtonClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  // const handleCloseModal = () => {
  //   setShowModal(false);
  // };

  const handleViewSchool = (value: any) => {
    const schoolId = value;

    navigate(`/school-profile/${schoolId}`);
  };

  const getBaseDomain = () => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin; // Get the current frontend domain
      const match = origin.match(/^(https?:\/\/[^\/]+\.(com|in))/);
      return match ? match[1] : origin; // Return extracted domain or fallback to origin
    }
    return "";
  };

  return (
    <div className="bg-white">
      {/* <HeaderWrapper toggleView={() => {}} /> */}

      {/* <ToolbarDashBoard /> */}
      <Content>
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
              School Lists
            </span>
            <div
              onClick={handlePrimaryButtonClick}
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
                Add New School
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="#1C335C"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_103_1850)">
                  <path
                    d="M1.66663 10C1.66663 6.07165 1.66663 4.10746 2.88701 2.88708C4.1074 1.66669 6.07159 1.66669 9.99996 1.66669C13.9283 1.66669 15.8925 1.66669 17.1129 2.88708C18.3333 4.10746 18.3333 6.07165 18.3333 10C18.3333 13.9284 18.3333 15.8926 17.1129 17.113C15.8925 18.3334 13.9283 18.3334 9.99996 18.3334C6.07159 18.3334 4.1074 18.3334 2.88701 17.113C1.66663 15.8926 1.66663 13.9284 1.66663 10Z"
                    stroke="#fff"
                    stroke-width="1.5"
                  />
                  <path
                    d="M12.5 10L10 10M10 10L7.5 10M10 10L10 7.5M10 10L10 12.5"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_103_1850">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
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
                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                    }}
                  >
                    School Id
                  </th>
                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                    }}
                  >
                    School Name
                  </th>

                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                    }}
                  >
                    School Email
                  </th>
                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                    }}
                  >
                    School Phone
                  </th>
                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                    }}
                  >
                    School Address
                  </th>
                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                    }}
                  >
                    Parent Portal
                  </th>
                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {schools.map((group, index) => (
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
                      {group.school_id}
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                      }}
                    >
                      {group.name}
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                      }}
                    >
                      {group.email}
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                      }}
                    >
                      {group.phone}
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                      }}
                    >
                      {group.address}
                    </td>
                    {/* <td
                      style={{
                        padding: "12px 20px",
                      }}
                    >
                      { group.encrypted_id !== null ?
                       
                      `${fRONTDOMAIN}/parent-portal/userlogin?id=${encodeURIComponent(group.encrypted_id)}` : "No Created"}
                    </td> */}
                    {group.encrypted_id ? (
                    <td style={{ padding: "12px 20px" }}>
                        <a
                          href={`${getBaseDomain()}/parent-portal/userlogin?id=${encodeURIComponent(group.encrypted_id)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Link To Portal!
                        </a>
                      </td>
                    ) : (
                      <td style={{ padding: "12px 20px" }}>N/A</td>
                    )}

                    <td
                      style={{
                        display: "flex",
                        gap: "10px", // Adds space between the buttons
                        justifyContent: "center", // Aligns buttons horizontally in the center
                        alignItems: "center", // Vertically centers the buttons
                        padding: "12px 20px",
                      }}
                    >
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip1`}>View Details</Tooltip>
                        }
                      >
                        <div
                          onClick={() => handleViewSchool(group.school_id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 12px",
                            backgroundColor: "#F5F5F5",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#D9D9D9")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#F5F5F5")
                          }
                        >
                          <img
                            src="/media/svg/files/view.svg"
                            style={{ width: "20px", height: "20px" }}
                          />
                          {/* <button
                            type="button"
                            className="btn btn-primary"
                            
                            style={{
                              fontFamily: "Manrope",
                              fontSize: "13px",
                              fontWeight: "500",
                            }}
                          >
                            View
                          </button> */}
                          {/* <CreateschoolDetailModal
                            show={showModal}
                            onHide={handleCloseModal}
                            school={selectedschool}
                          /> */}
                        </div>
                      </OverlayTrigger>
                      {/* <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip1`}>Delete School</Tooltip>
                        }
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "40px",
                            borderRadius: "6px",
                            padding: "10px 6px 10px 6px",
                            gap: "10px",
                            backgroundColor: "#FFE7E1",
                          }}
                          onClick={() => handleDeleteSchool(group.school_id)}
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
                              stroke-width="1.5"
                              stroke-linecap="round"
                            />
                            <path
                              d="M15.6944 7.08331L15.3111 12.8326C15.1637 15.045 15.0899 16.1512 14.3691 16.8256C13.6482 17.5 12.5396 17.5 10.3222 17.5H9.67775C7.46042 17.5 6.35175 17.5 5.63091 16.8256C4.91007 16.1512 4.83632 15.045 4.68883 12.8326L4.30554 7.08331"
                              stroke="#ED5578"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            />
                            <path
                              d="M7.91663 9.16669L8.33329 13.3334"
                              stroke="#ED5578"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            />
                            <path
                              d="M12.0833 9.16669L11.6666 13.3334"
                              stroke="#ED5578"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            />
                            <path
                              d="M5.41663 5C5.46319 5 5.48648 5 5.50758 4.99947C6.19379 4.98208 6.79915 4.54576 7.03264 3.90027C7.03982 3.88041 7.04719 3.85832 7.06191 3.81415L7.14282 3.57143C7.21188 3.36423 7.24642 3.26063 7.29222 3.17267C7.47497 2.82173 7.81308 2.57803 8.2038 2.51564C8.30173 2.5 8.41094 2.5 8.62934 2.5H11.3706C11.589 2.5 11.6982 2.5 11.7961 2.51564C12.1868 2.57803 12.525 2.82173 12.7077 3.17267C12.7535 3.26063 12.788 3.36423 12.8571 3.57143L12.938 3.81415C12.9527 3.85826 12.9601 3.88042 12.9673 3.90027C13.2008 4.54576 13.8061 4.98208 14.4923 4.99947C14.5134 5 14.5367 5 14.5833 5"
                              stroke="#ED5578"
                              stroke-width="1.5"
                            />
                          </svg>
                        </div>
                      </OverlayTrigger> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Modal
              show={showDeleteModal}
              onHide={() => setShowDeleteModal(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete this school? This action cannot
                be undone.
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="danger" onClick={confirmDeleteSchool}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
          <CreateSchoolModal
            show={showModal}
            handleClose={handleModalClose}
            refresh={setRefreshData}
          />
          {/* <CreateSchoolMasterModal
            show={showNextModal}
            onHide={handleNextModalClose}
            setRefresh={setRefreshData}
            newSchoolId= {newSchoolId}
          /> */}
        </div>
      </Content>
    </div>
  );
};

const ManageSchools = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>

      {/* <HeaderWrapper toggleView={() => {}} /> */}
      <ManageSchoolsPage />
    </>
  );
};

export default ManageSchools;
