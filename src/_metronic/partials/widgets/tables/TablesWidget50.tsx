import React, { useEffect, useState } from "react";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { AddSubjectGroup } from "../../modals/create-app-stepper/AddSubjectGroup";
import { DeleteConfirmationModal } from "../../modals/create-app-stepper/DeleteConfirmationModal";
import { toast } from "react-toastify";
import { CreateEditSubjectGroup } from "../../modals/create-app-stepper/CreateEditSubjectGroup";

interface CurrentUser {
  school_id: string; // Adjust type as per your actual data type for school_id
  // Add other properties if `currentUser` has more properties
}

interface Data {
  id: string;
  name: string;
}

const TablesWidget50 = () => {
  const [filteredData, setFilteredData] = useState<Data[]>([]);

  const { currentUser } = useAuth();

  const school_id = (currentUser as unknown as CurrentUser)?.school_id;
  const session_id = (currentUser as unknown as CurrentUser)?.session_id;
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [subjectId, setSubjectId] = useState(0);
  const [classSectionId, setClassSectionId] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState({});
  
  const [refresh, setRefresh] = useState(false);

  const handleModal = () => {
    setShowModal(true);
  };
  const handleShowDeleteModal = (subject_id: number,class_id: number) => {
    setSubjectId(subject_id);
    setClassSectionId(class_id);
    setShowDeleteModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleCloseDeleteModal = () => {
    setSubjectId(0);
    setShowDeleteModal(false);
  };

  const handleModalEdit = (subject: any) => {
    setSelectedSubject(subject);
    setShowEditModal(true);
  };

  const handleModalEditClose = () => {
    setShowEditModal(false);
    setSubjectId(0);
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-subjects-with-mapping/${school_id}/${session_id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const responseData = await response.json();

        // Group the data based on subject, class, and session
        const groupedData = responseData.reduce((acc, curr) => {
          const key = `${curr.subject_id}-${curr.class_id}-${curr.session_id}`;

          // Check if the group already exists, if so, push the section into the array
          if (!acc[key]) {
            acc[key] = {
              subject_id: curr.subject_id,
              subject_name: curr.subject_name,
              subject_code: curr.subject_code,
              subject_type: curr.subject_type,
              session_id: curr.session_id,
              session_name: curr.session_name,
              class_id: curr.class_id,
              class_name: curr.class_name,
              class_section_id: curr.class_section_id,
              sections: [], // Initialize sections array
              subject_group_id:curr.id
            };
          }
          // Add section information to the existing entry
          acc[key].sections.push({
            section_id: curr.section_id,
            section_name: curr.section_name,
          });

          return acc;
        }, {});

        // Convert the object back to an array
        setFilteredData(Object.values(groupedData));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSubjects();
    setRefresh(false);
  }, [school_id, refresh]);


  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/delete-subject-group/${subjectId}/${classSectionId}/${school_id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete the Subject");
      }
      // Optionally, you can refresh the list or update the state to remove the deleted item
      setRefresh(true); // Assuming you have a way to refresh the list of designations
      toast.success("Subject deleted successfully.", { autoClose: 3000 });
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting Subject:", error);
      toast.error("Failed to delete Subject!", { autoClose: 3000 });
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
          Manage Subject Groups
        </span>
        <div style={{display:'flex', gap:'15px'}}>
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
              <g clip-path="url(#clip0_582_4295)">
                <circle
                  cx="8.50002"
                  cy="7.66665"
                  r="6.33333"
                  stroke="white"
                  stroke-width="1.5"
                />
                <path
                  d="M14.1667 13.3333L15.5 14.6666"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
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
            style={{
              backgroundColor: "transparent",
              color: "black",
            }}
            className="form-control border-0"
            placeholder="Search ...."
            aria-label="Search"
            aria-describedby="addon-wrapping"
          />
        </div>
        <div
          onClick={handleModal}
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
            Add Subject Group
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
      </div>
      <div
        style={{
          height: "650px", // Fixed height for the table container
          overflowY: "auto", // Enable vertical scrolling
        }}
      >
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
                Subject ID
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Subject Name
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Class
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Session
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "left",
                }}
              >
                Sections
              </th>
              <th
                style={{
                  padding: "12px 20px",
                  textAlign: "right",
                }}
              >
                Actions
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
                  height:'auto',
                }}
              >
                {/* Subject ID */}
                <td
                  style={{
                    padding: "20px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#1F4061",
                    fontFamily: "Manrope"
                  }}
                >
                  {item.subject_id}
                </td>
                {/* Subject Name */}
                <td
                  style={{
                    padding: "20px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#1F4061",
                    fontFamily: "Manrope"
                  }}
                >
                  {item.subject_name}
                </td>

                {/* Class Name */}
                <td
                  style={{
                    padding: "20px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#1F4061",
                    fontFamily: "Manrope"
                  }}
                >
                  {item.class_name}
                </td>

                {/* Session Name */}
                <td
                  style={{
                    padding: "20px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#1F4061",
                    fontFamily: "Manrope"
                  }}
                >
                  {item.session_name}
                </td>

                {/* Sections */}
                <td
                  style={{
                    padding: "20px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#1F4061",
                    fontFamily: "Manrope"
                  }}
                >
                  {item.sections
                    .map((section) => section.section_name)
                    .join(", ")}
                </td>

                {/* Actions */}
               <td
                  style={{
                    display: "flex",
                    gap: "10px", // Adds space between the buttons
                    justifyContent: "right", // Aligns buttons horizontally in the center
                    alignItems: "center", // Vertically centers the buttons
                    padding: "12px 20px",
                    border:'none'
                  }}
                >
                  <div
                    onClick={() =>
                      handleModalEdit(item)
                    }
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
                  onClick={() => handleShowDeleteModal(item.subject_id, item.class_section_id)}
                    style={{
                      width: "32px",
                      height: "40px",
                      borderRadius: "6px",
                      padding: "10px 6px",
                      gap: "10px",
                      backgroundColor: "#FFE7E1",
                      cursor: "pointer",
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
      </div>
      <AddSubjectGroup
        show={showModal}
        handleClose={handleModalClose}
        setRefresh={setRefresh}
      />

{showEditModal && selectedSubject && (
        <CreateEditSubjectGroup
          show={showEditModal}
          handleClose={handleModalEditClose}
          setRefresh={setRefresh}
          initialClassId={selectedSubject.class_id}
          initialSections={selectedSubject.sections}
          initialSubjects={selectedSubject.subject_id}
          classSectionId={selectedSubject.class_section_id}
          subjectGroupId={selectedSubject.subject_group_id}
        />
      )}

      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete the subject Group?  \n This action cannot be undone.`}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export { TablesWidget50 };
