
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const FrontCMSSettingPage: FC = () => {
  return <div>FrontCMSSetting</div>;
};

const FrontCMSSetting: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FrontCMSSetting" })}
      </PageTitle>
      <FrontCMSSettingPage />
    </>
  );
};


export { FrontCMSSetting };
