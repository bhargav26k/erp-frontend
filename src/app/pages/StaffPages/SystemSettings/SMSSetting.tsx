
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const SMSSettingPage: FC = () => {
  return <div>SMS Setting</div>;
};

const SMSSetting: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.SMSSetting" })}
      </PageTitle>
      <SMSSettingPage />
    </>
  );
};


export { SMSSetting };
