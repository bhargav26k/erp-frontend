
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const HostelAttendancePage: FC = () => {
  return <div>HostelAttendance</div>;
};

const HostelAttendance: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HostelAttendance" })}
      </PageTitle>
      <HostelAttendancePage />
    </>
  );
};


export { HostelAttendance };
