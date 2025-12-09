
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const FeesCollectionAndExpenseMonthlyChartPage: FC = () => {
  return <div>FeesCollectionAndExpenseMonthlyChart</div>;
};

const FeesCollectionAndExpenseMonthlyChart: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FeesCollectionAndExpenseMonthlyChart" })}
      </PageTitle>
      <FeesCollectionAndExpenseMonthlyChartPage />
    </>
  );
};


export { FeesCollectionAndExpenseMonthlyChart };
