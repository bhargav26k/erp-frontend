
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const VehicleManagementPage: FC = () => {
  return <div>VehicleManagement</div>;
};

const VehicleManagement: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.VehicleManagement" })}
      </PageTitle>
      <VehicleManagementPage />
    </>
  );
};


export { VehicleManagement };
