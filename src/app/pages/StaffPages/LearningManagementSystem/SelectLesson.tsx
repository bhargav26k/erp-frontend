import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import { useAuth } from "../../../modules/auth/core/Auth";
import { useLocation, useNavigate } from "react-router-dom";
import { AddLesson } from "../../../../_metronic/partials/modals/create-app-stepper/AddLesson";
import { EditLesson } from "../../../../_metronic/partials/modals/create-app-stepper/EditLesson";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

interface Lesson {
  lesson_id: string;
  lesson_name: string;
  class_section_subject_lesson_id: string;
  // add other properties if needed
}

const SelectLessonPage: FC = () => {
  const isAssignment = window.location.pathname.includes(
    "lms-Assigmnent-management"
  );
  const query = useQuery();
  const class_id = query.get("class_id");
  const sectionId = query.get("section_id");
  const subject_id = query.get("subject_id");
  const css_id = query.get("css_id");

  const { currentUser } = useAuth();
  const Navigate = useNavigate();
  const school_id = (currentUser as any)?.school_id;
  const [getLessons, setLessons] = useState<Lesson[]>([]);
  
  const [entityNames, setEntityNames] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-alllessons-portal/${css_id}/${school_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setLessons(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLessons();
  }, [css_id, school_id, refresh]);

  // const handleCheckLessons = (classId : string | null ,sectionId: string | null ,subjectId : string | null ,lessonId : string | null,class_section_subject_lesson_id : string | null) => {
  //   const queryParams = new URLSearchParams({
  //     class_id: classId || '',
  //     section_id: sectionId || '',
  //     subject_id:subjectId || '',
  //     lesson_id:lessonId || '',
  //     css_id:class_section_subject_lesson_id || ''
  //   }).toString();
  //   if (isAssignment) {
  //     Navigate(`/lms-Assigmnent-management/select-topics?${queryParams}`);
  //   } else {
  //     Navigate(`/lms-course-management/select-topics?${queryParams}`);
  //   }

  // };
  const handleContent = (
    classId: string | null,
    sectionId: string | null,
    subjectId: string | null,
    lessonId: string | null
  ) => {
    const queryParams = new URLSearchParams({
      class_id: classId || "",
      section_id: sectionId || "",
      subject_id: subjectId || "",
      lesson_id: lessonId || "",
    }).toString();
    Navigate(`/lms-course-management/material-wise?${queryParams}`);
  };
  const handleAssignment = (
    classId: string | null,
    sectionId: string | null,
    subjectId: string | null,
    lessonId: string | null
  ) => {
    const queryParams = new URLSearchParams({
      class_id: classId || "",
      section_id: sectionId || "",
      subject_id: subjectId || "",
      lesson_id: lessonId || "",
    }).toString();
    Navigate(`/lms-course-management/assignment-wise?${queryParams}`);
  };

  const handleDelete = () => {

    alert('hi')
  };

  // const handleClick = (value) => {
  //   Navigate(`/select-topics/${css_id}`)
  //   // fetchSections(value);
  // };

  const handleBack = () => {
    Navigate(-1);
  };

  const handleModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleEditModal = (cls) => {
    setSelectedLesson(cls);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setSelectedLesson(false);
    setShowEditModal(false);
  };

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-entity-names/${school_id}?class_id=${class_id}&section_id=${sectionId}&subject_id=${subject_id}&lesson_id=${null}`
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
    setRefresh(false);
  }, [class_id, sectionId, refresh]);

  return (
    <div className="">
      <Content>
        <div className="row">
          <h3
            style={{
              fontFamily: "Manrope",
              fontWeight: "500",
              fontSize: "16px",
              borderBottom: "1px solid lightgray",
              paddingBottom: "10px",
              width: "100%",
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
            </div>
            /{entityNames?.class_name} {"->"}
            {entityNames?.section_name} {"->"} {entityNames?.subject_name}
          </h3>
          <div className="container" style={{ padding: "10px" }}>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h1
                style={{
                  fontSize: "26px",
                  fontWeight: "500",
                  lineHeight: "21.86px",
                  color: "#1C325B",
                  fontFamily: "Manrope",
                }}
              >
                Select Lesson :
              </h1>
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
                  Add Lesson
                </span>
              </div>
            </div>
            <div className="row  mt-5 ">
              {getLessons.map((cls) => (
                <div className="col-md-12" key={cls.lesson_id}>
                  <div className="card mb-4">
                    <div
                      className="card-body"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#F2F4F5",
                        padding: "8px 25px",
                      }}
                    >
                      <h5
                        className="card-title"
                        style={{
                          fontSize: "20px",
                          fontWeight: "500",
                          lineHeight: "21.86px",
                          color: "#424242",
                          fontFamily: "Manrope",
                          // marginBottom:'20px'
                        }}
                      >
                        {cls.lesson_name}
                      </h5>
                      <div>
                        <button
                          onClick={() =>
                            handleContent(
                              class_id,
                              sectionId,
                              subject_id,
                              cls.lesson_id
                            )
                          }
                          className="btn border border-black m-2"
                        >
                          {"Upload / Check Materials"}
                        </button>
                        <button
                          onClick={() =>
                            handleAssignment(
                              class_id,
                              sectionId,
                              subject_id,
                              cls.lesson_id
                            )
                          }
                          className="btn border border-black m-2"
                        >
                          {"Upload / Check Assignment"}
                        </button>
                        <button
                          onClick={() => handleEditModal(cls)}
                          className="btn border border-black m-2"
                        >
                          {"Edit"}
                        </button>
                        <button
                          className={`btn border border-black m-2 ${
                            cls.has_content === 1 ? "btn-disabled" : ""
                          }`}
                          onClick={() =>
                            handleDelete(
                              class_id,
                              sectionId,
                              subject_id,
                              cls.lesson_id
                            )
                          }
                          disabled={cls.has_content === 1} // Disable the button if has_content is 1
                        >
                          Delete
                        </button>
                      </div>
                      {/* <button
                      onClick={() =>
                        handleCheckLessons(class_id,sectionId,subject_id,cls.lesson_id,cls.class_section_subject_lesson_id)
                      }
                      className="btn btn-success"
                    >
                      Go to Topics
                    </button> */}
                      {/* <button
                    onClick={() => handleClick(cls.id)}
                    className="btn btn-primary"
                  >
                    View More
                  </button> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <AddLesson
              show={showModal}
              handleClose={handleCloseModal}
              setRefresh={setRefresh}
              css_id={css_id}
            />
            <EditLesson
              show={showEditModal}
              handleClose={handleCloseEditModal}
              setRefresh={setRefresh}
              selectedLesson={selectedLesson}
            />
          </div>
        </div>
      </Content>
    </div>
  );
};

const SelectLesson: FC = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>

      <SelectLessonPage />
    </>
  );
};

export default SelectLesson;
