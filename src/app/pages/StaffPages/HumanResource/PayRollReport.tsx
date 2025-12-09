
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const PayRollReportPage: FC = () => {
  return <div>PayRollReport</div>;
};

const PayRollReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.PayRollReport" })}
      </PageTitle>
      <PayRollReportPage />
    </>
  );
};


export { PayRollReport };
