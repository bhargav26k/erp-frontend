
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const IncomeGroupReportPage: FC = () => {
  return <div>IncomeGroupReport</div>;
};

const IncomeGroupReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.IncomeGroupReport" })}
      </PageTitle>
      <IncomeGroupReportPage />
    </>
  );
};


export { IncomeGroupReport };
