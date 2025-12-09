
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const StockReportPage: FC = () => {
  return <div>StockReport</div>;
};

const StockReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.StockReport" })}
      </PageTitle>
      <StockReportPage />
    </>
  );
};


export { StockReport };
