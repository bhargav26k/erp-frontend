

import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const StudentTimelinePage: FC = () => {
  return <div> StudentTimelinePage</div>;
};

const StudentTimeline: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.StudentTimeline" })}
      </PageTitle>
      <StudentTimelinePage />
    </>
  );
};


export { StudentTimeline };