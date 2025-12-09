
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ScheduleManagementPage: FC = () => {
  return <div>ScheduleManagement</div>;
};

const ScheduleManagement: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ScheduleManagement" })}
      </PageTitle>
      <ScheduleManagementPage />
    </>
  );
};


export { ScheduleManagement };
