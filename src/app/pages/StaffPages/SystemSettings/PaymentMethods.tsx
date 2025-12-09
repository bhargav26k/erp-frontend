
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const PaymentMethodsPage: FC = () => {
  return <div>PaymentMethods</div>;
};

const PaymentMethods: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.PaymentMethods" })}
      </PageTitle>
      <PaymentMethodsPage />
    </>
  );
};


export { PaymentMethods };
