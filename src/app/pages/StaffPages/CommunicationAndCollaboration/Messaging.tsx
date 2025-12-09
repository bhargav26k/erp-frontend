
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const MessagingPage: FC = () => {
  return <div>Messaging</div>;
};

const Messaging: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.Messaging" })}
      </PageTitle>
      <MessagingPage />
    </>
  );
};


export { Messaging };
