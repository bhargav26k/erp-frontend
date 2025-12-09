
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ExpenseReportPage: FC = () => {
  return <div>ExpenseReport</div>;
};

const ExpenseReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ExpenseReport" })}
      </PageTitle>
      <ExpenseReportPage />
    </>
  );
};


export { ExpenseReport };
