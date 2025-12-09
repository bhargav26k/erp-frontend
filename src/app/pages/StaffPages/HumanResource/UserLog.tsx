
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const UserLogPage: FC = () => {
  return <div>UserLog</div>;
};

const UserLog: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.UserLog" })}
      </PageTitle>
      <UserLogPage />
    </>
  );
};


export { UserLog };
