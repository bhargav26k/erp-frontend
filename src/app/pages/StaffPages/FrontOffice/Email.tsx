
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const EmailPage: FC = () => {
  return <div>Email</div>;
};

const Email: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.Email" })}
      </PageTitle>
      <EmailPage />
    </>
  );
};


export { Email };