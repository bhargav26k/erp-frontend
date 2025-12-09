
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const UserDirectoryPage: FC = () => {
  return <div>UserDirectory</div>;
};

const UserDirectory: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.UserDirectory" })}
      </PageTitle>
      <UserDirectoryPage />
    </>
  );
};


export { UserDirectory };
