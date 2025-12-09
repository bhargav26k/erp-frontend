
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const RouteManagementPage: FC = () => {
  return <div>RouteManagement</div>;
};

const RouteManagement: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.RouteManagement" })}
      </PageTitle>
      <RouteManagementPage />
    </>
  );
};


export { RouteManagement };
