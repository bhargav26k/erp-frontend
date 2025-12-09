/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
import { HeaderWrapper } from "../../../../_metronic/layout/components/header_staff";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import { useAuth } from "../../../modules/auth/core/Auth";
import { useNavigate } from "react-router-dom";

interface Class {
  id: string;
  class: string;
  // Add other properties if needed
}

const SelectClassPage: FC = () => {
  const isAssignment = window.location.pathname.includes(
    "lms-Assigmnent-management"
  );
  const { currentUser } = useAuth();
  const Navigate = useNavigate();

  const school_id = (currentUser as any)?.school_id;
  const session_id = (currentUser as any)?.session_id;
  const [getClasses, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      /* @ts-ignore */

      const teacher_id = currentUser?.id;
      try {
        let response;
        if (currentUser?.roleName === "Teacher") {
          response = await fetch(
            `${DOMAIN}/api/school/get-allteacherclasses/${school_id}/${teacher_id}`
          );
        } else {
          response = await fetch(
            `${DOMAIN}/api/school/get-allclasses/${school_id}/${session_id}`
          );
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Class[] = await response.json();
        setClasses(data);
      } catch (error) {
        console.log("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [currentUser, school_id]);

  const handleCheckSections = (classId: string) => {
    if (isAssignment) {
      Navigate(`/lms-Assigmnent-management/select-sections/${classId}`);
    } else {
      Navigate(`/lms-course-management/select-sections/${classId}`);
    }
  };

  const handleCheckMaterials = (
    classId: string | null,
    sectionId = "",
    subjectId = "",
    lessonId = "",
    topicId = ""
  ) => {
    const queryParams = new URLSearchParams({
      class_id: classId || "",
      section_id: sectionId,
      subject_id: subjectId,
      lesson_id: lessonId,
      topic_id: topicId,
    }).toString();
    if (isAssignment) {
      Navigate(`/lms-Assigmnent-management/assignment-wise?${queryParams}`);
    } else {
      Navigate(`/lms-course-management/material-wise?${queryParams}`);
    }
  };

  return (
    <div className="">
      <Content>
        <div className="row" >
          <h1
            className="card-title"
            style={{
              fontSize: "26px",
              fontWeight: "500",
              lineHeight: "21.86px",
              color: "#1C325B",
              fontFamily: "Manrope",
              marginBottom: "20px",
            }}
          >
            Select Classes :
          </h1>
          {getClasses.map((cls) => (
            <div className="col-md-2" key={cls.id}>
              <div className="card mb-4" style={{ boxShadow:" 0px 4px 10px rgba(0, 0, 0, 0.1)"}}>
                <div
                  className="card-body"
                  style={{
                    background: "#F2F6FF",
                    justifyContent: "center",
                    display: "flex",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCheckSections(cls.id)}
                >
                  <h5
                    className="card-title"
                    style={{
                      fontSize: "26px",
                      fontWeight: "500",
                      lineHeight: "21.86px",
                      color: "#1C325B",
                      fontFamily: "Manrope",
                    }}
                  >
                    {cls.class}
                  </h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Content>
    </div>
  );
};

const SelectClass: FC = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>

      <SelectClassPage />
    </>
  );
};

export default SelectClass;
