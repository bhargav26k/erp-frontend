
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const TransportReportPage: FC = () => {
  return <div>TransportReport</div>;
};

const TransportReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.TransportReport" })}
      </PageTitle>
      <TransportReportPage/>
    </>
  );
};


export { TransportReport };
