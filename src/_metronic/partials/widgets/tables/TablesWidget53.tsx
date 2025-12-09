/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// import { Tooltip as ReactTooltip } from "react-tooltip";
import "../../../../app/pages/StaffPages/FinancialManagement/style.css";
// import { CreateWalkinEnquiry } from "../../modals/create-app-stepper/CreateWalkinEnquiry";
// import { CreateEnquiryAction } from "../../modals/create-app-stepper/CreateEnquiryAction";
// import { CreateEditEnquiry } from "../../modals/create-app-stepper/CreateEditEnquiry";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
// import { UploadsFilter } from "../../modals/create-app-stepper/UploadsFilter";
// import { AddClasses } from "../../modals/create-app-stepper/AddClasses";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { AssignTeacher } from "../../modals/create-app-stepper/AssignTeacher";
import { AssignClassTeacher } from "../../modals/create-app-stepper/AssignClassTeacher";
// import { AddTeacher } from "../../modals/create-app-stepper/AddTeacher";

interface Section {
  section_id: number;
  section_name: string;
}

interface TeacherData {
  staff_id: number;
  staff_name: string;
  subject_id: number;
  subject_name: string;
  class_id: number;
  class_name: string;
  session_id: number;
  session_name: string;
  sections: Section[]; // Array of sections
  class_teacher_class: string;
  class_teacher_section: string;
}

const TablesWidget53 = () => {
  const [teacherData, setTeacherData] = useState<TeacherData[]>([]);
  const [showAssignSubjectModal, setShowAssignSubjectModal] = useState(false);
  const [showAssignClassModal, setShowAssignClassModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [showEditModal, setShowEditModal] = useState(false);

  const { currentUser } = useAuth();
  const school_id = (currentUser as any)?.school_id;

  const handleAssignSubjectTeacherModal = () => {
    setShowAssignSubjectModal(true);
  };
  const handleAssignClassTeacherModal = () => {
    setShowAssignClassModal(true);
  };
  // const handleShowDeleteModal = (class_id: string) => {
  //   setClassId(class_id);
  //   setShowDeleteModal(true);
  // };

  const handleAssignSubjectTeacherModalClose = () => {
    setShowAssignSubjectModal(false);
  };
  const handleAssignClassTeacherModalClose = () => {
    setShowAssignClassModal(false);
  };

  // const handleCloseDeleteModal = () => {
  //   setClassId("");
  //   setShowDeleteModal(false);
  // };

  // const handleModalEdit = (class_id: string, classname: string , sections : any) => {
  //   setClassId(class_id);
  //   setclassname(classname);
  //   setEditSections(sections);
  //   // setClassId('');
  //   // setclassname('');
  //   // setEditSections([]);
  //   setShowEditModal(true);
  // };

  // const handleModalEditClose = () => {
  //   setShowEditModal(false);
  //   setClassId('')
  // };

  const groupTeacherData = (data: TeacherData[]): TeacherData[] => {
    const groupedData = data.reduce((acc, curr) => {
      // Create a unique key based on staff_id and subject_id to group by staff and subject
      const key = `${curr.staff_id}-${curr.subject_id}`;

      // If this combination doesn't exist yet, create a new entry
      if (!acc[key]) {
        acc[key] = {
          ...curr, // Add all properties of the current entry
          sections: [], // Initialize sections array
        };
      }

      // Push the current section details into the sections array
      acc[key].sections.push({
        section_id: curr.section_id,
        section_name: curr.section_name,
      });

      return acc;
    }, {} as Record<string, TeacherData>); // Explicit typing for accumulator

    // Convert the grouped data back into an array
    return Object.values(groupedData);
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-classteachers/${school_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: TeacherData[] = await response.json();

        // Group the fetched data
        const groupedData = groupTeacherData(data);
        setTeacherData(groupedData); // Pass the correctly typed data
        setRefresh(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTeachers();
  }, [school_id, refresh]);

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
          Manager Teachers
        </span>
        <div
          onClick={handleAssignSubjectTeacherModal}
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
            Assign Subject Teacher
          </span>
        </div>
        <div
          onClick={handleAssignClassTeacherModal}
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
            Assign Class Teacher
          </span>
        </div>
      </div>
      <div
        style={{
          height: "650px",
          overflowY: "auto",
        }}
      >
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
              <th style={{ padding: "12px 20px", textAlign: "left" }}>Class</th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Section
              </th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Subject
              </th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Teacher
              </th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>
                Class Teacher
              </th>
              <th style={{ padding: "12px 20px", textAlign: "center" }}>
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {teacherData.map((item, index) => (
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
                <td style={{ padding: "12px 20px" }}>{item.class_name}</td>
                <td style={{ padding: "12px 20px" }}>
                  {item.sections
                    .map((section) => section.section_name)
                    .join(", ")}
                </td>
                <td style={{ padding: "12px 20px" }}>{item.subject_name}</td>
                <td style={{ padding: "12px 20px" }}>{item.staff_name}</td>
                <td style={{ padding: "12px 20px" }}>
                  {item.class_teacher_class + " " + item.class_teacher_section}
                </td>
                <td
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "12px 20px",
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
            ))}
          </tbody>
        </table>
      </div>
      <AssignTeacher
        showAssignSubjectModal={showAssignSubjectModal}
        handleAssignSubjectTeacherModalClose={
          handleAssignSubjectTeacherModalClose
        }
        setRefresh={setRefresh}
      />
      <AssignClassTeacher
        showAssignClassModal={showAssignClassModal}
        handleAssignClassTeacherModalClose={handleAssignClassTeacherModalClose}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export { TablesWidget53 };
