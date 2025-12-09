
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const AttendanceReportsPage: FC = () => {
  return <div>AttendanceReports</div>;
};

const AttendanceReports: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.AttendanceReports" })}
      </PageTitle>
      <AttendanceReportsPage />
    </>
  );
};


export { AttendanceReports };
