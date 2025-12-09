
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ReportsAndAnalyticsPage: FC = () => {
  return <div>ReportsAndAnalytics</div>;
};

const ReportsAndAnalytics: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ReportsAndAnalytics" })}
      </PageTitle>
      <ReportsAndAnalyticsPage />
    </>
  );
};


export { ReportsAndAnalytics };
