
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const StaffPerformanceReportsPage: FC = () => {
  return <div>StaffPerformanceReports</div>;
};

const StaffPerformanceReports: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.StaffPerformanceReports" })}
      </PageTitle>
      <StaffPerformanceReportsPage />
    </>
  );
};


export { StaffPerformanceReports };
