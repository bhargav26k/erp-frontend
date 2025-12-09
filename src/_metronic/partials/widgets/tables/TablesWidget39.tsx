import React, { useEffect, useState } from "react";
// import { Tooltip as ReactTooltip } from "react-tooltip";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
// import { CreateWalkinEnquiry } from "../../modals/create-app-stepper/CreateWalkinEnquiry";
// import { CreateEnquiryAction } from "../../modals/create-app-stepper/CreateEnquiryAction";
// import { CreateEditEnquiry } from "../../modals/create-app-stepper/CreateEditEnquiry";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
// import { UploadsFilter } from "../../modals/create-app-stepper/UploadsFilter";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { EditUploadedAssignment } from "../../modals/create-app-stepper/EditUploadedAssignment";
import { UploadAssignmentModal } from "../../modals/create-app-stepper/UploadAssignmentModal";
import { toast } from "react-toastify";
import axios from "axios";



interface TablesWidgetProps {
  classId: string;
  sectionId?: string;
  subjectId?: string;
  lessonId?: string;
  topicId?: string;
}

interface DataItem {
  class: string;
  section: string;
  subject: string;
  type: string;
  lesson: string;
  topic: string;
  title: string;
  upload_type: string;
  staff_name: string;
  created_at: string;
  updated_at: string;
}

const TablesWidget39: React.FC<TablesWidgetProps> = ({
  classId,
  sectionId,
  subjectId,
  lessonId,
}) => {
  const [refresh, setRefresh] = useState(false);
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  
  const [entityNames, setEntityNames] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Navigate = useNavigate();
  const { currentUser } = useAuth();
  const school_id = (currentUser as any)?.school_id;
  const session_id = (currentUser as any)?.session_id;
  const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
      const [selectedItem, setSelectedItem] = useState({});

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-entity-names/${school_id}?class_id=${classId}&section_id=${sectionId}&subject_id=${subjectId}&lesson_id=${lessonId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch entity names");
        }

        const data = await response.json();
        setEntityNames(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNames();
  }, [classId, sectionId, subjectId, lessonId]);

  const handleModal = () => {
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };
  const handleModalEdit = (value) => {
    // Assuming you have these variables already set somewhere in your component
    const additionalValues = {
      class_id: value.classId || "",    // If you have a specific value, otherwise keep it blank
      section_id: value.sectionId || "", 
      subject_id: value.subjectId || "", 
      lesson_id: value.lessonId || "",
    };
  
    // Spread the original `value` object and add the new keys
    setSelectedItem({
      ...value,
      ...additionalValues
    });
  
    setShowEditModal(true);
  };
  

  const handleModalEditClose = () => {
    setShowEditModal(false);
  };

  // useEffect(() => {
  //   if (Object.values(filterData).some(value => value !== '')) {
  //     console.log(Object.values(filterData));

  //     // Apply filters based on filterData
  //     const filteredResult = data.filter(item => {
  //       // Implement your filtering logic based on filterData fields
  //       return (
  //         (filterData.class === '' || item.className === filterData.class) &&
  //         (filterData.section === '' || item.sectionName === filterData.section) &&
  //         (filterData.subject === '' || item.subjectName === filterData.subject) &&
  //         (filterData.lesson === '' || item.lessonName === filterData.lesson) &&
  //         (filterData.topic === '' || item.topicName === filterData.topic) &&
  //         (filterData.isPublic === '' || item.isPublic === (filterData.isPublic === 'true'))
  //       );
  //     });
  //     setFilteredData(filteredResult); // Update filtered data state
  //   } else {
  //     // If no filters are applied, show original data
  //     setFilteredData(data);
  //   }
  // }, [filterData, data]);

  //   const handleActionModal = (value) => {
  //     setEnqId(value)
  //     setShowActionModal(true);
  //   };
  //   const handleActionModalClose = () => {
  //     setShowActionModal(false);
  //   };

  //   const handleModalEdit=(value)=>{
  //     setEnqId(value)
  //     setShowEditModal(true)
  //       }

  //       const handleModalEditClose=()=>{
  //         setShowEditModal(false)
  //           }

  useEffect(() => {
    if (!classId || !sectionId || !subjectId || !lessonId) {
      console.warn("Missing required query parameters. Skipping fetch.");
      return;
    }

    const fetchUploads = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams({
          class_id: String(classId),
          section_id: String(sectionId),
          subject_id: String(subjectId),
          lesson_id: String(lessonId),
        }).toString();


        const teacher_id = currentUser?.id;
        let response;

        if (currentUser?.roleName === "Teacher") {
          response = await fetch(
            `${DOMAIN}/api/school/get-alluploadsbyteacher/${school_id}/${teacher_id}?${queryParams}`
          );
        } else {
          response = await fetch(
            `${DOMAIN}/api/school/get-allassignmentsbyid/${school_id}/${session_id}/?${queryParams}`
          );
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const responseData = await response.json();

        if (!Array.isArray(responseData)) {
          throw new Error("Invalid response format.");
        }

        setFilteredData(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
    setRefresh(false);
  }, [classId, sectionId, subjectId, lessonId, refresh]);

  // const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
  //   const query = e.target.value.toLowerCase();
  //   setSearchQuery(query);

  //   const filtered = data.filter(
  //     (item) =>
  //       item.class.toLowerCase().includes(query) ||
  //       item.section.toLowerCase().includes(query) ||
  //       item.subject.toLowerCase().includes(query) ||
  //       item.type.toLowerCase().includes(query)
  //   );

  //   setFilteredData(filtered);
  // };

  const formatDate = (dateString: any) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    /* @ts-ignore */
    return date.toLocaleDateString("en-GB", options);
  };

  const handleBack = () => {
    Navigate(-1);
  };



  const handleDelete = async (id) => {
    try {
        const response = await axios.post(
            `${DOMAIN}/api/school/delete-uploadassignment`,
            { id }
        );

        if (response.status === 200) {
            toast.success(response.data.message);
            setRefresh(true); // Refresh the content list if necessary
        }
    } catch (error) {
        console.error("Delete Error:", error);
        toast.error("Failed to delete the content. Please try again.");
    }
};


  return (
    <div>
      <h3
        style={{
          fontFamily: "Manrope",
          fontWeight: "500",
          fontSize: "16px",
          borderBottom: "1px solid lightgray",
          paddingBottom: "10px",
          width: "a",
          marginTop: "10px",
          display: "flex",
          gap: "1%",
          alignItems: "center",
        }}
      >
        <div
          style={{
            border: "1px solid gray",
            borderRadius: "100%",
            padding: "5px 10px",
            cursor: "pointer",
          }}
          onClick={handleBack}
        >
          <i className="fas fa-arrow-left"></i>
        </div>{" "}
        {entityNames?.class_name}
        {" -> "}
        {entityNames?.section_name}
        {" -> "}
        {entityNames?.subject_name}
        {" -> "}
        {entityNames?.lesson_name}
      </h3>
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
          fontFamily: "Manrope",
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
            width: "100%",
          }}
        >
          <div style={{ width: "40%" }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#1F4061",
                fontFamily: "Manrope",
              }}
            >
              Uploaded Assignments List
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              width: "60%",
              justifyContent: "end",
            }}
          >
            {/* <div
            className="input-group flex-nowrap"
            style={{
              width: "380px",
              height: "36px",
              borderRadius: "8px",
              border: "1px solid #1F4061",
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
                    stroke="#1F4061"
                    stroke-width="1.5"
                  />
                  <path
                    d="M14.1667 13.3333L15.5 14.6666"
                    stroke="#1F4061"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_582_4295">
                    <rect
                      width="16"
                      height="16"
                      fill="#1F4061"
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
                color: "#1C335C",
              }}
              className="form-control border-0"
              placeholder="Search by Phone no. | Email | Type ...."
              aria-label="Search"
              aria-describedby="addon-wrapping"
              onChange={handleSearch}
              value={searchQuery}
            />
          </div> */}
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
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "700",
                  fontFamily: "Manrope",
                }}
              >
                Upload Assignment
              </span>
            </div>
          </div>
        </div>
        <div style={{ width: "auto", height: "100%", overflow: "hidden" }}>
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
                  Id
                </th>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                  }}
                >
                  Title
                </th>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                  }}
                >
                  File Type
                </th>

                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                  }}
                >
                  Created By
                </th>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                  }}
                >
                  Visibility Status
                </th>

                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                  }}
                >
                  Created Date
                </th>

                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "center",
                  }}
                >
                  Updated Date
                </th>

                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "Right",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? "rgb(242, 246, 255)" : "#FFFFFF",
                      borderBottom: "1px solid #E0E4F0",
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      color: "#1C335C",
                      height: "auto",
                    }}
                  >
                    <td
                      style={{
                        padding: "20px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1F4061",
                        fontFamily: "Manrope",
                      }}
                    >
                      {index}
                    </td>
                    <td
                      style={{
                        padding: "20px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1F4061",
                        fontFamily: "Manrope",
                      }}
                    >
                      {item.title}
                    </td>

                    <td
                      style={{
                        padding: "20px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1F4061",
                        fontFamily: "Manrope",
                      }}
                    >
                      {item.description || "-NA-"}
                    </td>
                    <td
                      style={{
                        padding: "20px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1F4061",
                        fontFamily: "Manrope",
                      }}
                    >
                      {item.file_type}
                    </td>

                    <td
                      style={{
                        padding: "20px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1F4061",
                        fontFamily: "Manrope",
                      }}
                    >
                      {item.staff_name}
                    </td>
                    <td
                      style={{
                        padding: "20px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1F4061",
                        fontFamily: "Manrope",
                      }}
                    >
                      {item.is_public === "0" ? "No" : "Yes"}
                    </td>
                    <td
                      style={{
                        padding: "20px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1F4061",
                        fontFamily: "Manrope",
                      }}
                    >
                      {formatDate(item.created_at)}
                    </td>
                    <td
                      style={{
                        padding: "20px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1F4061",
                        fontFamily: "Manrope",
                      }}
                    >
                      {formatDate(item.updated_at)}
                    </td>
                    <td
                      style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "right",
                        alignItems: "center",
                        padding: "12px 10px",
                        border: "none",
                      }}
                    >
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip1`}>Edit</Tooltip>}
                      >
                        <div
                          style={{
                            gap: "10px",
                            backgroundColor: "#1C335C",
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                          }}
                          onClick={() => handleModalEdit(item)}
                        >
                          <i
                            className="fas fa-pencil"
                            style={{ color: "white", padding: "5px 4px" }}
                          />
                        </div>
                      </OverlayTrigger>

                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip2`}>Delete</Tooltip>}
                      >
                        <div
                          style={{
                            gap: "10px",
                            backgroundColor: "#E75C83",
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                          }}
                          onClick={() => handleDelete(item.id)}
                        >
                          <i
                            className="fas fa-trash"
                            style={{ color: "white", padding: "5px 4px" }}
                          />
                        </div>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="12"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      fontFamily: "Manrope",
                      fontSize: "16px",
                      color: "#1F4061",
                    }}
                  >
                    No Content was uploaded till now. Please Start Now !
                  </td>
                </tr>
              )}
            </tbody>

            <EditUploadedAssignment
              show={showEditModal}
              handleClose={handleModalEditClose}
              selectedItem={selectedItem}  
              setRefresh={setRefresh}   
              />
            {/* <CreateEnquiryAction show={showActionModal} handleClose={handleActionModalClose} enqId={enqId}/> */}

            <UploadAssignmentModal
              show={showModal}
              handleClose={handleModalClose}
              setRefresh={setRefresh}
              classId={classId}
              sectionId={sectionId}
              subjectId={subjectId}
              lessonId={lessonId}
            />
          </table>
        </div>
      </div>
    </div>
  );
};

export { TablesWidget39 };
