
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const EmailSMSLogPage: FC = () => {
  return <div>EmailSMSLog</div>;
};

const EmailSMSLog: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.EmailSMSLog" })}
      </PageTitle>
      <EmailSMSLogPage />
    </>
  );
};


export { EmailSMSLog };