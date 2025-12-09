
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const ExpenseDonutGraphPage: FC = () => {
  return <div>ExpenseDonutGraph</div>;
};

const ExpenseDonutGraph: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.ExpenseDonutGraph" })}
      </PageTitle>
      <ExpenseDonutGraphPage />
    </>
  );
};


export { ExpenseDonutGraph };
