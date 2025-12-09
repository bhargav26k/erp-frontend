import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CreateStudentTransection } from "../../../../_metronic/partials/modals/create-app-stepper/CreateStudentTransection";
import { CreateEditStudent } from "../../../../_metronic/partials/modals/create-app-stepper/CreateEditStudent";
import { CreateEditStudentUpload } from "../../../../_metronic/partials/modals/create-app-stepper/CreateEditStudentUpload";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Content } from "../../../../_metronic/layout/components/content";
import axios from "axios";
import { toast } from "react-toastify";
import { CloudHail } from "lucide-react";
import { ShowTransactions } from "../../../../_metronic/partials/modals/create-app-stepper/ShowTransactions";
import { AddRebate } from "../../../../_metronic/partials/modals/create-app-stepper/AddRebate";
import { EditStudentProfile } from "../../../../_metronic/partials/modals/create-app-stepper/EditStudentProfile";

interface ApplicationData {
  id: any;
  student_id: any;
  part_payment: any;
  has_transactions: boolean | undefined;
  group_name: string;
  pending_amount: number;
  student_fees_master_id: number;
  fee_group_id: number;
  invoice_number: string;
  fee_group_name: string;
  fee_session_group_id: string;
  total_amount: number;
  due_date: string;
  status: string;
  fine_amount: number;
  fine_type: string;
}

const StudentProfileView: React.FC = () => {
  const [student, setStudent] = useState<any[]>([]);
  const [fee, setFee] = useState<any[]>([]);

  const { currentUser } = useAuth();
  const school_id = (currentUser as any)?.school_id;
  const session_id = (currentUser as any)?.session_id;
  const [refresh, setRefresh] = useState(false);
  const [sessionId, setSessionId] = useState(0);
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedGroupData, setSelectedGroupData] =
    useState<ApplicationData | null>(null);

  const [studentPic, setStudentPic] = useState("");
  const [fatherPic, setFatherPic] = useState("");
  const [motherPic, setMotherPic] = useState("");
  const [guardianPic, setGuardianPic] = useState("");
  const [rebateModalOpen, setRebateModalOpen] = useState(false);
  const location = useLocation();
  const [studentId, setStudentId] = useState(0);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  // Extract the staff_id from the query params
  const params = new URLSearchParams(location.search);
  const student_id = params.get("id");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const handleEditModal = (student_id: number) => {
    setStudentId(student_id);
    setShowEditModal(true);
  };
  const handleCloseEditModal = (student_id: number) => {
    setStudentId(0);
    setShowEditModal(false);
  };

  const handleEditDocumentModal = (student_id: number) => {
    setStudentId(student_id);
    setShowEditDocumentModal(true);
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(
          `${DOMAIN}/api/school/get-student-details/${school_id}/${student_id}/${session_id}`
        );

        if (!response.data || response.data.length === 0) {
          console.warn("Empty response data");
          return;
        }

        const responseData = response.data;

        setStudent(responseData);
        setStudent_Pic(responseData[0]?.image || null);
        setFather_Pic(responseData[0]?.father_pic || null);
        setMother_Pic(responseData[0]?.mother_pic || null);
        setGuardian_Pic(responseData[0]?.guardian_pic || null);
        setSessionId(session_id);
        setRefresh(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStudent();
  }, [school_id, refresh, session_id]);

  useEffect(() => {
    // const fetchFees = async () => {
    //   try {
    //     const response = await fetch(
    //       `${DOMAIN}/api/school/get-studentwisefeegrouptype/${school_id}/${student_id}/${session_id}`
    //     );
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch data");
    //     }
    //     const responseData = await response.json();
    //     console.log(responseData);
    //     // Group fees by fee_group_id to align with your table structure
    //     const groupedFees = responseData.reduce((acc: any[], curr: any) => {
    //       const existingGroup = acc.find(
    //         (group) => group.fee_group_id === curr.fee_group_id
    //       );
    //       if (existingGroup) {
    //         existingGroup.fees.push(curr);
    //       } else {
    //         acc.push({
    //           fee_group_id: curr.fee_group_id,
    //           fee_group_name: curr.fee_group_name,
    //           fees: [curr],
    //         });
    //       }
    //       return acc;
    //     }, []);

    //     setFee(groupedFees);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };

    // fetchFees();

    const fetchFeeGroupType = async () => {
      try {
        const schoolId = school_id;
        const studentId = student_id;
        const sessionId = session_id;
        const url = `${DOMAIN}/api/school/get-student-feesgroup/${schoolId}/${studentId}/${sessionId}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Network response was not ok for URL: ${url}`);
        }

        const result = await response.json();

        if (result && result.data) {
          setFee(result.data);
          setRefresh(false);
        } else {
          console.error("Unexpected response structure:", result);
          toast.error("Unexpected response structure received.");
        }
      } catch (error) {
        console.error("Error fetching fee group/type data:", error);
        toast.error("Error fetching fee group/type data.");
      }
    };

    fetchFeeGroupType();
  }, [school_id, student_id, sessionId, refresh]);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  if (student.length === 0) {
    return <div>Loading...</div>;
  }

  const studentDetail = student[0]; // Assuming you're fetching one employee, adjust as necessary

  // useEffect(() => {
  //   const fetchStudentPic = async () => {
  //     try {
  //         const studentResponse = await fetch(
  //           `${DOMAIN}/api/school/get-student-pic`,
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({ student_pic: studentDetail.image }),
  //           }
  //         );
  //         if (!studentResponse.ok) {
  //           throw new Error(`Failed to fetch student picture!`);
  //         }
  //         const studentBlob = await studentResponse.blob();
  //         const studentImageObjectURL = URL.createObjectURL(studentBlob);
  //         setStudentPic(studentImageObjectURL);
  //     } catch (error) {
  //       console.error("Error fetching student picture:", error);
  //     }
  //   };

  //   fetchStudentPic();
  // }, []);

  // useEffect(() => {
  //   const fetchFatherPic = async () => {
  //     try {
  //       if (father_pic) {
  //         const fatherResponse = await fetch(
  //           `${DOMAIN}/api/school/get-father-pic`,
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({ father_pic: father_pic }),
  //           }
  //         );
  //         if (!fatherResponse.ok) {
  //           throw new Error(`Failed to fetch father picture!`);
  //         }
  //         const fatherBlob = await fatherResponse.blob();
  //         const fatherImageObjectURL = URL.createObjectURL(fatherBlob);
  //         setFatherPic(fatherImageObjectURL);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching father picture:", error);
  //     }
  //   };

  //   fetchFatherPic();
  // }, []);

  // useEffect(() => {
  //   const fetchMotherPic = async () => {
  //     try {
  //       if (mother_pic) {
  //         const motherResponse = await fetch(
  //           `${DOMAIN}/api/school/get-mother-pic`,
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({ mother_pic: mother_pic }),
  //           }
  //         );
  //         if (!motherResponse.ok) {
  //           throw new Error(`Failed to fetch mother picture!`);
  //         }
  //         const motherBlob = await motherResponse.blob();
  //         const motherImageObjectURL = URL.createObjectURL(motherBlob);
  //         setMotherPic(motherImageObjectURL);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching mother picture:", error);
  //     }
  //   };

  //   fetchMotherPic();
  // }, []);

  // useEffect(() => {
  //   const fetchGuardianPic = async () => {
  //     try {
  //       if (guardian_pic) {
  //         const guardianResponse = await fetch(
  //           `${DOMAIN}/api/school/get-guardian-pic`,
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({ guardian_pic: guardian_pic }),
  //           }
  //         );
  //         if (!guardianResponse.ok) {
  //           throw new Error(`Failed to fetch guardian picture!`);
  //         }
  //         const guardianBlob = await guardianResponse.blob();
  //         const guardianImageObjectURL = URL.createObjectURL(guardianBlob);
  //         setGuardianPic(guardianImageObjectURL);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching guardian picture:", error);
  //     }
  //   };

  //   fetchGuardianPic();
  // }, []);

  const openModal = (groupId: number) => {
    setSelectedGroupId(groupId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGroupId(null);
  };

  const openRebateModal = (groupId: number) => {
    setSelectedGroupId(groupId);
    const groupDetails =
      fee.find((group) => group.fee_group_id === groupId) || null;
    setSelectedGroupData(groupDetails);

    setRebateModalOpen(true);
  };

  const closeRebateModal = () => {
    setRebateModalOpen(false);
    setSelectedGroupId(null);
  };

  return (
    <Content>
      <div
        className="student-profile-container"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#F6F8FA",
          fontFamily: "Manrope",
          borderRadius: "10px",
          padding: "25px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h1
            style={{
              fontSize: "26px",
              fontFamily: "Manrope",
              fontWeight: "600",
            }}
          >
            {`${studentDetail.firstname} ${studentDetail.lastname}`}{" "}
            <span style={{ color: "grey" }}>Profile</span>
          </h1>

          <div
            onClick={() => handleEditModal(studentDetail.admission_no)}
            style={{
              display: "flex",
              width: "20vh",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px 15px",
              backgroundColor: "#1C335C",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.3s",
              marginRight: "5vh",
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
              Edit Profile
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
        {/* Tabs */}
        <div
          className="tabs"
          style={{
            width: "95%",
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            backgroundColor: "transparent",
            padding: "10px 20px",
          }}
        >
          {["Overview", "Fee Information", "Exam", "Documents", "Timeline"].map(
            (tab) => (
              <div
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => handleTabChange(tab)}
                style={{
                  padding: "12px 20px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: activeTab === tab ? "600" : "500",
                  fontFamily: "Manrope",
                  color: activeTab === tab ? "#1C335C" : "#666",
                  borderBottom:
                    activeTab === tab
                      ? "3px solid #1C335C"
                      : "3px solid transparent",
                  transition: "color 0.3s, border-bottom 0.3s",
                }}
              >
                {tab}
              </div>
            )
          )}
        </div>

        {/* Tab Content */}
        <div
          className="tab-content"
          style={{
            backgroundColor: "transparent",
          }}
        >
          {activeTab === "Overview" && (
            <div
              style={{
                display: "flex",
                width: "100%",
                gap: "20px",
              }}
            >
              {/* Left Column: 30% width */}
              <div
                style={{
                  width: "25%",
                  backgroundColor: "white",
                  borderRadius: "15px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "20px",
                  height: "fit-content",
                }}
              >
                {/* Profile Picture */}

                <div className="d-flex align-items-center">
                  <img
                    src={
                      studentDetail.gender === "Female"
                        ? "/media/icons/student_female.jpg"
                        : "/media/icons/student_male.jpg"
                    }
                    alt="Profile"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      border: "1px solid grey",
                      borderRadius: "50%", // Makes the image square
                      alignItems: "flex-start",
                      overflow: "hidden",
                    }}
                  />
                </div>

                <br />
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    fontFamily: "Manrope",
                  }}
                >{`${studentDetail.firstname} ${studentDetail.lastname}`}</h2>
                <hr style={{ width: "80%", height: "1px", color: "black" }} />
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        color: "#1C335C",
                        fontWeight: "600",
                        fontSize: "16px",
                        marginRight: "5px",
                        fontFamily: "Manrope",
                      }}
                    >
                      Admission No:
                    </span>
                    <span
                      style={{
                        color: "darkslategrey",
                        fontSize: "16px",
                        fontFamily: "Manrope",
                      }}
                    >
                      {studentDetail.admission_no}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        color: "#1C335C",
                        fontWeight: "600",
                        fontSize: "16px",
                        marginRight: "5px",
                        fontFamily: "Manrope",
                      }}
                    >
                      Student Id:
                    </span>
                    <span
                      style={{
                        color: "darkslategrey",
                        fontSize: "16px",
                        fontFamily: "Manrope",
                      }}
                    >
                      {studentDetail.gr_number || "N/A"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        color: "#1C335C",
                        fontWeight: "600",
                        fontSize: "16px",
                        marginRight: "5px",
                        fontFamily: "Manrope",
                      }}
                    >
                      Class:
                    </span>
                    <span
                      style={{
                        color: "darkslategrey",
                        fontSize: "16px",
                        fontFamily: "Manrope",
                      }}
                    >
                      {studentDetail.class || "N/A"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        color: "#1C335C",
                        fontWeight: "600",
                        fontSize: "16px",
                        marginRight: "5px",
                        fontFamily: "Manrope",
                      }}
                    >
                      Section:
                    </span>
                    <span
                      style={{
                        color: "darkslategrey",
                        fontSize: "16px",
                        fontFamily: "Manrope",
                      }}
                    >
                      {studentDetail.section || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: 70% width */}
              <div
                style={{
                  width: "75%",
                  backgroundColor: "white",
                  padding: "25px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  borderRadius: "15px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Personal Information */}

                <div
                  style={{
                    width: "100%",
                    padding: "0px",
                    margin: "0px",
                  }}
                >
                  <h2 className="fw-bold">Student Information</h2>
                  <hr />
                </div>
                <div style={{ width: "100%", display: "flex" }}>
                  <div
                    className=""
                    style={{
                      width: "50%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "#1C335C",
                          fontWeight: "600",
                          fontSize: "16px",
                          marginRight: "5px",
                          fontFamily: "Manrope",
                        }}
                      >
                        Email:
                      </span>
                      <span
                        style={{
                          color: "darkslategrey",
                          fontSize: "16px",
                          fontFamily: "Manrope",
                        }}
                      >
                        {studentDetail.email || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "#1C335C",
                          fontWeight: "600",
                          fontSize: "16px",
                          marginRight: "5px",
                          fontFamily: "Manrope",
                        }}
                      >
                        Aadhar No.:
                      </span>
                      <span
                        style={{
                          color: "darkslategrey",
                          fontSize: "16px",
                          fontFamily: "Manrope",
                        }}
                      >
                        {studentDetail.adhar_no || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "#1C335C",
                          fontWeight: "600",
                          fontSize: "16px",
                          marginRight: "5px",
                          fontFamily: "Manrope",
                        }}
                      >
                        Address:
                      </span>
                      <span
                        style={{
                          color: "darkslategrey",
                          fontSize: "16px",
                          fontFamily: "Manrope",
                        }}
                      >
                        {studentDetail.current_address ||
                          studentDetail.permanent_address ||
                          "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "#1C335C",
                          fontWeight: "600",
                          fontSize: "16px",
                          marginRight: "5px",
                          fontFamily: "Manrope",
                        }}
                      >
                        State:
                      </span>
                      <span
                        style={{
                          color: "darkslategrey",
                          fontSize: "16px",
                          fontFamily: "Manrope",
                        }}
                      >
                        {studentDetail.state || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "#1C335C",
                          fontWeight: "600",
                          fontSize: "16px",
                          marginRight: "5px",
                          fontFamily: "Manrope",
                        }}
                      >
                        Father's Name:
                      </span>
                      <span
                        style={{
                          color: "darkslategrey",
                          fontSize: "16px",
                          fontFamily: "Manrope",
                        }}
                      >
                        {studentDetail.father_name || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "#1C335C",
                          fontWeight: "600",
                          fontSize: "16px",
                          marginRight: "5px",
                          fontFamily: "Manrope",
                        }}
                      >
                        Mother's Name :
                      </span>
                      <span
                        style={{
                          color: "darkslategrey",
                          fontSize: "16px",
                          fontFamily: "Manrope",
                        }}
                      >
                        {studentDetail.mother_name || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Family Information */}
                  <div
                    className=""
                    style={{
                      width: "50%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "#1C335C",
                          fontWeight: "600",
                          fontSize: "16px",
                          marginRight: "5px",
                          fontFamily: "Manrope",
                        }}
                      >
                        Phone No.:
                      </span>
                      <span
                        style={{
                          color: "darkslategrey",
                          fontSize: "16px",
                          fontFamily: "Manrope",
                        }}
                      >
                        {studentDetail.mobileno || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "#1C335C",
                          fontWeight: "600",
                          fontSize: "16px",
                          marginRight: "5px",
                          fontFamily: "Manrope",
                        }}
                      >
                        Gender:
                      </span>
                      <span
                        style={{
                          color: "darkslategrey",
                          fontSize: "16px",
                          fontFamily: "Manrope",
                        }}
                      >
                        {studentDetail.gender || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "#1C335C",
                          fontWeight: "600",
                          fontSize: "16px",
                          marginRight: "5px",
                          fontFamily: "Manrope",
                        }}
                      >
                        City:
                      </span>
                      <span
                        style={{
                          color: "darkslategrey",
                          fontSize: "16px",
                          fontFamily: "Manrope",
                        }}
                      >
                        {studentDetail.city || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "#1C335C",
                          fontWeight: "600",
                          fontSize: "16px",
                          marginRight: "5px",
                          fontFamily: "Manrope",
                        }}
                      >
                        Blood Group:
                      </span>
                      <span
                        style={{
                          color: "darkslategrey",
                          fontSize: "16px",
                          fontFamily: "Manrope",
                        }}
                      >
                        {studentDetail.blood_group || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "#1C335C",
                          fontWeight: "600",
                          fontSize: "16px",
                          marginRight: "5px",
                          fontFamily: "Manrope",
                        }}
                      >
                        Father's Mobile:
                      </span>
                      <span
                        style={{
                          color: "darkslategrey",
                          fontSize: "16px",
                          fontFamily: "Manrope",
                        }}
                      >
                        {studentDetail.father_phone || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "#1C335C",
                          fontWeight: "600",
                          fontSize: "16px",
                          marginRight: "5px",
                          fontFamily: "Manrope",
                        }}
                      >
                        Mother's Mobile:
                      </span>
                      <span
                        style={{
                          color: "darkslategrey",
                          fontSize: "16px",
                          fontFamily: "Manrope",
                        }}
                      >
                        {studentDetail.mother_phone || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Documents" && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  flexDirection: "column",
                  padding: "20px",
                  backgroundColor: "transparent",
                }}
              >
                <table
                  className="table"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Light shadow
                    border: "2px #58749A", // Dotted border for the table
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: "#fff", // Dark background for header
                        borderBottom: "2px #58749A", // Dotted border for header
                        fontFamily: "Manrope",
                        fontWeight: "600",
                        color: "#58749A", // Lighter text color
                        fontSize: "16px",
                      }}
                    >
                      {[
                        "Student Pic",
                        "Father Pic",
                        "Mother Pic",
                        "Guardian Pic",
                        "Action",
                      ].map((header) => (
                        <th
                          key={header}
                          style={{
                            padding: "16px",
                            textAlign: "center",
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      style={{
                        backgroundColor: "#EAF4FC", // Dark background for rows
                        borderBottom: "1px #58749A", // Dotted border for rows
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        color: "#58749A", // Lighter text color
                      }}
                    >
                      {[studentPic, fatherPic, motherPic, guardianPic].map(
                        (pic, index) => (
                          <td
                            key={index}
                            style={{
                              padding: "16px",
                              textAlign: "center",
                            }}
                          >
                            <img
                              src={pic || "https://via.placeholder.com/100"}
                              alt="Profile"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "10px",
                                border: "2px #58749A", // Dotted border for images
                              }}
                            />
                          </td>
                        )
                      )}
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          onClick={() =>
                            handleEditDocumentModal(studentDetail.id)
                          }
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "12px 16px",
                            backgroundColor: "#58749A", // Light background for button
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
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
                            Edit Documents
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
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "Exam" && <></>}

          {activeTab === "Timeline" && <></>}
          {activeTab === "Fee Information" && (
            <>
              <table
                className="table"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "10px",
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
                    <th style={{ padding: "12px 20px", textAlign: "left" }}>
                      Invoice No
                    </th>
                    <th style={{ padding: "12px 20px", textAlign: "left" }}>
                      Fee Group
                    </th>
                    <th style={{ padding: "12px 20px", textAlign: "center" }}>
                      Total Amount
                    </th>
                    <th style={{ padding: "12px 20px", textAlign: "left" }}>
                      Due Date
                    </th>
                    <th style={{ padding: "12px 20px", textAlign: "left" }}>
                      Status
                    </th>
                    <th style={{ padding: "12px 20px", textAlign: "left" }}>
                      Paid Amount
                    </th>
                    <th style={{ padding: "12px 20px", textAlign: "left" }}>
                      Transaction Date
                    </th>
                    <th style={{ padding: "12px 20px", textAlign: "left" }}>
                      {school_id?.slice(0, 3) === "INN"
                        ? "Administrative Charges"
                        : "Fine Amount"}
                    </th>
                    <th style={{ padding: "12px 20px", textAlign: "left" }}>
                      Rebate Amount
                    </th>

                    <th style={{ padding: "12px 20px", textAlign: "center" }}>
                      Pending Amount
                    </th>
                    <th style={{ padding: "12px 20px", textAlign: "center" }}>
                      View Transactions History
                    </th>
                    <th style={{ padding: "12px 20px", textAlign: "center" }}>
                      Edit Rebate
                    </th>
                    {/* <th
                      style={{
                        padding: "12px 20px",
                        textAlign: "left",
                      }}
                    >
                      Allow 60%
                    </th> */}
                    {/* <th style={{ padding: "12px 20px", textAlign: "center" }}>
                      Action
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {fee.map((item) => {
                    const currentDate = new Date();
                    const dueDate = item.due_date
                      ? new Date(item.due_date)
                      : null;
                    const isOverdue =
                      dueDate &&
                      currentDate > dueDate &&
                      item.status !== "paid";

                    const statusStyles = {
                      paid: { backgroundColor: "#4CAF50", color: "white" }, // Green for Paid
                      partial: { backgroundColor: "#FFC107", color: "black" }, // Yellow for Partial
                      pending: { backgroundColor: "#F44336", color: "white" }, // Red for Pending
                    };
                    return (
                      <tr
                        key={item.fee_group_id}
                        style={{
                          backgroundColor:
                            item.fee_group_id % 2 === 0
                              ? "rgb(242, 246, 255)"
                              : "#FFFFFF",
                          borderBottom: "1px solid #E0E4F0",
                          fontFamily: "Manrope",
                          fontSize: "14px",
                          color: "#1C335C",
                        }}
                      >
                        <td style={{ padding: "12px 20px" }}>
                          {item.invoice_number || "N/A"}
                        </td>
                        <td style={{ padding: "12px 20px" }}>
                          {item.group_name || "N/A"}
                        </td>
                        <td
                          style={{ padding: "12px 20px", textAlign: "center" }}
                        >
                          {currentUser?.currency_symbol +
                            " " +
                            item.total_amount}
                        </td>
                        <td style={{ padding: "12px 20px" }}>
                          {item.due_date
                            ? new Date(item.due_date).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td
                          style={{
                            padding: "12px 20px",
                            fontWeight: "bold",
                            textAlign: "start",
                          }}
                        >
                          <span
                            style={{
                              padding: "6px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "bold",
                              fontFamily: "Manrope",
                              ...statusStyles[item.status.toLowerCase()],
                            }}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td
                          style={{ padding: "12px 20px", textAlign: "center" }}
                        >
                          {currentUser?.currency_symbol +
                            " " +
                            item.amount_paid}
                        </td>
                        <td
                          style={{
                            padding: "12px 20px",
                            textAlign: "start",
                          }}
                        >
                          {item.transaction_date
                            ? new Date(
                                item.transaction_date
                              ).toLocaleDateString()
                            : "NA"}
                        </td>
                        <td
                          style={{ padding: "12px 20px", textAlign: "center" }}
                        >
                          +{" "}
                          {currentUser?.currency_symbol +
                            " " +
                            Number(item.fine_amount).toFixed(2) || 0}
                          {isOverdue && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#FF0000",
                                fontFamily: "Manrope",
                                fontWeight: "500",
                              }}
                            >
                              {item.days_late} days overdue
                            </div>
                          )}
                        </td>
                        <td
                          style={{ padding: "12px 20px", textAlign: "center" }}
                        >
                          -{" "}
                          {currentUser?.currency_symbol +
                            " " +
                            Number(item.rebate_amount).toFixed(2)}
                        </td>

                        <td
                          style={{ padding: "12px 20px", textAlign: "center" }}
                        >
                          {currentUser?.currency_symbol +
                            " " +
                            Number(item.pending_amount)}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          <i
                            className="fas fa-eye"
                            style={{ cursor: "pointer" }}
                            onClick={() => openModal(item.fee_group_id)}
                          ></i>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <i
                            className="fas fa-cash-register"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              item.status !== "paid" &&
                              openRebateModal(item.fee_group_id)
                            }
                          ></i>
                        </td>
                        {/* <td>
                        <Form.Check
                          type="switch"
                          checked={
                            changedPartPayment[item.fee_group_id] !== undefined
                              ? changedPartPayment[item.fee_group_id]
                              : checkedPartPayment[item.fee_group_id]
                          } // Ensure the checkbox reflects the correct state
                          onChange={() => handlePartialCheck(item)}
                          disabled={item.has_transactions}
                          style={{ padding: "2px", textAlign: "center" }}
                        />
                      </td> */}
                        {/* <td
                        style={{
                          display: "flex",
                          gap: "10px", // Adds space between the buttons
                          justifyContent: "right", // Aligns buttons horizontally in the center
                          alignItems: "center", // Vertically centers the buttons
                          padding: "12px 20px",
                        }}
                      >
                        <div
                          // onClick={() =>
                          //   item.status !== "paid" &&
                          //   openCollectOfflineModal(item.fee_group_id)
                          // }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px",
                            backgroundColor:
                              item.status === "paid" ? "#A9A9A9" : "#1C335C", // Gray color for disabled state
                            borderRadius: "8px",
                            cursor:
                              item.status === "paid"
                                ? "not-allowed"
                                : "pointer", // Change cursor style for disabled state
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
                            Collect Offline
                          </span>
                        </div>
                        <div
                          // onClick={() =>
                          //   item.status !== "paid" &&
                          //   paymentGatewayDetails &&
                          //   createPaymentLink(
                          //     item.fee_group_id,
                          //     item.part_payment
                          //   )
                          // }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px",
                            // backgroundColor:
                            //   item.status === "paid" || !paymentGatewayDetails
                            //     ? "#A9A9A9"
                            //     : "#4CAF50", // Gray color for disabled state
                            borderRadius: "8px",
                            // cursor:
                              // item.status === "paid" || !paymentGatewayDetails
                              //   ? "not-allowed"
                              //   : "pointer", // Change cursor style for disabled state
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
                            Create Link
                          </span>
                        </div>
                      </td> */}
                      </tr>
                    );
                  })}
                </tbody>
                {/* <tfoot>
                  <tr>
                    <td
                      colSpan={12}
                      style={{
                        padding: "12px 20px",
                        textAlign: "right",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#1C335C",
                      }}
                    >
                      Total Items: {fee.length}
                    </td>
                  </tr>
                </tfoot> */}
              </table>
            </>
          )}
        </div>
      </div>
      <EditStudentProfile
              show={showEditModal}
              handleClose={handleCloseEditModal}
              student_id={student_id}
              setRefresh={setRefresh}
            />

      <ShowTransactions
        // studentFeesMasterId={studentFeesMasterId}
        show={isModalOpen}
        onHide={closeModal}
        groupId={selectedGroupId}
        studentId={student_id}
      />
      <AddRebate
        show={rebateModalOpen}
        handleClose={closeRebateModal}
        selectedGroupData={selectedGroupData}
        setRefresh={setRefresh}
      />
    </Content>
  );
};

export default StudentProfileView;
