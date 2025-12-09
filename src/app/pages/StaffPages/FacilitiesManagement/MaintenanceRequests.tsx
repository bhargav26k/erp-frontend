
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const MaintenanceRequestsPage: FC = () => {
  return <div>MaintenanceRequests</div>;
};

const MaintenanceRequests: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.MaintenanceRequests" })}
      </PageTitle>
      <MaintenanceRequestsPage />
    </>
  );
};


export { MaintenanceRequests };
