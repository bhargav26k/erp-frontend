import React from 'react';
import { HeaderWrapper } from '../../../../_metronic/layout/components/header_staff';
import { Content } from '../../../../_metronic/layout/components/content';
import { TablesWidget39 } from '../../../../_metronic/partials/widgets';
import { useLocation } from 'react-router-dom';

// Custom hook to parse query parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ClassWiseAssignment: React.FC = () => {
  const query = useQuery();
  const class_id = query.get('class_id') || '';
  const section_id = query.get('section_id') || '';
  const subject_id = query.get('subject_id') || '';
  const lesson_id = query.get('lesson_id') || '';
  const topic_id = query.get('topic_id') || '';
  return (
    <div className="">
      <HeaderWrapper toggleView={() => {}} />
      <Content>
        <TablesWidget39
          classId={class_id}
          sectionId={section_id}
          subjectId={subject_id}
          lessonId={lesson_id}
          topicId={topic_id}
        />
      </Content>
    </div>
  );
};

export default ClassWiseAssignment;
