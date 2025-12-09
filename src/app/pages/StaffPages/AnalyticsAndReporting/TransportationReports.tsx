
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const TransportationReportsPage: FC = () => {
  return <div>TransportationReports</div>;
};

const TransportationReports: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.TransportationReports" })}
      </PageTitle>
      <TransportationReportsPage />
    </>
  );
};


export { TransportationReports };
