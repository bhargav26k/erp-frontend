
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const EnergyManagementPage: FC = () => {
  return <div>EnergyManagement</div>;
};

const EnergyManagement: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.EnergyManagement" })}
      </PageTitle>
      <EnergyManagementPage />
    </>
  );
};


export { EnergyManagement };
