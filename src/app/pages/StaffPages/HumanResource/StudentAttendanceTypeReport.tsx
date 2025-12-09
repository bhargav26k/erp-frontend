
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const StudentAttendanceTypeReportPage: FC = () => {
  return <div>StudentAttendanceTypeReport</div>;
};

const StudentAttendanceTypeReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.StudentAttendanceTypeReport" })}
      </PageTitle>
      <StudentAttendanceTypeReportPage />
    </>
  );
};


export { StudentAttendanceTypeReport };
