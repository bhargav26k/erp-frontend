
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const AddStaffMemberPage: FC = () => {
  return <div>AddStaffMember</div>;
};

const AddStaffMember: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.AddStaffMember" })}
      </PageTitle>
      <AddStaffMemberPage />
    </>
  );
};


export { AddStaffMember };
