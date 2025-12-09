


import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const AttendenceTrackingPage: FC = () => {
  return <div>AttendenceTracking</div>;
};

const AttendenceTracking: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.AttendenceTracking" })}
      </PageTitle>
      <AttendenceTrackingPage />
    </>
  );
};


export { AttendenceTracking };
