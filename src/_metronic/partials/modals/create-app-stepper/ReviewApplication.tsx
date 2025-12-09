import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "react-bootstrap";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";

type Props = {
  show: boolean;
  handleClose: () => void;
  enqId: string | undefined;
  isReviwed: string | undefined;
  setRefresh: (refresh: boolean) => void;
  noaccept: boolean;
};

interface AdmissionEnquiryData {
  admission_enquiry_id: string;
  school_id: string;
  student_name: string;
  student_phone: string;
  student_address: string;
  student_email: string;
  status: string;
  class: string;
  gender: string;
  date_of_birth: string | null;
  current_school: string;
  session_id: string;
  father_name: string;
  father_phone: string;
  mother_name: string;
  mother_phone: string;
  blood_group: string;
  height_cm: number | null;
  weight_kg: number | null;
  aadhar_number: string;
  wrestling_level: string;
  previous_training_center: string;
  training_duration: string;
  tournaments_participated: string;
  student_photo?: string;
  father_photo?: string;
}

const modalsRoot = document.getElementById("root-modals") || document.body;

const ReviewApplication = ({
  show,
  handleClose,
  enqId,
  setRefresh,
  isReviwed,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;
  const sessionId = currentUser?.session_id;
  const [data, setData] = useState<AdmissionEnquiryData[]>([]);
  const accept = data[0]?.status;
  const [studentProfile, setStudentProfile] = useState<string>("");
  const [fatherProfile, setFatherProfile] = useState<string>("");
  console.log(data);

  useEffect(() => {
    if (!enqId || !schoolId) return;
    const fetchApplication = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-application-review/${schoolId}/${enqId}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching application review data:", error);
      }
    };
    fetchApplication();
  }, [schoolId, enqId]);

  const handleCloseModal = () => {
    setData([]);
    handleClose();
  };

  const handleAccept = async (
    schoolId: string,
    admission_enquiry_id: string,
  ) => {
    setLoading(true);
    try {
      const school_id = schoolId;
      const response = await fetch(
        `${DOMAIN}/api/school/application-accept/${school_id}/${admission_enquiry_id}/${sessionId}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      console.log("Application accepted successfully:", result);
      handleClose();
      setRefresh(true);
    } catch (error) {
      console.error("Error accepting application:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!data.length || !data[0]) return;

    console.log("Data[0]:", data[0]);

    const fetchImage = async (
      endpoint: string,
      body: object,
      setter: (url: string) => void
    ) => {
      try {
        const res = await fetch(
          `${DOMAIN}/api/school/${endpoint}/${schoolId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
        if (!res.ok) throw new Error("Image fetch failed");
        const blob = await res.blob();
        setter(URL.createObjectURL(blob));
      } catch (err) {
        console.error(err);
      }
    };

    if (data[0].student_profile) {
      console.log("Student photo:", data[0].student_profile);
      fetchImage(
        "get_admission_student_photo",
        { student_photo: data[0].student_profile},
        setStudentProfile
      );
    } else {
      console.log("⚠️ No student_photo field in data[0]");
    }

    if (data[0].father_profile) {
      console.log("Father photo:", data[0].father_profile);
      fetchImage(
        "get_admission_father_photo",
        { father_photo: data[0].father_profile},
        setFatherProfile
      );
    } else {
      console.log("⚠️ No father_photo field in data[0]");
    }
  }, [data, schoolId]);

  const DocumentField = ({
    label,
    value,
    colSpan = "col-md-4",
  }: {
    label: string;
    value: string | number | null;
    colSpan?: string;
  }) => (
    <div
      className={colSpan}
      style={{ paddingLeft: "8px", paddingRight: "8px" }}
    >
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            fontSize: "12px",
            color: "#666",
            fontWeight: "500",
            marginBottom: "4px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "#333",
            fontWeight: "500",
            padding: "8px 0",
            borderBottom: "1px solid #e1e5e9",
            minHeight: "24px",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {value || "N/A"}
        </div>
      </div>
    </div>
  );

  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      size="xl"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered"
      show={show}
      onHide={handleCloseModal}
      style={{ zIndex: 1055 }}
    >
      <div
        className="modal-content"
        style={{
          border: "none",
          borderRadius: "12px",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {/* Header */}
        <div
          className="modal-header"
          style={{
            backgroundColor: "#1e3a8a",
            color: "white",
            borderBottom: "none",
            padding: "20px 30px",
            position: "relative",
          }}
        >
          <div style={{ textAlign: "center", width: "100%" }}>
            <h3 style={{ margin: "0", fontWeight: "600", fontSize: "20px" }}>
              ADMISSION APPLICATION REVIEW
            </h3>
            <p style={{ margin: "8px 0 0 0", fontSize: "14px", opacity: 0.9 }}>
              Academic Session Review Document
            </p>
          </div>
          <div
            className="btn btn-sm btn-icon"
            onClick={handleCloseModal}
            style={{
              position: "absolute",
              right: "20px",
              top: "20px",
              color: "white",
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "6px",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <i className="fas fa-times" style={{ fontSize: "12px" }}></i>
          </div>
        </div>

        <div
          className="modal-body"
          style={{ padding: "0", backgroundColor: "#f8fafc" }}
        >
          {data.map((item, index) => (
            <div key={index} style={{ backgroundColor: "white", margin: "0" }}>
              {/* Application Summary Banner */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                  color: "white",
                  padding: "20px 40px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h4
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "24px",
                      fontWeight: "600",
                      color: "#fff",
                    }}
                  >
                    {item.student_name}
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      gap: "24px",
                      fontSize: "14px",
                      opacity: 0.9,
                    }}
                  >
                    <span>
                      <strong>{schoolId === "AMO-2509097151" ? "Group :" : "Class :"}</strong> {item.class}
                    </span>
                    <span>
                      <strong>Session:</strong> {item.session_id}
                    </span>
                    <span>
                      <strong>Application ID:</strong>{" "}
                      {item.admission_enquiry_id}
                    </span>
                  </div>
                </div>
                {isReviwed === "isReviewed" && (
                  <div
                    style={{
                      backgroundColor: "#10b981",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    ✓ Approved
                  </div>
                )}
              </div>

              {/* Photos Section */}
              <div
                style={{
                  padding: "24px 40px",
                  backgroundColor: "#f8fafc",
                  borderBottom: "2px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    borderLeft: "4px solid #7c3aed",
                    paddingLeft: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <h5
                    style={{
                      margin: "0",
                      color: "#7c3aed",
                      fontWeight: "600",
                      fontSize: "16px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Photographs
                  </h5>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "40px",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Student Photo */}
                  <div
                    style={{
                      textAlign: "center",
                      backgroundColor: "white",
                      padding: "20px",
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      border: "1px solid #e5e7eb",
                      minWidth: "200px",
                    }}
                  >
                    <div
                      style={{
                        width: "150px",
                        height: "180px",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px auto",
                        border: "2px solid #e5e7eb",
                        overflow: "hidden",
                      }}
                    >
                      {studentProfile ? (
                        <img
                          src={studentProfile}
                          alt="Student"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            textAlign: "center",
                            color: "#6b7280",
                            fontSize: "12px",
                          }}
                        >
                          <i
                            className="fas fa-user"
                            style={{ fontSize: "24px", marginBottom: "8px" }}
                          ></i>
                          <br />
                          Student Photo
                          <br />
                          Not Available
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Student Photo
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginTop: "4px",
                      }}
                    >
                      {item.student_name}
                    </div>
                  </div>

                  {/* Father Photo */}
                  <div
                    style={{
                      textAlign: "center",
                      backgroundColor: "white",
                      padding: "20px",
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      border: "1px solid #e5e7eb",
                      minWidth: "200px",
                    }}
                  >
                    <div
                      style={{
                        width: "150px",
                        height: "180px",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px auto",
                        border: "2px solid #e5e7eb",
                        overflow: "hidden",
                      }}
                    >
                      {fatherProfile ? (
                        <img
                          src={fatherProfile}
                          alt="Father"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            textAlign: "center",
                            color: "#6b7280",
                            fontSize: "12px",
                          }}
                        >
                          <i
                            className="fas fa-user-tie"
                            style={{ fontSize: "24px", marginBottom: "8px" }}
                          ></i>
                          <br />
                          Father Photo
                          <br />
                          Not Available
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Father Photo
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginTop: "4px",
                      }}
                    >
                      {item.father_name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Content */}
              <div
                style={{
                  padding: "24px",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                }}
              >
                {/* Student Information Section */}
                <div style={{ marginBottom: "32px" }}>
                  <div
                    style={{
                      borderLeft: "4px solid #1e3a8a",
                      paddingLeft: "16px",
                      marginBottom: "20px",
                    }}
                  >
                    <h5
                      style={{
                        margin: "0",
                        color: "#1e3a8a",
                        fontWeight: "600",
                        fontSize: "16px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Student Information
                    </h5>
                  </div>
                  <div className="row" style={{ margin: "0" }}>
                    <DocumentField
                      label="Full Name"
                      value={item.student_name}
                    />
                    <DocumentField
                      label="Contact Number"
                      value={item.student_phone}
                    />
                    <DocumentField
                      label="Email Address"
                      value={item.student_email}
                    />
                    <DocumentField label="Gender" value={item.gender} />
                    <DocumentField
                      label="Date of Birth"
                      value={
                        item.date_of_birth
                          ? new Date(item.date_of_birth).toLocaleDateString(
                              "en-GB"
                            )
                          : "N/A"
                      }
                    />
                    <DocumentField
                      label="Blood Group"
                      value={item.blood_group}
                    />
                    <DocumentField
                      label="Aadhar Number"
                      value={item.aadhar_number}
                      colSpan="col-md-6"
                    />
                    <DocumentField
                      label="Current School"
                      value={item.current_school}
                      colSpan="col-md-6"
                    />
                    <DocumentField
                      label="Residential Address"
                      value={item.student_address}
                      colSpan="col-md-12"
                    />
                  </div>
                </div>

                {/* Guardian Information Section */}
                <div style={{ marginBottom: "32px" }}>
                  <div
                    style={{
                      borderLeft: "4px solid #059669",
                      paddingLeft: "16px",
                      marginBottom: "20px",
                    }}
                  >
                    <h5
                      style={{
                        margin: "0",
                        color: "#059669",
                        fontWeight: "600",
                        fontSize: "16px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Guardian Information
                    </h5>
                  </div>
                  <div className="row" style={{ margin: "0" }}>
                    <DocumentField
                      label="Father's Name"
                      value={item.father_name}
                      colSpan="col-md-6"
                    />
                    <DocumentField
                      label="Father's Contact"
                      value={item.father_phone}
                      colSpan="col-md-6"
                    />
                    <DocumentField
                      label="Mother's Name"
                      value={item.mother_name}
                      colSpan="col-md-6"
                    />
                    <DocumentField
                      label="Mother's Contact"
                      value={item.mother_phone}
                      colSpan="col-md-6"
                    />
                  </div>
                </div>

                {/* Physical & Training Information Section */}
                <div style={{ marginBottom: "32px" }}>
                  <div
                    style={{
                      borderLeft: "4px solid #d97706",
                      paddingLeft: "16px",
                      marginBottom: "20px",
                    }}
                  >
                    <h5
                      style={{
                        margin: "0",
                        color: "#d97706",
                        fontWeight: "600",
                        fontSize: "16px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Physical & Training Details
                    </h5>
                  </div>
                  <div className="row" style={{ margin: "0" }}>
                    <DocumentField
                      label="Height"
                      value={item.height_cm ? `${item.height_cm} cm` : "N/A"}
                    />
                    <DocumentField
                      label="Weight"
                      value={item.weight_kg ? `${item.weight_kg} kg` : "N/A"}
                    />
                    <DocumentField
                      label="Wrestling Level"
                      value={item.wrestling_level}
                    />
                    <DocumentField
                      label="Previous Training Center"
                      value={item.previous_training_center}
                      colSpan="col-md-6"
                    />
                    <DocumentField
                      label="Training Duration"
                      value={item.training_duration}
                      colSpan="col-md-6"
                    />
                    <DocumentField
                      label="Tournaments Participated"
                      value={item.tournaments_participated}
                      colSpan="col-md-12"
                    />
                  </div>
                </div>

                {/* Action Section */}
                <div
                  style={{
                    borderTop: "2px solid #e5e7eb",
                    paddingTop: "24px",
                    textAlign: "center",
                    marginTop: "40px",
                  }}
                >
                  {isReviwed === "isReviewed" ? (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        backgroundColor: "#10b981",
                        color: "white",
                        padding: "12px 24px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        gap: "8px",
                      }}
                    >
                      <i className="fas fa-check-circle"></i>
                      APPLICATION APPROVED
                    </div>
                  ) : (
                    <button
                      className="btn"
                      onClick={() =>
                        handleAccept(item.school_id, item.admission_enquiry_id)
                      }
                      disabled={accept === "isSubmitted" || loading}
                      style={{
                        backgroundColor: loading ? "#94a3b8" : "#10b981",
                        color: "white",
                        border: "none",
                        padding: "12px 32px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (!loading && accept !== "isSubmitted") {
                          e.currentTarget.style.backgroundColor = "#059669";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading && accept !== "isSubmitted") {
                          e.currentTarget.style.backgroundColor = "#10b981";
                        }
                      }}
                    >
                      {loading ? (
                        <>
                          <i
                            className="fas fa-spinner fa-spin"
                            style={{ marginRight: "8px" }}
                          ></i>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i
                            className="fas fa-check"
                            style={{ marginRight: "8px" }}
                          ></i>
                          {accept === "isSubmitted"
                            ? "Application Approved"
                            : "Approve Application"}
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Document Footer */}
                <div
                  style={{
                    marginTop: "40px",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "12px",
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "20px",
                  }}
                >
                  <p style={{ margin: "0" }}>
                    This document contains confidential information. Generated
                    on {new Date().toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { ReviewApplication };
