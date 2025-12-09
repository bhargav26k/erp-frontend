
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const UserStatusPage: FC = () => {
  return <div>UserStatus</div>;
};

const UserStatus: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.UserStatus" })}
      </PageTitle>
      <UserStatusPage />
    </>
  );
};


export { UserStatus };
