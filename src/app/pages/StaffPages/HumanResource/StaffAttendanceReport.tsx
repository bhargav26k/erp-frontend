
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const StaffAttendanceReportPage: FC = () => {
  return <div>StaffAttendanceReport</div>;
};

const StaffAttendanceReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.StaffAttendanceReport" })}
      </PageTitle>
      <StaffAttendanceReportPage />
    </>
  );
};


export { StaffAttendanceReport };
