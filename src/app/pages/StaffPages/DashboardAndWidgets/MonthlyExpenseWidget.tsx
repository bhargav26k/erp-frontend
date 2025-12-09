
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const MonthlyExpenseWidgetPage: FC = () => {
  return <div>MonthlyExpenseWidget</div>;
};

const MonthlyExpenseWidget: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.MonthlyExpenseWidget" })}
      </PageTitle>
      <MonthlyExpenseWidgetPage />
    </>
  );
};


export { MonthlyExpenseWidget };
