
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const DriverManagementPage: FC = () => {
  return <div>DriverManagement</div>;
};

const DriverManagement: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.DriverManagement" })}
      </PageTitle>
      <DriverManagementPage />
    </>
  );
};


export { DriverManagement };
