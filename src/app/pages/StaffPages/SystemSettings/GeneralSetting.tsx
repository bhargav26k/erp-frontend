
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const GeneralSettingPage: FC = () => {
  return <div>GeneralSetting</div>;
};

const GeneralSetting: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.GeneralSetting" })}
      </PageTitle>
      <GeneralSettingPage />
    </>
  );
};


export { GeneralSetting };
