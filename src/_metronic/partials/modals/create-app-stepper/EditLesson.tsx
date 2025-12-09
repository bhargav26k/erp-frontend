import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../../app/modules/auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

type SelectedLesson = {
  lessonName: string;
  css_id: string;
  lessonId: string;
};

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: any;
  selectedLesson: SelectedLesson | null; // Allowing null for better type safety
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const EditLesson = ({ show, handleClose, setRefresh, selectedLesson }: Props) => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;
  const session_id = currentUser?.session_id;
  const user_id = currentUser?.id;

  // Extracting data from selectedLesson with safe fallback
  const initialLessonName = selectedLesson?.lesson_name || "";
  const css_id = selectedLesson?.class_section_subject_lesson_id || "";
  const lessonId = selectedLesson?.lesson_id || "";

  const [lessonName, setLessonName] = useState(initialLessonName);

  useEffect(() => {
    if (initialLessonName) {
      setLessonName(initialLessonName); // Initialize with previous name
    }
  }, [initialLessonName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonName || !css_id || !lessonId) {
      alert("Please enter the Lesson name.");
      return;
    }
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/edit-lesson/${school_id}/${session_id}/${user_id}/${lessonId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lessonName,
            css_id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Lesson edited successfully!", result);
      handleClose(); // Close the modal after submission
      setRefresh(true);
    } catch (error) {
      console.error("Error editing lesson:", error);
    }
  };

  return createPortal(
    <Modal
      id="kt_modal_edit_lesson"
      tabIndex={-1}
      size="lg"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-500px"
      show={show}
      onHide={handleClose}
    >
      <div
        className="modal-header"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
          fontFamily: "Manrope",
          fontWeight: "500",
          fontSize: "14px",
        }}
      >
        <h2>Edit Lesson</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>
      <div className="modal-body" style={{ backgroundColor: "#F2F6FF" }}>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="edit_lesson_name">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Lesson Name
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Edit Lesson Name"
                    value={lessonName}
                    onChange={(e) => setLessonName(e.target.value)}
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                fontFamily: "Manrope",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Save Changes
            </button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { EditLesson };
