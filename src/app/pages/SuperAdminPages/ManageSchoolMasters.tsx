import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { Content } from "../../../_metronic/layout/components/content";
import { HeaderWrapper } from "../../../_metronic/layout/components/header_staff";
import { DOMAIN } from "../../routing/ApiEndpoints";
import { CreateSchoolMasterModal } from "../../../_metronic/partials/modals/create-app-stepper/CreateSchoolMaster";
import { useAuth } from "../../../app/modules/auth/core/Auth";
import { CreateEditSchoolMasterModal } from "../../../_metronic/partials/modals/create-app-stepper/CreateEditSchoolMasterModal";
import { DeleteConfirmationModal } from "../../../_metronic/partials/modals/create-app-stepper/DeleteConfirmationModal";
import { toast } from "react-toastify";
import { Copy } from "lucide-react";
import { Tooltip } from "react-tooltip";

interface SchoolMaster {
  id: number;
  name: string;
  // Add other properties as needed
}

export const ManageSchoolMastersPage = () => {
  const [schoolMasters, setSchoolMasters] = useState<SchoolMaster[]>([]);
  const [group, setGroup] = useState<SchoolMaster[]>([]);
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [subId, setSubId] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);
  const { currentUser } = useAuth();
  const [copiedEmails, setCopiedEmails] = useState({});
  const userId = currentUser?.id;

  const getBaseDomain = () => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin; // Get the current frontend domain
      const match = origin.match(/^(https?:\/\/[^\/]+\.(com|in))/);
      return match ? match[1] : origin; // Return extracted domain or fallback to origin
    }
    return "";
  };

  useEffect(() => {
    const fetchSchoolMasters = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/superadmin/get-school-masters/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch school masters");
        }
        const data = await response.json();
        // console.log(data);
        setSchoolMasters(data); // Update state with fetched data
        setRefresh(false);
      } catch (error) {
        console.error("Error fetching school masters:", error);
      }
    };

    fetchSchoolMasters();
  }, [refresh]);

  const handleSelect = (schoolMaster: School) => {
    setSelectedSchool(school);
    setSchoolId(school.id);
  };

  const handleAddSuperAdmin = () => {
    setShowModal(true);
  };

  const handleViewSchool = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleViewEditSchool = (group: any) => {
    setGroup(group);
    setShowEditModal(true);
  };
  const handleEditCloseModal = () => {
    setShowEditModal(false);
  };

  const handleDeleteSchool = (group: any) => {
    if (group.school_names === "No school assigned") {
      toast.warn("Cannot delete. Schools are assigned to this company.");
      return;
    }

    setSubId(group.id);
    setShowDeleteModal(true);
  };

  const handleDeleteCloseModal = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    if (!subId) return;

    try {
      const response = await fetch(
        `${DOMAIN}/api/superadmin/delete-school-master/${subId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Company deleted successfully!");
      setRefresh(true);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Failed to delete company. Please try again.");
    }
  };

  const handleCopy = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmails((prev) => ({ ...prev, [email]: true }));

    setTimeout(() => {
      setCopiedEmails((prev) => ({ ...prev, [email]: false }));
    }, 1500); // Reset after 1.5 seconds
  };

  return (
    <div className="bg-white">
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
              Company List
            </span>
            <div
              onClick={handleViewSchool}
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
                New Company
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
                  {/* <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                    }}
                  >
                    Company Id
                  </th> */}
                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                    }}
                  >
                    Company Name
                  </th>

                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                    }}
                  >
                    Company Email
                  </th>
                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "right",
                    }}
                  >
                    Company Phone
                  </th>
                  <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "right",
                    }}
                  >
                    Assigned Schools
                  </th>
                  {/* <th
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                    }}
                  >
                    PayPortal Link
                  </th> */}
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
                {schoolMasters.map((group, index) => (
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
                    {/* <td
                      style={{
                        padding: "12px 20px",
                      }}
                    >
                      {group.id}
                    </td> */}
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
                        display: "flex",
                        alignItems: "center",
                        border: "none",
                        outline: "none",
                      }}
                    >
                      <span>{group.email}</span>
                      <Copy
                        size={18}
                        style={{
                          marginLeft: 8,
                          cursor: "pointer",
                          color: copiedEmails[group.email] ? "green" : "black",
                        }}
                        onClick={() => handleCopy(group.email)}
                        data-tooltip-id={`tooltip-${group.email}`}
                        data-tooltip-content={
                          copiedEmails[group.email]
                            ? "Copied!"
                            : "Copy to clipboard"
                        }
                      />
                      <Tooltip
                        id={`tooltip-${group.email}`}
                        place="top"
                        effect="Light"
                        style={{ zIndex: "999" }}
                      />
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                        textAlign: "right",
                      }}
                    >
                      {group.contact_no}
                    </td>

                    <td
                      style={{
                        padding: "12px 20px",
                        textAlign: "right",
                      }}
                    >
                      {group.school_names && group.school_names.length > 0 ? (
                        group.school_names.map((school, index) => (
                          <span key={index}>
                            {school}
                            {index < group.school_names.length - 1 && ", "}
                          </span>
                        ))
                      ) : (
                        <span>No schools assigned</span>
                      )}
                    </td>
                    {/* {group.encrypted_code ? (
                      <td style={{ padding: "12px 20px" }}>
                        <a
                          href={`${getBaseDomain()}/pay-portal?encrypted_code=${
                            group.encrypted_code
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Link To Portal!
                        </a>
                      </td>
                    ) : (
                      <td style={{ padding: "12px 20px" }}>N/A</td>
                    )} */}

                    <td
                      style={{
                        display: "flex",
                        gap: "10px", // Adds space between the buttons
                        justifyContent: "center", // Aligns buttons horizontally in the center
                        alignItems: "center", // Vertically centers the buttons
                        padding: "12px 20px",
                      }}
                    >
                      <div
                        onClick={() => handleViewEditSchool(group)}
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
                          Edit
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
                      <div
                        style={{
                          width: "32px",
                          height: "40px",
                          borderRadius: "6px",
                          padding: "10px 6px",
                          gap: "10px",
                          backgroundColor:
                            group.school_names?.[0] === "No school assigned"
                              ? "#FFE7E1"
                              : "#d3d3d3",
                          cursor:
                            group.school_names?.[0] === "No school assigned"
                              ? "pointer"
                              : "not-allowed",
                          pointerEvents:
                            group.school_names?.[0] === "No school assigned"
                              ? "auto"
                              : "none",
                        }}
                        onClick={() => {
                          if (
                            group.school_names?.[0] === "No school assigned"
                          ) {
                            handleDeleteSchool(group);
                          }
                        }}
                        title={
                          group.school_names?.[0] === "No school assigned"
                            ? "Delete Company"
                            : "Cannot delete. Schools are assigned to this company."
                        }
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
                            stroke={
                              group.school_names?.[0] === "No school assigned"
                                ? "#ED5578"
                                : "#A0A0A0"
                            }
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M15.6944 7.08331L15.3111 12.8326C15.1637 15.045 15.0899 16.1512 14.3691 16.8256C13.6482 17.5 12.5396 17.5 10.3222 17.5H9.67775C7.46042 17.5 6.35175 17.5 5.63091 16.8256C4.91007 16.1512 4.83632 15.045 4.68883 12.8326L4.30554 7.08331"
                            stroke={
                              group.school_names?.[0] === "No school assigned"
                                ? "#ED5578"
                                : "#A0A0A0"
                            }
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M7.91663 9.16669L8.33329 13.3334"
                            stroke={
                              group.school_names?.[0] === "No school assigned"
                                ? "#ED5578"
                                : "#A0A0A0"
                            }
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M12.0833 9.16669L11.6666 13.3334"
                            stroke={
                              group.school_names?.[0] === "No school assigned"
                                ? "#ED5578"
                                : "#A0A0A0"
                            }
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

          <div>
            <CreateSchoolMasterModal
              show={showModal}
              onHide={handleCloseModal}
              setRefresh={setRefresh}
              userType={"company"}
            />
            <CreateEditSchoolMasterModal
              show={showEditModal}
              onHide={handleEditCloseModal}
              setRefresh={setRefresh}
              userType={"company"}
              group={group}
            />
            <DeleteConfirmationModal
              show={showDeleteModal}
              handleClose={handleDeleteCloseModal}
              handleDelete={handleDelete}
              title="Confirm Deletion"
              description={`Are you sure you want to delete the subscription "${group?.name}"? This will also delete all entries assigned to this subscription. This action cannot be undone.`}
              confirmButtonText="Delete"
              cancelButtonText="Cancel"
            />
          </div>
        </div>
      </Content>
    </div>
  );
};

const ManageSchoolMasters = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>

      <HeaderWrapper toggleView={() => {}} />
      <ManageSchoolMastersPage />
    </>
  );
};

export default ManageSchoolMasters;
