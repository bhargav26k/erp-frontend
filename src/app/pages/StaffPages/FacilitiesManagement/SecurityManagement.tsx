
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const SecurityManagementPage: FC = () => {
  return <div>SecurityManagement</div>;
};

const SecurityManagement: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.SecurityManagement" })}
      </PageTitle>
      <SecurityManagementPage />
    </>
  );
};


export { SecurityManagement };
