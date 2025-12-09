
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const StudentTodayAttendanceWidegtsPage: FC = () => {
  return <div>StudentTodayAttendanceWidegts</div>;
};

const StudentTodayAttendanceWidegts: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.StudentTodayAttendanceWidegts" })}
      </PageTitle>
      <StudentTodayAttendanceWidegtsPage />
    </>
  );
};


export { StudentTodayAttendanceWidegts };
