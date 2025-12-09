
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const IncomeReportPage: FC = () => {
  return <div>IncomeReport</div>;
};

const IncomeReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.IncomeReport" })}
      </PageTitle>
      <IncomeReportPage />
    </>
  );
};


export { IncomeReport };
