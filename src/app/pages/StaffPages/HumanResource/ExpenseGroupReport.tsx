
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ExpenseGroupReportPage: FC = () => {
  return <div>ExpenseGroupReport</div>;
};

const ExpenseGroupReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ExpenseGroupReport" })}
      </PageTitle>
      <ExpenseGroupReportPage />
    </>
  );
};


export { ExpenseGroupReport };
