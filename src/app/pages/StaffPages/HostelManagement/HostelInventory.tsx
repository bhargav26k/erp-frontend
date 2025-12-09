
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const HostelInventoryPage: FC = () => {
  return <div>HostelInventory</div>;
};

const HostelInventory: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HostelInventory" })}
      </PageTitle>
      <HostelInventoryPage />
    </>
  );
};


export { HostelInventory };
