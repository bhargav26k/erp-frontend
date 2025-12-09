
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const SMSPage: FC = () => {
  return <div>SMS</div>;
};

const SMS: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.SMS" })}
      </PageTitle>
      <SMSPage />
    </>
  );
};


export { SMS };