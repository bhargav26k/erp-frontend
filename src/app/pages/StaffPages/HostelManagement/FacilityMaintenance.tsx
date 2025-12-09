
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const FacilityMaintenancePage: FC = () => {
  return <div>FacilityMaintenance</div>;
};

const FacilityMaintenance: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FacilityMaintenance" })}
      </PageTitle>
      <FacilityMaintenancePage />
    </>
  );
};


export { FacilityMaintenance };
