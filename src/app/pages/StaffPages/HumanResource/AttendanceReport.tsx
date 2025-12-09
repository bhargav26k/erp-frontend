
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const AttendanceReportPage: FC = () => {
  return <div>AttendanceReport</div>;
};

const AttendanceReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.AttendanceReport" })}
      </PageTitle>
      <AttendanceReportPage />
    </>
  );
};


export { AttendanceReport };
