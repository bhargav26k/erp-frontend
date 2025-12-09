
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const InventoryManagmentPage: FC = () => {
  return <div>InventoryManagment</div>;
};

const InventoryManagment: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.InventoryManagment" })}
      </PageTitle>
      <InventoryManagmentPage />
    </>
  );
};


export { InventoryManagment };
