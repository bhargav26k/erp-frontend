
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const GradingAndResultsPage: FC = () => {
  return <div>GradingAndResults</div>;
};

const GradingAndResults: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.GradingAndResults" })}
      </PageTitle>
      <GradingAndResultsPage />
    </>
  );
};


export { GradingAndResults };
