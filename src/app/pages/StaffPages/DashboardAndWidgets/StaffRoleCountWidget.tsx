
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const StaffRoleCountWidgetPage: FC = () => {
  return <div>StaffRoleCountWidget</div>;
};

const StaffRoleCountWidget: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.StaffRoleCountWidget" })}
      </PageTitle>
      <StaffRoleCountWidgetPage />
    </>
  );
};


export { StaffRoleCountWidget };
