
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const NotificationSettingPage: FC = () => {
  return <div>NotificationSetting</div>;
};

const NotificationSetting: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.NotificationSetting" })}
      </PageTitle>
      <NotificationSettingPage />
    </>
  );
};


export { NotificationSetting };
