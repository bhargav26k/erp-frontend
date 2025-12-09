
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const AdmissionAnalyticsPage: FC = () => {
  return <div>AdmissionAnalytics</div>;
};

const AdmissionAnalytics: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.AdmissionAnalytics" })}
      </PageTitle>
      <AdmissionAnalyticsPage />
    </>
  );
};


export default AdmissionAnalytics ;
