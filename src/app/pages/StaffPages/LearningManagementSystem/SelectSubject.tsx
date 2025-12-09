/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
import { HeaderWrapper } from "../../../../_metronic/layout/components/header_staff";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import { useAuth } from "../../../modules/auth/core/Auth";
import { useLocation, useNavigate } from "react-router-dom";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

interface Subject {
  subject_id: string;
  subject_name: string;
  class_section_subject_id: string;
  // add other properties if needed
}

const SelectSubjectPage: FC = () => {
  const isAssignment = window.location.pathname.includes(
    "lms-Assigmnent-management"
  );

  const query = useQuery();
  const class_id = query.get("class_id");
  const sectionId = query.get("section_id");
  const class_section_id = query.get("class_section_id");

  const { currentUser } = useAuth();
  const Navigate = useNavigate();
  /* @ts-ignore */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const school_id = (currentUser as any)?.school_id;
  const [getSubjects, setSubjects] = useState<Subject[]>([]);
  const [entityNames, setEntityNames] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      /* @ts-ignore */

      const teacher_id = currentUser?.id;
      try {
        let response;
        if (currentUser?.roleName == "Teacher") {
          response = await fetch(
            `${DOMAIN}/api/school/get-allteachersubjects/${school_id}/${teacher_id}/${class_section_id}`
          );
        } else {
          response = await fetch(
            `${DOMAIN}/api/school/get-allsubjects/${class_section_id}/${school_id}`
          );
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setSubjects(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSubjects();
  }, [class_section_id, school_id]);

  const handleCheckLessons = (
    classId: string | null,
    sectionId: string | null,
    subjectId: string | null,
    class_section_subject_id: string | null
  ) => {
    const queryParams = new URLSearchParams({
      class_id: classId || "",
      section_id: sectionId || "",
      subject_id: subjectId || "",
      css_id: class_section_subject_id || "",
    }).toString();
    if (isAssignment) {
      Navigate(`/lms-Assigmnent-management/select-lessons?${queryParams}`);
    } else {
      Navigate(`/lms-course-management/select-lessons?${queryParams}`);
    }
  };
  const handleCheckMaterials = (
    classId: string | null,
    sectionId: string | null,
    subjectId: string | null,
    lessonId = "",
    topicId = ""
  ) => {
    const queryParams = new URLSearchParams({
      class_id: classId || "",
      section_id: sectionId || "",
      subject_id: subjectId || "",
      lesson_id: lessonId,
      topic_id: topicId,
    }).toString();

    if (isAssignment) {
      Navigate(`/lms-Assigmnent-management/assignment-wise?${queryParams}`);
    } else {
      Navigate(`/lms-course-management/material-wise?${queryParams}`);
    }
  };

  const handleBack = () => {
    Navigate(-1);
  };

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-entity-names/${school_id}?class_id=${class_id}&section_id=${sectionId}&subject_id=${null}&lesson_id=${null}`
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
  }, [class_id, sectionId]);

  // const handleClick = (value) => {
  //   const css_id = value;

  //   Navigate(`/select-lessons/${css_id}`)
  // };

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
            /{entityNames?.class_name}
            {"->"}
            {entityNames?.section_name}
          </h3>
          <div className="container" style={{padding:'10px'}}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <h1
                style={{
                  fontSize: "26px",
                  fontWeight: "500",
                  lineHeight: "21.86px",
                  color: "#1C325B",
                  fontFamily: "Manrope",
                }}
              >
                Select Subjects :
              </h1>
            </div>
            <div className="row mt-5">
              {getSubjects.map((cls) => (
                <div className="col-md-2" key={cls.subject_id}>
                  <div
                    className="card mb-4"
                    style={{ boxShadow: " 0px 4px 10px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div
                      className="card-body"
                      style={{
                        background: "#F2F6FF",
                        justifyContent: "center",
                        display: "flex",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleCheckLessons(
                          class_id,
                          sectionId,
                          cls.subject_id,
                          cls.class_section_subject_id
                        )
                      }
                    >
                      <h5
                        className="card-title"
                        style={{
                          fontSize: "26px",
                          fontWeight: "500",
                          lineHeight: "21.86px",
                          color: "#424242",
                          fontFamily: "Manrope",
                        }}
                      >
                        {cls.subject_name}
                      </h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
};

const SelectSubject: FC = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>

      <SelectSubjectPage />
    </>
  );
};

export default SelectSubject;
