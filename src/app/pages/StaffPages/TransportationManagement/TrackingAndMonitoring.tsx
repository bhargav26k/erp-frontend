
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const TrackingAndMonitoringPage: FC = () => {
  return <div>TrackingAndMonitoring</div>;
};

const TrackingAndMonitoring: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.TrackingAndMonitoring" })}
      </PageTitle>
      <TrackingAndMonitoringPage />
    </>
  );
};


export { TrackingAndMonitoring };
