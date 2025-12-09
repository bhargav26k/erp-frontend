
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const BackupPage: FC = () => {
  return <div>Backup</div>;
};

const Backup: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.Backup" })}
      </PageTitle>
      <BackupPage />
    </>
  );
};


export { Backup };
