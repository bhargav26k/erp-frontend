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
import { Modal, Button } from "react-bootstrap";
import "../../../partials/modals/create-app-stepper/style.css";

interface Session {
  id: number;
  name: string;
  session: string;
}

interface Class {
  class_id: number;
  class: string;
}
interface Section {
  id: number;
  section: string;
}
const TablesWidget54 = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [classId, setClassId] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionId, setSectionId] = useState<Section[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionId, setSessionId] = useState<Session[]>([]);

  const [filteredData, setFilteredData] = useState([]);
  
  const { currentUser } = useAuth();

  const school_id = (currentUser as any)?.school_id;
  const promote_type = (currentUser as any)?.promote_type;

  // Next set of dropdowns
  const [nextClasses, setNextClasses] = useState<Class[]>([]);
  const [nextClassId, setNextClassId] = useState<string>("");
  const [nextSections, setNextSections] = useState<Section[]>([]);
  const [nextSectionId, setNextSectionId] = useState<string>("");
  const [nextSessions, setNextSessions] = useState<Session[]>([]);
  const [nextSessionId, setNextSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isApiLoading, setisApiLoading] = useState(false);
  const [isFeeMasterReady, setIsFeeMasterReady] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  // const handleModal = () => {
  //   setShowModal(true);
  // };
  // const handleModalClose = () => {
  //   setShowModal(false);
  // };

  const [paymentGatewayDetails, setPaymentGateway] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const secretKey = paymentGatewayDetails?.secret_key || "";

  useEffect(() => {
    const fetchPaymentGateway = async () => {
      if (!school_id) {
        setError("School ID is required.");
        setLoading(false);
        return;
      }
      const schoolId = school_id;
      try {
        setLoading(true);
        const response = await fetch(
          `${DOMAIN}/api/school/get-active-payment-gateway/${schoolId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        setPaymentGateway(data.paymentGateways[0]);
      } catch (err) {
        console.error("Error fetching payment gateway:", err);
        setError(err.message || "Failed to fetch payment gateway details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentGateway();
  }, [school_id]);

  useEffect(() => {
    const fetchClassesForSession = async () => {
      try {
        if (!sessionId) {
          console.log("Waiting for sessionId to be available...");
          return;
        }

        const response = await fetch(
          `${DOMAIN}/api/school/get-classes-for-session/${school_id}/${sessionId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch classes for sessionId");
        }

        const responseData = await response.json();
        setClasses(responseData);
      } catch (error) {
        console.error("Error fetching classes for sessionId:", error);
      }
    };

    fetchClassesForSession();
  }, [school_id, sessionId]);

  useEffect(() => {
    const fetchClassesForNextSession = async () => {
      try {
        if (!nextSessionId) {
          console.log("Waiting for nextSessionId to be available...");
          return;
        }

        const response = await fetch(
          `${DOMAIN}/api/school/get-classes-for-next-session/${school_id}/${nextSessionId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch classes for nextSessionId");
        }

        const responseData = await response.json();
        setNextClasses(responseData);
      } catch (error) {
        console.error("Error fetching classes for nextSessionId:", error);
      }
    };

    fetchClassesForNextSession();
  }, [school_id, nextSessionId]);

  useEffect(() => {
    const fetchSections = async () => {
      if (!classId) return;
      try {
        const class_id = classId;
        const response = await fetch(
          `${DOMAIN}/api/school/get-classwise-section/${class_id}/${school_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setSections(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSections();
  }, [classId]);

  useEffect(() => {
    const fetchNextSections = async () => {
      if (!nextClassId) return;
      try {
        const class_id = nextClassId;
        const response = await fetch(
          `${DOMAIN}/api/school/get-classwise-section/${class_id}/${school_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setNextSections(data);
      } catch (error) {
        console.error("Error fetching next sections:", error);
      }
    };
    if (nextClassId) fetchNextSections();
  }, [nextClassId, school_id]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const session_id = sessionId;
        const response = await fetch(
          `${DOMAIN}/api/school/get-class-section-session-wise-students/${classId}/${sectionId}/${session_id}/${school_id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();

        const defaultData = responseData.map((student) => ({
          student_id: student.admission_no, // Only include gr_number
          student_name: student.firstname + " " + student.lastname,
          father_name: student.father_name,
          student_email: student.email,
          dob: student.dob,
          result: "Pass", // Default to "Pass"
          sessionStatus: "Continue", // Default to "Continue"
          status: "Loading..."
        }));

        setFilteredData(defaultData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStudents();
  }, [school_id, sectionId, sessionId]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-onlysessions/${school_id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        setSessions(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSessions();
  }, [school_id]);

  useEffect(() => {
    const fetchNextSessions = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-onlynextsessions/${school_id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        console.log(responseData);

        setNextSessions(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNextSessions();
  }, [school_id]);

  const handleSectionSelected = (e) => {
    const section_id = e.target.value;
    setSectionId(section_id); // Update selected section state
  };
  const handleSessionSelected = (e) => {
    const section_id = e.target.value;
    setSessionId(section_id); // Update selected section state
  };

  const handleClassSelected = (e) => {
    const class_id = e.target.value;
    setClassId(class_id);
  };

  const handleNextClassSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNextClassId(e.target.value);
  };

  const handleNextSectionSelected = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setNextSectionId(e.target.value);
  };

  const handleNextSessionSelected = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setNextSessionId(e.target.value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (student_id, fieldName, value) => {
    setFilteredData((prevData) =>
      prevData.map((student) => {
        if (student.student_id === student_id) {
          const isActuallyModified = student[fieldName] !== value; // Only mark as modified if value changes

          return {
            ...student,
            [fieldName]: value,
            isModified: isActuallyModified, // Reset isModified if value is unchanged
          };
        }
        return student;
      })
    );
  };

  const checkFeeMasterAndPreviousData = async () => {
    try {
      setIsLoading(true); // Show loader
  
      // Basic checks to ensure you have all required IDs
      if (!nextClassId || !nextSessionId || !school_id) {
        setShowNoticeModal(true);
        setIsLoading(false);
        return;
      }
  
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 3000));
  
      // URLs needed for fetch calls
      const feeMasterUrl = `${DOMAIN}/api/school/check-fee-master/${nextClassId}/${nextSessionId}/${school_id}`;
      const promotedStudentsUrl = `${DOMAIN}/api/school/get-promoted-students/${nextSessionId}/${nextClassId}/${school_id}`;
  
      let feeMasterResponse, promotedStudentsResponse, feeMasterResult, promotedStudentsResult;
  
      if (promote_type === 1) {
        // ✅ If promote_type is 1, skip checking fee master
        //    Only fetch the promoted students data
        promotedStudentsResponse = await fetch(promotedStudentsUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
  
        if (!promotedStudentsResponse.ok) {
          throw new Error("Failed to fetch promoted students.");
        }
  
        promotedStudentsResult = await promotedStudentsResponse.json();
  
        // If you still want to mark `isFeeMasterReady` in some default way:
        setIsFeeMasterReady(true); // or false, depending on your preference
      } else {
        // ✅ If promote_type is not 1, check fee master and fetch promoted students
        [feeMasterResponse, promotedStudentsResponse] = await Promise.all([
          fetch(feeMasterUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
          fetch(promotedStudentsUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
        ]);
  
        if (!feeMasterResponse.ok || !promotedStudentsResponse.ok) {
          throw new Error("Failed to check fee master or fetch promoted students.");
        }
  
        feeMasterResult = await feeMasterResponse.json();
        if (!feeMasterResult.isFeeMasterCreated) {
          setShowNoticeModal(true);
          setIsLoading(false);
          return;
        }
  
        setIsFeeMasterReady(feeMasterResult.isFeeMasterCreated || false);
  
        promotedStudentsResult = await promotedStudentsResponse.json();
      }
  
      // Merge Promoted Students Data with existing data
      setFilteredData((prevData) =>
        prevData.map((student) => {
          const promotedStudent = promotedStudentsResult.find(
            (p) => p.student_id === student.student_id
          );
          return promotedStudent
            ? {
                ...student,
                status: promotedStudent.status || "Not Initiated",
                result: promotedStudent.current_result || "pass",
                sessionStatus: promotedStudent.next_session_status || "continue",
                isPromoted: true, // Mark existing promoted students
                isModified: false, // Reset modifications when fetching data
              }
            : {
                ...student,
                isPromoted: false, // Mark new students as NOT promoted
                isModified: false, // Reset modifications
              };
        })
      );
    } catch (error) {
      console.error(
        "Error checking fee master and fetching previous data:",
        error.message
      );
      setShowNoticeModal(true);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    if (nextClassId && nextSectionId && nextSessionId) {
      checkFeeMasterAndPreviousData();
    }
  }, [nextClassId, nextSectionId, nextSessionId]);

  const handleSave = async () => {
    if (!isFeeMasterReady) {
      setShowNoticeModal(true);
      return;
    }

    setisApiLoading(true);

    // ✅ Identify New Students: Default values + Modifications (if any)
    const newStudents = filteredData
      .filter((student) => !student.isPromoted) // ✅ Newly promoted students
      .map((student) => ({
        student_id: student.student_id,
        student_name: student.student_name,
        student_email: student.student_email,
        result: student.isModified ? student.result?.toLowerCase() : "pass", // ✅ Default "pass" if not modified
        sessionStatus: student.isModified
          ? student.sessionStatus?.toLowerCase()
          : "continue", // ✅ Default "continue" if not modified
      }));

    // ✅ Identify Modified Students (Previously Promoted)
    const modifiedStudents = filteredData
      .filter((student) => student.isPromoted && student.isModified) // ✅ Already promoted & Modified
      .map((student) => ({
        student_id: student.student_id,
        student_name: student.student_name,
        student_email: student.student_email,
        result: student.result?.toLowerCase(),
        sessionStatus: student.sessionStatus?.toLowerCase(),
      }));

    // ✅ Merge both groups
    const studentsToSend = [...newStudents, ...modifiedStudents];

    if (studentsToSend.length === 0) {
      alert("No changes detected for promotion.");
      setisApiLoading(false);
      return;
    }

    const payload = {
      nextSelection: {
        nextClassId,
        nextSectionId,
        nextSessionId,
        secretKey: secretKey,
        promoteType: promote_type
      },
      students: studentsToSend,
    };

    const schoolId = (currentUser as any)?.school_id;
    const userId = (currentUser as any)?.id;

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/initiate-promote-student/${schoolId}/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to promote students");
      }

      const result = await response.json();
      console.log("Promotion successful:", result);

      // ✅ After saving, refresh but keep updated values intact
      setTimeout(() => {
        setisApiLoading(false);
        alert("Students promoted successfully!");
        checkFeeMasterAndPreviousData(); // ✅ Refresh data after saving
      }, 3000);
    } catch (error) {
      console.error("Error promoting students:", error);
      setTimeout(() => {
        setisApiLoading(false);
        alert("An error occurred while promoting students. Please try again.");
      }, 3000);
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
          padding: "15px 20px",
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
          Promote Students In Next Session
        </span>
        <div
          style={{
            display: "flex",
            gap: "10px",
            width: "80%",
            justifyContent: "right",
            alignItems: "center",
            fontFamily: "Manrope",
            fontSize: "20px",
          }}
        >
          <div
            className="input-group flex-nowrap"
            style={{
              width: "350px",
              height: "45px",
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
            style={{
              display: "flex",
              gap: "10px",
              // marginBottom: "20px",
              width: "45%",
              // justifyContent: "left",
            }}
          >
            <select
              value={sessionId || ""}
              onChange={handleSessionSelected}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "100%",
                backgroundColor: "#fff",
              }}
              className="form-select"
            >
              <option value="">Select Session</option>
              {sessions.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.session}
                </option>
              ))}
            </select>
            <select
              value={classId || ""}
              onChange={handleClassSelected}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "100%",
                backgroundColor: "#fff",
              }}
              className="form-select"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.class_id} value={cls.class_id}>
                  {cls.class}
                </option>
              ))}
            </select>

            <select
              value={sectionId || ""}
              onChange={handleSectionSelected}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "100%",
                backgroundColor: "#fff",
              }}
              className="form-select"
            >
              <option value="">Select Section</option>
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.section}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div
        className="card-header"
        style={{
          backgroundColor: "rgb(242, 246, 255)",
          padding: "15px 20px 0px 20px",
          // borderBottom: "1px solid #E0E4F0",
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
          Select Criteria :
        </span>
        <div
          style={{
            display: "flex",
            gap: "10px",
            width: "80%",
            justifyContent: "right",
            alignItems: "center",
            fontFamily: "Manrope",
            fontSize: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              // marginBottom: "20px",
              width: "45%",
              // justifyContent: "left",
            }}
          >
            <select
              value={nextSessionId}
              onChange={handleNextSessionSelected}
              className="form-select"
            >
              <option value="">Select Next Session</option>
              {nextSessions.map((sess) => (
                <option key={sess.id} value={sess.id}>
                  {sess.session}
                </option>
              ))}
            </select>
            <select
              value={nextClassId}
              onChange={handleNextClassSelected}
              className="form-select"
            >
              <option value="">Select Next Class</option>
              {nextClasses.map((cls) => {
                const currentClass = classes.find(
                  (c) => c.class_id == classId
                )?.class; // Get selected class name
                const currentClassNumber = parseInt(
                  currentClass.replace(/\D/g, ""),
                  10
                ); // Extract number from class name (e.g., "Class 3" → 3)
                const nextClassNumber = parseInt(
                  cls.class.replace(/\D/g, ""),
                  10
                ); // Extract number from next class name

                return (
                  <option
                    key={cls.class_id}
                    value={cls.class_id}
                    disabled={
                      cls.class === currentClass ||
                      nextClassNumber <= currentClassNumber // Disable same or lower class
                    }
                  >
                    {cls.class}
                  </option>
                );
              })}
            </select>

            <select
              value={nextSectionId}
              onChange={handleNextSectionSelected}
              className="form-select"
            >
              <option value="">Select Next Section</option>
              {nextSections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.section}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div
        style={{
          height: "580px", // Fixed height for the table container
          overflowY: "auto", // Enable vertical scrolling
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
              <th style={{ padding: "12px 20px", textAlign: "center" }}>
                Student Id
              </th>
              <th style={{ padding: "12px 20px", textAlign: "center" }}>
                Student Name
              </th>
              <th style={{ padding: "12px 20px", textAlign: "center" }}>
                Father's Name
              </th>
              <th style={{ padding: "12px 20px", textAlign: "center" }}>
                Promote Status
              </th>
              <th style={{ padding: "12px 20px", textAlign: "center" }}>
                Current Result
              </th>
              <th style={{ padding: "12px 20px", textAlign: "center" }}>
                Next Session Status
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <h3
                    style={{
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    No Data Please Select Class and Section
                  </h3>
                </td>
              </tr>
            ) : (
              <>
                {filteredData.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? "rgb(242, 246, 255)" : "#FFFFFF",
                      borderBottom: "1px solid #E0E4F0",
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      opacity:
                        item.isPromoted &&
                        item.status === 'success'
                          ? 0.5
                          : 1, // ✅ Reduce opacity for disabled state
                      pointerEvents:
                        item.isPromoted &&
                         item.status === 'success'
                          ? "none"
                          : "auto", // ✅ Disable interactivity
                    }}
                  >
                    <td style={{ textAlign: "center", padding: "12px 20px" }}>
                      {item.student_id}
                    </td>
                    <td style={{ textAlign: "center", padding: "12px 20px" }}>
                      {item.student_name}
                    </td>
                    <td style={{ textAlign: "center", padding: "12px 20px" }}>
                      {item.father_name}
                    </td>
                    <td style={{ textAlign: "center", padding: "12px 20px" }}>
                      {item.status}
                    </td>
                    <td style={{ textAlign: "center", padding: "12px 20px" }}>
                      <div
                        style={{
                          minWidth: "200px",
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <label style={{ marginLeft: "10px" }}>
                          <input
                            type="radio"
                            name={`result-${index}`}
                            disabled={!isFeeMasterReady || isLoading}
                            value="Fail"
                            checked={item.result?.toLowerCase() === "fail"} // Ensure case sensitivity
                            onChange={() =>
                              handleInputChange(
                                item.student_id,
                                "result",
                                "Fail"
                              )
                            }
                          />{" "}
                          Fail
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`result-${index}`}
                            disabled={!isFeeMasterReady || isLoading}
                            value="Pass"
                            checked={item.result?.toLowerCase() === "pass"} // Ensure case sensitivity
                            onChange={() =>
                              handleInputChange(
                                item.student_id,
                                "result",
                                "Pass"
                              )
                            }
                          />{" "}
                          Pass
                        </label>
                      </div>
                    </td>

                    <td style={{ textAlign: "center", padding: "12px 20px" }}>
                      <div
                        style={{
                          minWidth: "200px",
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <label style={{ marginLeft: "10px" }}>
                          <input
                            type="radio"
                            name={`sessionStatus-${index}`}
                            disabled={!isFeeMasterReady || isLoading}
                            value="Leave"
                            checked={
                              item.sessionStatus?.toLowerCase() === "leave"
                            } // Ensure case sensitivity
                            onChange={() =>
                              handleInputChange(
                                item.student_id,
                                "sessionStatus",
                                "Leave"
                              )
                            }
                          />{" "}
                          Leave
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`sessionStatus-${index}`}
                            disabled={!isFeeMasterReady || isLoading}
                            value="Hold"
                            checked={
                              item.sessionStatus?.toLowerCase() === "hold"
                            } // Ensure case sensitivity
                            onChange={() =>
                              handleInputChange(
                                item.student_id,
                                "sessionStatus",
                                "Hold"
                              )
                            }
                          />{" "}
                          Hold
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`sessionStatus-${index}`}
                            disabled={!isFeeMasterReady || isLoading}
                            value="Continue"
                            checked={
                              item.sessionStatus?.toLowerCase() === "continue"
                            } // Ensure case sensitivity
                            onChange={() =>
                              handleInputChange(
                                item.student_id,
                                "sessionStatus",
                                "Continue"
                              )
                            }
                          />{" "}
                          Continue
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
      <div
        style={{
          margin: "10px",
          width: "100%",
          display: "flex",
          justifyContent: "end",
        }}
      >
        <button
          style={{
            alignSelf: "center",
            padding: "8px 16px",
            backgroundColor: isLoading
              ? "#ddd"
              : isFeeMasterReady
              ? "#4CAF50"
              : "#ccc",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading
              ? "wait"
              : !isFeeMasterReady
              ? "not-allowed"
              : "pointer",
            fontSize: "14px",
          }}
          onClick={handleSave}
          disabled={!isFeeMasterReady || isLoading}
        >
          {isLoading ? "Processing..." : "Save All"}
        </button>
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="loader"></div>
            <p className="loading-text">
              Checking fee master for the next session, please wait!
            </p>
          </div>
        </div>
      )}
      {isApiLoading && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="loader"></div>
            <p className="loading-text">
              Updating Database For you, please wait!
            </p>
          </div>
        </div>
      )}

      <Modal show={showNoticeModal} onHide={() => setShowNoticeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Notice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Sorry, you cannot promote students to the selected criteria. You
            need to set up the fee master for the next session and selected
            class first.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowNoticeModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export { TablesWidget54 };
