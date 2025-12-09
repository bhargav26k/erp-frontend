
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const InventoryManagementPage: FC = () => {
  return <div>InventoryManagement</div>;
};

const InventoryManagement: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.InventoryManagement" })}
      </PageTitle>
      <InventoryManagementPage />
    </>
  );
};


export { InventoryManagement };
