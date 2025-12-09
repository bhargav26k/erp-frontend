import React, { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
import { HeaderWrapper } from "../../../../_metronic/layout/components/header_staff";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import { useAuth } from "../../../modules/auth/core/Auth";
import { useLocation, useNavigate } from "react-router-dom";

// Define the interface for the topic
interface Topic {
  topic_id: string;
  topic_name: string;
}

// Utility hook to get query parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SelectTopicPage: FC = () => {
  const isAssignment = window.location.pathname.includes('lms-Assigmnent-management');

  const query = useQuery();
  const class_id = query.get("class_id");
  const section_id = query.get("section_id");
  const subject_id = query.get("subject_id");
  const lesson_id = query.get("lesson_id");
  const cssl_id = query.get("css_id");

  const { currentUser } = useAuth();
  const Navigate = useNavigate();
  const school_id = (currentUser as any)?.school_id;
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-alltopics/${cssl_id}/${school_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    if (cssl_id && school_id) {
      fetchTopics();
    }
  }, [cssl_id, school_id]);

  const handleCheckMaterials = (classId: string | null, sectionId: string | null, subjectId: string | null, lessonId: string | null, topicId: string) => {
    const queryParams = new URLSearchParams({
      class_id: classId || '',
      section_id: sectionId || '',
      subject_id: subjectId || '',
      lesson_id: lessonId || '',
      topic_id: topicId,
    }).toString();
    if (isAssignment) {
      Navigate(`/lms-Assigmnent-management/assignment-wise?${queryParams}`);
    } else {
      Navigate(`/lms-course-management/material-wise?${queryParams}`);
    }
  };

  return (
    <div>
      <HeaderWrapper toggleView={() => {}} />

      <Content>
        <div className="container">
          <div className="row">
            {topics.map((topic) => (
              <div className="col-md-12" key={topic.topic_id}>
                <div className="card mb-4">
                  <div className="card-body" style={{ background: '#F2F4F5' }}>
                    <h5 className="card-title" style={{
                      fontSize: "26px",
                      fontWeight: "700",
                      lineHeight: "21.86px",
                      color: "#424242",
                      fontFamily: 'Manrope',
                      marginBottom:'20px'
                    }}>
                      {topic.topic_name}
                    </h5>
                    <button
                      onClick={() => handleCheckMaterials(class_id, section_id, subject_id, lesson_id, topic.topic_id)}
                      className="btn border border-black"
                    >
                      {isAssignment ? "Check Assignments" : "Check Materials"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Content>
    </div>
  );
};

const SelectTopic: FC = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>

      <SelectTopicPage />
    </>
  );
};

export default SelectTopic;
