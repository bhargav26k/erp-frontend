
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const FeesAwaitingPaymentWidegtsPage: FC = () => {
  return <div>FeesAwaitingPaymentWidegts</div>;
};

const FeesAwaitingPaymentWidegts: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FeesAwaitingPaymentWidegts" })}
      </PageTitle>
      <FeesAwaitingPaymentWidegtsPage />
    </>
  );
};


export { FeesAwaitingPaymentWidegts };
