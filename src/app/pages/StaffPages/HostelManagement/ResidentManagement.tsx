
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ResidentManagementPage: FC = () => {
  return <div>ResidentManagement</div>;
};

const ResidentManagement: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ResidentManagement" })}
      </PageTitle>
      <ResidentManagementPage />
    </>
  );
};


export { ResidentManagement };
