
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const MaintenanceLogsPage: FC = () => {
  return <div>MaintenanceLogs</div>;
};

const MaintenanceLogs: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.MaintenanceLogs" })}
      </PageTitle>
      <MaintenanceLogsPage />
    </>
  );
};


export { MaintenanceLogs };
