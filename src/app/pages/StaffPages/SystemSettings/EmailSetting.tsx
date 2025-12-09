
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const EmailSettingPage: FC = () => {
  return <div>EmailSetting</div>;
};

const EmailSetting: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.EmailSetting" })}
      </PageTitle>
      <EmailSettingPage />
    </>
  );
};


export { EmailSetting };
