
import { FC } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { useIntl } from "react-intl";


const FeesCollectionReportPage: FC = () => {
  return <div>FeesCollectionReport</div>;
};

const FeesCollectionReport: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.FeesCollectionReport" })}
      </PageTitle>
      <FeesCollectionReportPage />
    </>
  );
};


export { FeesCollectionReport };
