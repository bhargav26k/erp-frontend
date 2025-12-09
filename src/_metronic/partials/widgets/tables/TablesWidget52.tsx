import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Modal, Button } from "react-bootstrap";

interface CurrentUser {
  school_id: string;
  session_id: string;
  role_name: string;
}

const TablesWidget52 = () => {
  const [circulars, setCirculars] = useState<any[]>([]);
  const [selectedCircular, setSelectedCircular] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const { currentUser } = useAuth<CurrentUser>();
  const school_id = currentUser?.school_id;
  const session_id = currentUser?.session_id;

  useEffect(() => {
    const fetchCirculars = async () => {
      if (!school_id || !session_id) return;
      try {
        const response = await fetch(
          `${DOMAIN}/api/student/get-circulars/${school_id}/${session_id}`
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        // Only show public circulars
        const publicCirculars = data.filter(
          (c: any) => c.visibility === "public"
        );
        setCirculars(publicCirculars);
      } catch (err) {
        console.error("Error fetching circulars:", err);
      }
    };
    fetchCirculars();
  }, [school_id, session_id]);

  const formatDateCircular = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCircularClick = (c: any) => {
    setSelectedCircular(c);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedCircular(null);
  };

  return (
    <div
      className="announcement-board"
      style={{
        width: "100%",
        borderRadius: "16px",
        backgroundColor: "rgb(242, 246, 255)",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        padding: "20px",
        fontFamily: "Manrope",
      }}
    >
      <div
        className="announcement-header"
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
          Notice Board
        </span>
      </div>

      <div
        style={{
          height: "560px",
          overflowY: "auto",
          padding: "16px 0",
        }}
      >
        {circulars.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6c757d" }}>
            No public circulars available.
          </p>
        ) : (
          <ul
            style={{
              listStyleType: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {circulars.map((circular, idx) => (
              <li
                key={idx}
                style={{
                  backgroundColor: idx % 2 === 0 ? "#f9fafc" : "#ffffff",
                  padding: "20px",
                  borderRadius: "12px",
                  marginBottom: "10px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleCircularClick(circular)}
              >
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "16px",
                    color: "#1C335C",
                    fontFamily: "Manrope",
                  }}
                >
                  {circular.title || "Untitled Circular"}
                </span>
                <span
                  style={{
                    fontWeight: "400",
                    fontSize: "14px",
                    color: "#6c757d",
                    fontFamily: "Manrope",
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#e7f3ff",
                      color: "#1C335C",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontWeight: "500",
                    }}
                  >
                    Published on: {formatDateCircular(circular.start_date)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ───── Modal ───── */}
      <Modal
        show={showModal}
        onHide={closeModal}
        centered
        size="xl"
        scrollable={false}
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          style={{ backgroundColor: "#1C335C" }}
        >
          <Modal.Title style={{ color: "#fff" }}>
            {selectedCircular?.title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            fontFamily: "Manrope, sans-serif",
            padding: "20px",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {/* ─── Description ─── */}
          <div style={{ marginBottom: "1rem" }}>
            <strong>Description:</strong>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html:
                selectedCircular?.description ||
                "<p><em>No description.</em></p>",
            }}
          />

          {/* ─── Attachment Link (PDF or Image) ─── */}
          {selectedCircular?.document_path && (
            <div style={{ marginTop: "1.5rem" }}>
              <strong>Attachment:</strong>{" "}
              {selectedCircular.document_path
                .toLowerCase()
                .endsWith(".pdf") ? (
                <a
                  href={`${DOMAIN}${encodeURI(
                    selectedCircular.document_path
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginLeft: "0.5rem",
                    textDecoration: "none",
                    color: "#1C335C",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <i
                    className="bi bi-file-earmark-pdf-fill"
                    style={{ fontSize: "24px", color: "#e74c3c" }}
                  ></i>
                  {selectedCircular.document_path.split("/").pop()}
                </a>
              ) : (
                <a
                  href={`${DOMAIN}${encodeURI(
                    selectedCircular.document_path
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginLeft: "0.5rem",
                    textDecoration: "none",
                    color: "#1C335C",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <i
                    className="bi bi-image-fill"
                    style={{ fontSize: "24px", color: "#3498db" }}
                  ></i>
                  {selectedCircular.document_path.split("/").pop()}
                </a>
              )}
            </div>
          )}

          {/* ─── Classes ─── */}
          <div style={{ marginTop: "1.5rem" }}>
            <strong>Classes:</strong> {selectedCircular?.class_names}
          </div>

          {/* ─── Publish Date ─── */}
          <div style={{ marginTop: "1rem" }}>
            <strong>Publish Date:</strong>
            <br />
            <span style={{ color: "#4a4f55" }}>
              {formatDateCircular(selectedCircular?.publish_date)}
            </span>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={closeModal}
            style={{
              backgroundColor: "#dde2ed",
              color: "#1C335C",
              border: "none",
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export { TablesWidget52 };
