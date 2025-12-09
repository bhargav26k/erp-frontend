
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const IncomeDonutGraphPage: FC = () => {
  return <div>IncomeDonutGraph</div>;
};

const IncomeDonutGraph: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.IncomeDonutGraph" })}
      </PageTitle>
      <IncomeDonutGraphPage />
    </>
  );
};


export { IncomeDonutGraph };
