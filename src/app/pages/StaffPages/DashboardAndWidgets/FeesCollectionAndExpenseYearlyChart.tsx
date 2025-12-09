
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const FeesCollectionAndExpenseYearlyChartPage: FC = () => {
  return <div>FeesCollectionAndExpenseYearlyChart</div>;
};

const FeesCollectionAndExpenseYearlyChart: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FeesCollectionAndExpenseYearlyChart" })}
      </PageTitle>
      <FeesCollectionAndExpenseYearlyChartPage />
    </>
  );
};


export { FeesCollectionAndExpenseYearlyChart };
