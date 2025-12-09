
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const StudentPerformanceReportsPage: FC = () => {
  return <div>StudentPerformanceReports</div>;
};

const StudentPerformanceReports: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.StudentPerformanceReports" })}
      </PageTitle>
      <StudentPerformanceReportsPage />
    </>
  );
};


export { StudentPerformanceReports };
