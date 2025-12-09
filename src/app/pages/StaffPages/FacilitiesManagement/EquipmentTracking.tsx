
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const EquipmentTrackingPage: FC = () => {
  return <div>EquipmentTracking</div>;
};

const EquipmentTracking: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.EquipmentTracking" })}
      </PageTitle>
      <EquipmentTrackingPage />
    </>
  );
};


export { EquipmentTracking };
