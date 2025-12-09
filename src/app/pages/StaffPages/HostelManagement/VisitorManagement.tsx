
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const VisitorManagementPage: FC = () => {
  return <div>VisitorManagement</div>;
};

const VisitorManagement: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.VisitorManagement" })}
      </PageTitle>
      <VisitorManagementPage />
    </>
  );
};


export { VisitorManagement };
